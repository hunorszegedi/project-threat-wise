import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Logs from './pages/Logs';
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
            <Route path="/logok" element={<Logs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
