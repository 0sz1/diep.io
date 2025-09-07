import React from 'react';
import { DRONE_CLASSES } from '../constants';
import { TankClass, AmmoType } from '../types';

interface HudProps {
    level: number;
    xp: number;
    xpToNextLevel: number;
    playerClass: TankClass;
    droneCount: number;
    maxDrones: number;
    currentAmmo?: AmmoType;
}

const Hud: React.FC<HudProps> = ({ level, xp, xpToNextLevel, playerClass, droneCount, maxDrones, currentAmmo }) => {
    const xpPercentage = Math.min(100, (xp / xpToNextLevel) * 100);
    const isDroneClass = DRONE_CLASSES.has(playerClass);

    const ammoName = currentAmmo !== undefined ? AmmoType[currentAmmo].replace('_', ' ') : null;

    return (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-1/3 max-w-lg p-2 bg-gray-900/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg text-black dark:text-white font-mono flex items-center space-x-4 border border-gray-400/30 dark:border-gray-700/50">
            <div className="text-xl font-bold bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded">
                LVL {level}
            </div>
            <div className="relative flex-grow bg-gray-300 dark:bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-gray-400 dark:border-gray-600">
                <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${xpPercentage}%` }}
                />
                 <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {Math.round(xp)} / {xpToNextLevel}
                </div>
            </div>
            {isDroneClass && (
                 <div className="text-lg font-bold bg-purple-300 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-3 py-1 rounded">
                    {droneCount}/{maxDrones}
                </div>
            )}
             {ammoName && (
                <div className="text-sm font-bold bg-gray-300 dark:bg-gray-500 text-gray-800 dark:text-gray-100 px-3 py-1 rounded capitalize">
                    {ammoName}
                </div>
            )}
        </div>
    );
};

export default Hud;