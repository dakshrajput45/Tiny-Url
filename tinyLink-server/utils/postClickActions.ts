import { getLinkDbColl } from "./dbColls";
import { deleteLinkCache } from "./redisHelper";

export const postClickActions = async (slug: string, longUrl: string) => {
  try {
    const linkColl = await getLinkDbColl();
    await linkColl.updateOne(
      { slug },
      { $inc: { clickCount: 1 }, $set: { lastAccessed: new Date() } }
    );

    await deleteLinkCache(slug);
  } catch (error) {
    console.error(`Error in postClickActions for slug ${slug}:`, error);
  }
}