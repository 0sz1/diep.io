

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, ShapeType, Controls, Vector2D, LeaderboardPlayer, TankClass, Shape, Stats, Projectile, GameMode, Drone, Mine, Turret, Structure, DelayedExplosion, AmmoType, Clone, FloatingText } from './types';
import { XP_PER_LEVEL, PLAYER_MAX_SPEED, PLAYER_RADIUS, PROJECTILE_BASE_SPEED, PROJECTILE_RADIUS, BARREL_LENGTH, BARREL_WIDTH, SHAPE_SIZES, SHAPE_HEALTH, SHAPE_XP, SHAPE_COLORS, MAX_SHAPES_BASE, WORLD_WIDTH, WORLD_HEIGHT, UPGRADE_LEVELS, FIRE_RATE, PROJECTILE_DAMAGE, PROJECTILE_SPEED_MOD, SHAPE_BODY_DAMAGE, HEALTH_REGEN_DELAY, HEALTH_REGEN_RATE, EVOLUTION_TREE, SUPREME_EVOLUTIONS, RECOIL_FORCE, PROJECTILE_INACCURACY, EXPLOSION_RADIUS, MAX_BOUNCES, LVL100_CLASS_TO_PATH, SUPREMACY_PATHS, ASCENSION_MAP, APOTHEOSIS_MAP, TRANSCENDENCE_MAP, PASSIVE_XP_RATES, DRONE_CLASSES, MAX_DRONES, DRONE_SPAWN_RATE, DRONE_DAMAGE, DRONE_HEALTH, DRONE_SPEED, MINE_CLASSES, MINE_DAMAGE, MINE_RADIUS, MINE_TRIGGER_RADIUS, MINE_EXPLOSION_RADIUS, SEEKER_CLASSES, HOMING_STRENGTH, BOSS_SPAWN_TIME, BOSS_STATS, TURRET_CLASSES, MAX_TURRETS, TURRET_ORBIT_RADIUS, TURRET_FIRE_RATE, TURRET_PROJECTILE_DAMAGE, TURRET_PROJECTILE_SPEED, SMART_MINE_CLASSES, SMART_MINE_SPEED, LASER_CLASSES, WALL_CLASSES, CHANNELER_DAMAGE_TO_XP, SPIRIT_OF_PEACE_DAMAGE_REDUCTION, PACIFIST_CLASSES, MINIBOSS_SPAWN_CHANCE, SPAWNER_BOSS_STATS, ALPHA_PENTAGON_STATS, SPAWNER_MINION_STATS, ARCHITECT_CLASSES, MAX_STRUCTURES, STRUCTURE_STATS, CHAIN_REACTION_CLASSES, REFLECTOR_CLASSES, SLOWING_CLASSES, DRONE_SPLITTING_CLASSES, TETHER_MINE_CLASSES, MINE_TETHER_RANGE, MINE_TETHER_DAMAGE, MOBILE_TURRET_CLASSES, CLONE_CLASSES, GROWING_PROJECTILE_CLASSES, INVISIBLE_PROJECTILE_CLASSES, DAMAGE_REFLECTION_CLASSES, GRAVITY_AURA_CLASSES, WAVE_ATTACK_CLASSES, MULTI_AMMO_CLASSES, GROWING_PROJECTILE_RATE, DAMAGE_REFLECTION_SHARDS, DAMAGE_REFLECTION_DAMAGE_MOD, GRAVITY_AURA_RADIUS, GRAVITY_PULL_STRENGTH, WAVE_MAX_RADIUS, WAVE_EXPANSION_SPEED, AMMO_TYPE_PROPERTIES, CLONE_STATS, GUARDIAN_BOSS_STATS } from './constants';
import Hud from './components/Hud';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';
import Leaderboard from './components/Leaderboard';
import UpgradeScreen from './components/UpgradeScreen';
import StatsPanel from './components/StatsPanel';
import EvolutionTree from './components/EvolutionTree';
import ModeSelectScreen from './components/ModeSelectScreen';
import Minimap from './components/Minimap';

type GamePhase = 'START' | 'MODE_SELECT' | 'PLAYING' | 'GAME_OVER';
type Theme = 'light' | 'dark';

const initialStats: Stats = {
    xpGain: 0,
    spawnRate: 0,
    passiveXpBoost: 0,
};

let shapeIdCounter = 0;
let droneIdCounter = 0;
let mineIdCounter = 0;
let turretIdCounter = 0;
let projectileIdCounter = 0;
let structureIdCounter = 0;
let cloneIdCounter = 0;
let floatingTextIdCounter = 0;

const soundManager = {
    sounds: {} as Record<string, HTMLAudioElement>,
    load: (name: string, path: string) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        soundManager.sounds[name] = audio;
    },
    play: (name: string, volume = 0.5) => {
        // In this environment, we can't load external files.
        // We will log to console as a fallback.
        console.log(`SOUND: Playing ${name} at volume ${volume}`);
    }
};


