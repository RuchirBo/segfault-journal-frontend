import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App'; //this is the component we want to test
import {homeHeader } from './App';

describe('App', () => {
  it('renders nav bar and home', async()=>{
    render(<App />);
    await screen.findByRole('heading');
    expect(screen.getByRole('heading')).toHaveTextContent(homeHeader);
    
    // expect(screen.getAllByRole('listitem))
  })
})
