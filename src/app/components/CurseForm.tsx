"use client";

import { useState } from "react";

interface CurseFormProps {
  onCurseAdded: () => void;
}

const CURSE_SUGGESTIONS = [
  "Que ses lacets se défassent à chaque pas",
  "Que son Wi-Fi soit éternellement lent",
  "Que chaque porte lui résiste au premier essai",
  "Que son café soit toujours tiède",
  "Que ses chaussettes soient toujours humides",
  "Que son téléphone tombe toujours face contre terre",
  "Que ses écouteurs s'emmêlent à l'infini",
  "Que chaque feu de circulation passe au rouge à son approche",
];

export default function CurseForm({ onCurseAdded }: CurseFormProps) {
  const [targetName, setTargetName] = useState("");
  const [curseText, setCurseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !curseText.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/curses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName, curseText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur inconnue");
      }

      setTargetName("");
      setCurseText("");
      setSuccess(true);
      onCurseAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const fillSuggestion = () => {
    const random =
      CURSE_SUGGESTIONS[Math.floor(Math.random() * CURSE_SUGGESTIONS.length)];
    setCurseText(random);
  };

  return (
    <form onSubmit={handleSubmit} className="card-curse rounded-xl p-6 md:p-8">
      <h2 className="font-gothic text-2xl md:text-3xl font-bold text-fire mb-6 text-center">
        Inscrire une Malédiction
      </h2>

      <div className="space-y-5">
        {/* Target Name */}
        <div>
          <label className="block text-curse-300 font-gothic text-sm mb-2 tracking-wider uppercase">
            Nom de la personne maudite
          </label>
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="Inscrivez le nom ici..."
            maxLength={100}
            className="w-full bg-[#0f0f1a] border border-curse-800 rounded-lg px-4 py-3 text-[#e0d6cc] placeholder-[#4a4a5a] focus:outline-none focus:border-curse-600 input-glow transition-all"
          />
        </div>

        {/* Curse Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-curse-300 font-gothic text-sm tracking-wider uppercase">
              Votre malédiction
            </label>
            <button
              type="button"
              onClick={fillSuggestion}
              className="text-xs text-curse-500 hover:text-curse-400 transition-colors"
            >
              Suggestion aléatoire
            </button>
          </div>
          <textarea
            value={curseText}
            onChange={(e) => setCurseText(e.target.value)}
            placeholder="Que cette personne..."
            maxLength={500}
            rows={3}
            className="w-full bg-[#0f0f1a] border border-curse-800 rounded-lg px-4 py-3 text-[#e0d6cc] placeholder-[#4a4a5a] focus:outline-none focus:border-curse-600 input-glow transition-all resize-none"
          />
          <div className="text-right text-xs text-[#4a4a5a] mt-1">
            {curseText.length}/500
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-blood-950/50 border border-blood-800 rounded-lg px-4 py-2 text-blood-400 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-curse-950/50 border border-curse-800 rounded-lg px-4 py-2 text-curse-400 text-sm text-center">
            Malédiction inscrite avec succès !
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !targetName.trim() || !curseText.trim()}
          className="w-full bg-gradient-to-r from-blood-700 to-curse-700 hover:from-blood-600 hover:to-curse-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-gothic text-lg py-3 rounded-lg transition-all btn-pulse tracking-wider uppercase"
        >
          {loading ? "En cours..." : "Maudire"}
        </button>
      </div>
    </form>
  );
}
