import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Masthead from './Masthead';
import { MemoryRouter } from 'react-router-dom';
import { BACKEND_URL } from '../../constants';

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

  test('fetches and displays people and roles', async () => {
    axios.get.mockImplementation((url) => {
      if (url === `${BACKEND_URL}/people`) return Promise.resolve({ data: mockPeople });
      if (url === `${BACKEND_URL}/roles`) return Promise.resolve({ data: mockRoles });
      return Promise.reject(new Error('Unexpected API call'));
    });
  
    render(
      <MemoryRouter>
        <Masthead allowedRoles={['editor', 'reviewer']} />
      </MemoryRouter>
    );  
    expect(await screen.findAllByText('Alice')).not.toHaveLength(0);
    expect(await screen.findAllByText('Bob')).not.toHaveLength(0);
    expect(await screen.findAllByText('Editor')).not.toHaveLength(0);
    expect(await screen.findAllByText('Reviewer')).not.toHaveLength(0);
  });
  

  test('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter>
        <Masthead allowedRoles={['editor', 'reviewer']} />
      </MemoryRouter>
    );
    // await waitFor(() => {
    //   expect(screen.getByText("There was a problem getting roles. Error: Network Error")).toBeInTheDocument();
    // });
    expect(await screen.findByText("There was a problem getting roles. Error: Network Error")).toBeInTheDocument();

  });

  test('only displays people with allowed roles', async () => {
    axios.get.mockImplementation((url) => {
      if (url === `${BACKEND_URL}/people`) return Promise.resolve({ data: mockPeople });
      if (url === `${BACKEND_URL}/roles`) return Promise.resolve({ data: mockRoles });
      return Promise.reject(new Error('Unexpected API call'));
    });

    render(
      <MemoryRouter>
        <Masthead allowedRoles={['editor']} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
  });
});