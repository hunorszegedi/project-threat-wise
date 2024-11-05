import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Project ThreatWise</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/security-dashboard">
            <SecurityIcon className="icon" />
            <span>Security Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/network-control">
            <NetworkCheckIcon className="icon" />
            <span>Network Control</span>
          </Link>
        </li>
        <li>
          <Link to="/system-configuration">
            <SettingsIcon className="icon" />
            <span>System Configuration</span>
          </Link>
        </li>
        <li>
          <Link to="/compliance">
            <AssessmentIcon className="icon" />
            <span>Compliance Controls</span>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            <ReportIcon className="icon" />
            <span>Reports</span>
          </Link>
        </li>
        <li>
          <Link to="/logs">
            <ListAltIcon className="icon" />
            <span>Logs</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
