import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';

const Results = ({ token }) => {
  const [tests, setTests] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('https://edutech-yse2.onrender.com/tests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTests(res.data);
      } catch (error) {
        console.error('Failed to fetch tests', error);
      }
    };

    fetchTests();
  }, [token]);

  const handleSelectTest = async (testId) => {
    try {
      const res = await axios.get(`https://edutech-yse2.onrender.com/results/${testId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResult(res.data);
    } catch (error) {
      console.error('Failed to fetch results', error);
    }
  };

  return (
    <div className="results-container">
      <h2>View Results</h2>
      <select onChange={(e) => handleSelectTest(e.target.value)}>
        <option value="">Select a test</option>
        {tests.map((test) => (
          <option key={test._id} value={test._id}>{test.title}</option>
        ))}
      </select>
      {result && (
        <div className="result-details">
          <h3>Results for {result.testName}</h3>
          <p>User: {result.userName}</p>
          <p>Score: {result.score}</p>
        </div>
      )}
    </div>
  );
};

export default Results;
