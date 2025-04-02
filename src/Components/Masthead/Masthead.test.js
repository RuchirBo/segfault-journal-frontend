import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import axios from 'axios';

import Masthead from './Masthead'; //this is the component we want to test

jest.mock('axios');

const mockPeople = {
    person1: { name: 'Alice', email: 'alice@example.com', affiliation: 'NYU', roles: ['editor'] },
    person2: { name: 'Bob', email: 'bob@example.com', affiliation: 'NYU', roles: ['reviewer'] }
  };
  
const mockRoles = {
    editor: 'Editor',
    reviewer: 'Reviewer'
  };
  
  describe('Masthead Component', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('fetches and displays people and roles', async () => {
      axios.get.mockImplementation((url) => {
        if (url === `${BACKEND_URL}/people`) return Promise.resolve({ data: mockPeople });
        if (url === `${BACKEND_URL}/roles`) return Promise.resolve({ data: mockRoles });
        return Promise.reject(new Error('Unexpected API call'));
      });
  
      render(<Masthead allowedRoles={['editor', 'reviewer']} />);
  
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Editor')).toBeInTheDocument();
        expect(screen.getByText('Reviewer')).toBeInTheDocument();
      });
    });


  test('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(<Masthead allowedRoles={['editor', 'reviewer']} />);

    await waitFor(() => {
      expect(screen.getByText(/There was a problem retrieving the list of people/)).toBeInTheDocument();
    });
  });

  
  test('only displays people with allowed roles', async () => {
    axios.get.mockImplementation((url) => {
      if (url === `${BACKEND_URL}/people`) return Promise.resolve({ data: mockPeople });
      if (url === `${BACKEND_URL}/roles`) return Promise.resolve({ data: mockRoles });
      return Promise.reject(new Error('Unexpected API call'));
    });

    render(<Masthead allowedRoles={['editor']} />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
  });

  });