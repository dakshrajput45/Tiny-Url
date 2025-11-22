import dotenv from "dotenv";
import { MongoClient, Db } from "mongodb";
dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;


const connectToDatabase = async (): Promise<Db> => {
    if (db) return db;

    const dbUrl = process.env['DATABASE_URL'];

    if (!dbUrl) {
        console.error("DATABASE_URL is not defined in environment variables.");
        process.exit(1);
    }

    try {
        client = new MongoClient(dbUrl);
        await client.connect();
        db = client.db();
        console.log("Database connected successfully (mongodb native driver)");
        return db;
    } catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
};

const getDb = async (): Promise<Db> => {
    if (!db) {
        db = await connectToDatabase();
    }
    return db;
};

const closeConnection = async (): Promise<void> => {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("Database connection closed");
    }
};

export { connectToDatabase, getDb, closeConnection };