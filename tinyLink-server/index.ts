import app from './app';
import { connectToDatabase } from './config/db';

const PORT = process.env['PORT'] || 4000;

// Start server with database connection
const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
      console.log(`Database: MongoDB connected`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 