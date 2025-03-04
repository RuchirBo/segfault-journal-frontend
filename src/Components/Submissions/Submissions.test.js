import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import axios from 'axios';
import Submissions from './Submissions'; //this is the component we want to test

jest.mock('axios');

describe('Submissions Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { manuscripts: [] } });
  });

  it('renders correct text on Submissions page', async()=>{
    render(<Submissions />);

    expect(screen.getByText('View All Submissions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add manuscript/i })).toBeInTheDocument();
    expect(screen.getByText('No manuscripts found.')).toBeInTheDocument();
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

})
