import React, { useEffect, useState } from 'react';

function Profile() {
    const [user, setUser] = useState({
      email: 'Guest',
      role: 'Guest'
    });
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/auth/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
    
          if (!response.ok) {
            throw new Error('Not logged in');
          }
    
          const data = await response.json();
          console.log(data)
          setUser({
            email: data.email,
            role: data.role
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setUser({
            email: 'Guest',
            role: 'Guest'
          });
        }
      };
    
      fetchUser();
    }, []);
    
  
    return (
      <div className="profile">
        <h2>User Profile</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    );
  }
  
  export default Profile;