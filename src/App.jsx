// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarComponent from './components/Sidebar';
import GeolocationMap from './components/GeolocationMap';
import Report from './components/Report';
import Dashboard from './components/Dashboard';
import SecurityDashboard from './components/SecurityDashboard';
import NetworkControl from './components/NetworkControl';
import TrafficBlocking from './components/TrafficBlocking';
import FirewallRules from './components/FirewallRules';
import ComplianceReports from './components/ComplianceReports';
import CustomReports from './components/CustomReports';
import Logs from './components/Logs';
import SystemConfiguration from './components/SystemConfiguration';
import UserManagement from './components/UserManagement';
import IncidentManagement from './components/IncidentManagement';
import RealTimeTraffic from './components/RealTimeTraffic';
import AnomalyDetection from './components/AnomalyDetection';
import './App.css';

const App = () => {
  return (
    <Router>
      <SidebarComponent />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/security-dashboard" element={<SecurityDashboard />} />
          <Route path="/real-time-traffic" element={<RealTimeTraffic />} />
          <Route path="/anomaly-detection" element={<AnomalyDetection />} />
          <Route path="/network-control" element={<NetworkControl />} />
          <Route path="/traffic-blocking" element={<TrafficBlocking />} />
          <Route path="/firewall-rules" element={<FirewallRules />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/compliance-reports" element={<ComplianceReports />} />
          <Route path="/custom-reports" element={<CustomReports />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/geolocation-map" element={<GeolocationMap />} />
          <Route path="/system-configuration" element={<SystemConfiguration />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/incident-management" element={<IncidentManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
