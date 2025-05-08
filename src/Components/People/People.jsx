import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_UPDATE_ENDPOINT = `${BACKEND_URL}/people/update`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`

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


const peopleHeader = "View All People";

function Person({ person, fetchPeople, setError, roleMap, setSuccessMessage }) {
  const { name, email, roles, affiliation } = person;
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    const fetchUserAndCheckIfEditor = async () => {
      try {
        const userResponse = await fetch(`${BACKEND_URL}/auth/user`, {
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

  const deletePerson = () => {
    axios.delete(`${PEOPLE_READ_ENDPOINT}/${email}/delete`)
      .then(() => {
        fetchPeople();
        setSuccessMessage('Person successfully deleted');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => { 
        const errorMessage = error.response?.data?.message || error.message;
        setError(`There was a problem deleting the person. ${errorMessage}`); 
      });
  };
  
  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  return (
    <div>
        <div className="person-container">
        <Link to={name}> </Link>
          <h2>{name}</h2>
          <p>Email: {email}</p>
          <p><strong>Affiliation:</strong> {affiliation}</p>
          <ul>
            Roles: {Array.isArray(roles) ? roles.map((role) => (
                    <li key={role}>{roleMap[role]}</li>)) : <li>{roles}</li> 
            }
          </ul>
        </div>
        {isEditor && (
        <>
          <button onClick={deletePerson}>Delete Person</button>
          <button onClick={toggleUpdateForm}>Update Person</button>
        </>
      )}
      {showUpdateForm && (
        <UpdatePersonForm
          visible={showUpdateForm}
          person={person}
          cancel={toggleUpdateForm}
          fetchPeople={fetchPeople}
          setError={setError}
          roleOptions={roleMap}
        />
      )}
    </div>
  );
}


function UpdatePersonForm({ visible, person, cancel, fetchPeople, setError, roleOptions }) {
  const [name, setName] = useState(person.name);
  const [affiliation, setAffiliation] = useState(person.affiliation);
  const [roles, setRoles] = useState(person.roles || []);
  const [successMessage, setSuccessMessage] = useState('');

  const changeName = (event) => setName(event.target.value);
  const changeAffiliation = (event) => setAffiliation(event.target.value);
  const changeRoles = (event) => {
    const selectedRoles = Array.from(event.target.selectedOptions, option => option.value);
    setRoles(selectedRoles);
  };

  const updatePerson = (event) => {
    event.preventDefault();
    const updatedPerson = { name, affiliation, roles };
    axios.put(`${PEOPLE_UPDATE_ENDPOINT}/${person.email}`, updatedPerson)
      .then(() => {
        fetchPeople();
        setSuccessMessage('Person successfully updated');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => { 
        const errorMessage = error.response?.data?.message || error.message;
        setError(`There was a problem updating the person. ${errorMessage}`); 
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="update-name">Name</label>
      <input required type="text" id="update-name" value={name} onChange={changeName} />
      <label htmlFor="update-affiliation">Affilation</label>
      <input required type="text" id="update-affiliation" value={affiliation} onChange={changeAffiliation} />
      <label htmlFor="update-role">Roles</label>
      <select multiple id="update-role" value={roles} onChange={changeRoles} required>
        {Object.keys(roleOptions).map((code) => (
          <option key={code} value={code}>
            {roleOptions[code]}
          </option>
        ))}
      </select>

      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={updatePerson}>Update</button>

      {successMessage && (
        <div className="success-popup">
          {successMessage}
        </div>
      )}
    </form>
  );
}
UpdatePersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.array.isRequired
  }).isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  roleOptions: propTypes.object.isRequired,
};

Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.arrayOf(propTypes.string).isRequired,
  }).isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  roleMap: propTypes.object.isRequired,
  setSuccessMessage: propTypes.func.isRequired,
};

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data);
  const people = keys.map((key) => Data[key]);
  return people;
}

function groupPeopleByRole(people) {
  return people.reduce((grouped, person) => {
    person.roles.forEach(role => {
      if (!grouped[role]) {
        grouped[role] = [];
      }
      grouped[role].push(person);
    });
    return grouped;
  }, {});
}

function People() {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  const [roleMap, setRoleMap] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => { setPeople(peopleObjectToArray(data)) })
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => setRoleMap(data))
      .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
  }
  

  useEffect(fetchPeople, []);
  useEffect(getRoles,[]);

  const filteredPeople = people.filter((person) => {
    const search = searchQuery.toLowerCase();
    return (
      person.name.toLowerCase().includes(search) ||
      person.email.toLowerCase().includes(search)||
      person.affiliation.toLowerCase().includes(search) ||
      person.roles.some(role => role.toLowerCase().includes(search))
    );
  });

  const groupedPeople = groupPeopleByRole(filteredPeople);

  return (
    <div className="wrapper">
      <header>
        <h1> {peopleHeader}</h1>
        <input 
          type="text"
          placeholder='Search by name, email, affiliation, or role...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style = {{margin: "10px 0", width: "100%", padding: "8px"}}
        />
       
      </header>
      
      {successMessage && (
        <div className="success-popup">
          {successMessage}
        </div>
      )}
      
      {error && <ErrorMessage message={error} />}

      {Object.keys(groupedPeople).map(role => (
        <div key={role}>
          <h2>{roleMap[role]}</h2>
          {groupedPeople[role].map(person => (
            <Person
              key={person.email}
              person={person}
              fetchPeople={fetchPeople}
              setError={setError}
              roleMap={roleMap}
              setSuccessMessage={setSuccessMessage}
            />
          ))}
        </div>
      ))}
    </div>
  );
}


export default People;
export {peopleHeader};
