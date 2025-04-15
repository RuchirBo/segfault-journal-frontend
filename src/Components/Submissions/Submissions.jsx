import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Manuscripts.css';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANU_CREATE_ENDPOINT = `${BACKEND_URL}/manuscripts/create`;
const MANU_UPDATE_ENDPOINT = `${BACKEND_URL}/manuscripts/update`;
const MANU_DELETE_ENDPOINT = `${BACKEND_URL}/manuscripts/delete`;

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

const manuscriptsHeader = "View All Submissions";

function Manuscripts() {
  const [manuscripts, setManuscripts] = useState([]);
  const [error, setError] = useState('');
  const [addingManuscript, setAddingManuscript] = useState(false);
  const [editingManuscript, setEditingManuscript] = useState(null);

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
        <h1>{manuscriptsHeader}</h1>
        <button onClick={() => setAddingManuscript(true)}>Add Manuscript</button>
      </header>

      {error && <ErrorMessage message={error} />}

      <AddManuscriptForm
        visible={addingManuscript || editingManuscript !== null}
        cancel={() => {
          setAddingManuscript(false);
          setEditingManuscript(null);
        }}
        fetchManu={fetchManu}
        setError={setError}
        editingManuscript={editingManuscript}
        setEditingManuscript={setEditingManuscript}
      />

      <div className="manuscript-list">
        {manuscripts.length > 0 ? (
          manuscripts.map((manuscript) => (
            <div key={manuscript.id} className="manuscript-item">
              <h3>{manuscript.title}</h3>
              <p><strong>Author:</strong> {manuscript.author}</p>
              <p><strong>Author Email:</strong> {manuscript.author_email}</p>
              <p><strong>Text:</strong> {manuscript.text}</p>
              <p><strong>Abstract:</strong> {manuscript.abstract}</p>
              <p><strong>Editor Email:</strong> {manuscript.editor_email}</p>
              <Link to={`/manuscript/${manuscript.id}`}>View Details</Link>
              <br /><br />
              <button onClick={() => setEditingManuscript(manuscript)}>Edit</button>
              <button
                onClick={() =>
                  deleteManuscript(
                    {
                    title: manuscript.title,
                    author: manuscript.author,
                    author_email: manuscript.author_email,
                    text: manuscript.text,
                    abstract: manuscript.abstract,
                    editor_email: manuscript.editor_email
                  }
                  )
                }
              >
                Delete Manuscript
              </button>
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
export {manuscriptsHeader};
