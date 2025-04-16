import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANU_DELETE_ENDPOINT = `${BACKEND_URL}/manuscripts/delete`;

//const MANU_UPDATE_ENDPOINT = `${BACKEND_URL}/manuscripts/update`;

const manuscriptsHeader = "View All Manuscripts";

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
  const [searchQuery, setSearchQuery] = useState('');

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

  const deleteManuscript = (manuscript_to_delete) => {
    axios
    .delete(MANU_DELETE_ENDPOINT, {data: manuscript_to_delete})
    .then(() => {
      fetchManu();
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message;
      setError(`There was a problem deleting the manuscript. ${errorMessage}`);
    });
  };

  useEffect(fetchManu, []);

  return (
    <div className="wrapper">
      <header>
        <h1>{manuscriptsHeader}</h1>
        <input
          type="text"
          placeholder="Search by author email, text, abstract, editor email, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ margin: "10px 0", width: "100%", padding: "8px" }}
        />
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
            <th>State</th>
            <th>Actions</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {manuscripts.filter((manuscript) => {
            const search = searchQuery.toLowerCase();
            return (
              manuscript.title.toLowerCase().includes(search) ||
              manuscript.author.toLowerCase().includes(search) ||
              manuscript.author_email.toLowerCase().includes(search) ||
              manuscript.text.toLowerCase().includes(search) ||
              manuscript.abstract.toLowerCase().includes(search) ||
              manuscript.editor_email.toLowerCase().includes(search) ||
              manuscript.state.toLowerCase().includes(search)
            );
          }).length > 0 ? (
            manuscripts
              .filter((manuscript) => {
                const search = searchQuery.toLowerCase();
                return (
                  manuscript.title.toLowerCase().includes(search) ||
                  manuscript.author.toLowerCase().includes(search) ||
                  manuscript.author_email.toLowerCase().includes(search) ||
                  manuscript.text.toLowerCase().includes(search) ||
                  manuscript.abstract.toLowerCase().includes(search) ||
                  manuscript.editor_email.toLowerCase().includes(search) ||
                  manuscript.state.toLowerCase().includes(search)
                );
              })
              .map((manuscript) => (
                <tr key={manuscript.id}>
                  <td>{manuscript.title}</td>
                  <td>{manuscript.author}</td>
                  <td>{manuscript.author_email}</td>
                  <td>{manuscript.text}</td>
                  <td>{manuscript.abstract}</td>
                  <td>{manuscript.editor_email}</td>
                  <td className="state-container">
                    <div className="state">{manuscript.state}</div>
                    <div className="state-description">{manuscript.state_description}</div>
                  </td>
                  <td>
                    <Link to={`/manuscript/${manuscript.id}`}>View</Link>
                  </td>
                  <td>                 
                    <button onClick={() =>
                      deleteManuscript({
                      title: manuscript.title,
                      author: manuscript.author,
                      author_email: manuscript.author_email,
                      text: manuscript.text,
                      abstract: manuscript.abstract,
                      editor_email: manuscript.editor_email,
                    })
                  }
                >
                  Delete Manuscript
                </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8">No manuscripts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Manuscripts;
export { manuscriptsHeader };
