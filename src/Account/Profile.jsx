import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function Profile() {
    const [user, setUser] = useState({
      name: 'Guest',
      email: 'Guest',
      role: 'Guest'
    });
  
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser({
            name: decoded.name || decoded.email || 'Guest',
            email: decoded.email || 'Guest',
            role: decoded.role || 'Guest'
          });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }, []);
  
    return (
      <div className="profile">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    );
  }
  
  export default Profile;