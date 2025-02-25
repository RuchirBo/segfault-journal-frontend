import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import Submissions from './Submissions'; //this is the component we want to test

describe('Submissions', () => {
  it('renders title, author, author email, text, abstract, and editor', async()=>{
    render(<People />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Author Email')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Abstract')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
  })
})
