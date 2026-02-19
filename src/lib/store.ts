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

interface BlobData {
  curses: Curse[];
}

const BLOB_FILE = "data.json";

const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

// --- Vercel Blob store ---

async function readData(): Promise<BlobData> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: BLOB_FILE });
  const blob = blobs.find((b) => b.pathname === BLOB_FILE);
  if (!blob) {
    return { curses: [] };
  }
  const res = await fetch(blob.url);
  return (await res.json()) as BlobData;
}

async function writeData(data: BlobData): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_FILE, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
  });
}

function computeLeaderboard(curses: Curse[], limit: number): LeaderboardEntry[] {
  const countMap = new Map<string, { name: string; count: number }>();
  for (const curse of curses) {
    const key = curse.targetName.toLowerCase();
    const entry = countMap.get(key);
    if (entry) {
      entry.count++;
    } else {
      countMap.set(key, { name: curse.targetName, count: 1 });
    }
  }
  return Array.from(countMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

const blobStore = {
  async addCurse(targetName: string, curseText: string): Promise<Curse> {
    const data = await readData();
    const curse: Curse = {
      id: uuidv4(),
      targetName: targetName.trim(),
      curseText: curseText.trim(),
      createdAt: Date.now(),
    };
    data.curses.unshift(curse);
    await writeData(data);
    return curse;
  },
  async getRecentCurses(limit: number = 50): Promise<Curse[]> {
    const data = await readData();
    return data.curses.slice(0, limit);
  },
  async getCursesForTarget(targetName: string): Promise<Curse[]> {
    const data = await readData();
    return data.curses.filter(
      (c) => c.targetName.toLowerCase() === targetName.toLowerCase()
    );
  },
  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    const data = await readData();
    return computeLeaderboard(data.curses, limit);
  },
};

// --- In-memory fallback for local development ---
const memCurses: Curse[] = [];

const memStore = {
  async addCurse(targetName: string, curseText: string): Promise<Curse> {
    const curse: Curse = {
      id: uuidv4(),
      targetName: targetName.trim(),
      curseText: curseText.trim(),
      createdAt: Date.now(),
    };
    memCurses.unshift(curse);
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
    return computeLeaderboard(memCurses, limit);
  },
};

// Select store based on environment
const store = isBlobConfigured ? blobStore : memStore;

export const addCurse = store.addCurse;
export const getRecentCurses = store.getRecentCurses;
export const getCursesForTarget = store.getCursesForTarget;
export const getLeaderboard = store.getLeaderboard;
