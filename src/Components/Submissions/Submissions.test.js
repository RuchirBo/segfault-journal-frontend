import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Author Email')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Abstract')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
  });

  // add tests for after manuscript is submitted 

})
