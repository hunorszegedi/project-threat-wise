const express = require('express');
const logProcessor = require('./logProcessor');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the Log Processing API. Use /api/logs to fetch logs.');
  });

app.get('/api/logs', (req, res) => {
  const logs = logProcessor.processLogs();
  res.json(logs);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
