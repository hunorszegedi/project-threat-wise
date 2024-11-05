import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Navigáció</h2>
      <ul>
        <li><Link to="/page1">Page 1</Link></li>
        <li><Link to="/page2">Page 2</Link></li>
        <li><Link to="/logs">Logs</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
