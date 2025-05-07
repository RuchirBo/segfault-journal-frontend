import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { BACKEND_URL } from '../constants';

const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`;

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);
  const [roleOptions, setRoleOptions] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [affiliation, setAffiliation] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(ROLES_ENDPOINT)
      .then(res => res.json())
      .then(data => setRoleOptions(data))
      .catch(() => setErrorMsg('Failed to load roles'));
  }, []);

  const changeRoles = (e) => {
    const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
    setRoles(selectedRoles);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: roles.length > 0 ? roles[0] : '', // Assuming only one role is needed at registration
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMsg(data.message || 'Registered successfully!');

        await fetch(PEOPLE_CREATE_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: email.split('@')[0],
            email,
            roles,
            affiliation,
          }),
        });

        navigate('/home');
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
      <h1>Register for Evil AI Journals</h1>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <form onSubmit={handleRegister}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="affiliation">Affiliation</label>
        <input
          type="text"
          id="affiliation"
          placeholder="Enter affiliation"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
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

        <label htmlFor="roles">Roles</label>
        <select multiple id="roles" value={roles} onChange={changeRoles} required>
          {Object.keys(roleOptions).map((code) => (
            <option key={code} value={code}>
              {roleOptions[code]}
            </option>
          ))}
        </select>

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
