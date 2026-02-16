"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PlayerCard from "./PlayerCard";

interface Player {
  name?: string;
  hp: number;
  mhp: number;
  mp: number;
  mmp: number;
  class?: string;
  lvl?: number;
  team: number | string;
}

interface PlayersData {
  [key: string]: Player;
}

export default function Dashboard() {
  const [battleId, setBattleId] = useState<string>("");
  const [inputBattleId, setInputBattleId] = useState<string>("");
  const [players, setPlayers] = useState<PlayersData>({});
  const [battleName, setBattleName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!battleId) return;

    setLoading(true);
    const battleRef = doc(db, "battles", battleId);

    const unsubscribe = onSnapshot(
      battleRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPlayers(data.players || {});
          setBattleName(data.battle_name || "Battle");
          setError(null);
        } else {
          setPlayers({});
          setError("Battle not found. Please check the Battle ID.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase error:", error);
        setError("Failed to connect to Firebase. Check your configuration.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [battleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBattleId.trim()) {
      setBattleId(inputBattleId.trim());
      setError(null);
    }
  };

  const handleDisconnect = () => {
    setBattleId("");
    setInputBattleId("");
    setPlayers({});
    setBattleName("");
    setError(null);
  };

  // Show input form if not connected to a battle
  if (!battleId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-800 max-w-md w-full">
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">🎲</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              D&D Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Enter a Battle ID to connect
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="battleId"
                className="block text-xs font-medium text-gray-400 mb-1"
              >
                Battle ID
              </label>
              <input
                type="text"
                id="battleId"
                value={inputBattleId}
                onChange={(e) => setInputBattleId(e.target.value)}
                placeholder="e.g., 6tQ5mdjl0OKbLeuuvEK9"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              Connect to Battle
            </button>
          </form>

          {error && (
            <div className="mt-3 bg-red-950 border border-red-900 rounded p-2">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Connecting to battle...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="bg-red-950 border border-red-900 rounded-lg p-4 max-w-md">
          <h2 className="text-red-500 font-bold text-lg mb-2">
            Connection Error
          </h2>
          <p className="text-gray-300 text-sm">{error}</p>
          <button
            onClick={handleDisconnect}
            className="mt-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-sm transition-colors"
          >
            Try Another Battle
          </button>
        </div>
      </div>
    );
  }

  const playerList = Object.entries(players);

  // No players state
  if (playerList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-4xl mb-3">⚔️</div>
          <h2 className="text-xl font-bold text-gray-300 mb-2">
            No Players Yet
          </h2>
          <p className="text-gray-500 mb-3 text-sm">
            Waiting for players to join {battleName}...
          </p>
          <button
            onClick={handleDisconnect}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded text-sm transition-colors"
          >
            Change Battle
          </button>
        </div>
      </div>
    );
  }

  // Separate players by team field (handle both string and number)
  const team1Players = playerList.filter(
    ([_, player]) => player.team === 1 || player.team === "1",
  );
  const team2Players = playerList.filter(
    ([_, player]) => player.team === 2 || player.team === "2",
  );

  // Main dashboard with two-column team layout
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{battleName}</h1>
          <p className="text-gray-600 text-xs mt-0.5">Battle ID: {battleId}</p>
        </div>
        <button
          onClick={handleDisconnect}
          className="bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors"
        >
          Change Battle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Team 1 */}
        <div>
          <h2 className="text-lg font-bold text-blue-500 mb-2 text-center pb-1 border-b border-blue-900">
            Team 1
          </h2>
          <div className="space-y-2">
            {team1Players.map(([id, player]) => (
              <PlayerCard
                key={id}
                name={player.name || id}
                hp={player.hp}
                maxHp={player.mhp}
                mana={player.mp}
                maxMana={player.mmp}
              />
            ))}
          </div>
        </div>

        {/* Team 2 */}
        <div>
          <h2 className="text-lg font-bold text-red-500 mb-2 text-center pb-1 border-b border-red-900">
            Team 2
          </h2>
          <div className="space-y-2">
            {team2Players.map(([id, player]) => (
              <PlayerCard
                key={id}
                name={player.name || id}
                hp={player.hp}
                maxHp={player.mhp}
                mana={player.mp}
                maxMana={player.mmp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
