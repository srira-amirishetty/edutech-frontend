import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TakeTest.css';

const TakeTest = ({ token }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('https://edutech-yse2.onrender.com/tests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [token]);

  const handleTestSelect = async (testId) => {
    setSelectedTest(testId);
    try {
      const response = await axios.get(`https://edutech-yse2.onrender.com/questions/${testId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(response.data);
      setResponses(response.data.map((question) => ({
        question_id: question._id,
        selected_option: ''
      })));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setResponses(responses.map((response) =>
      response.question_id === questionId ? { ...response, selected_option: selectedOption } : response
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://edutech-yse2.onrender.com/responses', {
        test_id: selectedTest,
        responses
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const resultResponse = await axios.get(`https://edutech-yse2.onrender.com/results/${selectedTest}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScore(resultResponse.data.score);
      alert(`Your Score: ${resultResponse.data.score}`);
      navigate(`/results/${selectedTest}`); // Navigate to the results page
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  return (
    <div className="take-test-container">
      <h2>Take Test</h2>
      {selectedTest ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="question-block">
              <p>{question.question_text}</p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option}
                    checked={responses.find((response) => response.question_id === question._id)?.selected_option === option}
                    onChange={() => handleOptionChange(question._id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h3>Select a test</h3>
          <ul>
            {tests.map((test) => (
              <li key={test._id} onClick={() => handleTestSelect(test._id)}>
                {test.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      {score !== null && <h3>Your Score: {score}</h3>}
    </div>
  );
};

export default TakeTest;
