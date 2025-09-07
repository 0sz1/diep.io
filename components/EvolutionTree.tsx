import React, { useState, useRef, useEffect } from 'react';
import { TankClass } from '../types';
import { EVOLUTION_TREE, SUPREME_EVOLUTIONS, CLASS_DETAILS, LVL100_CLASS_TO_PATH, SUPREMACY_PATHS, ASCENSION_MAP, APOTHEOSIS_MAP, TRANSCENDENCE_MAP } from '../constants';

interface EvolutionTreeProps {
    onClose: () => void;
    currentPlayerClass: TankClass;
}

// --- Data Structure Builder ---
interface TreeNode {
    id: TankClass;
    children: TreeNode[];
    level: number;
}

const findLevel = (tankClass: TankClass): number => {
    if (tankClass === TankClass.DEFAULT) return 1;
    for (const level of [25, 50, 75, 100, 200, 400, 800, 1600]) {
        if (Object.values(EVOLUTION_TREE).flat().includes(tankClass) && level <= 75) {
             // Simplified logic, would need proper tree traversal for perfect levels
             if (Object.values(EVOLUTION_TREE).some(v => v.includes(tankClass))) {
                // Check if it's a child in the base tree
                 for(const p in EVOLUTION_TREE) {
                     if(EVOLUTION_TREE[Number(p) as TankClass]?.includes(tankClass)){
                        const parentLevel = findLevel(Number(p) as TankClass);
                        if (parentLevel < 75) return parentLevel + 25;
                     }
                 }
             }
        }
    }
    // Fallback for higher tiers
    if (SUPREME_EVOLUTIONS.includes(tankClass)) return 100;
    if (Object.values(SUPREMACY_PATHS).flat().includes(tankClass)) return 200;
    if (Object.values(ASCENSION_MAP).includes(tankClass)) return 400;
    if (Object.values(APOTHEOSIS_MAP).includes(tankClass)) return 800;
    if (Object.values(TRANSCENDENCE_MAP).includes(tankClass)) return 1600;
    
    return 1; // Default
};


const buildFullTree = (): TreeNode[] => {
    const nodeMap = new Map<TankClass, TreeNode>();
    const allKnownClasses = new Set<TankClass>(Object.values(TankClass).filter(v => typeof v === 'number') as TankClass[]);

    allKnownClasses.forEach(classId => {
        nodeMap.set(classId, { id: classId, children: [], level: findLevel(classId) });
    });

    const connect = (parent: TankClass, child: TankClass) => {
        const parentNode = nodeMap.get(parent);
        const childNode = nodeMap.get(child);
        if (parentNode && childNode && !parentNode.children.includes(childNode)) {
            parentNode.children.push(childNode);
        }
    };

    for (const parentStr in EVOLUTION_TREE) {
        const parentId = Number(parentStr) as TankClass;
        EVOLUTION_TREE[parentId]?.forEach(childId => connect(parentId, childId));
    }

    const finalTier75 = Object.values(EVOLUTION_TREE).flat().filter(c => !EVOLUTION_TREE[c]);
    finalTier75.forEach(parentId => {
        SUPREME_EVOLUTIONS.forEach(childId => connect(parentId, childId));
    });

    for (const parentStr in LVL100_CLASS_TO_PATH) {
        const parentId = Number(parentStr) as TankClass;
        const pathKey = LVL100_CLASS_TO_PATH[parentId];
        if (pathKey) {
            SUPREMACY_PATHS[pathKey]?.forEach(childId => connect(parentId, childId));
        }
    }
    
    for (const map of [ASCENSION_MAP, APOTHEOSIS_MAP, TRANSCENDENCE_MAP]) {
        for (const parentStr in map) {
            const parentId = Number(parentStr) as TankClass;
            const childId = map[parentId];
            if (childId !== undefined) connect(parentId, childId);
        }
    }

    return [nodeMap.get(TankClass.DEFAULT)!];
};

const fullTree = buildFullTree();


