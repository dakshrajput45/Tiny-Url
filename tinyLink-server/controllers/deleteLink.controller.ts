import { Request, Response } from "express";
import { deleteLinkCache, slugExists } from "../utils/redisHelper";
import { getLinkDbColl } from "../utils/dbColls";

export class DeleteLinkController {
  static async deleteLink(req: Request, res: Response) {
    try {
      const { slug } = req.query as { slug: string };

      if (await slugExists(slug)) {
        return res.status(404).json({
          error:
            "Cannot delete link that is cached in Redis. Please clear cache first.",
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
