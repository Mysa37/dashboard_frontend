import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{
      width: '200px',
      height: '100vh',
      background: '#1e1e2f',
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ color: '#4dd0e1' }}>📊 Dashboard</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '20px 0' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Live Charts</Link>
        </li>
        <li style={{ margin: '20px 0' }}>
          <Link to="/add" style={{ color: '#fff', textDecoration: 'none' }}>Add Chart</Link>
        </li>
         <Link to="/add" style={{ color: '#fff', textDecoration: 'none' }}>Reports</Link>
      </ul>
    </div>
  );
};

export default Sidebar;
