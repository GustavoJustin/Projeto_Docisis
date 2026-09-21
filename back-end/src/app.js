// app.js
const express = require('express');
const app = express();

app.use(express.json());

// Suas rotas
app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

module.exports = app;