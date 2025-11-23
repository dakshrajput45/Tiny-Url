import { getLinkDbColl } from "../utils/dbColls";
import { getLinkFromDbAndCacheIt } from "../utils/linkHelpers";
import { Request, Response } from "express";

export class GetLinkController {
  static async getLink(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ error: "Slug parameter is missing" });
      }

      const data = await getLinkFromDbAndCacheIt(slug);
      res.status(200).json({ message: "Link cached successfully", data });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }

  static async ping(req: Request, res: Response) {
    res.status(200).json({ message: "pong" });
  }

  static async getAllLinksFromDb(req: Request, res: Response) {
    try {
      const { email, page, pageSize } = req.query;

      const linkColl = await getLinkDbColl();

      const data = await linkColl
        .find({ email })
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
