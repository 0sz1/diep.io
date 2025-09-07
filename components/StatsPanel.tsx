import React from 'react';
import { Stats, TankClass } from '../types';
import { STAT_NAMES, PACIFIST_CLASSES } from '../constants';

interface StatsPanelProps {
    stats: Stats;
    points: number;
    onUpgrade: (stat: keyof Stats) => void;
    playerClass: TankClass;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, points, onUpgrade, playerClass }) => {
    const isPacifist = PACIFIST_CLASSES.has(playerClass);

    const statKeysToDisplay: Array<keyof Stats> = isPacifist
        ? ['passiveXpBoost']
        : ['xpGain', 'spawnRate'];

    return (
        <>
            <div className="absolute bottom-5 left-5 w-64 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-white font-mono p-3 text-sm animate-slide-in-left border border-gray-300 dark:border-gray-700">
                <h2 className="text-lg font-bold text-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">STATS ({points} points)</h2>
                <ul className="space-y-2">
                    {statKeysToDisplay.map((statKey) => {
                        const level = stats[statKey];
                        const canUpgrade = points > 0;

                        return (
                            <li key={statKey} className="flex items-center justify-between">
                                <span className="truncate">{STAT_NAMES[statKey]}</span>
                                <div className="flex items-center space-x-2">
                                    <span className="w-8 text-center font-bold text-green-600 dark:text-green-400">{level}</span>
                                    <button
                                        onClick={() => onUpgrade(statKey)}
                                        disabled={!canUpgrade}
                                        className="bg-gray-300 dark:bg-gray-600 hover:bg-green-500 text-gray-800 dark:text-white font-bold w-6 h-6 rounded-sm text-lg flex items-center justify-center transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <style>
                {`
                    @keyframes slide-in-left {
                        from {
                            transform: translateX(-100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    .animate-slide-in-left {
                        animation: slide-in-left 0.5s ease-out forwards;
                    }
                `}
            </style>
        </>
    );
};

export default StatsPanel;