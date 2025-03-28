import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleKey, setRoleKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username,
          password: password,
          role_key: roleKey
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setSuccessMsg(data.message || 'Logged in successfully!');
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        setErrorMsg(errorData.message || 'Error logging in');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setErrorMsg('Network or server error occurred');
    }
  };

  return (
    <div className="wrapper">
      <h1>Segfault Journals</h1>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username (email)</label>
        <input
          type="text"
          id="username"
          placeholder="Enter email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <label htmlFor="roleKey">Role Key (if required)</label>
        <input
          type="text"
          id="roleKey"
          placeholder="Enter role key"
          value={roleKey}
          onChange={(e) => setRoleKey(e.target.value)}
        />

        <button type="submit">Log in</button>
      </form>

      <div className="auth-links">
        <p>Forgot your password?</p>
        <Link to="/reset-password">Reset password</Link>
        <p>No account?</p>
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}

export default Login;
