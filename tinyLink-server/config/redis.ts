import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: RedisClientType | null = null;

/**
 * Connects to Redis server
 * @returns Connected Redis client instance
 */
export const connectRedis = async (): Promise<RedisClientType> => {
  if (redisClient) return redisClient;

  try {
    // Create Redis client with your Redis Cloud credentials
    redisClient = createClient({
      username: process.env['REDIS_USERNAME'] || 'default',
      password: process.env['REDIS_PASSWORD'],
      socket: {
        host: process.env['REDIS_HOST'] || 'redis-10134.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
        port: Number(process.env['REDIS_PORT']) || 10134
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    // Connect to Redis
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

/**
 * Gets the Redis client instance
 * @returns Redis client or null if not connected
 */
export const getRedisClient = async (): Promise<RedisClientType> => {
    if(!redisClient) {
        return await connectRedis();
    }
  return redisClient;
};

/**
 * Closes Redis connection
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
};