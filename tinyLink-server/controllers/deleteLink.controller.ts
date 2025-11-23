import { Request, Response } from "express";
import { deleteLinkCache, slugExists } from "../utils/redisHelper";
import { getLinkDbColl } from "../utils/dbColls";

export class DeleteLinkController {
  static async deleteLink(req: Request, res: Response) {
    try {
      const { slug } = req.params as { slug: string };

      if(!slug) {
        return res.status(400).json({ error: "Invalid or missing slug in request query" });
      }

      if (!await slugExists(slug)) {
        return res.status(404).json({
          error:
            "Link not found.",
        });
      }

      const linkColl = await getLinkDbColl();

      const deleteResult = await linkColl.deleteOne({ _id: slug });
      await deleteLinkCache(slug);

      if (deleteResult.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Link not found or already deleted." });
      }
      return res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error", errMsg: error });
    }
  }
}
