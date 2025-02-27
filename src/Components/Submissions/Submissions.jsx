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
  const [authorEmail, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [editor, setEditor] = useState('');

  useEffect(() => {
    if (editingManuscript) {
      setTitle(editingManuscript.title);
      setAuthor(editingManuscript.author);
      setAuthorEmail(editingManuscript.authorEmail);
      setText(editingManuscript.text);
      setAbstract(editingManuscript.abstract);
      setEditor(editingManuscript.editor);
    }
  }, [editingManuscript]);

  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthor = (event) => setAuthor(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  const changeEditor = (event) => setEditor(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newManuscript = {
      title,
      author,
      authorEmail,
      text,
      abstract,
      editor,
    };

    if (editingManuscript) {
      updateManuscript(editingManuscript, newManuscript);
    } else {
      axios
        .put(MANU_CREATE_ENDPOINT, newManuscript)
        .then(fetchManu)
        .catch((error) => {
          setError(`There was a problem adding the manuscript. ${error}`);
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

      <label htmlFor="authorEmail">Author Email</label>
      <input required type="text" id="authorEmail" value={authorEmail} onChange={changeAuthorEmail} />

      <label htmlFor="text">Text</label>
      <input required type="text" id="text" value={text} onChange={changeText} />

      <label htmlFor="abstract">Abstract</label>
      <input required type="text" id="abstract" value={abstract} onChange={changeAbstract} />

      <label htmlFor="editor">Editor</label>
      <input required type="text" id="editor" value={editor} onChange={changeEditor} />

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
  const [addingManuscript, setAddingManuscript] = useState(false);
  const [editingManuscript, setEditingManuscript] = useState(null);

  const deleteManuscript = (title, author, authorEmail, text, abstract, editor) => {
    axios
      .delete(`${MANU_READ_ENDPOINT}/delete`, {
        data: { title, author, authorEmail, text, abstract, editor },
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
        <h1>View All Submissions</h1>
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
              <p>{manuscript.authorEmail}</p>
              <p>{manuscript.text}</p>
              <p>{manuscript.abstract}</p>
              <p>{manuscript.editor}</p>
              <Link to={`/manuscript/${manuscript.id}`}>View Details</Link>
              <br />
              <br />
              <button onClick={() => setEditingManuscript(manuscript)}>Edit</button>
              <button
                onClick={() =>
                  deleteManuscript(
                    manuscript.title,
                    manuscript.author,
                    manuscript.authorEmail,
                    manuscript.text,
                    manuscript.abstract,
                    manuscript.editor
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
