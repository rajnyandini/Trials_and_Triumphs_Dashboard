"use client";

interface PlayerCardProps {
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  className?: string;
}

export default function PlayerCard({
  name,
  hp,
  maxHp,
  mana,
  maxMana,
  className = "",
}: PlayerCardProps) {
  const hpPercentage = (hp / maxHp) * 100;
  const manaPercentage = (mana / maxMana) * 100;

  const getHpColor = () => {
    if (hpPercentage > 60) return "bg-green-600";
    if (hpPercentage > 30) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div
      className={`bg-gray-900 rounded-md p-3 shadow-lg border border-gray-800 ${className}`}
    >
      <h3 className="text-lg font-bold text-white mb-2 text-center">{name}</h3>

      {/* HP Bar */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-400">HP</span>
          <span className="text-xs font-medium text-gray-400">
            {hp} / {maxHp}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${getHpColor()} transition-all duration-300 flex items-center justify-center text-xs font-bold text-white`}
            style={{ width: `${Math.max(hpPercentage, 0)}%` }}
          >
            {hpPercentage > 15 && `${Math.round(hpPercentage)}%`}
          </div>
        </div>
      </div>

      {/* Mana Bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-400">Mana</span>
          <span className="text-xs font-medium text-gray-400">
            {mana} / {maxMana}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 flex items-center justify-center text-xs font-bold text-white"
            style={{ width: `${Math.max(manaPercentage, 0)}%` }}
          >
            {manaPercentage > 15 && `${Math.round(manaPercentage)}%`}
          </div>
        </div>
      </div>
    </div>
  );
}
