import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { BACKEND_URL } from '../../constants';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;

function fetchTextData(sectionKey) {
    return axios
        .get(`${TEXT_READ_ENDPOINT}/${sectionKey}`)
        .then(({ data }) => data || null)  
        .catch((error) => {
            throw new Error(`There was a problem retrieving the text for ${sectionKey}. ${error.message}`);
        });
}

function updateText(sectionKey, newTitle, newText) {
    return axios
        .put(`${TEXT_READ_ENDPOINT}/${sectionKey}/update`, { 
            title: newTitle, 
            text: newText 
        })
        .then(() => {
            alert(`Successfully updated ${sectionKey}`);
        })
        .catch((error) => {
            alert(`Failed to update ${sectionKey}: ${error.message}`);
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
            <h2>About This Journal</h2>
            <h2>{aboutText.title}</h2>
            <p>{aboutText.text}</p>
            <button type="button" onClick={() => alert('Implement Add Text functionality')}>
                Add Text
            </button>
            <button onClick={() => updateText('HomePage', aboutText?.title, aboutText?.text)}>
            Update About
            </button>
        </div>
    );
}

export default About;
