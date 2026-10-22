require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { ensureAssessments } = require('./seed/assessmentSeeder');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async () => {
  const assessmentSeed = await ensureAssessments();
  console.log(`[SmartHire] Assessments ready: ${assessmentSeed.created} created, ${assessmentSeed.existing} existing.`);

  const server = app.listen(PORT, () => {
    console.log(`[SmartHire Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
    // Keep server running in development or close gracefully
  });
}).catch(err => {
  console.error('[Server Startup Error]:', err.message);
  process.exit(1);
});