// --- Path Finding ---
const getPathForClass = (targetClass: TankClass): Set<TankClass> => {
    const path = new Set<TankClass>();
    const find = (node: TreeNode | null): boolean => {
        if (!node) return false;
        if (node.id === targetClass) {
            path.add(node.id);
            return true;
        }
        for (const child of node.children) {
            if (find(child)) {
                path.add(node.id);
                return true;
            }
        }
        return false;
    };
    fullTree.forEach(root => find(root));
    return path;
};


// --- React Component ---
const EvolutionNode: React.FC<{ node: TreeNode; playerPath: Set<TankClass>; currentClass: TankClass }> = ({ node, playerPath, currentClass }) => {
    const details = CLASS_DETAILS[node.id];
    if (!details?.name) return null;

    const isCurrent = node.id === currentClass;
    const isInPath = playerPath.has(node.id);
    
    const nodeColor = isCurrent ? 'border-yellow-400 bg-yellow-200 dark:bg-yellow-800' : isInPath ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-gray-400 dark:border-gray-500 bg-gray-200 dark:bg-gray-700';
    const textColor = isCurrent ? 'text-yellow-600 dark:text-yellow-300' : isInPath ? 'text-blue-600 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200';

    return (
        <div className="flex items-center group">
            <div className={`relative rounded-lg p-2 w-[160px] text-center shadow-md border-2 ${nodeColor} transition-all`}>
                <p className={`font-bold text-sm truncate ${textColor}`}>{details.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">(Lvl {node.level})</p>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 bg-gray-100 dark:bg-gray-900 p-3 rounded-md shadow-lg border border-gray-400 dark:border-gray-600 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 z-10 text-left">
                     <p className="text-gray-600 dark:text-gray-300 text-sm">{details.description}</p>
                </div>
            </div>

            {node.children.length > 0 && (
                <div className="flex items-center pl-4 relative">
                    <div className={`w-6 h-0.5 ${isInPath ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                    {node.children.length > 1 && <div className={`absolute top-0 left-[24px] w-0.5 h-full ${isInPath ? 'bg-blue-500' : 'bg-gray-400'}`}></div>}
                    <div className="flex flex-col justify-center space-y-2">
                        {node.children.map((childNode) => (
                             <div key={childNode.id} className="flex items-center relative">
                                 <div className={`absolute top-1/2 left-0 w-6 h-0.5 ${playerPath.has(childNode.id) ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                               <EvolutionNode node={childNode} playerPath={playerPath} currentClass={currentClass} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const EvolutionTree: React.FC<EvolutionTreeProps> = ({ onClose, currentPlayerClass }) => {
    const playerPath = getPathForClass(currentPlayerClass);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 0.8 });
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        if(containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        isDragging.current = false;
         if(containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    };

    const handleWheel = (e: React.WheelEvent) => {
        const zoomFactor = 1.1;
        const newZoom = e.deltaY > 0 ? view.zoom / zoomFactor : view.zoom * zoomFactor;
        setView(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(2, newZoom)) }));
    };
    
    const resetView = () => setView({ x: 0, y: 0, zoom: 0.8 });

    return (
        <div 
            className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-gray-900 dark:text-white font-mono z-30 animate-fade-in"
            onClick={onClose}
        >
            <div 
                ref={containerRef}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-2xl border-2 border-purple-500 text-center max-w-[95vw] w-full h-[90vh] overflow-hidden relative cursor-grab"
                onClick={e => e.stopPropagation()}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
            >
                <div className="absolute top-4 left-4 z-10 space-x-2">
                     <button onClick={resetView} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">Reset View</button>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-3xl font-bold text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors z-10">&times;</button>
                <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-6 sticky top-0 bg-gray-100 dark:bg-gray-800 py-2 z-10">EVOLUTION TREE</h1>
                
                <div 
                    className="w-full h-full"
                    style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`, transition: 'transform 0.1s ease-out' }}
                >
                    <div className="flex justify-start p-4 space-x-4">
                       {fullTree.map(rootNode => <EvolutionNode key={rootNode.id} node={rootNode} playerPath={playerPath} currentClass={currentPlayerClass} />)}
                    </div>
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

export default EvolutionTree;