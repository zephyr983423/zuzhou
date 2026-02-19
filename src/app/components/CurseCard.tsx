"use client";

interface Curse {
  id: string;
  targetName: string;
  curseText: string;
  createdAt: number;
}

interface CurseCardProps {
  curse: Curse;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "À l'instant";
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
  if (seconds < 2592000) return `Il y a ${Math.floor(seconds / 86400)}j`;
  return new Date(timestamp).toLocaleDateString("fr-FR");
}

export default function CurseCard({ curse }: CurseCardProps) {
  return (
    <div className="card-curse rounded-lg p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-blood-500 text-lg">💀</span>
          <span className="font-gothic font-bold text-blood-400 text-lg">
            {curse.targetName}
          </span>
        </div>
        <span className="text-xs text-[#4a4a5a]">
          {timeAgo(curse.createdAt)}
        </span>
      </div>

      <p className="text-[#c0b8ae] italic leading-relaxed pl-8">
        &ldquo;{curse.curseText}&rdquo;
      </p>
    </div>
  );
}
