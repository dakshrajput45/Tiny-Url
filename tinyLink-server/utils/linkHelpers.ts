import crypto from "crypto";
import { getLinkDbColl } from "./dbColls";
import { CacheValue } from "../models/cache.model";
import { Analytics } from "../models/analytics.model";
import { Link } from "../models/link.model";
import { getRedisClient } from "../config/redis";


export const getShortUrlWithUniqueCode = (ucode: string) => {
  const code = generateRandomCode(ucode);
  const alphanumeric = code.replace(/[^A-Za-z0-9]/g, '');
  return alphanumeric.substring(0, 6);
};

export const generateRandomCode = (code: string): string => {
  return crypto
    .createHash("sha256")
    .update(code + crypto.randomUUID())
    .digest("base64url");
};

export const getFinalizeSlug = async (longUrl: string) => {
  const linkColl = await getLinkDbColl();
  const code = generateRandomCode(longUrl);
  const slug = getShortUrlWithUniqueCode(code);

  const slugExists = await linkColl.findOne({ slug });
  if (slugExists) {
    throw new Error("Slug generation conflict");
  }

  return slug;
};

export const getLinkFromDbAndCacheIt = async (
  slug: string
): Promise<CacheValue> => {
  const linkColl = await getLinkDbColl();
  const slugData = await linkColl.findOne<Link>({ _id: slug });

  if (!slugData) {
    throw new Error("Slug not found");
  }

  const client = await getRedisClient();
  // Prepare cache value
  const cacheValue: CacheValue = {
    longUrl: slugData.url,
    lastClickedAt: slugData.analytics.lastClickedAt || new Date(),
    clickCount: slugData.analytics.clickCount || 0,
  };

  await client.setEx(`slug:${slugData._id}`, 86400, JSON.stringify(cacheValue));
  return cacheValue;
};

export const addLinkToCacheAndDb = async (
  slug: string,
  longUrl: string
) => {
  const linkColl = await getLinkDbColl();
  const analytics: Analytics = {
    clickCount: 0,
    lastClickedAt: null,
  };

  const newLink: Link = {
    _id: slug,
    url: longUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
    analytics,
  };

  const cacheValue: CacheValue = {
    longUrl: longUrl,
    lastClickedAt: null,
    clickCount: 0,
  };

  await linkColl.insertOne(newLink);
  const redisClient = await getRedisClient();
  await redisClient.setEx(`slug:${slug}`, 86400, JSON.stringify(cacheValue));
};
