import React from 'react';
import { TankClass } from '../types';
import { CLASS_DETAILS } from '../constants';

interface UpgradeScreenProps {
    availableUpgrades: TankClass[];
    onUpgrade: (chosenClass: TankClass) => void;
}

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ availableUpgrades, onUpgrade }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white font-mono z-20 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 rounded-lg shadow-2xl border-2 border-green-500 text-center max-w-4xl">
                <h1 className="text-4xl font-bold text-green-500 dark:text-green-400 mb-6">CHOOSE YOUR UPGRADE</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableUpgrades.map(upgradeClass => (
                        <button
                            key={upgradeClass}
                            onClick={() => onUpgrade(upgradeClass)}
                            className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-400 dark:border-gray-600 hover:bg-green-300 dark:hover:bg-green-600 hover:border-green-500 dark:hover:border-green-400 transition-all duration-200 text-left focus:outline-none focus:ring-4 focus:ring-green-400 flex flex-col h-full"
                        >
                            <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{CLASS_DETAILS[upgradeClass].name}</h2>
                            <p className="text-gray-700 dark:text-gray-300 flex-grow">{CLASS_DETAILS[upgradeClass].description}</p>
                        </button>
                    ))}
                </div>
            </div>
             <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out forwards;
                    }
                `}
            </style>
        </div>
    );
};

export default UpgradeScreen;