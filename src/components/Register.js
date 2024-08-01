import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importing the CSS file

const Register = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://edutech-yse2.onrender.com/auth/register', { username, password, email, role });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate(role === 'teacher' ? '/create-test' : '/take-test');
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="register-form">
      <h2>Register</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="register-input" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="register-input" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="register-input" />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="register-select">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <button type="submit" className="register-button">Register</button>
    </form>
  );
};

export default Register;
