import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

import Dashboard from './Dashboard'; 
import { manuscriptsHeader } from './Dashboard';

jest.mock('axios');

describe('Dashboard Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { manuscripts: [] } });
  });

  it('renders correct text on Dashboard page', async () => {
    render(<Dashboard />);
    expect(screen.getByText(manuscriptsHeader)).toBeInTheDocument();
  });

  it('displays manuscripts when data is fetched', async () => {
    const mockManuscripts = [
      {
        id: '1',
        title: 'This is a manuscript.',
        author: 'Steph Curry',
        author_email: 'stephcurry@nyu.edu',
        text: 'Some text',
        abstract: 'This is a poem.',
        editor_email: 'rsh9689@nyu.edu',
        state: 'SUB',
      },
      {
        id: '2',
        title: 'The Art of Stephen Curry',
        author: 'Raiya Haque',
        author_email: 'rsh9689@nyu.edu',
        text: 'Stephen Curry is a wonderful basketball player.',
        abstract: 'Go Stephen Curry',
        editor_email: 'rsh9689@nyu.edu',
        state: 'SUB',
      },
    ];
    axios.get.mockResolvedValue({ data: { manuscripts: mockManuscripts } });

    render(<Dashboard />);
  });
});


