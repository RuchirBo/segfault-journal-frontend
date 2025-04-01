//masthead only includes thr people that work for the journal

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const ROLES_ENDPOINT = `${BACKEND_URL}/roles`;

const Masthead = () => {
  const [people, setPeople] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const peopleResponse = await axios.get(PEOPLE_READ_ENDPOINT);
        setPeople(peopleResponse.data);
        const rolesResponse = await axios.get(ROLES_ENDPOINT);
        setRoles(rolesResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div></div>;
  }
  if (!people.length || !roles.length) {
    return <div>Loading...</div>;
  }

  return <div></div>;
};

export default Masthead;
