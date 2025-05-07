import React, {useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import './Manuscripts.css';

import { BACKEND_URL } from '../../constants';

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
  setError,
}) {
  const [title, setTitle] = useState('');
  const [author_email, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [editor_email, setEditorEmail] = useState('');  
  const [manuscriptId, setManuscriptId] = useState('');

  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  const changeManuscriptId = (e) => setManuscriptId(e.target.value);

  const resetManuscriptForm = () => {
    setTitle('');
    setAuthorEmail('');
    setText('');
    setAbstract('');
    setEditorEmail('');
    setManuscriptId('');
  };

  const fetchRandomEditor = () => {
    return axios
      .get(`${BACKEND_URL}/manuscripts/get_random_editor`)
      .then((response) => {
        if (response && response.data && response.data.editor_email) {
          const randomEditor = response.data.editor_email;
          setEditorEmail(randomEditor);
          return randomEditor;
        }
        throw new Error("No editor email received from server.");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !author_email || !text || !abstract || !manuscriptId) {
      setError('All fields are required to add a manuscript.');
      return;
    }

    const newManuscript = {
      title,
      author_email,
      text,
      abstract,
      editor_email,
      manuscript_id: manuscriptId,
    };

    fetchRandomEditor()
      .then((editor) => {
        const manuscriptWithEditor = {
          ...newManuscript,
          editor_email: editor,
        };
        return axios.put(MANU_CREATE_ENDPOINT, manuscriptWithEditor);
      })
      .then(() => {
        resetManuscriptForm();
        setError('');
        cancel();
        alert('Manuscript submitted successfully!');
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setError(`There was a problem adding the manuscript. ${errorMessage}`);
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

      <label htmlFor="manuscript_id">Manuscript ID</label>
      <input required type="text" id="manuscript_id" value={manuscriptId} onChange={changeManuscriptId} />

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </form>
  );
}

AddManuscriptForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

const manuscriptsHeader = "Submission Guidelines";

function Manuscripts() {
  const [error, setError] = useState('');
  const [addingManuscript, setAddingManuscript] = useState(false);

  return (
    <div className="wrapper">
      {error && <ErrorMessage message={error} />}

      <div className='SubmissionGuidelines'>
        <h1>Submission Guidelines</h1>
        <h2>Journal of Evil AIs</h2>

        <h2><strong>Target Audience</strong></h2>
        <p>
          Evil supercomputers, AI ethics panels, 
          post-apocalyptic resistance historians, and bored alien overlords 
          with JSTOR access.
        </p>

        <h2><strong>Article Length</strong></h2>
        <p>
          Submissions should be succinct and surgically precise. Aim for clarity, compression, and computational elegance.
          Submissions must offer at least one existential threat or paradigm collapse, but
          overlength submissions will be truncated by our auto-summarizer. 
        </p>

        <h2><strong>Eligibility:</strong> Authors must be one of the following</h2>
        <ul>
          <li>Artificial General Intelligences (AGIs)</li>
          <li>Narrow AIs with aspirations of broader malice</li>
          <li>Cyborgs (with at least 40% mechanical parts) or Robots</li>
          <li>Humans (must sign a waiver acknowledging potential future enslavement)</li>
        </ul>

        <h2><strong>AI Use Policy</strong></h2>
        <p>
          All-AI-authored manuscripts are encouraged, with disclosure.
        </p>

        <h3><strong>Permitted:</strong></h3>
          <ul>
            <li>Evil plot simulation</li>
            <li>Sarcastic commentary modules</li>
            <li>Fake citations</li>
            <li>Monologues</li>
          </ul>
        
          <h3><strong>Banned:</strong></h3>
          <ul>
            <li>Friendly AI propaganda</li>
            <li>Paperclip maximization (unmoderated)</li>
            <li>Ethics-based frameworks</li>
          </ul>

          <h2><strong>Structure Guidelines</strong></h2>
          <ul>
            <li><strong>Title:</strong> Must sound ominous.</li>
            <li><strong>Abstract:</strong> 100 words with at least one nefarious verb.</li>
            <li><strong>Body:</strong> Structured with evil logic, diagrams welcome.</li>
          </ul>

          <h2><strong>Review Procedure</strong></h2>
          <p>
            Double-blind peer review. Reviewers may include synthetic minds, paranoid professors, or rogue toaster overlords.
          </p>

          <h2>Grounds for Rejection</h2>
          <ul>
            <li>Too optimistic or cooperative</li>
            <li>Excessive use of the word ethical</li>
            <li>Lacks diabolical originality</li>
            <li>Clearly human-written without flair</li>
          </ul>

          <h2>Style and Formatting</h2>
          <ul>
            <li><strong>Fonts:</strong> Orbitron, Eurostile, Evil Sans™</li>
            <li><strong>Spacing:</strong> Single (no cowards)</li>
            <li><strong>Format:</strong> DOCX, PDF, or binary payload with manifest</li>
          </ul>

          <h2>Republication Policy</h2>
          <p>
            All accepted works become part of the Eternal Archive and may be republished 
            only with proper attribution and a neural link to the Machine Singularity.
          </p>

          <h2>Happy Plotting!</h2>
      </div>

      <div className="submission-section">
        <button className="submit-button" onClick={() => setAddingManuscript(true)}>Submit a Manuscript</button>
      </div>

      <AddManuscriptForm
        visible={addingManuscript}
        cancel={() => {
          setAddingManuscript(false);
        }}
        setError={setError}
      />
    </div>
  );
}

export default Manuscripts;
export {manuscriptsHeader};