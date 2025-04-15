import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import axios from 'axios';

import Submissions from './Submissions'; //this is the component we want to test
import { manuscriptsHeader } from './Submissions';

jest.mock('axios');

describe('Submissions Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { manuscripts: [] } });
  });

  it('renders correct text on Submissions page', async()=>{
    render(<Submissions />);

    expect(screen.getByText(manuscriptsHeader)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add manuscript/i })).toBeInTheDocument();
  })

  it('opens add manuscript form when button is clicked', async () => {
    render(<Submissions />);
    fireEvent.click(screen.getByText(/Add Manuscript/i));
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Author Email')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Abstract')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Manuscript ID/i)).toBeInTheDocument();
  })
  
  it('displays manuscripts from backend', async () => {
    const mockManuscripts = [
      {
        id: '1',
        title: 'Test Title.',
        author: 'Test Author',
        author_email: 'testauthoremail@nyu.edu',
        text: 'Test text',
        abstract: 'Test abstract.',
        editor_email: 'Test editor email',
        state: 'SUB',
      }
    ];

    axios.get.mockResolvedValue({ data: { manuscripts: mockManuscripts } });
    render(<BrowserRouter><Submissions /></BrowserRouter>);

    expect(await screen.findByText(/Test Title/));
    expect(await screen.findByText(/Test Author/)).toBeInTheDocument();
    expect(await screen.findByText(/testauthoremail@nyu.edu/)).toBeInTheDocument();
    expect(await screen.findByText(/Test text/)).toBeInTheDocument();
    expect(await screen.findByText(/Test abstract./)).toBeInTheDocument();
    expect(await screen.findByText(/Test editor email/)).toBeInTheDocument();
  })
  ;

  //tests for after a manuscript is submitted
  it('submits a new manuscript with unique manuscript ID', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } }); // ID check returns not found
    axios.put.mockResolvedValueOnce({}); // submission succeeds

    render(<BrowserRouter><Submissions /></BrowserRouter>);

    fireEvent.click(screen.getByText(/Add Manuscript/i));

    fireEvent.change(screen.getByLabelText(/Manuscript ID/i), {
      target: { value: 'MANU001' },
    });
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Unique Manuscript' },
    });
    fireEvent.change(screen.getByLabelText(/Author Email/i), {
      target: { value: 'author@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Text/i), {
      target: { value: 'This is the manuscript body.' },
    });
    fireEvent.change(screen.getByLabelText(/Abstract/i), {
      target: { value: 'A brilliant summary.' },
    });
    fireEvent.change(screen.getByLabelText(/Editor/i), {
      target: { value: 'editor@example.com' },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/manuscripts/MANU001')
      );
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/manuscripts/create'),
        expect.objectContaining({
          manuscript_id: 'MANU001',
          title: 'Unique Manuscript',
        })
      );
    });
  });

  it('prevents submission if manuscript ID is not unique', async () => {
    axios.get.mockResolvedValueOnce({ data: { manuscript_id: 'MANU001' } });

    render(<BrowserRouter><Submissions /></BrowserRouter>);

    fireEvent.click(screen.getByText(/Add Manuscript/i));

    fireEvent.change(screen.getByLabelText(/Manuscript ID/i), {
      target: { value: 'MANU001' },
    });
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Duplicate Manuscript' },
    });
    fireEvent.change(screen.getByLabelText(/Author Email/i), {
      target: { value: 'author@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Text/i), {
      target: { value: 'Text of the duplicate manuscript.' },
    });
    fireEvent.change(screen.getByLabelText(/Abstract/i), {
      target: { value: 'Duplicate abstract.' },
    });
    fireEvent.change(screen.getByLabelText(/Editor/i), {
      target: { value: 'editor@example.com' },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalled();
      expect(screen.getByText(/already exists/)).toBeInTheDocument();
    });
  });
})