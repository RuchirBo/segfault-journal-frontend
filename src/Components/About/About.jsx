import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { BACKEND_URL } from '../../constants';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;

function fetchTextData() {
    return axios
        .get(TEXT_READ_ENDPOINT)
        .then(({ data }) => data["ABOUT"] || null)  
        .catch((error) => {
            throw new Error(`There was a problem retrieving the text. ${error.message}`);
        });
}

function About() {
    const [aboutText, setAboutText] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTextData()
            .then((data) => {
                if (data) {
                    setAboutText(data);
                } else {
                    setError('No ABOUT text found');
                }
            })
            .catch((err) => setError(err.message))
    }, []);


    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!aboutText) {
        return <p>No manuscripts found.</p>
    }

    return (
        <div className="text-container">
            <h2>{aboutText.title}</h2>
            <p>{aboutText.text}</p>
            <button type="button" onClick={() => alert('Implement Add Text functionality')}>
                Add Text
            </button>
        </div>
    );
}

export default About;
