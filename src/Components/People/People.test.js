import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import People from './People'; //this is the component we want to test
import { peopleHeader } from './People';

describe('People', () => {
  it('renders header and button', async()=>{
    render(<People />);

    expect(screen.getByText(peopleHeader)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add a person/i })).toBeInTheDocument();
  })

  it('renders add person when button is clicked', async()=>{
    render(<People />);

    fireEvent.click(screen.getByRole('button', { name: /add a person/i }));
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Affiliation')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
  })

  // add tests for after person is created (using mocked data from axios calls) 

})
