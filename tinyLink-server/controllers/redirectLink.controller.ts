import { Request, Response } from "express";
import { getLinkBySlug } from "../utils/redisHelper";


export class RedirectLinkController {
  static async redirectLink(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Slug parameter is missing" });
      }
      const data = await getLinkBySlug(slug);
      if (!data) {
        return res.status(404).json({ error: "Link not found", slug: slug });
      }

      return res.redirect(302, data.longUrl);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }
}
