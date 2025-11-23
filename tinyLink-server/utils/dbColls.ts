import { getDb } from "../config/db";

export const getLinkDbColl = async () => {
    const db = await getDb();
    return db.collection<Link>("links");
};
