import { getLinkDbColl } from "../utils/dbColls";
import { Request, Response } from "express";
import { getLinkBySlug } from "../utils/redisHelper";

export class GetLinkController {
  static async getLink(req: Request, res: Response) {
    try {
      const { slug } = req.params as { slug: string };
      if (!slug) {
        return res.status(400).json({ error: "Slug parameter is missing" });
      }

      const data = await getLinkBySlug(slug);
      return res.status(200).json({ message: "Link cached successfully", data });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }

  static async healthCheck(_req: Request, res: Response) {
    try {
      res.status(200).json({ message: "GetLinkController is healthy" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }

  static async getAllLinksFromDb(req: Request, res: Response) {
    try {
      const { page, pageSize } = req.query as {
        page?: string;
        pageSize?: string;
      };

      const linkColl = await getLinkDbColl();

      const data = await linkColl
        .find({})
        .skip(((Number(page) || 1) - 1) * (Number(pageSize) || 10))
        .limit(Number(pageSize) || 100)
        .toArray();

      res
        .status(200)
        .json({ message: "All links retrieved successfully", data });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }
}
