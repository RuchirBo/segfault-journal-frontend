import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Login Attempt:', { username, password });
  };

  return (
    <div className="wrapper">
      <h1>Segfault Journals</h1>

      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
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