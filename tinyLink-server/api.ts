import app from "./app";
import { connectToDatabase } from "./config/db";

let isConnected = false;

export default async (req: any, res: any) => {
  try {
    if (!isConnected) {
      await connectToDatabase();
      isConnected = true;
    }
   return app(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};