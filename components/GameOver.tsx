import React from 'react';

interface GameOverProps {
    score: number;
    onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white font-mono z-10">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-10 rounded-lg shadow-2xl border-2 border-blue-500 text-center animate-fade-in">
                <h1 className="text-6xl font-bold text-red-500 mb-4">GAME OVER</h1>
                <p className="text-2xl mb-2">Your Score:</p>
                <p className="text-5xl font-bold text-yellow-400 mb-8">{score}</p>
                <button
                    onClick={onRestart}
                    className="px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                    RESTART
                </button>
            </div>
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-out forwards;
                    }
                `}
            </style>
        </div>
    );
};

export default GameOver;