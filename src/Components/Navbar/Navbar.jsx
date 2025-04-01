import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PAGES = [
  { label: 'Home', destination: '/' },
  { label: 'View All People', destination: '/people' },
  { label: 'Masthead', destination: '/Masthead' },
  { label: 'View All Submissions', destination: '/submissions' },
  { label: 'About', destination: '/about' },
  { label: 'Dashboard', destination: '/dashboard' },
];

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}
NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function Navbar() {
  return (
    <nav>
      <ul className="wrapper">
        {PAGES.map((page) => <NavLink key={page.destination} page={page} />)}
      </ul>
      <button className="login-button">
        <Link to="/login">Login</Link>
      </button>
    </nav>
  );
}

export default Navbar;
