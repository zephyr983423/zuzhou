import { v4 as uuidv4 } from "uuid";

export interface Curse {
  id: string;
  targetName: string;
  curseText: string;
  createdAt: number;
}

export interface LeaderboardEntry {
  name: string;
  count: number;
}

// Check if Vercel KV is configured
const isKVConfigured = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

// --- In-memory fallback for local development ---
const memCurses: Curse[] = [];
const memLeaderboard: Map<string, number> = new Map();
const memDisplayNames: Map<string, string> = new Map();

const memStore = {
  async addCurse(targetName: string, curseText: string): Promise<Curse> {
    const normalizedName = targetName.trim();
    const curse: Curse = {
      id: uuidv4(),
      targetName: normalizedName,
      curseText: curseText.trim(),
      createdAt: Date.now(),
    };
    memCurses.unshift(curse);
    const key = normalizedName.toLowerCase();
    memLeaderboard.set(key, (memLeaderboard.get(key) || 0) + 1);
    memDisplayNames.set(key, normalizedName);
    return curse;
  },
  async getRecentCurses(limit: number = 50): Promise<Curse[]> {
    return memCurses.slice(0, limit);
  },
  async getCursesForTarget(targetName: string): Promise<Curse[]> {
    return memCurses.filter(
      (c) => c.targetName.toLowerCase() === targetName.toLowerCase()
    );
  },
  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    const entries: LeaderboardEntry[] = [];
    memLeaderboard.forEach((count, key) => {
      entries.push({ name: memDisplayNames.get(key) || key, count });
    });
    entries.sort((a, b) => b.count - a.count);
    return entries.slice(0, limit);
  },
};

// --- Vercel KV store ---
const kvStore = {
  async addCurse(targetName: string, curseText: string): Promise<Curse> {
    const { kv } = await import("@vercel/kv");
    const normalizedName = targetName.trim();
    const curse: Curse = {
      id: uuidv4(),
      targetName: normalizedName,
      curseText: curseText.trim(),
      createdAt: Date.now(),
    };
    await kv.lpush("curses", JSON.stringify(curse));
    await kv.zincrby("leaderboard", 1, normalizedName.toLowerCase());
    await kv.hset("name_display", {
      [normalizedName.toLowerCase()]: normalizedName,
    });
    return curse;
  },
  async getRecentCurses(limit: number = 50): Promise<Curse[]> {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.lrange<string>("curses", 0, limit - 1);
    return raw.map((item) =>
      typeof item === "string" ? JSON.parse(item) : item
    );
  },
  async getCursesForTarget(targetName: string): Promise<Curse[]> {
    const all = await kvStore.getRecentCurses(500);
    return all.filter(
      (c) => c.targetName.toLowerCase() === targetName.toLowerCase()
    );
  },
  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    const { kv } = await import("@vercel/kv");
    const results = await kv.zrange<string[]>("leaderboard", 0, limit - 1, {
      rev: true,
      withScores: true,
    });
    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < results.length; i += 2) {
      const key = String(results[i]);
      const count = Number(results[i + 1]);
      const displayName = await kv.hget<string>("name_display", key);
      entries.push({ name: displayName || key, count });
    }
    return entries;
  },
};

// Select store based on environment
const store = isKVConfigured ? kvStore : memStore;

export const addCurse = store.addCurse;
export const getRecentCurses = store.getRecentCurses;
export const getCursesForTarget = store.getCursesForTarget;
export const getLeaderboard = store.getLeaderboard;
