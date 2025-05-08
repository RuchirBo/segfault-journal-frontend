import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../constants';

function Profile() {
  const [user, setUser] = useState({ email: 'Guest', role: 'Guest' });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Not logged in');
      const data = await res.json();
      setUser({ email: data.email, role: data.role });
    } catch {
      setUser({ email: 'Guest', role: 'Guest' });
    }
  };

  const handleLogout = async () => {
    // only attempt logout if someone is actually logged in
    if (user.email === 'Guest') return;

    await fetch(`${BACKEND_URL}/auth/user`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser({ email: 'Guest', role: 'Guest' });
  };

  const isGuest = user.email === 'Guest';

  return (
    <div
      className="wrapper"
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '400px',
        margin: '20px auto',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3>User Profile</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <button
        onClick={handleLogout}
        disabled={isGuest}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: isGuest ? 'not-allowed' : 'pointer',
          backgroundColor: isGuest ? '#e0e0e0' : '#007bff',
          color: isGuest ? '#888888' : '#ffffff',
        }}
      >
        Log out
      </button>
    </div>
  );
}

export default Profile;