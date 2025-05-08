import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import CollapsibleText from './CollapsibleText';

import { BACKEND_URL } from '../../constants';

const MANU_READ_ENDPOINT = `${BACKEND_URL}/manuscripts`;
const MANU_RECEIVE_ACTION_ENDPOINT = `${BACKEND_URL}/manuscripts/receive_action`;
const MANU_CREATE_ENDPOINT = `${BACKEND_URL}/manuscripts/create`;
const MANU_UPDATE_ENDPOINT = `${BACKEND_URL}/manuscripts/update`;
const MANU_DELETE_ENDPOINT = `${BACKEND_URL}/manuscripts/delete`;
const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;


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
  SUB: ["ARF", "REJ", "WITHDRAW"],
  REV: ["ACC", "ACCWITHREV", "SUBREV", "DRF", "ARF", "REJ", "WITHDRAW"],
  CED: ["DON", "WITHDRAW"],
  AUREVIEW: ["DON", "WITHDRAW"],
  FORM: ["DON", "WITHDRAW"],
  AUTHREVISION: ["DON", "WITHDRAW"],
  EDREV: ["ACC", "WITHDRAW"],
  PUB: [],
  REJ: [],
  WITHDRAWN: [],
};
const getAvailableActions = (state) => availableActionsMap[state] || [];


const filterActionsByRole = (state, roles, isOwner) => {

  const hasEditorRole = roles.includes("EDITOR") || roles.includes("ED");
  const hasMERole = roles.includes("MANAGING EDITOR") || roles.includes("ME")
  const hasCERole = roles.includes("CONSULTING EDITOR") || roles.includes("CE")
  const hasAuthorRole = roles.includes("AUTHOR") || roles.includes("AU");
  const hasRefereeRole = roles.includes("REFEREE") || roles.includes("RE");
  
  if (hasEditorRole || hasMERole || hasCERole) {
    console.log(roles)
    return getAvailableActions(state).filter(action => action !== "WITHDRAW" && action !== "SUBREV");
  }
  
  if (hasAuthorRole) {
    //return getAvailableActions(state).filter(action => action === "WITHDRAW" || action === "DON");
    return getAvailableActions(state)
      .filter(action =>
        action === "DON" && isOwner ||
        (action === "WITHDRAW" && isOwner)
      );
  }
  
  if (hasRefereeRole) {
    return getAvailableActions(state).filter(action => action === "SUBREV");
  }
  
  return [];
};

