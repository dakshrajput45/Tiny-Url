import { getDb } from "../config/db";
import { Link } from "../models/link.model";

export const getLinkDbColl = async () => {
    const db = await getDb();
    return db.collection<Link>("links");
};
