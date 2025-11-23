import crypto from "crypto";
import { getLinkDbColl } from "./dbColls";
import { CacheValue } from "../models/cache.model";
import { Analytics } from "../models/analytics.model";
import { Link } from "../models/link.model";
import { getRedisClient } from "../config/redis";
const domain = "https://tinylink.daksh.dev";

export const getShortUrlWithUniqueCode = (ucode: string) => {
  const code = generateRandomCode(ucode);
  return code.substring(0, 6);
};

export const generateRandomCode = (code: string): string => {
  return crypto
    .createHash("sha256")
    .update(code + crypto.randomUUID())
    .digest("base64url");
};

export const getFinalizeSlug = async (email: string, longUrl: string) => {
  const linkColl = await getLinkDbColl();
  const code = generateRandomCode(email + longUrl);
  const slug = getShortUrlWithUniqueCode(code);

  const slugExists = await linkColl.findOne({ slug });
  if (slugExists) {
    throw new Error("Slug generation conflict");
  }

  return slug;
};

export const getLinkFromDb = async (slug: string) => {
  const linkColl = await getLinkDbColl();
  const slugData = await linkColl.findOne(
    { _id: slug },
    { projection: { _id: 1 } }
  );

  if (!slugData) {
    throw new Error("Slug not found");
  }
  return slugData._id;
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
    lastClickedAt: slugData.lastClickedAt || new Date(),
    clickCount: slugData.clicks || 0,
    totalUniqueClicks: slugData.totalUniqueClicks || 0,
  };

  await client.setEx(`slug:${slugData._id}`, 86400, JSON.stringify(cacheValue));
  return cacheValue;
};

export const addLinkToCacheAndDb = async (
  slug: string,
  longUrl: string,
  email: string
) => {
  const linkColl = await getLinkDbColl();
  const analytics: Analytics = {
    clickCount: 0,
    totalUniqueClicks: 0,
    lastClickedAt: null,
  };

  const newLink: Link = {
    _id: slug,
    url: longUrl,
    email,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
    analytics,
  };

  await linkColl.insertOne({ newLink });
  const redisClient = await getRedisClient();
  await redisClient.setEx(`slug:${slug}`, 86400, JSON.stringify(newLink));
};
