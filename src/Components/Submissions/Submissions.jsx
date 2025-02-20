import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;

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
    axios.get(MANU_READ_ENDPOINT)
      .then(({ data }) => {
        setManuscripts(data);
      })
      .catch((error) => {
        setError(`There was a problem retrieving the list of manuscripts. ${error}`);
      });
  };

  useEffect(fetchManu, []); 

  return (
    <div className="wrapper">
      <header>
        <h1>View All Submissions</h1>
      </header>
      {error && <ErrorMessage message={error} />}
      <div className="manuscript-list">
        {manuscripts.length > 0 ? (
          manuscripts.map((manuscript) => (
            <div key={manuscript.id} className="manuscript-item">
              <h3>{manuscript.title}</h3>
              <p>{manuscript.author}</p>
              <p>{manuscript.description}</p>
              <Link to={`/manuscript/${manuscript.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>No manuscripts found.</p>
        )}
      </div>
    </div>
  );
}

export default Manuscripts;
