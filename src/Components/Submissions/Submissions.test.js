import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import Submissions from './Submissions'; //this is the component we want to test

describe('Submissions', () => {
  it('renders correct text on Submissions landing page', async()=>{
    render(<Submissions />);

    expect(screen.getByText('View All Submissions')).toBeInTheDocument();
    expect(screen.getByText('Add Manuscript')).toBeInTheDocument();
    expect(screen.getByText('No manuscripts found.')).toBeInTheDocument();
  })
})
