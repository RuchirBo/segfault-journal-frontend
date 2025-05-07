import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Navbar', () => {
  test('renders all navigation links correctly', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    //test the links to each page
    const homeLink = screen.getByText(/Home/i);
    const peopleLink = screen.getByText(/View All People/i);
    const mastheadLink = screen.getByText(/Masthead/i);
    const submissionsLink = screen.getByText(/View All Submissions/i);
    const aboutLink = screen.getByText(/About/i);
    const dashboardLink = screen.getByText(/Dashboard/i);
    const profileLink = screen.getByText(/Profile/i);

    expect(homeLink).toBeInTheDocument();
    expect(peopleLink).toBeInTheDocument();
    expect(mastheadLink).toBeInTheDocument();
    expect(submissionsLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
  });

  test('each link has the correct destination', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const homeLink = screen.getByText(/Home/i);
    const peopleLink = screen.getByText(/View All People/i);
    const mastheadLink = screen.getByText(/Masthead/i);
    const submissionsLink = screen.getByText(/View All Submissions/i);
    const aboutLink = screen.getByText(/About/i);
    const dashboardLink = screen.getByText(/Dashboard/i);
    const profileLink = screen.getByText(/Profile/i);

    expect(homeLink).toHaveAttribute('href', '/');
    expect(peopleLink).toHaveAttribute('href', '/people');
    expect(mastheadLink).toHaveAttribute('href', '/Masthead');
    expect(submissionsLink).toHaveAttribute('href', '/submissions');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();
  });
});
