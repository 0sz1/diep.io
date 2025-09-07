import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface StartScreenProps {
    onStart: (name: string) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, theme, toggleTheme }) => {
    const [name, setName] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedName = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        setName(sanitizedName);
    };

    const handleStart = () => {
        if (name.trim()) {
            onStart(name.trim());
        }
    };
    
    const toggleInstructions = () => setShowInstructions(!showInstructions);

    return (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-900 dark:text-white font-mono z-10 overflow-hidden">
             {/* Background shapes */}
            <div className="absolute inset-0 z-0">
                <div className="shape-1"></div>
                <div className="shape-2"></div>
                <div className="shape-3"></div>
            </div>
            
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button onClick={toggleInstructions} className="absolute top-5 right-5 text-4xl font-bold text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors z-20 hover:rotate-12 transform duration-300">?</button>
            
            <div className="relative z-10 bg-white/50 dark:bg-black/30 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 text-center animate-fade-in w-full max-w-md">
                <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">Diep.io 2</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">The Arena Awaits.</p>
                <div className="mb-6">
                    <input
                        id="name-input"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        maxLength={16}
                        className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 bg-opacity-50 border-2 border-gray-400 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-center text-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="Enter your name"
                    />
                </div>
                <button
                    onClick={handleStart}
                    disabled={!name.trim()}
                    className="w-full px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-2xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:from-gray-500 disabled:to-gray-600 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed disabled:transform-none"
                >
                    PLAY
                </button>
            </div>
            
            {showInstructions && (
                 <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center animate-fade-in z-30" onClick={toggleInstructions}>
                    <div className="bg-gray-200 dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg p-8 rounded-lg shadow-2xl border border-yellow-400 max-w-md w-full text-gray-900 dark:text-white" onClick={e => e.stopPropagation()}>
                         <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">How to Play</h2>
                         <div className="space-y-4 text-lg">
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">W, A, S, D</span> Move your tank</p>
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">Mouse</span> Aim</p>
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">Click</span> Shoot</p>
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">E</span> Toggle Autofire</p>
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">G</span> Toggle Autofarm</p>
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">U</span> View Evolutions</p>
                            <p><span className="font-bold text-cyan-500 dark:text-cyan-400 w-32 inline-block">Tab</span> Toggle Leaderboard</p>
                         </div>
                         <button 
                            onClick={toggleInstructions}
                            className="mt-8 w-full py-3 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-600 transition-colors"
                         >
                            Got it!
                         </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-out forwards;
                    }

                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(180deg); }
                        100% { transform: translateY(0px) rotate(360deg); }
                    }

                    @keyframes float-reverse {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(20px) rotate(-180deg); }
                        100% { transform: translateY(0px) rotate(-360deg); }
                    }

                    .shape-1 {
                        position: absolute;
                        width: 150px;
                        height: 150px;
                        background-color: rgba(0, 191, 255, 0.1);
                        top: 10%;
                        left: 15%;
                        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* Diamond */
                        animation: float 12s ease-in-out infinite;
                    }
                    html.dark .shape-1 { background-color: rgba(0, 191, 255, 0.1); }
                    html:not(.dark) .shape-1 { background-color: rgba(0, 191, 255, 0.2); }


                    .shape-2 {
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        bottom: 15%;
                        right: 10%;
                        border-radius: 30%;
                        animation: float-reverse 15s ease-in-out infinite;
                    }
                    html.dark .shape-2 { background-color: rgba(159, 122, 234, 0.1); }
                    html:not(.dark) .shape-2 { background-color: rgba(159, 122, 234, 0.2); }

                    .shape-3 {
                        position: absolute;
                        width: 80px;
                        height: 80px;
                        top: 70%;
                        left: 5%;
                        animation: float 10s ease-in-out infinite;
                    }
                    html.dark .shape-3 { background-color: rgba(246, 173, 85, 0.1); }
                    html:not(.dark) .shape-3 { background-color: rgba(246, 173, 85, 0.2); }
                `}
            </style>
        </div>
    );
};

export default StartScreen;
