import React from 'react';
import { GameMode } from '../types';

interface ModeSelectScreenProps {
    onModeSelect: (mode: GameMode) => void;
}

const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({ onModeSelect }) => {
    return (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-900 dark:text-white font-mono z-10 animate-fade-in">
            <div className="bg-white/50 dark:bg-black/30 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 text-center w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">Choose Game Mode</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => onModeSelect('NORMAL')}
                        className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-400 dark:border-gray-600 hover:bg-teal-300 dark:hover:bg-teal-600 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-200 text-left focus:outline-none focus:ring-4 focus:ring-teal-400 flex flex-col h-full"
                    >
                        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Normal Mode</h2>
                        <p className="text-gray-700 dark:text-gray-300 flex-grow">The full visual experience. Includes grid lines, particle effects, and glowing borders.</p>
                    </button>
                    <button
                        onClick={() => onModeSelect('PERFORMANCE')}
                        className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-400 dark:border-gray-600 hover:bg-orange-300 dark:hover:bg-orange-600 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-200 text-left focus:outline-none focus:ring-4 focus:ring-orange-400 flex flex-col h-full"
                    >
                        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Performance Mode</h2>
                        <p className="text-gray-700 dark:text-gray-300 flex-grow">For smoother gameplay. Disables non-essential visuals and reduces particle effects.</p>
                    </button>
                </div>
            </div>
             <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.4s ease-out forwards;
                    }
            `}</style>
        </div>
    );
};

export default ModeSelectScreen;
