export interface CacheValue {
    longUrl: string;
    lastClickedAt: Date | null;
    clickCount: number;
}