function UpdateActionButton({ manuscript, refreshManu, setError, referees, userRoles, currentUserEmail }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [showRefSelect, setShowRefSelect] = useState(false);
  const [selectedRef, setSelectedRef] = useState("");

  // const actions = getAvailableActions(manuscript.state);
  const availableActions = filterActionsByRole(
    manuscript.state, 
    userRoles,
    manuscript.author_email === currentUserEmail
  );


  const handleActionSelect = e => {
    const action = e.target.value;
    setSelectedAction(action);

    if (action === "ARF" || action === "DRF") {
      setShowRefSelect(true);
      return;
    }

    sendAction(action, []);
  };

  const sendAction = (action, refs) => {
    axios.put(MANU_RECEIVE_ACTION_ENDPOINT, {
      manuscript_id: manuscript.manuscript_id,
      action,
      referees: refs
    })
    .then(() => {
      refreshManu();
      resetAll();
    })
    .catch(err => setError(err.response?.data?.message || err.message));
  };

  const handleRefereePick = () => {
    if (!selectedRef) {
      setError("Please pick a referee.");
      return;
    }
    sendAction(selectedAction, [selectedRef]);
  };

  const resetAll = () => {
    setShowDropdown(false);
    setShowRefSelect(false);
    setSelectedAction("");
    setSelectedRef("");
  };

  const available = selectedAction === "DRF"
    ? manuscript.referees
    : referees.filter(r => !manuscript.referees.includes(r));

  return (
    <div className="update-action-button" style={{ marginRight: 10 }}>
      <button onClick={() => setShowDropdown(!showDropdown)}
              style={{ fontSize: '10px' }}>Update Action</button>

      {showDropdown && (
        <>
          <select onChange={handleActionSelect} value={selectedAction}>
            <option value="">Select Action</option>
            {availableActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {showRefSelect && (
            <div style={{ marginTop: 8 }}>
              <select
                value={selectedRef}
                onChange={e => setSelectedRef(e.target.value)}
              >
                <option value="">Pick a referee</option>
                {available.map(email => (
                  <option key={email} value={email}>{email}</option>
                ))}
              </select>
              <button onClick={handleRefereePick}>
                {selectedAction === "ARF" ? "Assign" : "Remove"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

UpdateActionButton.propTypes = {
  manuscript: propTypes.shape({
    manuscript_id: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    state: propTypes.string.isRequired,
    author_email:     propTypes.string.isRequired,
    referees: propTypes.arrayOf(propTypes.string).isRequired,
  }).isRequired,
  refreshManu: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  referees: propTypes.arrayOf(propTypes.string).isRequired,
  userRoles: propTypes.string.isRequired,
  currentUserEmail: propTypes.string.isRequired,
};


function EditManuscriptForm({
  visible,
  cancel,
  fetchManu,
  setError,
  editingManuscript,
  setEditingManuscript,
}) {
  const [title, setTitle] = useState(editingManuscript.title);
  const [author_email, setAuthorEmail] = useState(editingManuscript.author_email);
  const [text, setText] = useState(editingManuscript.text);
  const [abstract, setAbstract] = useState(editingManuscript.abstract);
  const [editor_email, setEditorEmail] = useState(editingManuscript.editor_email);  

  useEffect(() => {
    if (editingManuscript) {
      setTitle(editingManuscript.title);
      setAuthorEmail(editingManuscript.author_email);
      setText(editingManuscript.text);
      setAbstract(editingManuscript.abstract);
      setEditorEmail(editingManuscript.editor_email);
    }
  }, [editingManuscript]);

  const changeTitle = (event) => setTitle(event.target.value);
  const changeAuthorEmail = (event) => setAuthorEmail(event.target.value);
  const changeText = (event) => setText(event.target.value);
  const changeAbstract = (event) => setAbstract(event.target.value);
  const changeEditorEmail = (event) => setEditorEmail(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !author_email || !text || !abstract || !editor_email) {
      setError('All fields are required to add a manuscript.');
      return;
    }

    const newManuscript = {
      title: title,
      author_email: author_email,
      text: text,
      abstract: abstract,
      editor_email: editor_email,
    }

    const resetManuscriptForm = () => {
      setTitle('');
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

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={handleSubmit}>
        {editingManuscript ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}

EditManuscriptForm.propTypes = {
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
  const [referees, setReferees] = useState([]);
  const [isEditor, setIsEditor] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => {
        const peopleArray = Object.values(data);
        const refereeList = peopleArray.filter(person =>
          person.roles.some(role => role.includes("RE"))
        );
        setReferees(refereeList.map(r => r.email)); 
      })
      .catch((error) => {
        setError(`Could not load referees: ${error.message}`);
      });
  }, []);
  
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
    console.log("Manuscript to delete:", manuscript_to_delete.manuscript_id);
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

  useEffect(() => {
    const fetchUserAndCheckIfEditor = async () => {
      try {
        const userResponse = await fetch('http://127.0.0.1:8000/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Not logged in');
        }

        const userData = await userResponse.json();
        console.log(userData)

        setUserRoles(userData.role); 
        setCurrentUserEmail(userData.email);

        const isEditorResponse = await axios.get(`${BACKEND_URL}/people/editors`, {
          withCredentials: true,
        });
    
        console.log('Editors Data:', isEditorResponse.data.editors);

        const editorsData = isEditorResponse.data.editors

        const editorEmails = editorsData.map((editor) => editor.email);
        setIsEditor(editorEmails.includes(userData.email));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserAndCheckIfEditor();
  }, []);


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
            <th>Referees</th>
            <th>State</th>
            <th>Actions</th>
            <th>Edit Manuscript</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            manuscripts
            .filter((manuscript) => manuscript.state !== 'REJ')
            .filter((manuscript) => {
            const search = searchQuery.toLowerCase();
            return (
              manuscript.title.toLowerCase().includes(search) ||
              manuscript.author.toLowerCase().includes(search) ||
              manuscript.author_email.toLowerCase().includes(search) ||
              manuscript.text.toLowerCase().includes(search) ||
              manuscript.abstract.toLowerCase().includes(search) ||
              manuscript.editor_email.toLowerCase().includes(search) ||
              (manuscript.referees || [])
              .join(', ')
              .toLowerCase()
              .includes(search) ||
              manuscript.state.toLowerCase().includes(search)
            );
          }).length > 0 ? (
            manuscripts
              .filter((manuscript) => manuscript.state !== 'REJ')
              .filter((manuscript) => {
                const search = searchQuery.toLowerCase();
                return (
                  manuscript.title.toLowerCase().includes(search) ||
                  manuscript.author.toLowerCase().includes(search) ||
                  manuscript.author_email.toLowerCase().includes(search) ||
                  manuscript.text.toLowerCase().includes(search) ||
                  manuscript.abstract.toLowerCase().includes(search) ||
                  manuscript.editor_email.toLowerCase().includes(search) ||
                  (manuscript.referees || [])
                  .join(', ')
                  .toLowerCase()
                  .includes(search) ||
                  manuscript.state.toLowerCase().includes(search)
                );
              })
              .map((manuscript) => (
                <tr key={manuscript.manuscript_id}>
                  <td>{manuscript.title}</td>
                  <td>{manuscript.author}</td>
                  <td>{manuscript.author_email}</td>
                  <td>{ <CollapsibleText text={manuscript.text} limit={50} />}</td>
                  <td>{manuscript.abstract}</td>
                  <td>{manuscript.editor_email}</td>
                  <td>
                  {manuscript.referees && manuscript.referees.length > 0
                    ? manuscript.referees.join(', ')
                    : '—'}
                  </td>
                  <td className="state-container">
                    <div className="state">{manuscript.state}</div>
                    <div className="state-description">{manuscript.state_description}</div>
                  </td>
                  <td className="actions-list">
                    <UpdateActionButton
                      manuscript={manuscript}
                      refreshManu={fetchManu}
                      referees={referees}
                      setError={setError}
                      userRoles={userRoles}
                      currentUserEmail={currentUserEmail}
                    />
                    <Link to={`/manuscripts/${manuscript.manuscript_id}`}>View</Link>
                  </td>
                  <td>
                    {isEditor ? (
                      manuscript.state !== 'PUB' ? (
                        <button
                          onClick={() => setEditingManuscript(manuscript)}
                          style={{ fontSize: '10px' }}
                        >
                          Edit Manuscript
                        </button>
                      ) : (
                        <p>Cannot edit a published manuscript.</p>
                      )
                    ) : (
                      <p>You do not have permission to edit this manuscript.</p>
                    )}
                  </td>
                  <td>
                  {isEditor ? (
                    <button
                      onClick={() =>
                        deleteManuscript({
                          title: manuscript.title,
                          author: manuscript.author,
                          author_email: manuscript.author_email,
                          text: manuscript.text,
                          abstract: manuscript.abstract,
                          editor_email: manuscript.editor_email,
                          manuscript_id: manuscript.manuscript_id,
                        })
                      }
                      style={{ fontSize: '10px' }}
                    >
                      Delete Manuscript
                    </button>
                  ) : (
                    <p>You do not have permission to delete this manuscript.</p>
                  )}
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

      {editingManuscript && (
      <div className = "modal-overlay">
        <div className = "modal-content">
          <EditManuscriptForm
              visible={true}
              cancel={() => setEditingManuscript(null)}
              fetchManu={fetchManu}
              setError={setError}
              editingManuscript={editingManuscript}
              setEditingManuscript={setEditingManuscript}
          />
        </div>
      </div>
    )}
    </div>
  );
}

export default Manuscripts;
export { manuscriptsHeader };
