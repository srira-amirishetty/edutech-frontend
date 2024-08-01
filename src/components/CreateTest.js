import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateTest.css';

const CreateTest = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctOption: '' }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOption = event.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctOption: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedQuestions = questions.map(question => ({
      text: question.text,
      options: question.options,
      correctOption: question.options[question.correctOption]
    }));

    try {
      await axios.post('https://edutech-yse2.onrender.com/tests/create-test', {
        title,
        description,
        questions: formattedQuestions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Test created successfully');
      navigate('/tests'); // Navigate to tests list
    } catch (error) {
      console.error('Error creating test:', error.response ? error.response.data : error.message);
      alert('Failed to create test');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Test</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-block">
          <input type="text" value={question.text} onChange={(e) => handleQuestionChange(qIndex, e)} placeholder="Question" required />
          {question.options.map((option, oIndex) => (
            <input key={oIndex} type="text" value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e)} placeholder={`Option ${oIndex + 1}`} required />
          ))}
          <select value={question.correctOption} onChange={(e) => handleCorrectOptionChange(qIndex, e)}>
            <option value="">Select Correct Option</option>
            {question.options.map((option, oIndex) => (
              <option key={oIndex} value={oIndex}>{`Option ${oIndex + 1}`}</option>
            ))}
          </select>
        </div>
      ))}
      <button type="button" onClick={addQuestion}>Add Question</button>
      <button type="submit">Create Test</button>
    </form>
  );
};

export default CreateTest;