const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameState = useRef<GameState>({
        player: {
            name: 'Player',
            position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
            velocity: { x: 0, y: 0 },
            angle: 0,
            level: 1,
            xp: 0,
            health: 100,
            maxHealth: 100,
            tankClass: TankClass.DEFAULT,
            stats: { ...initialStats },
            statPoints: 0,
            lastDamageTime: 0,
            recoilOffset: 0,
            startTime: 0,
            maxDrones: 0,
            clones: [],
        },
        projectiles: [],
        shapes: [],
        particles: [],
        gameOver: false,
        drones: [],
        mines: [],
        turrets: [],
        structures: [],
        boss: null,
        bossSpawnTimer: BOSS_SPAWN_TIME,
        delayedExplosions: [],
        floatingTexts: [],
    });
    const controls = useRef<Controls>({ w: false, a: false, s: false, d: false, mouse: { x: 0, y: 0, down: false, rightDown: false }, autofire: false, autofarm: false });
    const lastShotTime = useRef<number>(0);
    const lastDroneSpawnTime = useRef<number>(0);
    const lastFrameTime = useRef<number>(performance.now());

    const [gamePhase, setGamePhase] = useState<GamePhase>('START');
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [xpToNextLevel, setXpToNextLevel] = useState(XP_PER_LEVEL[1]);
    const [score, setScore] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
    const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(true);
    const [showUpgradeScreen, setShowUpgradeScreen] = useState(false);
    const [availableUpgrades, setAvailableUpgrades] = useState<TankClass[]>([]);
    const [actionStatus, setActionStatus] = useState<string | null>(null);
    const [playerStats, setPlayerStats] = useState<Stats>({ ...initialStats });
    const [statPoints, setStatPoints] = useState(0);
    const [showEvolutionTree, setShowEvolutionTree] = useState(false);
    const [theme, setTheme] = useState<Theme>('dark');
    const [gameMode, setGameMode] = useState<GameMode>('NORMAL');
    const [cameraView, setCameraView] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [currentAmmo, setCurrentAmmo] = useState<AmmoType | undefined>(undefined);
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.className = savedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
            if (savedTheme === 'dark') document.documentElement.classList.add('dark');
        } else {
             document.body.className = 'bg-gray-800';
             document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
                document.body.className = 'bg-gray-800';
            } else {
                document.documentElement.classList.remove('dark');
                 document.body.className = 'bg-gray-100';
            }
            localStorage.setItem('theme', newTheme);
            soundManager.play('click');
            return newTheme;
        });
    };

    const resetGame = useCallback(() => {
        setShowUpgradeScreen(false);
        setGamePhase('START');
    }, []);
    
    const handleStart = (name: string) => {
        setPlayerName(name);
        setGamePhase('MODE_SELECT');
        soundManager.play('click');
    };

    const startGame = useCallback((name: string, mode: GameMode) => {
        setGameMode(mode);
        const initialShapes: Shape[] = [];
        const maxInitialShapes = MAX_SHAPES_BASE + initialStats.spawnRate * 5;
        for (let i = 0; i < maxInitialShapes; i++) {
            const shapeTypes = [ShapeType.SQUARE, ShapeType.TRIANGLE, ShapeType.PENTAGON];
            const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const position = {
                x: Math.random() * WORLD_WIDTH,
                y: Math.random() * WORLD_HEIGHT,
            };
            initialShapes.push({
                id: shapeIdCounter++,
                type,
                position,
                radius: SHAPE_SIZES[type],
                health: SHAPE_HEALTH[type],
                maxHealth: SHAPE_HEALTH[type],
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
            });
        }

        gameState.current = {
            player: {
                name: name,
                position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
                velocity: { x: 0, y: 0 },
                angle: 0,
                level: 1,
                xp: 0,
                health: 100,
                maxHealth: 100,
                tankClass: TankClass.DEFAULT,
                stats: { ...initialStats },
                statPoints: 0,
                lastDamageTime: 0,
                recoilOffset: 0,
                passiveXpRate: 0,
                startTime: Date.now(),
                maxDrones: 0,
                clones: [],
                currentAmmo: undefined,
            },
            projectiles: [],
            shapes: initialShapes,
            particles: [],
            gameOver: false,
            drones: [],
            mines: [],
            turrets: [],
            structures: [],
            boss: null,
            bossSpawnTimer: BOSS_SPAWN_TIME,
            delayedExplosions: [],
            floatingTexts: [],
        };
        controls.current = { w: false, a: false, s: false, d: false, mouse: { x: 0, y: 0, down: false, rightDown: false }, autofire: false, autofarm: false };
        setLevel(1);
        setXp(0);
        setXpToNextLevel(XP_PER_LEVEL[1]);
        setScore(0);
        setShowUpgradeScreen(false);
        setPlayerStats({ ...initialStats });
        setStatPoints(0);
        setCurrentAmmo(undefined);
        setGamePhase('PLAYING');
    }, []);

    const handleModeSelect = (mode: GameMode) => {
        soundManager.play('click');
        startGame(playerName, mode);
    };

    const handleUpgrade = (chosenClass: TankClass) => {
        const { player } = gameState.current;
        
        // Refund stat points if switching to Pacifist path
        if (PACIFIST_CLASSES.has(chosenClass) && !PACIFIST_CLASSES.has(player.tankClass)) {
            const refundedPoints = player.stats.xpGain + player.stats.spawnRate;
            player.statPoints += refundedPoints;
            player.stats.xpGain = 0;
            player.stats.spawnRate = 0;
        }

        player.tankClass = chosenClass;
        player.passiveXpRate = PASSIVE_XP_RATES[chosenClass] ?? 0;
        player.maxDrones = MAX_DRONES[chosenClass] ?? 0;

        if (MULTI_AMMO_CLASSES.has(chosenClass)) {
            player.currentAmmo = AmmoType.STANDARD;
        } else {
            player.currentAmmo = undefined;
        }
        setCurrentAmmo(player.currentAmmo);

        setShowUpgradeScreen(false);
        soundManager.play('level_up');
    }
    
    const handleStatUpgrade = (stat: keyof Stats) => {
        const { player } = gameState.current;
        if (player.statPoints > 0) {
            player.stats[stat]++;
            player.statPoints--;
            setPlayerStats({ ...player.stats });
            setStatPoints(player.statPoints);
            soundManager.play('click');
        }
    };

    const spawnShape = useCallback((forceType?: ShapeType, position?: Vector2D) => {
        const shapeTypes = [ShapeType.SQUARE, ShapeType.TRIANGLE, ShapeType.PENTAGON];
        let type = forceType || shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        
        if (!forceType && Math.random() < MINIBOSS_SPAWN_CHANCE) {
            type = ShapeType.ALPHA_PENTAGON;
        }
        
        let spawnPosition = position;
        if (!spawnPosition) {
            const { player } = gameState.current;
            const canvas = canvasRef.current;
            const zoom = Math.max(0.1, 1 - (player.level - 1) * 0.002);

            if (canvas) {
                const screenWidth = canvas.width / zoom;
                const screenHeight = canvas.height / zoom;
                const spawnMargin = 100;

                const horizontal = Math.random() > 0.5;
                const before = Math.random() > 0.5;

                if(horizontal){
                    spawnPosition = {
                        x: player.position.x + (before ? -screenWidth / 2 - spawnMargin : screenWidth / 2 + spawnMargin),
                        y: player.position.y + (Math.random() - 0.5) * (screenHeight + spawnMargin * 2)
                    }
                } else {
                     spawnPosition = {
                        x: player.position.x + (Math.random() - 0.5) * (screenWidth + spawnMargin * 2),
                        y: player.position.y + (before ? -screenHeight / 2 - spawnMargin : screenHeight / 2 + spawnMargin)
                    }
                }
                
                spawnPosition.x = Math.max(SHAPE_SIZES[type], Math.min(WORLD_WIDTH - SHAPE_SIZES[type], spawnPosition.x));
                spawnPosition.y = Math.max(SHAPE_SIZES[type], Math.min(WORLD_HEIGHT - SHAPE_SIZES[type], spawnPosition.y));

            } else {
                 spawnPosition = {
                    x: Math.random() * WORLD_WIDTH,
                    y: Math.random() * WORLD_HEIGHT,
                };
            }
        }

        const newShape: Shape = {
            id: shapeIdCounter++,
            type,
            position: spawnPosition,
            radius: SHAPE_SIZES[type],
            health: SHAPE_HEALTH[type],
            maxHealth: SHAPE_HEALTH[type],
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
        };

        if (type === ShapeType.ALPHA_PENTAGON) {
            newShape.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        }
        if (type === ShapeType.SPAWNER_MINION) {
            newShape.velocity = { x: 0, y: 0 };
             newShape.target = gameState.current.player; // Target the player on spawn
        }


        gameState.current.shapes.push(newShape);
    }, []);
    
    const createParticles = useCallback((position: Vector2D, color: string, count: number, magnitude: number = 5) => {
        const particleCount = gameMode === 'NORMAL' ? count : Math.floor(count / 3);
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * magnitude + 2;
            gameState.current.particles.push({
                position: { ...position },
                velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
                radius: Math.random() * 2 + 1,
                color,
                lifespan: Math.random() * 50 + 20,
            });
        }
    }, [gameMode]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        if (gamePhase !== 'PLAYING') {
            ctx.fillStyle = theme === 'dark' ? '#1a202c' : '#f7fafc'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                setIsLeaderboardVisible(prev => !prev);
            }
             if (e.key === 'r' || e.key === 'R') {
                const { player } = gameState.current;
                if (MULTI_AMMO_CLASSES.has(player.tankClass)) {
                    player.currentAmmo = ((player.currentAmmo ?? 0) + 1) % (Object.keys(AmmoType).length / 2);
                    setCurrentAmmo(player.currentAmmo);
                    soundManager.play('click');
                }
            }
            if (e.key === 'e' || e.key === 'E') {
                 const newStatus = !controls.current.autofire;
                 controls.current.autofire = newStatus;
                 if(newStatus) controls.current.autofarm = false;
                 setActionStatus(newStatus ? 'Autofire ENABLED' : 'Autofire DISABLED');
                 setTimeout(() => setActionStatus(null), 2000);
            }
            if (e.key === 'g' || e.key === 'G') {
                 const newStatus = !controls.current.autofarm;
                 controls.current.autofarm = newStatus;
                 if(newStatus) controls.current.autofire = false;
                 setActionStatus(newStatus ? 'Autofarm ENABLED' : 'Autofarm DISABLED');
                 setTimeout(() => setActionStatus(null), 2000);
            }
            if (e.key === 'u' || e.key === 'U') {
                setShowEvolutionTree(prev => !prev);
            }
            if (e.key === 'Escape') {
                setShowEvolutionTree(false);
            }
            if (['w', 'a', 's', 'd'].includes(e.key)) { (controls.current as any)[e.key] = true; }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
             if (['w', 'a', 's', 'd'].includes(e.key)) { (controls.current as any)[e.key] = false; }
        };
        const handleMouseMove = (e: MouseEvent) => { controls.current.mouse.x = e.clientX; controls.current.mouse.y = e.clientY; };
        const handleMouseDown = (e: MouseEvent) => { 
            if (e.button === 0) controls.current.mouse.down = true;
            if (e.button === 2) controls.current.mouse.rightDown = true;
        };
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 0) controls.current.mouse.down = false;
            if (e.button === 2) controls.current.mouse.rightDown = false;
        };
        const handleContextMenu = (e: MouseEvent) => {
            const { player } = gameState.current;
            if (ARCHITECT_CLASSES.has(player.tankClass)) {
                e.preventDefault();
                if (gameState.current.structures.length < MAX_STRUCTURES) {
                    const rect = canvas.getBoundingClientRect();
                    const zoom = Math.max(0.1, 1 - (player.level - 1) * 0.002);
                    const worldX = player.position.x + (e.clientX - rect.width / 2) / zoom;
                    const worldY = player.position.y + (e.clientY - rect.height / 2) / zoom;
                    
                    gameState.current.structures.push({
                        id: structureIdCounter++, position: { x: worldX, y: worldY }, health: STRUCTURE_STATS.HEALTH, maxHealth: STRUCTURE_STATS.HEALTH, angle: 0, target: null, lastShotTime: 0,
                    });
                    soundManager.play('click');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('contextmenu', handleContextMenu);
        
        let animationFrameId: number;

        const gameLoop = (timestamp: number) => {
            const deltaTime = timestamp - lastFrameTime.current;
            lastFrameTime.current = timestamp;

            if (gameState.current.gameOver) { setGamePhase('GAME_OVER'); return; }
            if (showUpgradeScreen || showEvolutionTree) { 
                animationFrameId = requestAnimationFrame(gameLoop);
                return;
            }

            const { player, projectiles, shapes, particles, drones, mines, turrets, boss, structures, delayedExplosions, floatingTexts } = gameState.current;
            const { stats } = player;

            // Handle Delayed Explosions
            for(let i = delayedExplosions.length - 1; i >= 0; i--) {
                const expl = delayedExplosions[i];
                expl.delay -= deltaTime;
                if(expl.delay <= 0) {
                    soundManager.play('explosion');
                    createParticles(expl.position, '#ff5733', 60, 12);
                    shapes.forEach(targetShape => {
                        const dist = Math.hypot(expl.position.x - targetShape.position.x, expl.position.y - targetShape.position.y);
                        if(dist < expl.radius + targetShape.radius) {
                            const damageFalloff = 1 - (dist / expl.radius);
                            targetShape.health -= expl.damage * damageFalloff;
                            targetShape.hitCooldown = 5;
                        }
                    });
                    delayedExplosions.splice(i, 1);
                }
            }

            // Update Boss Timer
            gameState.current.bossSpawnTimer -= deltaTime;
            if (gameState.current.bossSpawnTimer <= 0 && !boss) {
                const bossTypes = [ShapeType.BOSS, ShapeType.SPAWNER_BOSS, ShapeType.GUARDIAN_BOSS];
                const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
                
                const bossData = {
                    [ShapeType.BOSS]: BOSS_STATS,
                    [ShapeType.SPAWNER_BOSS]: SPAWNER_BOSS_STATS,
                    [ShapeType.GUARDIAN_BOSS]: GUARDIAN_BOSS_STATS,
                }[bossType];

                gameState.current.boss = {
                    id: shapeIdCounter++,
                    type: bossType,
                    position: { x: Math.random() * WORLD_WIDTH, y: Math.random() * WORLD_HEIGHT },
                    radius: bossData.RADIUS,
                    health: bossData.HEALTH,
                    maxHealth: bossData.HEALTH,
                    angle: 0,
                    rotationSpeed: 0.005,
                    lastShotTime: 0,
                    shieldCooldown: 0,
                };
                gameState.current.shapes.push(gameState.current.boss);
                gameState.current.bossSpawnTimer = BOSS_SPAWN_TIME;
            }

            // Manage Clones
            if (CLONE_CLASSES.has(player.tankClass) && (!player.clones || player.clones.length < 2)) {
                if (!player.clones) player.clones = [];
                while (player.clones.length < 2) {
                    player.clones.push({
                        id: cloneIdCounter++,
                        position: { x: player.position.x + (Math.random() - 0.5) * 20, y: player.position.y + (Math.random() - 0.5) * 20 },
                        angle: player.angle,
                        lastShotTime: 0,
                    });
                }
            } else if (!CLONE_CLASSES.has(player.tankClass) && player.clones && player.clones.length > 0) {
                player.clones = [];
            }

            player.clones?.forEach((clone, index) => {
                const angleOffset = (index === 0 ? -1 : 1) * Math.PI / 4;
                const targetX = player.position.x + Math.cos(player.angle + angleOffset) * CLONE_STATS.FOLLOW_DISTANCE;
                const targetY = player.position.y + Math.sin(player.angle + angleOffset) * CLONE_STATS.FOLLOW_DISTANCE;

                clone.position.x += (targetX - clone.position.x) * 0.1;
                clone.position.y += (targetY - clone.position.y) * 0.1;

                let bestTarget: Shape | null = null;
                let minDistance = 500;
                shapes.forEach(s => {
                    const dist = Math.hypot(clone.position.x - s.position.x, clone.position.y - s.position.y);
                    if (dist < minDistance) { minDistance = dist; bestTarget = s; }
                });

                if (bestTarget) {
                    clone.angle = Math.atan2(bestTarget.position.y - clone.position.y, bestTarget.position.x - clone.position.x);
                     if (timestamp - clone.lastShotTime > CLONE_STATS.FIRE_RATE) {
                        clone.lastShotTime = timestamp;
                        projectiles.push({
                            id: projectileIdCounter++, owner: 'clone', position: {...clone.position}, velocity: { x: Math.cos(clone.angle) * CLONE_STATS.PROJECTILE_SPEED, y: Math.sin(clone.angle) * CLONE_STATS.PROJECTILE_SPEED }, damage: CLONE_STATS.PROJECTILE_DAMAGE, radius: CLONE_STATS.RADIUS * 0.4, creationTime: timestamp,
                        });
                        soundManager.play('shoot', 0.3);
                    }
                } else {
                    clone.angle = player.angle;
                }
            });


            // Update Structures (Architect)
            structures.forEach(structure => {
                 if (!structure.target || structure.target.health <= 0) {
                     let minDistance = STRUCTURE_STATS.RANGE; let newTarget: Shape | null = null;
                     shapes.forEach(s => {
                         const dist = Math.hypot(structure.position.x - s.position.x, structure.position.y - s.position.y);
                         if (dist < minDistance) { minDistance = dist; newTarget = s; }
                     });
                     structure.target = newTarget;
                 }
                 if(structure.target){
                    structure.angle = Math.atan2(structure.target.position.y - structure.position.y, structure.target.position.x - structure.position.x);
                    if(timestamp - structure.lastShotTime > STRUCTURE_STATS.FIRE_RATE){
                        structure.lastShotTime = timestamp;
                        projectiles.push({
                            id: projectileIdCounter++, owner: 'player', position: {...structure.position}, velocity: { x: Math.cos(structure.angle) * PROJECTILE_BASE_SPEED, y: Math.sin(structure.angle) * PROJECTILE_BASE_SPEED }, damage: STRUCTURE_STATS.DAMAGE, radius: 5, creationTime: timestamp
                        });
                        soundManager.play('shoot');
                    }
                 }
            });


            // Update Turrets
            const isTurretClass = TURRET_CLASSES.has(player.tankClass);
            if (isTurretClass && turrets.length < MAX_TURRETS) {
                turrets.push({
                    id: turretIdCounter++,
                    position: { ...player.position },
                    angle: 0,
                    target: null,
                    lastShotTime: 0,
                    orbitAngle: (turrets.length / MAX_TURRETS) * Math.PI * 2,
                });
            } else if (!isTurretClass && turrets.length > 0) {
                gameState.current.turrets = [];
            }

            turrets.forEach((turret, index) => {
                if (MOBILE_TURRET_CLASSES.has(player.tankClass)) {
                    const angleOffset = (index === 0 ? -1 : 1) * Math.PI / 2;
                    const targetX = player.position.x + Math.cos(player.angle + angleOffset) * CLONE_STATS.FOLLOW_DISTANCE;
                    const targetY = player.position.y + Math.sin(player.angle + angleOffset) * CLONE_STATS.FOLLOW_DISTANCE;
                    turret.position.x += (targetX - turret.position.x) * 0.05;
                    turret.position.y += (targetY - turret.position.y) * 0.05;
                } else {
                    turret.orbitAngle += 0.01;
                    turret.position.x = player.position.x + Math.cos(turret.orbitAngle) * TURRET_ORBIT_RADIUS;
                    turret.position.y = player.position.y + Math.sin(turret.orbitAngle) * TURRET_ORBIT_RADIUS;
                }
                
                if (!turret.target || turret.target.health <= 0) {
                     let minDistance = 400;
                     let newTarget: Shape | null = null;
                     shapes.forEach(s => {
                         const dist = Math.hypot(turret.position.x - s.position.x, turret.position.y - s.position.y);
                         if (dist < minDistance) { minDistance = dist; newTarget = s; }
                     });
                     turret.target = newTarget;
                }

                if (turret.target) {
                    const dx = turret.target.position.x - turret.position.x;
                    const dy = turret.target.position.y - turret.position.y;
                    turret.angle = Math.atan2(dy, dx);
                    if (timestamp - turret.lastShotTime > TURRET_FIRE_RATE) {
                        turret.lastShotTime = timestamp;
                        projectiles.push({
                            id: projectileIdCounter++, owner: 'player', position: { ...turret.position }, velocity: { x: Math.cos(turret.angle) * TURRET_PROJECTILE_SPEED, y: Math.sin(turret.angle) * TURRET_PROJECTILE_SPEED }, damage: TURRET_PROJECTILE_DAMAGE, radius: PROJECTILE_RADIUS * 0.8, creationTime: timestamp,
                        });
                    }
                }
            });


            if (player.passiveXpRate) {
                const passiveXpBonus = 1 + player.stats.passiveXpBoost * 0.05; // 5% boost per point
                player.xp += (player.passiveXpRate * passiveXpBonus) * (deltaTime / 1000);
            }
            if (player.recoilOffset > 0) player.recoilOffset *= 0.9;

            const moveSpeed = PLAYER_MAX_SPEED;
            const fireRate = FIRE_RATE[player.tankClass];
            const xpMultiplier = 1 + stats.xpGain * 0.01;
            const spawnProbability = 0.02 + stats.spawnRate * 0.0002;
            const currentMaxShapes = MAX_SHAPES_BASE + stats.spawnRate * 5;

            const targetVelocity = { x: 0, y: 0 };
            
            let farmTarget: Shape | null = null;
            if (controls.current.autofarm) {
                let bestTargetScore = -Infinity;
                shapes.forEach(shape => {
                    const distance = Math.hypot(player.position.x - shape.position.x, player.position.y - shape.position.y);
                    const score = (SHAPE_XP[shape.type] * 5) - distance;
                    if (score > bestTargetScore) { bestTargetScore = score; farmTarget = shape; }
                });
                if (farmTarget) {
                    const dx = farmTarget.position.x - player.position.x;
                    const dy = farmTarget.position.y - player.position.y;
                    const distance = Math.hypot(dx, dy);
                    const safeDistance = PLAYER_RADIUS + farmTarget.radius + 150;
                    if (distance > safeDistance) {
                        targetVelocity.x = (dx / distance) * moveSpeed;
                        targetVelocity.y = (dy / distance) * moveSpeed;
                    } else if (distance < safeDistance - 50) { // Dodge
                        targetVelocity.x = -(dx / distance) * moveSpeed;
                        targetVelocity.y = -(dy / distance) * moveSpeed;
                    }
                }
            } else {
                if (controls.current.w) targetVelocity.y -= 1;
                if (controls.current.s) targetVelocity.y += 1;
                if (controls.current.a) targetVelocity.x -= 1;
                if (controls.current.d) targetVelocity.x += 1;

                const len = Math.sqrt(targetVelocity.x**2 + targetVelocity.y**2);
                if (len > 0) {
                    targetVelocity.x = (targetVelocity.x / len) * moveSpeed;
                    targetVelocity.y = (targetVelocity.y / len) * moveSpeed;
                }
            }
            
            player.velocity.x += (targetVelocity.x - player.velocity.x) * 0.1;
            player.velocity.y += (targetVelocity.y - player.velocity.y) * 0.1;
            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;
            player.position.x = Math.max(PLAYER_RADIUS, Math.min(WORLD_WIDTH - PLAYER_RADIUS, player.position.x));
            player.position.y = Math.max(PLAYER_RADIUS, Math.min(WORLD_HEIGHT - PLAYER_RADIUS, player.position.y));

            if (controls.current.autofarm && farmTarget) {
                const dx = farmTarget.position.x - player.position.x;
                const dy = farmTarget.position.y - player.position.y;
                player.angle = Math.atan2(dy, dx);
            } else {
                const dx = controls.current.mouse.x - canvas.width / 2;
                const dy = controls.current.mouse.y - canvas.height / 2;
                player.angle = Math.atan2(dy, dx);
            }
            player.gravityAuraActive = GRAVITY_AURA_CLASSES.has(player.tankClass);


            const isShooting = (controls.current.mouse.down || controls.current.autofire || (controls.current.autofarm && farmTarget));

            // Handle Drone Spawning
            const isDroneClass = DRONE_CLASSES.has(player.tankClass);
            if (isDroneClass) {
                const spawnRate = DRONE_SPAWN_RATE[player.tankClass] ?? 1000;
                if (drones.length < player.maxDrones && timestamp - lastDroneSpawnTime.current > spawnRate) {
                    lastDroneSpawnTime.current = timestamp;
                    drones.push({
                        id: droneIdCounter++, position: { ...player.position }, velocity: { x: 0, y: 0 }, target: null, health: DRONE_HEALTH,
                    });
                }
            }

            // Handle Shooting / Mine Laying
            if (isShooting && timestamp - lastShotTime.current > fireRate && !player.passiveXpRate && !isDroneClass && !isTurretClass && !CLONE_CLASSES.has(player.tankClass)) {
                lastShotTime.current = timestamp;
                player.recoilOffset = 10;
                
                let ammoProps = { damageMod: 1, speedMod: 1, radiusMod: 1, isExplosive: false };
                if (player.currentAmmo !== undefined) {
                    ammoProps = AMMO_TYPE_PROPERTIES[player.currentAmmo];
                }

                const projectileSpeed = PROJECTILE_BASE_SPEED * PROJECTILE_SPEED_MOD[player.tankClass] * ammoProps.speedMod;
                const projectileDamage = PROJECTILE_DAMAGE[player.tankClass] * ammoProps.damageMod;
                const projectileRadius = PROJECTILE_RADIUS * ammoProps.radiusMod;
                
                if (MINE_CLASSES.has(player.tankClass)) {
                    soundManager.play('shoot');
                    const newMine: Mine = {
                        id: mineIdCounter++, position: { ...player.position }, radius: MINE_RADIUS, damage: MINE_DAMAGE, triggerRadius: MINE_TRIGGER_RADIUS,
                    };
                    if (TETHER_MINE_CLASSES.has(player.tankClass)) {
                        let closestMine: Mine | null = null;
                        let minDist = MINE_TETHER_RANGE;
                        mines.forEach(m => {
                            if (!m.tetherTo) {
                                const dist = Math.hypot(newMine.position.x - m.position.x, newMine.position.y - m.position.y);
                                if (dist < minDist) {
                                    minDist = dist;
                                    closestMine = m;
                                }
                            }
                        });
                        if (closestMine) newMine.tetherTo = closestMine.id;
                    }
                    mines.push(newMine);
                } else if (LASER_CLASSES.has(player.tankClass)) {
                    soundManager.play('laser');
                    projectiles.push({
                        id: projectileIdCounter++, owner: 'player', position: { ...player.position }, velocity: { x: Math.cos(player.angle), y: Math.sin(player.angle) }, damage: projectileDamage, radius: BARREL_WIDTH, creationTime: timestamp, isLaser: true, piercedEnemies: new Set(),
                    });
                } else if (WAVE_ATTACK_CLASSES.has(player.tankClass)) {
                    soundManager.play('explosion');
                    projectiles.push({
                        id: projectileIdCounter++, owner: 'player', position: { ...player.position }, velocity: {x:0, y:0}, damage: projectileDamage, radius: 0, creationTime: timestamp, isWave: true, waveRadius: 0, piercedEnemies: new Set(),
                    });
                } else { // Regular projectile firing
                    soundManager.play('shoot');
                    const newProjectiles: Projectile[] = [];
                    const fireProjectile = (offsetAngle = 0, offsetX = 0, offsetY = 0, customRadius = projectileRadius, customSpeed = projectileSpeed, customDamage = projectileDamage) => {
                        const angle = player.angle + offsetAngle;
                        const inaccuracy = PROJECTILE_INACCURACY[player.tankClass] ?? 0;
                        const finalAngle = angle + (Math.random() - 0.5) * inaccuracy;
                        
                        const barrelTipX = player.position.x + Math.cos(angle) * BARREL_LENGTH + offsetX;
                        const barrelTipY = player.position.y + Math.sin(angle) * BARREL_LENGTH + offsetY;

                        let target: Shape | null = null;
                        if(SEEKER_CLASSES.has(player.tankClass)){
                             let minDistance = 400; // Max seeking range
                             [...shapes, boss].filter(Boolean).forEach(s => {
                                 if(!s) return;
                                 const dist = Math.hypot(player.position.x - s.position.x, player.position.y - s.position.y);
                                 if (dist < minDistance) { minDistance = dist; target = s; }
                             });
                        }
                        
                        const proj: Projectile = {
                            id: projectileIdCounter++, owner: 'player', position: { x: barrelTipX, y: barrelTipY }, velocity: { x: Math.cos(finalAngle) * customSpeed, y: Math.sin(finalAngle) * customSpeed }, damage: customDamage, radius: customRadius, creationTime: timestamp, bouncesLeft: MAX_BOUNCES[player.tankClass] ?? 0, explodesOnImpact: !!EXPLOSION_RADIUS[player.tankClass] || ammoProps.isExplosive, explosionRadius: EXPLOSION_RADIUS[player.tankClass] ?? 0, target: target, isDefensive: REFLECTOR_CLASSES.has(player.tankClass), slowsTarget: SLOWING_CLASSES.has(player.tankClass),
                        };
                        
                        if (GROWING_PROJECTILE_CLASSES.has(player.tankClass)) {
                            proj.startTime = timestamp;
                            proj.initialDamage = customDamage;
                            proj.initialSpeed = customSpeed;
                        }
                        if (INVISIBLE_PROJECTILE_CLASSES.has(player.tankClass)) {
                            proj.isInvisible = true;
                        }

                        newProjectiles.push(proj);
                    };
                    
                    if (WALL_CLASSES.has(player.tankClass)) {
                        for(let i = -4; i <= 4; i++) {
                            fireProjectile(0, Math.sin(player.angle + Math.PI / 2) * i * 15, -Math.cos(player.angle + Math.PI / 2) * i * 15, 10, projectileSpeed * 0.5, projectileDamage * 2);
                        }
                    } else {
                        switch (player.tankClass) {
                            case TankClass.TWIN_SHOT: case TankClass.TWIN_HEAVY:
                                fireProjectile(0, Math.sin(player.angle) * (BARREL_WIDTH / 2), -Math.cos(player.angle) * (BARREL_WIDTH / 2));
                                fireProjectile(0, -Math.sin(player.angle) * (BARREL_WIDTH / 2), Math.cos(player.angle) * (BARREL_WIDTH / 2));
                                break;
                            case TankClass.TRIPLET: case TankClass.SPREADSHOT:
                                fireProjectile(-0.2); fireProjectile(0); fireProjectile(0.2);
                                if(player.tankClass === TankClass.SPREADSHOT){ fireProjectile(-0.4); fireProjectile(0.4); }
                                break;
                            case TankClass.JUGGERNAUT:
                                for(let i=0; i<8; i++) { fireProjectile(i * (Math.PI / 4)); }
                                break;
                            case TankClass.CANNON_COLOSSUS:
                                fireProjectile(0, Math.sin(player.angle) * BARREL_WIDTH, -Math.cos(player.angle) * BARREL_WIDTH, 15);
                                fireProjectile(0, -Math.sin(player.angle) * BARREL_WIDTH, Math.cos(player.angle) * BARREL_WIDTH, 15);
                                break;
                            case TankClass.BULLET_STORM: case TankClass.BULLET_HURRICANE: case TankClass.INFINITE_RAIN: case TankClass.INFINITE_FURY:
                                fireProjectile();
                                break;
                            case TankClass.COLOSSAL_ARTILLERY: fireProjectile(0, 0, 0, 30); break;
                            case TankClass.GOD_OF_WAR: fireProjectile(0,0,0, 40); break;
                            default: fireProjectile(); break;
                        }
                    }
                    projectiles.push(...newProjectiles);
                }

                const recoil = RECOIL_FORCE[player.tankClass];
                if(recoil){
                    player.velocity.x -= Math.cos(player.angle) * recoil;
                    player.velocity.y -= Math.sin(player.angle) * recoil;
                }
            }

            const keptProjectiles: Projectile[] = [];
            projectiles.forEach(p => {
                 if (p.isLaser) {
                    if (timestamp - p.creationTime > 200) return; 
                    keptProjectiles.push(p); return;
                }
                if (p.isWave) {
                    p.waveRadius! += WAVE_EXPANSION_SPEED;
                    if (p.waveRadius! > WAVE_MAX_RADIUS) return;
                    shapes.forEach(shape => {
                        if (!p.piercedEnemies?.has(shape.id)) {
                             if (Math.hypot(p.position.x - shape.position.x, p.position.y - shape.position.y) < p.waveRadius! + shape.radius) {
                                shape.health -= p.damage; shape.hitCooldown = 5;
                                p.piercedEnemies!.add(shape.id);
                             }
                        }
                    });
                    keptProjectiles.push(p); return;
                }

                if (p.startTime) { // Growing projectile
                    const timeAlive = (timestamp - p.startTime) / 16; // apx frames
                    p.damage = p.initialDamage! + timeAlive * GROWING_PROJECTILE_RATE.damage;
                    p.radius += GROWING_PROJECTILE_RATE.radius;
                    const speedMultiplier = 1 + timeAlive * GROWING_PROJECTILE_RATE.speed;
                    const currentSpeed = Math.hypot(p.velocity.x, p.velocity.y);
                    p.velocity.x = (p.velocity.x / currentSpeed) * p.initialSpeed! * speedMultiplier;
                    p.velocity.y = (p.velocity.y / currentSpeed) * p.initialSpeed! * speedMultiplier;
                }
                
                if (player.gravityAuraActive) {
                    const dx = player.position.x - p.position.x;
                    const dy = player.position.y - p.position.y;
                    const dist = Math.hypot(dx, dy);
                    if (p.owner === 'enemy' && dist < GRAVITY_AURA_RADIUS) {
                        const force = (1 - dist / GRAVITY_AURA_RADIUS) * GRAVITY_PULL_STRENGTH;
                        p.velocity.x += (dx / dist) * force * (deltaTime / 1000);
                        p.velocity.y += (dy / dist) * force * (deltaTime / 1000);
                        if (dist < PLAYER_RADIUS) {
                             createParticles(p.position, '#805ad5', 5);
                             return; // destroy projectile
                        }
                    }
                }

                if (p.target && p.target.health > 0) {
                     const dx = p.target.position.x - p.position.x;
                     const dy = p.target.position.y - p.position.y;
                     const angleToTarget = Math.atan2(dy, dx);
                     const currentSpeed = Math.hypot(p.velocity.x, p.velocity.y);
                     p.velocity.x += Math.cos(angleToTarget) * HOMING_STRENGTH * currentSpeed;
                     p.velocity.y += Math.sin(angleToTarget) * HOMING_STRENGTH * currentSpeed;
                     const newSpeed = Math.hypot(p.velocity.x, p.velocity.y);
                     p.velocity.x = (p.velocity.x / newSpeed) * currentSpeed;
                     p.velocity.y = (p.velocity.y / newSpeed) * currentSpeed;
                }

                p.position.x += p.velocity.x;
                p.position.y += p.velocity.y;
                let alive = true;

                if (timestamp - p.creationTime > 2500) alive = false;
                
                if (alive && (p.position.x < 0 || p.position.x > WORLD_WIDTH)) {
                    if (p.bouncesLeft && p.bouncesLeft > 0) { p.velocity.x *= -1; p.bouncesLeft--; } else { alive = false; }
                }
                if (alive && (p.position.y < 0 || p.position.y > WORLD_HEIGHT)) {
                    if (p.bouncesLeft && p.bouncesLeft > 0) { p.velocity.y *= -1; p.bouncesLeft--; } else { alive = false; }
                }

                if (alive) keptProjectiles.push(p);
            });
            gameState.current.projectiles = keptProjectiles;
            
            shapes.forEach(shape => {
                shape.angle += shape.rotationSpeed;
                if (shape.hitCooldown && shape.hitCooldown > 0) shape.hitCooldown--;
                if (shape.slowUntil && timestamp < shape.slowUntil) {
                    if (shape.velocity) {
                        shape.velocity.x *= 0.95;
                        shape.velocity.y *= 0.95;
                    }
                } else {
                    shape.slowUntil = undefined;
                }

                // AI for movement and actions
                const isBossType = [ShapeType.BOSS, ShapeType.SPAWNER_BOSS, ShapeType.GUARDIAN_BOSS].includes(shape.type);
                if (isBossType) {
                    const dx = player.position.x - shape.position.x;
                    const dy = player.position.y - shape.position.y;
                    const dist = Math.hypot(dx, dy);

                    // Boss Movement
                    const speed = (
                        shape.type === ShapeType.BOSS ? BOSS_STATS.SPEED :
                        shape.type === ShapeType.SPAWNER_BOSS ? SPAWNER_BOSS_STATS.SPEED :
                        GUARDIAN_BOSS_STATS.SPEED
                    );
                    shape.position.x += (dx / dist) * speed;
                    shape.position.y += (dy / dist) * speed;

                    // Boss Abilities
                    if (shape.type === ShapeType.BOSS) {
                        if (timestamp - (shape.lastShotTime ?? 0) > BOSS_STATS.FIRE_RATE) {
                            shape.lastShotTime = timestamp;
                            const angleToPlayer = Math.atan2(dy, dx);
                            projectiles.push({
                                id: projectileIdCounter++, owner: 'enemy', position: { ...shape.position },
                                velocity: { x: Math.cos(angleToPlayer) * BOSS_STATS.PROJECTILE_SPEED, y: Math.sin(angleToPlayer) * BOSS_STATS.PROJECTILE_SPEED },
                                damage: BOSS_STATS.PROJECTILE_DAMAGE, radius: 15, creationTime: timestamp
                            });
                            soundManager.play('shoot', 0.8);
                        }
                    } else if (shape.type === ShapeType.SPAWNER_BOSS) {
                        if (timestamp - (shape.lastShotTime ?? 0) > SPAWNER_BOSS_STATS.SPAWN_RATE) {
                            shape.lastShotTime = timestamp;
                            spawnShape(ShapeType.SPAWNER_MINION, { ...shape.position });
                            soundManager.play('level_up', 0.4);
                        }
                    } else if (shape.type === ShapeType.GUARDIAN_BOSS) {
                        shape.shieldCooldown = (shape.shieldCooldown ?? 0) - deltaTime;
                        if (!shape.isShielded && shape.shieldCooldown <= 0) {
                            shape.isShielded = true;
                            shape.shieldCooldown = GUARDIAN_BOSS_STATS.SHIELD_DURATION;
                        } else if (shape.isShielded && shape.shieldCooldown <= 0) {
                            shape.isShielded = false;
                            shape.shieldCooldown = GUARDIAN_BOSS_STATS.SHIELD_COOLDOWN;
                        }
                    }
                } else if (shape.type === ShapeType.SPAWNER_MINION && shape.target) {
                    // Minion AI
                    const targetPosition = 'position' in shape.target ? shape.target.position : shape.target;
                    const dx = targetPosition.x - shape.position.x;
                    const dy = targetPosition.y - shape.position.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > 1) {
                        shape.velocity = { x: (dx / dist) * SPAWNER_MINION_STATS.SPEED, y: (dy / dist) * SPAWNER_MINION_STATS.SPEED };
                    }
                }

                if (shape.velocity) {
                    shape.position.x += shape.velocity.x;
                    shape.position.y += shape.velocity.y;
                }
            });

            drones.forEach(drone => {
                 if (!drone.target || drone.target.health <= 0) {
                     let minDistance = 500;
                     let newTarget: Shape | null = null;
                     shapes.forEach(s => {
                         const dist = Math.hypot(drone.position.x - s.position.x, drone.position.y - s.position.y);
                         if (dist < minDistance) { minDistance = dist; newTarget = s; }
                     });
                     drone.target = newTarget;
                 }

                 if (drone.target) {
                     const dx = drone.target.position.x - drone.position.x;
                     const dy = drone.target.position.y - drone.position.y;
                     const dist = Math.hypot(dx, dy);
                     drone.velocity.x = (dx / dist) * DRONE_SPEED;
                     drone.velocity.y = (dy / dist) * DRONE_SPEED;
                 } else {
                     const dx = player.position.x - drone.position.x;
                     const dy = player.position.y - drone.position.y;
                     const dist = Math.hypot(dx, dy);
                     if(dist > 100){
                         drone.velocity.x = (dx/dist) * DRONE_SPEED;
                         drone.velocity.y = (dy/dist) * DRONE_SPEED;
                     } else {
                        drone.velocity.x *= 0.9;
                        drone.velocity.y *= 0.9;
                     }
                 }
                 drone.position.x += drone.velocity.x;
                 drone.position.y += drone.velocity.y;
            });
            
            gameState.current.particles = particles.filter(p => {
                p.position.x += p.velocity.x; p.position.y += p.velocity.y; p.lifespan--; return p.lifespan > 0;
            });
            gameState.current.floatingTexts = floatingTexts.filter(ft => {
                ft.position.y -= 0.5;
                ft.opacity -= 0.01;
                return ft.opacity > 0;
            });

            // Mine logic
            for (let i = mines.length - 1; i >= 0; i--) {
                const mine = mines[i];
                if (SMART_MINE_CLASSES.has(player.tankClass)) {
                    if (!mine.target || mine.target.health <= 0) {
                        let minDistance = 300; let newTarget: Shape | null = null;
                        shapes.forEach(s => {
                            const dist = Math.hypot(mine.position.x - s.position.x, mine.position.y - s.position.y);
                            if (dist < minDistance) { minDistance = dist; newTarget = s; }
                        });
                        mine.target = newTarget;
                    }
                    if (mine.target) {
                        const dx = mine.target.position.x - mine.position.x; const dy = mine.target.position.y - mine.position.y;
                        const dist = Math.hypot(dx, dy);
                        mine.velocity = { x: (dx / dist) * SMART_MINE_SPEED, y: (dy / dist) * SMART_MINE_SPEED };
                        mine.position.x += mine.velocity.x; mine.position.y += mine.velocity.y;
                    }
                }

                let triggered = false;
                for (let j = shapes.length - 1; j >= 0; j--) {
                     const shape = shapes[j];
                     if (Math.hypot(mine.position.x - shape.position.x, mine.position.y - shape.position.y) < mine.triggerRadius + shape.radius) {
                         triggered = true; break;
                     }
                }
                if (triggered) {
                    soundManager.play('explosion');
                    createParticles(mine.position, '#ff5733', 50, 10);
                    shapes.forEach(targetShape => {
                        const dist = Math.hypot(mine.position.x - targetShape.position.x, mine.position.y - targetShape.position.y);
                        if (dist < MINE_EXPLOSION_RADIUS + targetShape.radius) {
                            targetShape.health -= mine.damage * (1 - dist / MINE_EXPLOSION_RADIUS);
                            targetShape.hitCooldown = 5;
                        }
                    });
                    mines.splice(i, 1);
                }
            }
             // Tether mine damage
            mines.forEach(mine => {
                if(mine.tetherTo) {
                    const otherMine = mines.find(m => m.id === mine.tetherTo);
                    if(otherMine) {
                        shapes.forEach(shape => {
                            // Basic line-segment collision check
                            const distToLine = Math.abs((otherMine.position.y - mine.position.y) * shape.position.x - (otherMine.position.x - mine.position.x) * shape.position.y + otherMine.position.x * mine.position.y - otherMine.position.y * mine.position.x) / Math.hypot(otherMine.position.y - mine.position.y, otherMine.position.x - mine.position.x);
                            if (distToLine < shape.radius) {
                                shape.health -= MINE_TETHER_DAMAGE;
                                shape.hitCooldown = 2;
                            }
                        });
                    }
                }
            });


            // Collision Detection
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const proj = projectiles[i];
                if (!proj) continue;

                // Projectile vs Projectile (for reflection)
                if (proj.owner === 'player' && proj.isDefensive) {
                    for (let k = projectiles.length - 1; k >=0; k--) {
                        const otherProj = projectiles[k];
                        if (otherProj.owner === 'enemy' && !otherProj.isReflected) {
                            if (Math.hypot(proj.position.x - otherProj.position.x, proj.position.y - otherProj.position.y) < proj.radius + otherProj.radius) {
                                projectiles.splice(i, 1);
                                otherProj.velocity.x *= -1;
                                otherProj.velocity.y *= -1;
                                otherProj.owner = 'player';
                                otherProj.isReflected = true;
                                break;
                            }
                        }
                    }
                    if (!projectiles[i]) continue;
                }


                if (proj.isLaser) {
                    for (const shape of shapes) {
                        if (proj.piercedEnemies?.has(shape.id)) continue;
                        const dist = Math.abs((shape.position.y - proj.position.y) * proj.velocity.x - (shape.position.x - proj.position.x) * proj.velocity.y);
                        if (dist < shape.radius + proj.radius) {
                             if(shape.isShielded) continue;
                             shape.health -= proj.damage; shape.hitCooldown = 5;
                             proj.piercedEnemies?.add(shape.id);
                             createParticles(shape.position, '#ffa500', 5);
                        }
                    }
                    continue;
                }

                for (let j = shapes.length - 1; j >= 0; j--) {
                    const shape = shapes[j];
                    if (!proj || !shape) continue;
                    if (Math.hypot(proj.position.x - shape.position.x, proj.position.y - shape.position.y) < shape.radius + proj.radius) {
                        
                        if (shape.isShielded && proj.owner === 'player') {
                            proj.velocity.x *= -1; proj.velocity.y *= -1;
                            proj.owner = 'enemy'; // Now it's an enemy projectile
                            proj.isReflected = true;
                            soundManager.play('hit');
                            continue;
                        }

                        projectiles.splice(i, 1);
                        shape.health -= proj.damage;
                        if(proj.slowsTarget) shape.slowUntil = timestamp + 1000;
                        shape.hitCooldown = 5;
                        soundManager.play('hit');
                        if (proj.isInvisible) createParticles(proj.position, '#ffffff', 20); else createParticles(proj.position, '#ffa500', 3);


                        if(proj.explodesOnImpact && proj.explosionRadius) {
                            if(CHAIN_REACTION_CLASSES.has(player.tankClass)){
                                delayedExplosions.push({ position: proj.position, radius: proj.explosionRadius * 1.5, damage: proj.damage * 1.2, delay: 300 });
                            }
                            soundManager.play('explosion');
                            createParticles(proj.position, '#ff5733', 40, 8);
                            shapes.forEach(targetShape => {
                                if (targetShape !== shape) {
                                     const dist = Math.hypot(proj.position.x - targetShape.position.x, proj.position.y - targetShape.position.y);
                                     if(dist < proj.explosionRadius + targetShape.radius) {
                                         const damageFalloff = 1 - (dist / proj.explosionRadius);
                                         targetShape.health -= proj.damage * damageFalloff;
                                         targetShape.hitCooldown = 5;
                                     }
                                }
                            });
                        }
                        break; 
                    }
                }
                 if(proj && proj.owner === 'enemy' && Math.hypot(proj.position.x - player.position.x, proj.position.y - player.position.y) < PLAYER_RADIUS + proj.radius) {
                    player.health -= proj.damage;
                    player.lastDamageTime = timestamp;
                    soundManager.play('damage');
                    createParticles(player.position, '#ff4d4d', 10);
                    projectiles.splice(i, 1);
                 }
            }

            for (let i = drones.length - 1; i >= 0; i--) {
                for (let j = shapes.length - 1; j >= 0; j--) {
                    const drone = drones[i]; const shape = shapes[j];
                    if (Math.hypot(drone.position.x - shape.position.x, drone.position.y - shape.position.y) < 10 + shape.radius) {
                        shape.health -= DRONE_DAMAGE; shape.hitCooldown = 5;
                        if (DRONE_SPLITTING_CLASSES.has(player.tankClass) && drones.length < player.maxDrones - 1) {
                            drones.push({id: droneIdCounter++, position: {...drone.position}, velocity: {x: Math.random() - 0.5, y: Math.random() - 0.5}, target: null, health: DRONE_HEALTH });
                            drones.push({id: droneIdCounter++, position: {...drone.position}, velocity: {x: Math.random() - 0.5, y: Math.random() - 0.5}, target: null, health: DRONE_HEALTH });
                        }
                        drones.splice(i, 1); createParticles(drone.position, '#a78bfa', 5);
                        break;
                    }
                }
            }

            for(let i = shapes.length - 1; i >= 0; i--) {
                const shape = shapes[i];
                 if (shape.health <= 0) {
                    const xpGained = SHAPE_XP[shape.type] * xpMultiplier;
                    player.xp += xpGained; setScore(currentScore => currentScore + xpGained);

                    const isMajorKill = [ShapeType.BOSS, ShapeType.SPAWNER_BOSS, ShapeType.GUARDIAN_BOSS, ShapeType.ALPHA_PENTAGON].includes(shape.type);
                    if (isMajorKill) {
                         gameState.current.floatingTexts.push({
                            id: floatingTextIdCounter++, text: `+${Math.round(xpGained)} XP`, position: {...shape.position}, opacity: 1, size: 30,
                         });
                    }

                    createParticles(shape.position, SHAPE_COLORS[shape.type], isMajorKill ? 150 : 35, isMajorKill ? 15 : 5);
                    soundManager.play('destroy');
                    if (shape.type === ShapeType.BOSS || shape.type === ShapeType.SPAWNER_BOSS || shape.type === ShapeType.GUARDIAN_BOSS) gameState.current.boss = null;
                    shapes.splice(i, 1);
                }
            }
            
            for (let i = shapes.length - 1; i >= 0; i--) {
                const shape = shapes[i];
                if(Math.hypot(player.position.x - shape.position.x, player.position.y - shape.position.y) < PLAYER_RADIUS + shape.radius) {
                    let damage = SHAPE_BODY_DAMAGE[shape.type];
                    if(player.tankClass === TankClass.SPIRIT_OF_PEACE){
                        damage *= (1 - SPIRIT_OF_PEACE_DAMAGE_REDUCTION);
                    }
                    if (DAMAGE_REFLECTION_CLASSES.has(player.tankClass)) {
                        const reflectedDamage = damage * DAMAGE_REFLECTION_DAMAGE_MOD;
                        const angleToShape = Math.atan2(shape.position.y - player.position.y, shape.position.x - player.position.x);
                        for(let k = 0; k < DAMAGE_REFLECTION_SHARDS; k++) {
                            const shardAngle = angleToShape + (Math.random() - 0.5) * Math.PI / 2;
                            projectiles.push({
                                id: projectileIdCounter++, owner: 'player', position: {...player.position}, velocity: { x: Math.cos(shardAngle) * 7, y: Math.sin(shardAngle) * 7}, damage: reflectedDamage, radius: 4, creationTime: timestamp,
                            });
                        }
                    }
                    player.health -= damage;
                    if(player.tankClass === TankClass.CHANNELER){
                        player.xp += damage * CHANNELER_DAMAGE_TO_XP;
                    }
                    player.lastDamageTime = timestamp;
                    soundManager.play('damage');
                    createParticles(player.position, '#ff4d4d', 15);
                     
                    const angle = Math.atan2(player.position.y - shape.position.y, player.position.x - shape.position.x);
                    player.velocity.x += Math.cos(angle) * 2;
                    player.velocity.y += Math.sin(angle) * 2;
                    
                    // Gain XP on body collision kill
                    shape.health -= 1000; // instant kill
                     if (shape.health <= 0) {
                        const xpGained = SHAPE_XP[shape.type] * xpMultiplier;
                        player.xp += xpGained; setScore(currentScore => currentScore + xpGained);
                     }
                    if ([ShapeType.BOSS, ShapeType.SPAWNER_BOSS, ShapeType.GUARDIAN_BOSS].includes(shape.type)) gameState.current.boss = null;
                    shapes.splice(i,1);
                }
            }
             if(player.health <= 0) {
               gameState.current.gameOver = true;
               createParticles(player.position, '#00bfff', 50);
            }

            if (player.health < player.maxHealth && timestamp - player.lastDamageTime > HEALTH_REGEN_DELAY) {
                const regenAmountPerFrame = (player.maxHealth * HEALTH_REGEN_RATE) * (deltaTime / 1000);
                player.health = Math.min(player.maxHealth, player.health + regenAmountPerFrame);
            }

            let currentLevelXp = XP_PER_LEVEL[player.level] || Infinity;
            while (player.xp >= currentLevelXp) {
                player.xp -= currentLevelXp;
                player.level++;
                player.statPoints += 2;
                currentLevelXp = XP_PER_LEVEL[player.level] || Infinity;
                player.maxHealth += 5; 
                player.health = player.maxHealth;
                createParticles(player.position, '#00ff00', 30);
                soundManager.play('level_up');
                
                if(UPGRADE_LEVELS.includes(player.level)) {
                    let upgrades: TankClass[] = [];
                    switch (player.level) {
                        case 25: case 50: case 75:
                            upgrades = EVOLUTION_TREE[player.tankClass] ?? []; break;
                        case 100: upgrades = SUPREME_EVOLUTIONS; break;
                        case 200:
                            const pathKey = LVL100_CLASS_TO_PATH[player.tankClass];
                            if (pathKey) { upgrades = SUPREMACY_PATHS[pathKey]; } break;
                        case 400: upgrades = [ASCENSION_MAP[player.tankClass]].filter(Boolean) as TankClass[]; break;
                        case 800: upgrades = [APOTHEOSIS_MAP[player.tankClass]].filter(Boolean) as TankClass[]; break;
                        case 1600: upgrades = [TRANSCENDENCE_MAP[player.tankClass]].filter(Boolean) as TankClass[]; break;
                    }
                    
                    if(upgrades.length > 0) { setAvailableUpgrades(upgrades); setShowUpgradeScreen(true); }
                }
            }

            if (shapes.length < currentMaxShapes && Math.random() < spawnProbability) { spawnShape(); }
            
            setLevel(player.level);
            setXp(player.xp);
            setXpToNextLevel(XP_PER_LEVEL[player.level] || Infinity);

            const elapsedSeconds = Math.floor((Date.now() - player.startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
            const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
            const timeAlive = `${minutes}:${seconds}`;

            setLeaderboard([{ name: playerName, level: player.level, isPlayer: true, timeAlive }]);
            setPlayerStats({ ...player.stats });
            setStatPoints(player.statPoints);
            setCurrentAmmo(player.currentAmmo);

            ctx.fillStyle = theme === 'dark' ? '#1a202c' : '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const zoom = Math.max(0.1, 1 - (player.level - 1) * 0.0025);
            
            setCameraView({
                x: player.position.x - (canvas.width / 2 / zoom),
                y: player.position.y - (canvas.height / 2 / zoom),
                width: canvas.width / zoom,
                height: canvas.height / zoom
            });

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(zoom, zoom);
            ctx.translate(-player.position.x, -player.position.y);
            
            if (gameMode === 'NORMAL') {
                ctx.strokeStyle = theme === 'dark' ? '#4a5568' : '#cbd5e0';
                ctx.lineWidth = 1 / zoom;
                const gridSpacing = 50;
                const cameraLeft = player.position.x - (canvas.width / 2 / zoom);
                const cameraTop = player.position.y - (canvas.height / 2 / zoom);
                const cameraRight = cameraLeft + canvas.width / zoom;
                const cameraBottom = cameraTop + canvas.height / zoom;

                const startX = Math.floor(cameraLeft / gridSpacing) * gridSpacing;
                const startY = Math.floor(cameraTop / gridSpacing) * gridSpacing;
                for(let x = startX; x < cameraRight; x += gridSpacing) {
                    ctx.beginPath(); ctx.moveTo(x, cameraTop); ctx.lineTo(x, cameraBottom); ctx.stroke();
                }
                for(let y = startY; y < cameraBottom; y += gridSpacing) {
                    ctx.beginPath(); ctx.moveTo(cameraLeft, y); ctx.lineTo(cameraRight, y); ctx.stroke();
                }
            }
            
            const boundaryWidth = gameMode === 'NORMAL' ? 20 : 10;
            ctx.strokeStyle = gameMode === 'NORMAL' 
                ? `rgba(0, 191, 255, ${0.3 + Math.sin(timestamp / 800) * 0.2})` 
                : 'rgba(0, 191, 255, 0.2)';
            ctx.lineWidth = boundaryWidth / zoom;
            ctx.strokeRect(boundaryWidth / 2, boundaryWidth / 2, WORLD_WIDTH - boundaryWidth, WORLD_HEIGHT - boundaryWidth);


            particles.forEach(p => {
                ctx.beginPath(); ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
            });
            
            shapes.forEach(shape => {
                ctx.save();
                ctx.translate(shape.position.x, shape.position.y);
                ctx.rotate(shape.angle);
                ctx.beginPath();
                const sides = shape.type === ShapeType.SQUARE ? 4 : (shape.type === ShapeType.TRIANGLE || shape.type === ShapeType.SPAWNER_MINION) ? 3 : 5;
                const angleStep = (Math.PI * 2) / sides;
                ctx.moveTo(shape.radius, 0);
                for (let k = 1; k <= sides; k++) { ctx.lineTo(shape.radius * Math.cos(k * angleStep), shape.radius * Math.sin(k * angleStep)); }
                ctx.fillStyle = shape.hitCooldown && shape.hitCooldown > 0 ? (theme === 'dark' ? '#ffffff' : '#333333') : SHAPE_COLORS[shape.type];
                ctx.fill(); ctx.strokeStyle = theme === 'dark' ? '#2d3748' : '#e2e8f0'; ctx.lineWidth = 3; ctx.stroke();
                ctx.restore();
                 if (shape.isShielded) {
                    ctx.beginPath(); ctx.arc(shape.position.x, shape.position.y, shape.radius + 10, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(100, 180, 255, ${0.5 + Math.sin(timestamp / 200) * 0.3})`;
                    ctx.lineWidth = 5; ctx.stroke();
                }
                if (shape.health < shape.maxHealth) {
                    const barWidth = shape.radius * 2; const barHeight = (shape.type === ShapeType.BOSS || shape.type === ShapeType.SPAWNER_BOSS || shape.type === ShapeType.GUARDIAN_BOSS) ? 15 : 5;
                    ctx.fillStyle = theme === 'dark' ? '#4a5568' : '#e2e8f0';
                    ctx.fillRect(shape.position.x - barWidth / 2, shape.position.y - shape.radius - 15, barWidth, barHeight);
                    ctx.fillStyle = (shape.type === ShapeType.BOSS || shape.type === ShapeType.SPAWNER_BOSS) ? '#e53e3e' : '#718096'; 
                    ctx.fillRect(shape.position.x - barWidth / 2, shape.position.y - shape.radius - 15, barWidth * (shape.health / shape.maxHealth), barHeight);
                }
            });

            mines.forEach(mine => {
                 ctx.beginPath(); ctx.arc(mine.position.x, mine.position.y, mine.radius, 0, Math.PI * 2);
                 ctx.fillStyle = theme === 'dark' ? '#b91c1c' : '#ef4444'; ctx.fill();
                 ctx.strokeStyle = theme === 'dark' ? '#7f1d1d' : '#f87171'; ctx.lineWidth = 2; ctx.stroke();
                 if (mine.tetherTo) {
                    const otherMine = mines.find(m => m.id === mine.tetherTo);
                    if (otherMine) {
                        ctx.beginPath();
                        ctx.moveTo(mine.position.x, mine.position.y);
                        ctx.lineTo(otherMine.position.x, otherMine.position.y);
                        ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }
                 }
            });
            
             const barrelColor = theme === 'dark' ? '#a0aec0' : '#4a5568';
            structures.forEach(structure => {
                ctx.save();
                ctx.translate(structure.position.x, structure.position.y);
                ctx.rotate(structure.angle);
                ctx.fillStyle = barrelColor;
                ctx.fillRect(0, -5, BARREL_LENGTH * 0.6, 10);
                ctx.restore();
                ctx.beginPath(); ctx.arc(structure.position.x, structure.position.y, STRUCTURE_STATS.RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = '#666'; ctx.fill(); ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.stroke();
            });

            projectiles.forEach(p => {
                 if (p.isInvisible) return;
                 if (p.isLaser) {
                    ctx.beginPath();
                    ctx.moveTo(p.position.x, p.position.y);
                    ctx.lineTo(p.position.x + p.velocity.x * WORLD_WIDTH * 2, p.position.y + p.velocity.y * WORLD_HEIGHT * 2);
                    ctx.strokeStyle = theme === 'dark' ? '#f6e05e' : '#4299e1';
                    ctx.lineWidth = p.radius;
                    ctx.stroke();
                } else if (p.isWave) {
                    ctx.beginPath(); ctx.arc(p.position.x, p.position.y, p.waveRadius!, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 87, 51, ${0.5 * (1 - p.waveRadius! / WAVE_MAX_RADIUS)})`;
                    ctx.fill();
                } else {
                    ctx.beginPath(); ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2); 
                    ctx.fillStyle = p.isReflected ? '#f56565' : theme === 'dark' ? '#f6e05e' : '#4299e1'; 
                    ctx.fill();
                }
            });
            
            drones.forEach(drone => {
                ctx.beginPath(); const size = 10;
                ctx.moveTo(drone.position.x, drone.position.y - size / 2);
                ctx.lineTo(drone.position.x - size / 2, drone.position.y + size / 2);
                ctx.lineTo(drone.position.x + size / 2, drone.position.y + size / 2);
                ctx.closePath(); ctx.fillStyle = '#a78bfa'; ctx.fill();
            });

            const bodyColor = '#00bfff';
            const bodyStrokeColor = theme === 'dark' ? '#2c5282' : '#a0aec0';
            const recoilOffset = player.recoilOffset;

            // Draw Turrets
            turrets.forEach(turret => {
                ctx.save();
                ctx.translate(turret.position.x, turret.position.y);
                ctx.rotate(turret.angle);
                ctx.fillStyle = barrelColor;
                ctx.fillRect(0, -BARREL_WIDTH / 4, BARREL_LENGTH * 0.8, BARREL_WIDTH / 2);
                ctx.beginPath(); ctx.arc(0, 0, PLAYER_RADIUS * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = '#a0aec0'; ctx.fill();
                ctx.strokeStyle = '#4a5568'; ctx.lineWidth = 2; ctx.stroke();
                ctx.restore();
            });

             // Draw Clones
            player.clones?.forEach(clone => {
                 ctx.save();
                 ctx.translate(clone.position.x, clone.position.y);
                 ctx.rotate(clone.angle);
                 ctx.fillStyle = barrelColor;
                 ctx.fillRect(0, -CLONE_STATS.RADIUS * 0.2, BARREL_LENGTH * 0.6, CLONE_STATS.RADIUS * 0.4);
                 ctx.beginPath(); ctx.arc(0, 0, CLONE_STATS.RADIUS, 0, Math.PI * 2);
                 ctx.fillStyle = bodyColor; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
                 ctx.strokeStyle = bodyStrokeColor; ctx.lineWidth = 3; ctx.stroke();
                 ctx.restore();
            });


            ctx.save();
            ctx.translate(player.position.x, player.position.y);
            
            const isPacifist = PACIFIST_CLASSES.has(player.tankClass);
            const isDroneClassRender = DRONE_CLASSES.has(player.tankClass);

            if(!isPacifist) {
                 ctx.rotate(player.angle);
                 // Draw Barrels (underneath the body)
                 ctx.fillStyle = barrelColor; 
                 switch (player.tankClass) {
                     case TankClass.TWIN_SHOT: case TankClass.TWIN_HEAVY:
                         ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH, BARREL_LENGTH, BARREL_WIDTH);
                         ctx.fillRect(0 - recoilOffset, 0, BARREL_LENGTH, BARREL_WIDTH); break;
                     case TankClass.SNIPER: ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH / 2, BARREL_LENGTH * 1.5, BARREL_WIDTH); break;
                     case TankClass.ASSASSIN: ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH / 2, BARREL_LENGTH * 2.0, BARREL_WIDTH); break;
                     case TankClass.MACHINE_GUN: ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH * 0.75, BARREL_LENGTH * 1.2, BARREL_WIDTH * 1.5); break;
                     case TankClass.DESTROYER: case TankClass.ANNIHILATOR: ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH, BARREL_LENGTH * 1.1, BARREL_WIDTH * 2); break;
                     case TankClass.TRIPLET: case TankClass.SPREADSHOT:
                         ctx.save(); ctx.rotate(-0.2); ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH/2, BARREL_LENGTH, BARREL_WIDTH); ctx.restore();
                         ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH/2, BARREL_LENGTH, BARREL_WIDTH);
                         ctx.save(); ctx.rotate(0.2); ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH/2, BARREL_LENGTH, BARREL_WIDTH); ctx.restore();
                         if (player.tankClass === TankClass.SPREADSHOT) {
                             ctx.save(); ctx.rotate(-0.4); ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH/2, BARREL_LENGTH * 0.9, BARREL_WIDTH); ctx.restore();
                             ctx.save(); ctx.rotate(0.4); ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH/2, BARREL_LENGTH * 0.9, BARREL_WIDTH); ctx.restore();
                         } break;
                     case TankClass.JUGGERNAUT:
                         for(let i=0; i<8; i++){
                             ctx.save(); ctx.rotate(i * Math.PI / 4);
                             ctx.fillRect(PLAYER_RADIUS * 0.8 - recoilOffset, -BARREL_WIDTH * 0.4, BARREL_LENGTH * 0.8, BARREL_WIDTH * 0.8);
                             ctx.restore();
                         } break;
                     case TankClass.CANNON_COLOSSUS: case TankClass.COLOSSAL_ARTILLERY:
                         ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH * 1.5, BARREL_LENGTH, BARREL_WIDTH * 1.2);
                         ctx.fillRect(0 - recoilOffset, BARREL_WIDTH * 0.3, BARREL_LENGTH, BARREL_WIDTH * 1.2); break;
                     default:
                         if(!isDroneClassRender && !isTurretClass && !CLONE_CLASSES.has(player.tankClass) && !WAVE_ATTACK_CLASSES.has(player.tankClass)) {
                             ctx.fillRect(0 - recoilOffset, -BARREL_WIDTH / 2, BARREL_LENGTH, BARREL_WIDTH);
                         } break;
                 }
            }
            
            // Draw Body (on top of barrels)
            ctx.beginPath();
            ctx.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = isPacifist ? '#9f7aea' : isDroneClassRender ? '#a78bfa' : bodyColor;
            ctx.fill();
            ctx.strokeStyle = bodyStrokeColor;
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.restore(); // End player rotation

            if (player.gravityAuraActive) {
                ctx.beginPath();
                ctx.arc(player.position.x, player.position.y, GRAVITY_AURA_RADIUS, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(128, 90, 213, ${0.2 + Math.sin(timestamp / 500) * 0.1})`;
                ctx.lineWidth = 10;
                ctx.stroke();
            }
            
            // Floating Text
            floatingTexts.forEach(ft => {
                ctx.font = `bold ${ft.size}px mono`;
                ctx.fillStyle = `rgba(255, 255, 0, ${ft.opacity})`;
                ctx.textAlign = 'center';
                ctx.fillText(ft.text, ft.position.x, ft.position.y);
            });

            // Health bar
            const playerBarWidth = PLAYER_RADIUS * 2; const playerBarHeight = 8;
            ctx.fillStyle = theme === 'dark' ? '#4a5568' : '#cbd5e0'; 
            ctx.fillRect(player.position.x - playerBarWidth / 2, player.position.y + PLAYER_RADIUS + 10, playerBarWidth, playerBarHeight);
            ctx.fillStyle = '#4299e1'; 
            ctx.fillRect(player.position.x - playerBarWidth / 2, player.position.y + PLAYER_RADIUS + 10, playerBarWidth * (player.health / player.maxHealth), playerBarHeight);
            
            ctx.restore(); // End camera translation
            animationFrameId = requestAnimationFrame(gameLoop);
        };
        animationFrameId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [gamePhase, spawnShape, startGame, showUpgradeScreen, showEvolutionTree, theme, createParticles]);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
            {gamePhase === 'START' && <StartScreen onStart={handleStart} theme={theme} toggleTheme={toggleTheme} />}
            {gamePhase === 'MODE_SELECT' && <ModeSelectScreen onModeSelect={handleModeSelect} />}
            {gamePhase === 'PLAYING' && (
                <>
                    <Hud level={level} xp={xp} xpToNextLevel={xpToNextLevel} playerClass={gameState.current.player.tankClass} droneCount={gameState.current.drones.length} maxDrones={gameState.current.player.maxDrones} currentAmmo={currentAmmo} />
                    {statPoints > 0 && <StatsPanel stats={playerStats} points={statPoints} onUpgrade={handleStatUpgrade} playerClass={gameState.current.player.tankClass} />}
                    <Leaderboard players={leaderboard} isVisible={isLeaderboardVisible} />
                    {showUpgradeScreen && <UpgradeScreen availableUpgrades={availableUpgrades} onUpgrade={handleUpgrade} />}
                    {showEvolutionTree && <EvolutionTree onClose={() => setShowEvolutionTree(false)} currentPlayerClass={gameState.current.player.tankClass} />}
                    <Minimap player={gameState.current.player} shapes={gameState.current.shapes} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} cameraView={cameraView} boss={gameState.current.boss} />
                     {actionStatus && (
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-lg font-mono px-4 py-2 rounded-md animate-fade-in-out">
                            {actionStatus}
                        </div>
                    )}
                </>
            )}
            {gamePhase === 'GAME_OVER' && <GameOver score={Math.round(score)} onRestart={resetGame} />}
             <style>
                {`
                    @keyframes fade-in-out {
                        0% { opacity: 0; transform: translateY(-20px); }
                        20% { opacity: 1; transform: translateY(0); }
                        80% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-20px); }
                    }
                    .animate-fade-in-out {
                        animation: fade-in-out 2s ease-in-out forwards;
                    }
                `}
            </style>
        </div>
    );
};

export default App;