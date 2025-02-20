import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANU_CREATE_ENDPOINT = `${BACKEND_URL}/manuscripts/create`;

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

function AddManuscriptForm({
  visible,
  cancel,
  fetchManu, 
  setError,
}) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const changeTitle = (event) => { setTitle(event.target.value); };
  const changeAuthor = (event) => { setAuthor(event.target.value); };

  const addManuscript = (event) => {
    event.preventDefault();
    const newManuscript = {
      title: title,
      author: author,
      referees: 'ED',
    }
    axios.put(MANU_CREATE_ENDPOINT, newManuscript)
      .then(fetchManu)
      .catch((error) => { setError(`There was a problem adding the manuscript. ${error}`); });
  };


  if (!visible) return null;
  return (
    <form>
      <label htmlFor="title">
        Title
      </label>
      <input required type="text" id="title" value={title} onChange={changeTitle} />
      <label htmlFor="author">
        Author
      </label>
      <input required type="text" id="author" onChange={changeAuthor} />
      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addManuscript}>Submit</button>
    </form>
  );
}

AddManuscriptForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchManu: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};


function Manuscripts() {
  const [manuscripts, setManuscripts] = useState([]);
  const [error, setError] = useState('');
  const [addingManuscript, setAddingManuscript] = useState(false);

  const fetchManu = () => {
    axios.get(MANU_READ_ENDPOINT)
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
        <h1>View All Submissions</h1>
        <button onClick={() => setAddingManuscript(true)}>Add Manuscript</button>
      </header>
      
      {error && <ErrorMessage message={error} />}

      <AddManuscriptForm
        visible={addingManuscript}
        cancel={() => setAddingManuscript(false)}
        fetchManu={fetchManu}
        setError={setError}
      />

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
