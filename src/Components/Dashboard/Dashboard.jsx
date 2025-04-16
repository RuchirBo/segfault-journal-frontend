import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANU_RECEIVE_ACTION_ENDPOINT = `${BACKEND_URL}/manuscripts/receive_action`;
const MANU_CREATE_ENDPOINT = `${BACKEND_URL}/manuscripts/create`;
const MANU_UPDATE_ENDPOINT = `${BACKEND_URL}/manuscripts/update`;
const MANU_DELETE_ENDPOINT = `${BACKEND_URL}/manuscripts/delete`;


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


const availableActionsMap = {
  SUB: ["ARF", "REJ", "WITH"],
  REV: ["ACC", "ACCWITHREV", "SUBREV", "DRF", "ARF", "REJ", "WITH"],
  CED: ["DON", "WITH"],
  AUREVIEW: ["DON", "WITH"],
  FORM: ["DON", "WITH"],
  AUTHREVISION: ["DON", "WITH"],
  EDREV: ["ACC", "WITH"],
  PUB: [],
  REJ: [],
  WITHDRAWN: [],
};
const getAvailableActions = (state) => availableActionsMap[state] || [];

function UpdateActionButton({ manuscript, refreshManu, setError }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const actions = getAvailableActions(manuscript.state);

  const handleActionSelect = (event) => {
    const action = event.target.value;
    console.log(action)
    setSelectedAction(action);
    const selectedRefs = manuscript.referees;
    console.log(selectedRefs)
    if (action) {
      axios
        .put(MANU_RECEIVE_ACTION_ENDPOINT, { title: manuscript.title, action, referees: selectedRefs[0]})
        .then(() => {
          refreshManu();
          setShowDropdown(false);
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message;
          setError(`Could not update action: ${errorMessage}`);
        });
    }
  };

  return (
    <div className="update-action-button" style={{ display: "inline-block", marginRight: "10px" }}>
      <button onClick={() => setShowDropdown(!showDropdown)}>Update Action</button>
      {showDropdown && (
        <select onChange={handleActionSelect} value={selectedAction}>
          <option value="">Select Action</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

UpdateActionButton.propTypes = {
  manuscript: propTypes.shape({
    title: propTypes.string.isRequired,
    state: propTypes.string.isRequired,
    referees: propTypes.arrayOf(propTypes.string).isRequired,
  }).isRequired,
  refreshManu: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function AddManuscriptForm({
  visible,
  cancel,
  fetchManu,
  setError,
  editingManuscript,
  setEditingManuscript,
}) {
  const [title, setTitle] = useState('');
  const [author_email, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [editor_email, setEditorEmail] = useState('');  
  const [manuscriptId, setManuscriptId] = useState('');

  useEffect(() => {
    if (editingManuscript) {
      setTitle(editingManuscript.title);
      setAuthorEmail(editingManuscript.author_email);
      setText(editingManuscript.text);
      setAbstract(editingManuscript.abstract);
      setEditorEmail(editingManuscript.editor_email);
      setManuscriptId(editingManuscript.manuscript_id);
    }
  }, [editingManuscript]);

  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  const changeEditorEmail = (event) => setEditorEmail(event.target.value);
  const changeManuscriptId = (e) => setManuscriptId(e.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !author_email || !text || !abstract || !editor_email || !manuscriptId) {
      setError('All fields are required to add a manuscript.');
      return;
    }

    const newManuscript = {
      title: title,
      author_email: author_email,
      text: text,
      abstract: abstract,
      editor_email: editor_email,
      manuscript_id: manuscriptId,
    }

    const resetManuscriptForm = () => {
      setTitle('');
      setAuthorEmail('');
      setText('');
      setAbstract('');
      setEditorEmail('');
      setManuscriptId('');
    };

    if (editingManuscript) {
      updateManuscript(editingManuscript, newManuscript);
    } else {
      axios
        .put(MANU_CREATE_ENDPOINT, newManuscript)
        .then(() => {
          fetchManu(); 
          resetManuscriptForm();
          window.location.reload();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message;
          setError(`There was a problem adding the manuscript. ${errorMessage}`);
        });
    }
    setEditingManuscript(null);
  };

  const updateManuscript = (oldManuscript, newManuscript) => {
    axios
      .put(MANU_UPDATE_ENDPOINT, {
        old_manuscript: oldManuscript,
        new_manuscript: newManuscript,
      })
      .then(() => {
        fetchManu();
        cancel();
      })
      .catch((error) => {
        setError(`There was a problem updating the manuscript. ${error}`);
      });
  };

  if (!visible) return null;

  return (
    <form>
      <label htmlFor="title">Title</label>
      <input required type="text" id="title" value={title} onChange={changeTitle} />

      <label htmlFor="author_email">Author Email</label>
      <input required type="text" id="author_email" value={author_email} onChange={changeAuthorEmail} />

      <label htmlFor="text">Text</label>
      <textarea 
        required 
        id="text" 
        value={text} 
        onChange={changeText} 
        rows="6"  
        cols="50"
      />

      <label htmlFor="abstract">Abstract</label>
      <input required type="text" id="abstract" value={abstract} onChange={changeAbstract} />

      <label htmlFor="editor">Editor</label>
      <input required type="text" id="editor" value={editor_email} onChange={changeEditorEmail} />
      <label htmlFor="manuscript_id">Manuscript ID</label>
      <input required type="text" id="manuscript_id" value={manuscriptId} onChange={changeManuscriptId} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={handleSubmit}>
        {editingManuscript ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}

AddManuscriptForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchManu: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  editingManuscript: propTypes.object,
  setEditingManuscript: propTypes.func.isRequired,
};

function Manuscripts() {
  const [manuscripts, setManuscripts] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingManuscript, setEditingManuscript] = useState(null);
  
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
            <th>Edit Manuscript</th>
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
                  <td className="actions-list">
                    <UpdateActionButton
                      manuscript={manuscript}
                      refreshManu={fetchManu}
                      setError={setError}
                    />
                    <Link to={`/manuscript/${manuscript.id}`}>View</Link>
                  </td>
                  <td> 
                    <button onClick={() => setEditingManuscript(true)}>Edit Manuscript</button>

                      <AddManuscriptForm
                        visible={editingManuscript !== null}
                        cancel={() => {
                          setEditingManuscript(null);
                        }}
                        fetchManu={fetchManu}
                        setError={setError}
                        editingManuscript={editingManuscript}
                        setEditingManuscript={setEditingManuscript}
                      />
                    <AddManuscriptForm
                        visible={editingManuscript !== null}
                        cancel={() => {
                          setEditingManuscript(null);
                        }}
                        fetchManu={fetchManu}
                        setError={setError}
                        editingManuscript={editingManuscript}
                        setEditingManuscript={setEditingManuscript}
                      />
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
