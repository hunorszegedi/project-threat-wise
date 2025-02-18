// src/components/Sidebar.jsx
import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
// import 'react-pro-sidebar/dist/styles.css';
import '../styles/Sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WarningIcon from '@mui/icons-material/Warning';
import MapIcon from '@mui/icons-material/Map';

const SidebarComponent = () => {
  return (
    <Sidebar backgroundColor="#16213e">
      <div className="logo">
        <h2>Project ThreatWise</h2>
      </div>
      <Menu>
        <MenuItem icon={<DashboardIcon />}>
          <Link to="/dashboard" className="menu-link">Dashboard</Link>
        </MenuItem>

        <SubMenu title="Monitoring" icon={<SecurityIcon />}>
          <MenuItem>
            <Link to="/security-dashboard" className="menu-link">Security Dashboard</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/real-time-traffic" className="menu-link">Real-Time Traffic</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/anomaly-detection" className="menu-link">Anomaly Detection</Link>
          </MenuItem>
        </SubMenu>

        <SubMenu title="Traffic Control" icon={<NetworkCheckIcon />}>
          <MenuItem>
            <Link to="/network-control" className="menu-link">Network Control</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/traffic-blocking" className="menu-link">Traffic Blocking</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/firewall-rules" className="menu-link">Firewall Rules</Link>
          </MenuItem>
        </SubMenu>

        <SubMenu title="Reporting" icon={<AssessmentIcon />}>
          <MenuItem>
            <Link to="/reports" className="menu-link">Traffic Reports</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/compliance-reports" className="menu-link">Compliance Reports</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/custom-reports" className="menu-link">Custom Reports</Link>
          </MenuItem>
        </SubMenu>

        <MenuItem icon={<ListAltIcon />}>
          <Link to="/logs" className="menu-link">Logs</Link>
        </MenuItem>

        <MenuItem icon={<MapIcon />}>
          <Link to="/geolocation-map" className="menu-link">Geolocation Map</Link>
        </MenuItem>

        <SubMenu title="Administration" icon={<SettingsIcon />}>
          <MenuItem>
            <Link to="/system-configuration" className="menu-link">System Configuration</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/user-management" className="menu-link">User Management</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/incident-management" className="menu-link">Incident Management</Link>
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
