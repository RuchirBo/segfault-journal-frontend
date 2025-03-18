import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Submissions from './Components/Submissions';
import About from './Components/About';
import Login from './Account/Login';
import Dashboard from './Components/Dashboard';

function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}

const homeHeader = "Segfault Journal";
// const newHomeHeader = "Segfaul Journal";

function Home(){
  const styles = {
    'textAlign': 'center',
  }
  return <h1 style={styles}> {homeHeader}</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* For a different home page, do:
         <Route index element={<Login />} /> */}
        <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export {
  homeHeader
};
