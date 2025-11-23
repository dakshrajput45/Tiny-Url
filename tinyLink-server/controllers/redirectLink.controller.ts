import { Request, Response } from "express";
import { getLinkBySlug } from "../utils/redisHelper";
import { postClickActions } from "../utils/postClickActions";


const FRONTEND_URL = process.env["FRONTEND_URL"] || "http://localhost:5173";

export class RedirectLinkController {
  static async redirectLink(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Slug parameter is missing" });
      }
      const data = await getLinkBySlug(slug);
      if (!data) {
        return res.redirect(404, `${FRONTEND_URL}/404`);
      }

      postClickActions(slug, data.longUrl);
      return res.redirect(302, data.longUrl);
    } catch (error) {
      console.error("Error in redirectLink:", error);
      return res.redirect(404, `${FRONTEND_URL}/404`);
    }
  }
}
