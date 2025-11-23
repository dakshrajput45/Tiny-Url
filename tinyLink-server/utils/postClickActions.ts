import { getLinkDbColl } from "./dbColls";
import { updateLinkCache } from "./redisHelper";

export const postClickActions = async (slug: string, longUrl: string) => {
  try {
    const linkColl = await getLinkDbColl();
    const linkData = await linkColl.findOneAndUpdate(
      { _id: slug },
      {
        $inc: { "analytics.clickCount": 1 },
        $set: { "analytics.lastClickedAt": new Date() },
      },
      { returnDocument: "after" }
    );

    if (!linkData) {
      throw new Error(`Link data not found for slug: ${slug}`);
    }

    await updateLinkCache(
      slug,
      longUrl,
      linkData.analytics.clickCount,
      linkData.analytics.lastClickedAt
    );
  } catch (error) {
    console.error(`Error in postClickActions for slug ${slug}:`, error);
  }
};
