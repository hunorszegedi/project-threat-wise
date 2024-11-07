import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Logs from './pages/Logs';
import IncidentManagement from './pages/IncidentManagement';
import GeolocationMap from './pages/GeolocationMap'; 
import IPInfoMap from './pages/IPInfoMap';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Page1 />} />
            <Route path="/security-dashboard" element={<Page2 />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/incident-management" element={<IncidentManagement />} />
            <Route path="/geolocation-map" element={<GeolocationMap/>} />
            <Route path="/ipinfo-map" element={<IPInfoMap />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
