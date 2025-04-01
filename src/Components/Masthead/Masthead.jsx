//masthead only includes thr people that work for the journal
import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`;

function Masthead({ allowedRoles }) {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  const [roleMap, setRoleMap] = useState({});

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
      .then(({ data }) => { 
        setPeople(peopleObjectToArray(data)); 
      })
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  const getRoles = () => {
    axios.get(ROLES_ENDPOINT)
      .then(({ data }) => setRoleMap(data))
      .catch((error) => { setError(`There was a problem getting roles. ${error}`); });
  };

  useEffect(fetchPeople, []);
  useEffect(getRoles, []);

  const filteredPeople = people.filter(person => {
    return person.roles.some(role => allowedRoles.includes(role));
  });

  const groupedPeople = groupPeopleByRole(filteredPeople);

  return (
    <div className="wrapper">

      {error && <ErrorMessage message={error} />}

      {Object.keys(groupedPeople).map(role => (
        <div key={role}>
          <h2>{roleMap[role]}</h2>
          {groupedPeople[role].map(person => (
            <Person
              key={person.email}
              person={person}
              roleMap={roleMap}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

Masthead.propTypes = {
  allowedRoles: propTypes.arrayOf(propTypes.string).isRequired,
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

function Person({ person, roleMap }) {
  const { name, email, roles, affiliation } = person;

  return (
    <div className="person-container">
      <Link to={name}>
        <h2>{name}</h2>
        <p>Email: {email}</p>
        <p><strong>Affiliation:</strong> {affiliation}</p>
        <ul>
          Roles: {Array.isArray(roles) ? roles.map((role) => (
            <li key={role}>{roleMap[role]}</li>
          )) : <li>{roles}</li>}
        </ul>
      </Link>
    </div>
  );
}

Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    roles: propTypes.arrayOf(propTypes.string).isRequired,
  }).isRequired,
  roleMap: propTypes.object.isRequired,
};

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

export default Masthead;

