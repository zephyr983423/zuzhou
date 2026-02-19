"use client";

import { useState, useEffect, useCallback } from "react";
import CurseForm from "./components/CurseForm";
import Leaderboard from "./components/Leaderboard";
import CurseCard from "./components/CurseCard";
import TargetModal from "./components/TargetModal";

interface Curse {
  id: string;
  targetName: string;
  curseText: string;
  createdAt: number;
}

interface LeaderboardEntry {
  name: string;
  count: number;
}

export default function Home() {
  const [curses, setCurses] = useState<Curse[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curse" | "feed">("curse");

  const fetchData = useCallback(async () => {
    try {
      const [cursesRes, leaderboardRes] = await Promise.all([
        fetch("/api/curses"),
        fetch("/api/leaderboard"),
      ]);
      const cursesData = await cursesRes.json();
      const leaderboardData = await leaderboardRes.json();
      setCurses(cursesData.curses || []);
      setLeaderboard(leaderboardData.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="pt-8 pb-6 md:pt-12 md:pb-8 text-center px-4">
        <div className="animate-float inline-block mb-4">
          <span className="text-5xl md:text-7xl">💀</span>
        </div>
        <h1 className="font-gothic text-4xl md:text-6xl font-black text-fire mb-3 tracking-wide">
          Le Carnet des Malédictions
        </h1>
        <p className="text-[#6a6a7a] text-lg md:text-xl max-w-2xl mx-auto font-body italic">
          Inscrivez le nom de vos ennemis dans ce carnet maudit.
          <br />
          Que leurs âmes soient à jamais tourmentées.
        </p>
        <div className="skull-divider max-w-md mx-auto mt-6">
          <span className="text-curse-600">☠</span>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="md:hidden flex justify-center gap-2 px-4 mb-6">
        <button
          onClick={() => setActiveTab("curse")}
          className={`px-6 py-2 rounded-full font-gothic text-sm tracking-wider uppercase transition-all ${
            activeTab === "curse"
              ? "bg-curse-700 text-white"
              : "bg-[#1a1a2e] text-[#6a6a7a] border border-curse-900"
          }`}
        >
          Maudire
        </button>
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-6 py-2 rounded-full font-gothic text-sm tracking-wider uppercase transition-all ${
            activeTab === "feed"
              ? "bg-blood-700 text-white"
              : "bg-[#1a1a2e] text-[#6a6a7a] border border-blood-900"
          }`}
        >
          Fil maudit
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Form + Recent */}
        <div
          className={`md:col-span-5 space-y-6 ${
            activeTab === "curse" ? "block" : "hidden md:block"
          }`}
        >
          <CurseForm onCurseAdded={fetchData} />

          {/* Recent Curses */}
          <div className="card-curse rounded-xl p-6">
            <h2 className="font-gothic text-xl font-bold text-curse-400 mb-4 text-center">
              Malédictions Récentes
            </h2>
            {curses.length === 0 ? (
              <p className="text-[#6a6a7a] italic text-center text-sm">
                Le carnet est vierge... pour l&apos;instant.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {curses.slice(0, 20).map((curse) => (
                  <CurseCard key={curse.id} curse={curse} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div
          className={`md:col-span-7 ${
            activeTab === "feed" ? "block" : "hidden md:block"
          }`}
        >
          <Leaderboard
            entries={leaderboard}
            onSelectTarget={setSelectedTarget}
          />

          {/* Stats */}
          <div className="mt-6 card-curse rounded-xl p-6 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-gothic font-black text-blood-500">
                  {curses.length}
                </div>
                <div className="text-xs text-[#6a6a7a] uppercase tracking-wider">
                  Malédictions totales
                </div>
              </div>
              <div>
                <div className="text-3xl font-gothic font-black text-curse-500">
                  {leaderboard.length}
                </div>
                <div className="text-xs text-[#6a6a7a] uppercase tracking-wider">
                  Âmes maudites
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-curse-950">
        <p className="text-[#4a4a5a] text-sm font-gothic">
          Le Carnet des Malédictions &mdash; Toute malédiction est
          définitive.
        </p>
        <p className="text-[#3a3a4a] text-xs mt-2">
          ☠ Ce site est purement fictif et humoristique ☠
        </p>
      </footer>

      {/* Target Modal */}
      {selectedTarget && (
        <TargetModal
          targetName={selectedTarget}
          onClose={() => setSelectedTarget(null)}
        />
      )}
    </main>
  );
}
