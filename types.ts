export interface Vector2D {
    x: number;
    y: number;
}

export enum TankClass {
    DEFAULT,
    // Level 25
    TWIN_SHOT,
    SNIPER,
    MACHINE_GUN,
    DESTROYER,
    BOMBER,
    MEDITATOR, // Pacifist
    // Level 50
    TRIPLET,
    TWIN_HEAVY,
    ASSASSIN,
    RICOCHET,
    GATLING,
    HYBRID,
    ANNIHILATOR,
    LAUNCHER,
    CLUSTER,
    MINE_LAYER,
    HARMONY_VIVA, // Pacifist
    // Level 75
    SPREADSHOT,
    FORTRESS_TWIN,
    RAILGUN,
    PINBALL,
    VULCAN,
    DRONE_HYBRID,
    OBLITERATOR,
    SEEKER,
    NUKE_CLUSTER,
    SPIDER_MINES,
    CHANNELER, // Pacifist
    // Level 100
    OVERLORD_SUPREMO,
    DEFENDER,
    FORTRESS,
    TITAN,
    JUGGERNAUT,
    SPIRIT_OF_PEACE, // Pacifist
    // Level 200 - Supremacy Right (Offensive)
    CANNON_COLOSSUS,
    NUCLEAR_SWARM,
    BULLET_STORM,
    SUPREME_HUNTER,
    // Level 200 - Supremacy Center (Balanced)
    LIVING_FORTRESS,
    REACTIVE_SHIELD,
    DRONE_OVERMIND,
    ARTIFICER,
    // Level 200 - Supremacy Left (Defensive)
    ARMORED_TITAN,
    MURAMASA,
    MINE_MASTER,
    ETERNAL_GUARDIAN,
    // Level 400 - Ascension Right (Offensive)
    COLOSSAL_ARTILLERY,
    NUCLEAR_TEMPEST,
    BULLET_HURRICANE,
    PHANTOM_HUNTER,
    // Level 400 - Ascension Center (Balanced)
    LIVING_CITADEL,
    PRISMATIC_SHIELD,
    ASCENDED_OVERMIND,
    WAR_ENGINEER,
    // Level 400 - Ascension Left (Defensive)
    STEEL_TITAN,
    MOBILE_WALL,
    MINE_WEAVER,
    ABSOLUTE_GUARDIAN,
    // Level 800 - Apotheosis Right (Offensive)
    GOD_OF_WAR,
    NUCLEAR_SUN,
    INFINITE_RAIN,
    STELLAR_PREDATOR,
    // Level 800 - Apotheosis Center (Balanced)
    SUPREME_ARCHITECT,
    DIMENSIONAL_SHIELD,
    COSMIC_OVERMIND,
    SUPREME_ARTIFICER,
    // Level 800 - Apotheosis Left (Defensive)
    COSMIC_GUARDIAN,
    WANDERING_FORTRESS,
    TRAP_MASTER,
    SHIELD_COLOSSUS,
     // Level 1600 - Transcendence Right (Offensive)
    INFINITE_FURY,
    WAR_SUPERNOVA,
    FIRE_TSUNAMI,
    DIMENSIONAL_HUNTER,
    // Level 1600 - Transcendence Center (Balanced)
    SUPREME_CONSCIOUSNESS,
    REALITY_WEAVER,
    ELEMENTAL_MASTER,
    SUPREME_GENERAL,
    // Level 1600 - Transcendence Left (Defensive)
    PURE_IMMORTALITY,
    CRYSTAL_COLOSSUS,
    ETERNAL_MURAMASA,
    PLANETARY_GUARDIAN,
}

export enum AmmoType {
    STANDARD,
    EXPLOSIVE,
    HIGH_VELOCITY,
}

export interface Stats {
    xpGain: number;
    spawnRate: number;
    passiveXpBoost: number;
}


