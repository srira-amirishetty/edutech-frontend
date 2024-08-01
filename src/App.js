import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import TakeTest from './components/TakeTest';
import CreateTest from './components/CreateTest';
import Home from './components/Home';
import Results from './components/Results';
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const handleLogout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <div className="container">
        <h1>Test Series Portal</h1>
        <nav>
          <ul>
            {!token && (
              <>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
            {token && (
              <>
                {role === 'teacher' && (
                  <li>
                    <Link to="/create-test">Create Test</Link>
                  </li>
                )}
                <li>
                  <Link to="/take-test">Take Test</Link>
                </li>
                <li>
                  <Link to="/results">View Results</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="/take-test" element={token ? <TakeTest token={token} /> : <Navigate to="/login" />} />
          <Route path="/create-test" element={token && role === 'teacher' ? <CreateTest token={token} /> : <Navigate to="/login" />} />
          <Route path="/results" element={token ? <Results token={token} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
