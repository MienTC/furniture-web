import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 LuxDecor TypeScript Backend is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔑 Auth: http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`📍 Address: http://localhost:${PORT}/api/v1/addresses`);
  console.log(`===============================================`);
});