export interface Player {
    name: string;
    position: Vector2D;
    velocity: Vector2D;
    angle: number;
    level: number;
    xp: number;
    health: number;
    maxHealth: number;
    tankClass: TankClass;
    stats: Stats;
    statPoints: number;
    lastDamageTime: number;
    recoilOffset: number;
    passiveXpRate?: number;
    startTime: number;
    maxDrones: number;
    clones?: Clone[];
    currentAmmo?: AmmoType;
    gravityAuraActive?: boolean;
}

export interface Projectile {
    id: number;
    owner: 'player' | 'enemy' | 'clone';
    position: Vector2D;
    velocity: Vector2D;
    damage: number;
    radius: number;
    creationTime: number;
    bodySides?: number; // For potential projectile shapes
    bouncesLeft?: number;
    explodesOnImpact?: boolean;
    explosionRadius?: number;
    target?: Shape | null;
    isLaser?: boolean;
    piercedEnemies?: Set<number>;
    isDefensive?: boolean;
    isReflected?: boolean;
    slowsTarget?: boolean;
    startTime?: number;
    initialDamage?: number;
    initialSpeed?: number;
    isInvisible?: boolean;
    isWave?: boolean;
    waveRadius?: number;
}

export enum ShapeType {
    SQUARE = 'SQUARE',
    TRIANGLE = 'TRIANGLE',
    PENTAGON = 'PENTAGON',
    BOSS = 'BOSS',
    ALPHA_PENTAGON = 'ALPHA_PENTAGON',
    SPAWNER_BOSS = 'SPAWNER_BOSS',
    SPAWNER_MINION = 'SPAWNER_MINION',
    GUARDIAN_BOSS = 'GUARDIAN_BOSS',
}

export interface Shape {
    id: number;
    type: ShapeType;
    position: Vector2D;
    velocity?: Vector2D;
    radius: number;
    health: number;
    maxHealth: number;
    angle: number;
    rotationSpeed: number;
    hitCooldown?: number;
    lastShotTime?: number;
    slowUntil?: number;
    target?: Vector2D | Player | null;
    isShielded?: boolean;
    shieldCooldown?: number;
}

export interface Particle {
    position: Vector2D;
    velocity: Vector2D;
    radius: number;
    color: string;
    lifespan: number;
}

export interface Drone {
    id: number;
    position: Vector2D;
    velocity: Vector2D;
    target: Shape | null;
    health: number;
}

export interface Mine {
    id: number;
    position: Vector2D;
    radius: number;
    damage: number;
    triggerRadius: number;
    target?: Shape | null;
    velocity?: Vector2D;
    tetherTo?: number | null;
}

export interface Turret {
    id: number;
    position: Vector2D;
    angle: number;
    target: Shape | null;
    lastShotTime: number;
    orbitAngle: number;
}

export interface Clone {
    id: number;
    position: Vector2D;
    angle: number;
    lastShotTime: number;
}

export interface Structure {
    id: number;
    position: Vector2D;
    health: number;
    maxHealth: number;
    angle: number;
    target: Shape | null;
    lastShotTime: number;
}

export interface DelayedExplosion {
    position: Vector2D;
    radius: number;
    damage: number;
    delay: number; // in ms
}

// FIX: Add and export the FloatingText interface to define the shape of floating text objects.
export interface FloatingText {
    id: number;
    text: string;
    position: Vector2D;
    opacity: number;
    size: number;
}

export interface GameState {
    player: Player;
    projectiles: Projectile[];
    shapes: Shape[];
    particles: Particle[];
    gameOver: boolean;
    drones: Drone[];
    mines: Mine[];
    turrets: Turret[];
    structures: Structure[];
    boss: Shape | null;
    bossSpawnTimer: number;
    delayedExplosions: DelayedExplosion[];
    // FIX: Add the floatingTexts property to the GameState interface to hold floating text objects.
    floatingTexts: FloatingText[];
}

export interface Controls {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    mouse: {
        x: number;
        y: number;
        down: boolean;
        rightDown: boolean;
    };
    autofire: boolean;
    autofarm: boolean;
}

export interface LeaderboardPlayer {
    name: string;
    level: number;
    isPlayer: boolean;
    timeAlive: string;
}

export type GameMode = 'NORMAL' | 'PERFORMANCE';