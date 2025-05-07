// About.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import About from './About'; // Update the import path as necessary
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock the axios call
jest.mock('axios');

// Sample response to mock for the axios call
const mockAboutText = {
    title: 'New Title',
    text: 'text',
};

describe('About component', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('renders the About text when the data is fetched', async () => {
        axios.get.mockResolvedValueOnce({ data: mockAboutText });
        render(<About />);
        await waitFor(() => expect(screen.getByText(mockAboutText.title)).toBeInTheDocument());
        expect(screen.getByText(mockAboutText.text)).toBeInTheDocument();
    });

    test('renders an error message when there is an error fetching data', async () => {
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
        render(<About />);
        await waitFor(() =>
            expect(screen.getByText(/There was a problem retrieving the text for SubmissionsPage. Failed to fetch/)).toBeInTheDocument()
        );
    });    

    
    test('renders a "No ABOUT text found" message if no "ABOUT" text is found', async () => {
        axios.get.mockResolvedValueOnce({ data: null });
        render(<About />);
        await waitFor(() =>
            expect(screen.getByText(/Error: No ABOUT text found/i)).toBeInTheDocument()
        );
    });
    
});
