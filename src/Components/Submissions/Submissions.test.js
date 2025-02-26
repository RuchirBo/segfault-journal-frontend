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

  it('renders correct text on Submissions landing page', async()=>{
    render(<Submissions />);

    expect(screen.getByText('View All Submissions')).toBeInTheDocument();
    expect(screen.getByText('Add Manuscript')).toBeInTheDocument();
    expect(screen.getByText('No manuscripts found.')).toBeInTheDocument();
  })

  it('opens add manuscript form when button is clicked', async () => {
    render(<Submissions />);
    fireEvent.click(screen.getByText(/Add Manuscript/i));
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  });

  it('displays error message when API fails to fetch manuscripts', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    render(<Submissions />);

    await waitFor(() => {
      expect(screen.getByText(/There was a problem retrieving the list of manuscripts/i)).toBeInTheDocument();
    });
  });

})
