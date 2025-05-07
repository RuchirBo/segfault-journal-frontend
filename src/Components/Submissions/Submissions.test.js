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
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Author Email')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Abstract')).toBeInTheDocument();
    });
  });

  // it('displays manuscripts from backend', async () => {
  //   const mockManuscripts = [
  //     {
  //       id: '1',
  //       title: 'Test Title',
  //       author: 'Test Author',
  //       author_email: 'testauthoremail@nyu.edu',
  //       text: 'Test text',
  //       abstract: 'Test abstract',
  //       editor_email: 'Test editor email',
  //       state: 'SUB',
  //     },
  //   ];

  //   axios.get.mockResolvedValue({ data: { manuscripts: mockManuscripts } });
  //   render(<BrowserRouter><Submissions /></BrowserRouter>);

  //   // // Check for manuscript data
  //   // await waitFor(() => {
  //   //   expect(screen.getByText(/Test Title/)).toBeInTheDocument();
  //   //   expect(screen.getByText(/Test Author/)).toBeInTheDocument();
  //   //   expect(screen.getByText(/testauthoremail@nyu.edu/)).toBeInTheDocument();
  //   //   expect(screen.getByText(/Test text/)).toBeInTheDocument();
  //   //   expect(screen.getByText(/Test abstract/)).toBeInTheDocument();
  //   //   expect(screen.getByText(/Test editor email/)).toBeInTheDocument();
  //   // });

  //   // Check for manuscript data with findByText
  //   expect(await screen.findByText(/Test Title/)).toBeInTheDocument();
  //   expect(await screen.findByText(/Test Author/)).toBeInTheDocument();
  //   expect(await screen.findByText(/testauthoremail@nyu.edu/)).toBeInTheDocument();
  //   expect(await screen.findByText(/Test text/)).toBeInTheDocument();
  //   expect(await screen.findByText(/Test abstract/)).toBeInTheDocument();
  //   expect(await screen.findByText(/Test editor email/)).toBeInTheDocument();

  // });

  // // Tests for after a manuscript is submitted
  // it('submits a new manuscript with unique manuscript ID', async () => {
  //   axios.get.mockRejectedValueOnce({ response: { status: 404 } }); // ID check returns not found
  //   axios.put.mockResolvedValueOnce({}); // submission succeeds

  //   render(<BrowserRouter><Submissions /></BrowserRouter>);

  //   // Fill in the form fields
  //   fireEvent.change(screen.getByLabelText(/Title/i), {
  //     target: { value: 'Unique Manuscript' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Author Email/i), {
  //     target: { value: 'author@example.com' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Text/i), {
  //     target: { value: 'This is the manuscript body.' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Abstract/i), {
  //     target: { value: 'A brilliant summary.' },
  //   });

  //   // Click submit
  //   fireEvent.click(screen.getByText(/Submit/i));

  //   // Wait for axios calls to complete
  //   await waitFor(() => {
  //     expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/manuscripts/MANU001'));
  //     expect(axios.put).toHaveBeenCalledWith(
  //       expect.stringContaining('/manuscripts/create'),
  //       expect.objectContaining({
  //         manuscript_id: 'MANU001',
  //         title: 'Unique Manuscript',
  //       })
  //     );
  //   });
  // });

  // it('prevents submission if manuscript ID is not unique', async () => {
  //   axios.get.mockResolvedValueOnce({ data: { manuscript_id: 'MANU001' } }); // Duplicate ID check

  //   render(<BrowserRouter><Submissions /></BrowserRouter>);

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
  //   fireEvent.click(screen.getByText(/Submit/i));

  //   // Wait for axios calls to complete
  //   await waitFor(() => {
  //     expect(axios.put).not.toHaveBeenCalled(); // Check that the PUT request is not made
  //     expect(screen.getByText(/already exists/)).toBeInTheDocument(); // Check for error message
  //   });
  // });
});
