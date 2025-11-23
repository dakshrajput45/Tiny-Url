import { getRedisClient } from "../config/redis";
import { CacheValue } from "../models/cache.model";
import { getLinkDbColl } from "./dbColls";
import { getLinkFromDbAndCacheIt } from "./linkHelpers";

/**
 * Checks if a slug exists in cache or database
 * First checks Redis cache for fast lookup
 * If not found in cache, checks MongoDB and caches the result
 *
 * @param slug - The short URL slug to check
 * @returns true if slug exists, false otherwise
 */
export const slugExists = async (slug: string): Promise<boolean> => {
  try {
    const client = await getRedisClient();

    const cachedData = await client.get(`slug:${slug}`);

    if (cachedData) {
      console.log(`Slug "${slug}" found in cache`);
      return true;
    }

    await getLinkFromDbAndCacheIt(slug);
    console.log(`Slug "${slug}" found in database and cached`);
    return true;
  } catch (error) {
    console.error(`Error checking slug existence for "${slug}":`, error);
    return false;
  }
};

/**
 * Gets link data by slug from cache or database
 * Returns the full link data if found, null otherwise
 *
 * @param slug - The short URL slug
 * @returns CacheValue object or null
 */
export const getLinkBySlug = async (
  slug: string
): Promise<CacheValue | null> => {
  try {
    const client = await getRedisClient();

    const cachedData = await client.get(`slug:${slug}`);

    if (cachedData) {
      console.log(`Link data for "${slug}" retrieved from cache`);
      return JSON.parse(cachedData);
    }

    const linkData = await getLinkFromDbAndCacheIt(slug);
    console.log(`Link data for "${slug}" cached from database`);

    return linkData;
  } catch (error) {
    console.error(`Error getting link data for "${slug}":`, error);
    return null;
  }
};

export const deleteLinkCache = async (slug: string): Promise<void> => {
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.del(`slug:${slug}`);
    console.log(`Cache deleted for slug "${slug}"`);
  } catch (error) {
    console.error(`Error deleting cache for "${slug}":`, error);
  }
};
