import { Request, Response } from "express";
import {
  addLinkToCacheAndDb,
  getFinalizeSlug,
} from "../utils/linkHelpers";
import { retryAsync } from "../utils/retryHelper";
import { slugExists } from "../utils/redisHelper";


export class AddLinkController {
  static async addLink(req: Request, res: Response) {
    try {
      const { longUrl } = req.body as { longUrl: string };

      if(!longUrl) {
        return res.status(400).json({ error: "Invalid or missing longUrl in request body" });
      }
  
      const slug = await retryAsync(() => getFinalizeSlug(longUrl));

      if(!slug) {
        return res.status(500).json({ error: "Failed to generate unique slug, please try again." });
      }
      
      if(await slugExists(slug)) {
        return res.status(409).json({ error: "Slug generation conflict, please try again." });
      }

      await addLinkToCacheAndDb(slug, longUrl);
      return res.status(201).json({ slug, longUrl });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }
}
