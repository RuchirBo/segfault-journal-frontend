import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleKey, setRoleKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          role_key: roleKey
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMsg(data.message || 'Registered successfully!');
        navigate('/home')
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message || 'Registration error');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setErrorMsg('Network or server error occurred');
    }
  };

  return (
    <div className="wrapper">
      <h1>Register for Segfault Journals</h1>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <form onSubmit={handleRegister}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="role">Role (optional)</label>
        <input
          type="text"
          id="role"
          placeholder="e.g. 'dev', 'EDITOR', 'AUTHOR'"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <label htmlFor="roleKey">Role Key (optional)</label>
        <input
          type="text"
          id="roleKey"
          placeholder="Enter role key if needed"
          value={roleKey}
          onChange={(e) => setRoleKey(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      <div className="auth-links">
        <p>Already have an account?</p>
        <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

export default Register;
