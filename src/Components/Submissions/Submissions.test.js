import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Submissions from './Submissions'; // This is the component we want to test
import { manuscriptsHeader } from './Submissions';

jest.mock('axios');

describe('Submissions Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { manuscripts: [] } });
  });

  it('renders correct text on Submissions page', async () => {
    render(<Submissions />);
    
    expect(screen.getByText(manuscriptsHeader)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit a Manuscript/i })).toBeInTheDocument();
  });

  it('opens submit manuscript form when button is clicked', async () => {
    render(<Submissions />);
    
    fireEvent.click(screen.getByText(/Submit a Manuscript/i));
    
    // Wait for form fields to appear and check their existence
    expect(await screen.findByText('Title')).toBeInTheDocument();
    expect(await screen.findByText('Author Email')).toBeInTheDocument();
    expect(await screen.findByText('Text')).toBeInTheDocument();
    expect(await screen.findByText('Abstract')).toBeInTheDocument();

  });

  // it('prevents submission if manuscript ID is not unique', async () => {
  //   axios.get.mockResolvedValueOnce({ data: { manuscript_id: 'MANU001' } }); // Duplicate ID check

  //   render(<BrowserRouter><Submissions /></BrowserRouter>);
  //   fireEvent.click(screen.getByText(/Submit a Manuscript/i));


  //   // Fill in the form fields
  //   fireEvent.change(screen.getByLabelText(/Title/i), {
  //     target: { value: 'Duplicate Manuscript' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Author Email/i), {
  //     target: { value: 'author@example.com' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Text/i), {
  //     target: { value: 'Text of the duplicate manuscript.' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Abstract/i), {
  //     target: { value: 'Duplicate abstract.' },
  //   });

  //   // Click submit
  //   fireEvent.click(screen.container.querySelector('.submit-button'));

    

  //   // Wait for axios calls to complete
  //   await waitFor(() => {
  //     expect(axios.put).not.toHaveBeenCalled(); // Check that the PUT request is not made
  //     expect(screen.getByText(/already exists/)).toBeInTheDocument(); // Check for error message
  //   });
  // });
});
