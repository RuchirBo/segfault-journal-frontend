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

  // add tests for after manuscript is submitted 

})