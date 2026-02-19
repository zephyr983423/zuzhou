import { v4 as uuidv4 } from "uuid";
import { neon } from "@neondatabase/serverless";

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

const isNeonConfigured = !!process.env.DATABASE_URL;

// --- Neon PostgreSQL store ---

function getSQL() {
  return neon(process.env.DATABASE_URL!);
}

let initialized = false;

async function ensureTable() {
  if (initialized) return;
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS curses (
      id TEXT PRIMARY KEY,
      target_name TEXT NOT NULL,
      curse_text TEXT NOT NULL,
      created_at BIGINT NOT NULL
    )
  `;
  initialized = true;
}

const neonStore = {
  async addCurse(targetName: string, curseText: string): Promise<Curse> {
    await ensureTable();
    const sql = getSQL();
    const curse: Curse = {
      id: uuidv4(),
      targetName: targetName.trim(),
      curseText: curseText.trim(),
      createdAt: Date.now(),
    };
    await sql`
      INSERT INTO curses (id, target_name, curse_text, created_at)
      VALUES (${curse.id}, ${curse.targetName}, ${curse.curseText}, ${curse.createdAt})
    `;
    return curse;
  },
  async getRecentCurses(limit: number = 50): Promise<Curse[]> {
    await ensureTable();
    const sql = getSQL();
    const rows = await sql`
      SELECT id, target_name, curse_text, created_at
      FROM curses ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows.map((r) => ({
      id: String(r.id),
      targetName: String(r.target_name),
      curseText: String(r.curse_text),
      createdAt: Number(r.created_at),
    }));
  },
  async getCursesForTarget(targetName: string): Promise<Curse[]> {
    await ensureTable();
    const sql = getSQL();
    const rows = await sql`
      SELECT id, target_name, curse_text, created_at
      FROM curses WHERE LOWER(target_name) = LOWER(${targetName})
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({
      id: String(r.id),
      targetName: String(r.target_name),
      curseText: String(r.curse_text),
      createdAt: Number(r.created_at),
    }));
  },
  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    await ensureTable();
    const sql = getSQL();
    const rows = await sql`
      SELECT
        LOWER(target_name) as name_key,
        MAX(target_name) as display_name,
        COUNT(*)::int as curse_count
      FROM curses
      GROUP BY LOWER(target_name)
      ORDER BY curse_count DESC
      LIMIT ${limit}
    `;
    return rows.map((r) => ({
      name: String(r.display_name),
      count: Number(r.curse_count),
    }));
  },
};

// --- In-memory fallback for local development ---
const memCurses: Curse[] = [];

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
const store = isNeonConfigured ? neonStore : memStore;

export const addCurse = store.addCurse;
export const getRecentCurses = store.getRecentCurses;
export const getCursesForTarget = store.getCursesForTarget;
export const getLeaderboard = store.getLeaderboard;
