import { Analytics } from "./analytics.model";

export interface Link {
    _id: string;
    email: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    analytics: Analytics;
    deleted?: boolean;
}