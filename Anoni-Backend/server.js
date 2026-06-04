const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});