import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
//const MANU_UPDATE_ENDPOINT = `${BACKEND_URL}/manuscripts/update`;

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Manuscripts() {
  const [manuscripts, setManuscripts] = useState([]);
  const [error, setError] = useState('');

  const fetchManu = () => {
    axios
      .get(MANU_READ_ENDPOINT)
      .then(({ data }) => {
        setManuscripts(data.manuscripts);
      })
      .catch((error) => {
        setError(`There was a problem retrieving the list of manuscripts. ${error}`);
      });
  };

  useEffect(fetchManu, []);

  return (
    <div className="wrapper">
      <header>
        <h1>View All Manuscripts</h1>
      </header>

      {error && <ErrorMessage message={error} />}

      <table className="manuscript-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Author Email</th>
            <th>Text</th>
            <th>Abstract</th>
            <th>Editor Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manuscripts.length > 0 ? (
            manuscripts.map((manuscript) => (
              <tr key={manuscript.id}>
                <td>{manuscript.title}</td>
                <td>{manuscript.author}</td>
                <td>{manuscript.author_email}</td>
                <td>{manuscript.text}</td>
                <td>{manuscript.abstract}</td>
                <td>{manuscript.editor_email}</td>
                <td>
                  <Link to={`/manuscript/${manuscript.id}`}>View</Link>
                </td>
              </tr>
            ))
          ) : (
            <p>No manuscripts found.</p>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Manuscripts;
