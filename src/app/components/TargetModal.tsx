"use client";

import { useState, useEffect } from "react";
import CurseCard from "./CurseCard";

interface Curse {
  id: string;
  targetName: string;
  curseText: string;
  createdAt: number;
}

interface TargetModalProps {
  targetName: string;
  onClose: () => void;
}

export default function TargetModal({ targetName, onClose }: TargetModalProps) {
  const [curses, setCurses] = useState<Curse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurses() {
      try {
        const res = await fetch(
          `/api/curses?target=${encodeURIComponent(targetName)}`
        );
        const data = await res.json();
        setCurses(data.curses || []);
      } catch {
        setCurses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCurses();
  }, [targetName]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-curse rounded-xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-gothic text-2xl font-bold text-fire">
            💀 {targetName}
          </h3>
          <button
            onClick={onClose}
            className="text-[#6a6a7a] hover:text-blood-400 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        <p className="text-curse-400 text-sm mb-4">
          {curses.length} malédiction{curses.length !== 1 ? "s" : ""} inscrite
          {curses.length !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="text-center py-8 text-[#6a6a7a]">
            Chargement des malédictions...
          </div>
        ) : curses.length === 0 ? (
          <div className="text-center py-8 text-[#6a6a7a] italic">
            Aucune malédiction trouvée
          </div>
        ) : (
          <div className="space-y-3">
            {curses.map((curse) => (
              <CurseCard key={curse.id} curse={curse} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
