import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs');
        console.log('Fetched logs:', response.data); 
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Logs</h1>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Process ID</th>
            <th>Host</th>
            <th>IP Address</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.processId}</td>
              <td>{log.host}</td>
              <td>{log.ip}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
