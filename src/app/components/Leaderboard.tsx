"use client";

interface LeaderboardEntry {
  name: string;
  count: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onSelectTarget: (name: string) => void;
}

const RANK_STYLES: Record<number, string> = {
  0: "text-4xl bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent",
  1: "text-3xl text-[#c0c0c0]",
  2: "text-2xl text-[#cd7f32]",
};

const RANK_ICONS: Record<number, string> = {
  0: "👑",
  1: "🥈",
  2: "🥉",
};

const RANK_BORDERS: Record<number, string> = {
  0: "border-yellow-500/30 bg-yellow-500/5",
  1: "border-[#c0c0c0]/20 bg-[#c0c0c0]/5",
  2: "border-[#cd7f32]/20 bg-[#cd7f32]/5",
};

export default function Leaderboard({
  entries,
  onSelectTarget,
}: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="card-curse rounded-xl p-6 md:p-8 text-center">
        <h2 className="font-gothic text-2xl md:text-3xl font-bold text-fire mb-4">
          Classement des Maudits
        </h2>
        <p className="text-[#6a6a7a] italic">
          Aucune âme n&apos;a encore été maudite...
        </p>
      </div>
    );
  }

  return (
    <div className="card-curse rounded-xl p-6 md:p-8">
      <h2 className="font-gothic text-2xl md:text-3xl font-bold text-fire mb-6 text-center">
        Classement des Maudits
      </h2>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <button
            key={entry.name}
            onClick={() => onSelectTarget(entry.name)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer text-left ${
              RANK_BORDERS[index] || "border-curse-900/30 bg-curse-950/20"
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
              {RANK_ICONS[index] ? (
                <span className="text-2xl">{RANK_ICONS[index]}</span>
              ) : (
                <span className="rank-number text-xl text-[#6a6a7a]">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="flex-grow min-w-0">
              <span
                className={`font-gothic font-bold truncate block ${
                  RANK_STYLES[index] || "text-lg text-[#e0d6cc]"
                }`}
              >
                {entry.name}
              </span>
            </div>

            {/* Count */}
            <div className="flex-shrink-0 text-right">
              <span className="text-blood-400 font-gothic font-bold text-xl">
                {entry.count}
              </span>
              <span className="text-[#6a6a7a] text-xs block">
                {entry.count === 1 ? "malédiction" : "malédictions"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
