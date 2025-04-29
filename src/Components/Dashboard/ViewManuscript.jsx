import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../constants';
import axios from 'axios';


function ViewManuscript() {
    const { id } = useParams(); 
    const [manuscript, setManuscript] = useState(null);
    const [error, setError] = useState('');
  
    useEffect(() => {
        axios.get(`${BACKEND_URL}/manuscripts/id/${id}`)
        .then((response) => {
          console.log('Fetching manuscript with ID:', id);
          setManuscript(response.data);
        })
        .catch((err) => {
          setError(`Error viewing manuscript: ${err.message}`);
        });
    }, [id]);
  
    if (error) return <div>{error}</div>;
    if (!manuscript) return <div>Error</div>;
  
    return (
      <div>
        <h2>{manuscript.title}</h2>
        <p><strong>Author</strong> {manuscript.author}</p>
        <p><strong>Abstract</strong> {manuscript.abstract}</p>
        <p><strong>Text</strong> {manuscript.text}</p>
      </div>
    );
  }

  export default ViewManuscript;