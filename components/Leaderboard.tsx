import React from 'react';
import { LeaderboardPlayer } from '../types';

interface LeaderboardProps {
    players: LeaderboardPlayer[];
    isVisible: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, isVisible }) => {
    const sortedPlayers = [...players].sort((a, b) => b.level - a.level);

    return (
        <div className={`absolute top-5 right-5 w-72 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-white font-mono p-3 border border-gray-300 dark:border-gray-700 transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
            <h2 className="text-xl font-bold text-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">Leaderboard</h2>
            <ul className="space-y-1">
                {sortedPlayers.map((player, index) => (
                    <li
                        key={index}
                        className={`flex justify-between items-center p-2 rounded ${
                            player.isPlayer ? 'bg-blue-500 bg-opacity-40' : ''
                        }`}
                    >
                        <span className="font-semibold truncate">
                            {index + 1}. {player.name}
                        </span>
                        <div className="flex items-center space-x-2">
                             {player.isPlayer && <span className="text-sm text-gray-600 dark:text-gray-400">{player.timeAlive}</span>}
                            <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                                L{player.level}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;