import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANU_CREATE_ENDPOINT = `${BACKEND_URL}/manuscripts/create`;
const MANU_UPDATE_ENDPOINT = `${BACKEND_URL}/manuscripts/update`;

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
  const [author, setAuthor] = useState('');
  const [author_email, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [editor_email, setEditorEmail] = useState('');  

  useEffect(() => {
    if (editingManuscript) {
      setTitle(editingManuscript.title);
      setAuthor(editingManuscript.author);
      setAuthorEmail(editingManuscript.author_email);
      setText(editingManuscript.text);
      setAbstract(editingManuscript.abstract);
      setEditorEmail(editingManuscript.editor_email);
    }
  }, [editingManuscript]);

  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthor = (event) => setAuthor(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  const changeEditorEmail = (event) => setEditorEmail(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !author || !author_email || !text || !abstract || !editor_email) {
      setError('All fields are required to add a manuscript.');
      return;
    }

    const newManuscript = {
      title: title,
      author: author,
      author_email: author_email,
      text: text,
      abstract: abstract,
      editor_email: editor_email,
    }

    const resetManuscriptForm = () => {
      setTitle('');
      setAuthor('');
      setAuthorEmail('');
      setText('');
      setAbstract('');
      setEditorEmail('');
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

      <label htmlFor="author">Author</label>
      <input required type="text" id="author" value={author} onChange={changeAuthor} />

      <label htmlFor="author_email">Author Email</label>
      <input required type="text" id="author_email" value={author_email} onChange={changeAuthorEmail} />

      <label htmlFor="text">Text</label>
      <input required type="text" id="text" value={text} onChange={changeText} />

      <label htmlFor="abstract">Abstract</label>
      <input required type="text" id="abstract" value={abstract} onChange={changeAbstract} />

      <label htmlFor="editor">Editor</label>
      <input required type="text" id="editor" value={editor_email} onChange={changeEditorEmail} />

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

  const deleteManuscript = (title, author, author_email, text, abstract, editor_email) => {
    axios
      .delete(`${MANU_READ_ENDPOINT}/delete`, {
        data: { title, author, author_email, text, abstract, editor_email },
      })
      .then(fetchManu)
      .catch((error) => setError(`There was a problem deleting the manuscript. ${error}`));
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
              <p>{manuscript.author}</p>
              <p>{manuscript.author_email}</p>
              <p>{manuscript.text}</p>
              <p>{manuscript.abstract}</p>
              <p>{manuscript.editor_email}</p>
              <Link to={`/manuscript/${manuscript.id}`}>View Details</Link>
              <br />
              <br />
              <button onClick={() => setEditingManuscript(manuscript)}>Edit</button>
              <button
                onClick={() =>
                  deleteManuscript(
                    manuscript.title,
                    manuscript.author,
                    manuscript.author_email,
                    manuscript.text,
                    manuscript.abstract,
                    manuscript.editor_email
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
