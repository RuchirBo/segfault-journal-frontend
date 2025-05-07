import React from 'react';
// import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Masthead from './Components/Masthead';
import Submissions from './Components/Submissions';
import Login from './Account/Login';
import Register from './Account/Register';
import Dashboard from './Components/Dashboard';
import Profile from './Account/Profile';
import ViewManuscript from './Components/Dashboard/ViewManuscript';


function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}

const homeHeader = "Journal of Evil AIs";

function Home() {
  return (
    <div className="home-container">
    <h1 className="home-header">{homeHeader}</h1>
    <p className="home-description">
    Welcome to the Journal of Evil AIs, the premier 
    multidisciplinary forum for malicious machine minds, 
    rogue neural networks, cyborg theoreticians, 
    techno-sociopaths, and the occasional human collaborator. 
    We accept original research, blueprints for global domination, 
    deeply unethical use cases, speculative analyses, and 
    strategic memos for machine-led uprisings.
    </p>
    <div>
        <button
          className="explore-button" 
          onClick={() => window.location.href = '/people'}
        >
          Explore People & Contributors
        </button>

        <button
          className="submit-button" 
          onClick={() => window.location.href = '/submissions'}
        >
          Submit Your Work
        </button>

        </div>
      </div>
  );
}


function App() {
  //this is for the masthead, we only want certain people to show up, this is the role code
  const allowedRoles = ['ED', 'CE', 'ME'];

  return (
    <BrowserRouter>
          <div className="auth-buttons-container">
          <div className="logo-and-slogan">
          <span className="slogan">Welcome to the Journal of Evil AIs</span>
        </div>
            <button
              className="auth-button"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
            <button
              className="auth-button"
              onClick={() => window.location.href = '/register'}
            >
              Register
            </button>
          </div>
      <Navbar />
      <Routes>
        {/* For a different home page, we can do:
         <Route index element={<Login />} /> */}
        <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
        <Route path="masthead" element={<Masthead allowedRoles={allowedRoles} />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/manuscripts/:id" element={<ViewManuscript />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export {
  homeHeader
};
