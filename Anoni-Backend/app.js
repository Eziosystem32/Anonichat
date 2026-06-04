require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/posts', postRoutes);
app.use('/api/auth',  authRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;