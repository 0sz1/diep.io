

// FIX: Import the `Stats` type to resolve the 'Cannot find name 'Stats'' error.
import { ShapeType, TankClass, Stats, AmmoType } from './types';

export const WORLD_WIDTH = 6000;
export const WORLD_HEIGHT = 6000;

export const PLAYER_RADIUS = 20;
export const PLAYER_MAX_SPEED = 4;
export const PROJECTILE_RADIUS = 5;
export const PROJECTILE_BASE_SPEED = 8;
export const BARREL_WIDTH = 18;
export const BARREL_LENGTH = 45;

// Tank Class Specifics
export const UPGRADE_LEVELS = [25, 50, 75, 100, 200, 400, 800, 1600];

// XP Curve
export const XP_PER_LEVEL: { [key: number]: number } = {};
let base_xp = 10;
for (let i = 1; i <= 2000; i++) {
    XP_PER_LEVEL[i] = Math.floor(base_xp);
    base_xp *= 1.1;
    if (i > 50) base_xp *= 1.01;
}

// Shapes
export const SHAPE_SIZES: Record<ShapeType, number> = {
    [ShapeType.SQUARE]: 12,
    [ShapeType.TRIANGLE]: 10,
    [ShapeType.PENTAGON]: 18,
    [ShapeType.ALPHA_PENTAGON]: 30,
    [ShapeType.BOSS]: 80,
    [ShapeType.SPAWNER_BOSS]: 100,
    [ShapeType.SPAWNER_MINION]: 8,
    [ShapeType.GUARDIAN_BOSS]: 90,
};

export const SHAPE_HEALTH: Record<ShapeType, number> = {
    [ShapeType.SQUARE]: 10,
    [ShapeType.TRIANGLE]: 15,
    [ShapeType.PENTAGON]: 50,
    [ShapeType.ALPHA_PENTAGON]: 200,
    [ShapeType.BOSS]: 5000,
    [ShapeType.SPAWNER_BOSS]: 7000,
    [ShapeType.SPAWNER_MINION]: 5,
    [ShapeType.GUARDIAN_BOSS]: 8000,
};

export const SHAPE_XP: Record<ShapeType, number> = {
    [ShapeType.SQUARE]: 10,
    [ShapeType.TRIANGLE]: 25,
    [ShapeType.PENTAGON]: 130,
    [ShapeType.ALPHA_PENTAGON]: 1000,
    [ShapeType.BOSS]: 20000,
    [ShapeType.SPAWNER_BOSS]: 30000,
    [ShapeType.SPAWNER_MINION]: 2,
    [ShapeType.GUARDIAN_BOSS]: 35000,
};

export const SHAPE_BODY_DAMAGE: Record<ShapeType, number> = {
    [ShapeType.SQUARE]: 8,
    [ShapeType.TRIANGLE]: 12,
    [ShapeType.PENTAGON]: 20,
    [ShapeType.ALPHA_PENTAGON]: 40,
    [ShapeType.BOSS]: 60,
    [ShapeType.SPAWNER_BOSS]: 50,
    [ShapeType.SPAWNER_MINION]: 5,
    [ShapeType.GUARDIAN_BOSS]: 55,
};

export const SHAPE_COLORS: Record<ShapeType, string> = {
    [ShapeType.SQUARE]: '#f5d342',
    [ShapeType.TRIANGLE]: '#fc7a7a',
    [ShapeType.PENTAGON]: '#7a8cfc',
    [ShapeType.ALPHA_PENTAGON]: '#7a8cfc',
    [ShapeType.BOSS]: '#a342f5',
    [ShapeType.SPAWNER_BOSS]: '#f542a4',
    [ShapeType.SPAWNER_MINION]: '#ff5733',
    [ShapeType.GUARDIAN_BOSS]: '#42f5ad',
};

export const MAX_SHAPES_BASE = 150;
export const MINIBOSS_SPAWN_CHANCE = 0.005;

// Player and Combat
export const HEALTH_REGEN_DELAY = 5000;
export const HEALTH_REGEN_RATE = 0.02; // 2% per second

const defaultFireRate = 200;
const defaultDamage = 10;
const defaultSpeedMod = 1;

export const FIRE_RATE: Record<TankClass, number> = {
    [TankClass.DEFAULT]: defaultFireRate, [TankClass.TWIN_SHOT]: 150, [TankClass.SNIPER]: 500, [TankClass.MACHINE_GUN]: 100, [TankClass.DESTROYER]: 800, [TankClass.BOMBER]: 600, [TankClass.MEDITATOR]: 0, [TankClass.TRIPLET]: 150, [TankClass.TWIN_HEAVY]: 200, [TankClass.ASSASSIN]: 650, [TankClass.RICOCHET]: 550, [TankClass.GATLING]: 80, [TankClass.HYBRID]: 700, [TankClass.ANNIHILATOR]: 1000, [TankClass.LAUNCHER]: 800, [TankClass.CLUSTER]: 700, [TankClass.MINE_LAYER]: 1000, [TankClass.HARMONY_VIVA]: 0, [TankClass.SPREADSHOT]: 200, [TankClass.FORTRESS_TWIN]: 300, [TankClass.RAILGUN]: 1200, [TankClass.PINBALL]: 500, [TankClass.VULCAN]: 60, [TankClass.DRONE_HYBRID]: 750, [TankClass.OBLITERATOR]: 1500, [TankClass.SEEKER]: 600, [TankClass.NUKE_CLUSTER]: 900, [TankClass.SPIDER_MINES]: 1000, [TankClass.CHANNELER]: 0, [TankClass.OVERLORD_SUPREMO]: 100, [TankClass.DEFENDER]: 300, [TankClass.FORTRESS]: 400, [TankClass.TITAN]: 1200, [TankClass.JUGGERNAUT]: 250, [TankClass.SPIRIT_OF_PEACE]: 0, [TankClass.CANNON_COLOSSUS]: 250, [TankClass.NUCLEAR_SWARM]: 800, [TankClass.BULLET_STORM]: 50, [TankClass.SUPREME_HUNTER]: 500, [TankClass.LIVING_FORTRESS]: 100, [TankClass.REACTIVE_SHIELD]: 300, [TankClass.DRONE_OVERMIND]: 100, [TankClass.ARTIFICER]: 400, [TankClass.ARMORED_TITAN]: 500, [TankClass.MURAMASA]: 600, [TankClass.MINE_MASTER]: 900, [TankClass.ETERNAL_GUARDIAN]: 700, [TankClass.COLOSSAL_ARTILLERY]: 1500, [TankClass.NUCLEAR_TEMPEST]: 700, [TankClass.BULLET_HURRICANE]: 40, [TankClass.PHANTOM_HUNTER]: 600, [TankClass.LIVING_CITADEL]: 100, [TankClass.PRISMATIC_SHIELD]: 350, [TankClass.ASCENDED_OVERMIND]: 100, [TankClass.WAR_ENGINEER]: 400, [TankClass.STEEL_TITAN]: 600, [TankClass.MOBILE_WALL]: 700, [TankClass.MINE_WEAVER]: 800, [TankClass.ABSOLUTE_GUARDIAN]: 800, [TankClass.GOD_OF_WAR]: 1800, [TankClass.NUCLEAR_SUN]: 600, [TankClass.INFINITE_RAIN]: 30, [TankClass.STELLAR_PREDATOR]: 500, [TankClass.SUPREME_ARCHITECT]: 100, [TankClass.DIMENSIONAL_SHIELD]: 400, [TankClass.COSMIC_OVERMIND]: 100, [TankClass.SUPREME_ARTIFICER]: 400, [TankClass.COSMIC_GUARDIAN]: 900, [TankClass.WANDERING_FORTRESS]: 700, [TankClass.TRAP_MASTER]: 700, [TankClass.SHIELD_COLOSSUS]: 1000, [TankClass.INFINITE_FURY]: 20, [TankClass.WAR_SUPERNOVA]: 500, [TankClass.FIRE_TSUNAMI]: 1200, [TankClass.DIMENSIONAL_HUNTER]: 400, [TankClass.SUPREME_CONSCIOUSNESS]: 100, [TankClass.REALITY_WEAVER]: 450, [TankClass.ELEMENTAL_MASTER]: 400, [TankClass.SUPREME_GENERAL]: 100, [TankClass.PURE_IMMORTALITY]: 1000, [TankClass.CRYSTAL_COLOSSUS]: 800, [TankClass.ETERNAL_MURAMASA]: 600, [TankClass.PLANETARY_GUARDIAN]: 1100,
};
export const PROJECTILE_DAMAGE: Record<TankClass, number> = {
    [TankClass.DEFAULT]: defaultDamage, [TankClass.TWIN_SHOT]: 7, [TankClass.SNIPER]: 25, [TankClass.MACHINE_GUN]: 4, [TankClass.DESTROYER]: 70, [TankClass.BOMBER]: 40, [TankClass.MEDITATOR]: 0, [TankClass.TRIPLET]: 8, [TankClass.TWIN_HEAVY]: 15, [TankClass.ASSASSIN]: 40, [TankClass.RICOCHET]: 20, [TankClass.GATLING]: 5, [TankClass.HYBRID]: 60, [TankClass.ANNIHILATOR]: 100, [TankClass.LAUNCHER]: 50, [TankClass.CLUSTER]: 30, [TankClass.MINE_LAYER]: 0, [TankClass.HARMONY_VIVA]: 0, [TankClass.SPREADSHOT]: 7, [TankClass.FORTRESS_TWIN]: 20, [TankClass.RAILGUN]: 120, [TankClass.PINBALL]: 22, [TankClass.VULCAN]: 6, [TankClass.DRONE_HYBRID]: 50, [TankClass.OBLITERATOR]: 150, [TankClass.SEEKER]: 40, [TankClass.NUKE_CLUSTER]: 35, [TankClass.SPIDER_MINES]: 0, [TankClass.CHANNELER]: 0, [TankClass.OVERLORD_SUPREMO]: 0, [TankClass.DEFENDER]: 15, [TankClass.FORTRESS]: 25, [TankClass.TITAN]: 200, [TankClass.JUGGERNAUT]: 12, [TankClass.SPIRIT_OF_PEACE]: 0, [TankClass.CANNON_COLOSSUS]: 30, [TankClass.NUCLEAR_SWARM]: 45, [TankClass.BULLET_STORM]: 7, [TankClass.SUPREME_HUNTER]: 50, [TankClass.LIVING_FORTRESS]: 0, [TankClass.REACTIVE_SHIELD]: 10, [TankClass.DRONE_OVERMIND]: 0, [TankClass.ARTIFICER]: 25, [TankClass.ARMORED_TITAN]: 40, [TankClass.MURAMASA]: 10, [TankClass.MINE_MASTER]: 0, [TankClass.ETERNAL_GUARDIAN]: 50, [TankClass.COLOSSAL_ARTILLERY]: 300, [TankClass.NUCLEAR_TEMPEST]: 50, [TankClass.BULLET_HURRICANE]: 8, [TankClass.PHANTOM_HUNTER]: 60, [TankClass.LIVING_CITADEL]: 0, [TankClass.PRISMATIC_SHIELD]: 12, [TankClass.ASCENDED_OVERMIND]: 0, [TankClass.WAR_ENGINEER]: 30, [TankClass.STEEL_TITAN]: 50, [TankClass.MOBILE_WALL]: 12, [TankClass.MINE_WEAVER]: 0, [TankClass.ABSOLUTE_GUARDIAN]: 60, [TankClass.GOD_OF_WAR]: 400, [TankClass.NUCLEAR_SUN]: 60, [TankClass.INFINITE_RAIN]: 9, [TankClass.STELLAR_PREDATOR]: 70, [TankClass.SUPREME_ARCHITECT]: 0, [TankClass.DIMENSIONAL_SHIELD]: 15, [TankClass.COSMIC_OVERMIND]: 0, [TankClass.SUPREME_ARTIFICER]: 35, [TankClass.COSMIC_GUARDIAN]: 70, [TankClass.WANDERING_FORTRESS]: 60, [TankClass.TRAP_MASTER]: 0, [TankClass.SHIELD_COLOSSUS]: 20, [TankClass.INFINITE_FURY]: 10, [TankClass.WAR_SUPERNOVA]: 70, [TankClass.FIRE_TSUNAMI]: 150, [TankClass.DIMENSIONAL_HUNTER]: 80, [TankClass.SUPREME_CONSCIOUSNESS]: 0, [TankClass.REALITY_WEAVER]: 30, [TankClass.ELEMENTAL_MASTER]: 40, [TankClass.SUPREME_GENERAL]: 0, [TankClass.PURE_IMMORTALITY]: 80, [TankClass.CRYSTAL_COLOSSUS]: 70, [TankClass.ETERNAL_MURAMASA]: 15, [TankClass.PLANETARY_GUARDIAN]: 90,
};
export const PROJECTILE_SPEED_MOD: Record<TankClass, number> = {
    [TankClass.DEFAULT]: defaultSpeedMod, [TankClass.TWIN_SHOT]: 1, [TankClass.SNIPER]: 1.8, [TankClass.MACHINE_GUN]: 1.2, [TankClass.DESTROYER]: 0.6, [TankClass.BOMBER]: 0.8, [TankClass.MEDITATOR]: 1, [TankClass.TRIPLET]: 1, [TankClass.TWIN_HEAVY]: 0.9, [TankClass.ASSASSIN]: 2.2, [TankClass.RICOCHET]: 1.5, [TankClass.GATLING]: 1.3, [TankClass.HYBRID]: 0.7, [TankClass.ANNIHILATOR]: 0.5, [TankClass.LAUNCHER]: 0.7, [TankClass.CLUSTER]: 0.8, [TankClass.MINE_LAYER]: 1, [TankClass.HARMONY_VIVA]: 1, [TankClass.SPREADSHOT]: 1, [TankClass.FORTRESS_TWIN]: 0.8, [TankClass.RAILGUN]: 3, [TankClass.PINBALL]: 1.6, [TankClass.VULCAN]: 1.4, [TankClass.DRONE_HYBRID]: 0.7, [TankClass.OBLITERATOR]: 0.4, [TankClass.SEEKER]: 0.9, [TankClass.NUKE_CLUSTER]: 0.8, [TankClass.SPIDER_MINES]: 1, [TankClass.CHANNELER]: 1, [TankClass.OVERLORD_SUPREMO]: 1, [TankClass.DEFENDER]: 0.8, [TankClass.FORTRESS]: 0.9, [TankClass.TITAN]: 0.5, [TankClass.JUGGERNAUT]: 1, [TankClass.SPIRIT_OF_PEACE]: 1, [TankClass.CANNON_COLOSSUS]: 0.8, [TankClass.NUCLEAR_SWARM]: 0.7, [TankClass.BULLET_STORM]: 1.5, [TankClass.SUPREME_HUNTER]: 1.2, [TankClass.LIVING_FORTRESS]: 1, [TankClass.REACTIVE_SHIELD]: 0.9, [TankClass.DRONE_OVERMIND]: 1, [TankClass.ARTIFICER]: 1, [TankClass.ARMORED_TITAN]: 0.9, [TankClass.MURAMASA]: 0.6, [TankClass.MINE_MASTER]: 1, [TankClass.ETERNAL_GUARDIAN]: 1, [TankClass.COLOSSAL_ARTILLERY]: 0.4, [TankClass.NUCLEAR_TEMPEST]: 0.7, [TankClass.BULLET_HURRICANE]: 1.6, [TankClass.PHANTOM_HUNTER]: 1.3, [TankClass.LIVING_CITADEL]: 1, [TankClass.PRISMATIC_SHIELD]: 0.9, [TankClass.ASCENDED_OVERMIND]: 1, [TankClass.WAR_ENGINEER]: 1, [TankClass.STEEL_TITAN]: 0.9, [TankClass.MOBILE_WALL]: 0.5, [TankClass.MINE_WEAVER]: 1, [TankClass.ABSOLUTE_GUARDIAN]: 1, [TankClass.GOD_OF_WAR]: 0.3, [TankClass.NUCLEAR_SUN]: 0.6, [TankClass.INFINITE_RAIN]: 1.7, [TankClass.STELLAR_PREDATOR]: 1.4, [TankClass.SUPREME_ARCHITECT]: 1, [TankClass.DIMENSIONAL_SHIELD]: 1, [TankClass.COSMIC_OVERMIND]: 1, [TankClass.SUPREME_ARTIFICER]: 1, [TankClass.COSMIC_GUARDIAN]: 1, [TankClass.WANDERING_FORTRESS]: 0.8, [TankClass.TRAP_MASTER]: 1, [TankClass.SHIELD_COLOSSUS]: 0.8, [TankClass.INFINITE_FURY]: 1.8, [TankClass.WAR_SUPERNOVA]: 0.6, [TankClass.FIRE_TSUNAMI]: 1, [TankClass.DIMENSIONAL_HUNTER]: 1.5, [TankClass.SUPREME_CONSCIOUSNESS]: 1, [TankClass.REALITY_WEAVER]: 1, [TankClass.ELEMENTAL_MASTER]: 1, [TankClass.SUPREME_GENERAL]: 1, [TankClass.PURE_IMMORTALITY]: 1, [TankClass.CRYSTAL_COLOSSUS]: 0.9, [TankClass.ETERNAL_MURAMASA]: 0.4, [TankClass.PLANETARY_GUARDIAN]: 1,
};
export const RECOIL_FORCE: Partial<Record<TankClass, number>> = {
    [TankClass.DESTROYER]: 4, [TankClass.ANNIHILATOR]: 6, [TankClass.OBLITERATOR]: 8, [TankClass.TITAN]: 10,
};
export const PROJECTILE_INACCURACY: Partial<Record<TankClass, number>> = {
    [TankClass.MACHINE_GUN]: 0.3, [TankClass.GATLING]: 0.4, [TankClass.VULCAN]: 0.5,
};
export const EXPLOSION_RADIUS: Partial<Record<TankClass, number>> = {
    [TankClass.BOMBER]: 80, [TankClass.CLUSTER]: 60, [TankClass.NUKE_CLUSTER]: 100, [TankClass.NUCLEAR_SWARM]: 120, [TankClass.NUCLEAR_TEMPEST]: 140, [TankClass.NUCLEAR_SUN]: 160, [TankClass.WAR_SUPERNOVA]: 180,
};
export const MAX_BOUNCES: Partial<Record<TankClass, number>> = {
    [TankClass.RICOCHET]: 3, [TankClass.PINBALL]: 6,
};

// Evolution Tree
export const EVOLUTION_TREE: Partial<Record<TankClass, TankClass[]>> = {
    [TankClass.DEFAULT]: [TankClass.TWIN_SHOT, TankClass.SNIPER, TankClass.MACHINE_GUN, TankClass.DESTROYER, TankClass.BOMBER, TankClass.MEDITATOR],
    [TankClass.TWIN_SHOT]: [TankClass.TRIPLET, TankClass.TWIN_HEAVY],
    [TankClass.SNIPER]: [TankClass.ASSASSIN, TankClass.RICOCHET],
    [TankClass.MACHINE_GUN]: [TankClass.GATLING, TankClass.HYBRID],
    [TankClass.DESTROYER]: [TankClass.ANNIHILATOR, TankClass.LAUNCHER],
    [TankClass.BOMBER]: [TankClass.CLUSTER, TankClass.MINE_LAYER],
    [TankClass.TRIPLET]: [TankClass.SPREADSHOT],
    [TankClass.TWIN_HEAVY]: [TankClass.FORTRESS_TWIN],
    [TankClass.ASSASSIN]: [TankClass.RAILGUN],
    [TankClass.RICOCHET]: [TankClass.PINBALL],
    [TankClass.GATLING]: [TankClass.VULCAN],
    [TankClass.HYBRID]: [TankClass.DRONE_HYBRID],
    [TankClass.ANNIHILATOR]: [TankClass.OBLITERATOR],
    [TankClass.LAUNCHER]: [TankClass.SEEKER],
    [TankClass.CLUSTER]: [TankClass.NUKE_CLUSTER],
    [TankClass.MINE_LAYER]: [TankClass.SPIDER_MINES],
    [TankClass.MEDITATOR]: [TankClass.HARMONY_VIVA],
    [TankClass.HARMONY_VIVA]: [TankClass.CHANNELER],
    [TankClass.CHANNELER]: [TankClass.SPIRIT_OF_PEACE],
};

export const SUPREME_EVOLUTIONS: TankClass[] = [
    TankClass.OVERLORD_SUPREMO, TankClass.DEFENDER, TankClass.FORTRESS, TankClass.TITAN, TankClass.JUGGERNAUT,
];
const finalTier75Classes = Object.values(EVOLUTION_TREE).flat().filter(c => !EVOLUTION_TREE[c] && !Object.values(TankClass).includes(c + "_VIVA")); // Exclude pacifist path
finalTier75Classes.forEach(c => { EVOLUTION_TREE[c] = SUPREME_EVOLUTIONS; });

// FIX: Changed to Partial<Record> because not all TankClass values have a path.
export const LVL100_CLASS_TO_PATH: Partial<Record<TankClass, 'offensive' | 'balanced' | 'defensive'>> = {
    [TankClass.OVERLORD_SUPREMO]: 'balanced', [TankClass.DEFENDER]: 'defensive', [TankClass.FORTRESS]: 'defensive', [TankClass.TITAN]: 'offensive', [TankClass.JUGGERNAUT]: 'offensive',
};
export const SUPREMACY_PATHS = {
    offensive: [TankClass.CANNON_COLOSSUS, TankClass.NUCLEAR_SWARM, TankClass.BULLET_STORM, TankClass.SUPREME_HUNTER],
    balanced: [TankClass.LIVING_FORTRESS, TankClass.REACTIVE_SHIELD, TankClass.DRONE_OVERMIND, TankClass.ARTIFICER],
    defensive: [TankClass.ARMORED_TITAN, TankClass.MURAMASA, TankClass.MINE_MASTER, TankClass.ETERNAL_GUARDIAN],
};
export const ASCENSION_MAP: Partial<Record<TankClass, TankClass>> = {
    [TankClass.CANNON_COLOSSUS]: TankClass.COLOSSAL_ARTILLERY, [TankClass.NUCLEAR_SWARM]: TankClass.NUCLEAR_TEMPEST, [TankClass.BULLET_STORM]: TankClass.BULLET_HURRICANE, [TankClass.SUPREME_HUNTER]: TankClass.PHANTOM_HUNTER, [TankClass.LIVING_FORTRESS]: TankClass.LIVING_CITADEL, [TankClass.REACTIVE_SHIELD]: TankClass.PRISMATIC_SHIELD, [TankClass.DRONE_OVERMIND]: TankClass.ASCENDED_OVERMIND, [TankClass.ARTIFICER]: TankClass.WAR_ENGINEER, [TankClass.ARMORED_TITAN]: TankClass.STEEL_TITAN, [TankClass.MURAMASA]: TankClass.MOBILE_WALL, [TankClass.MINE_MASTER]: TankClass.MINE_WEAVER, [TankClass.ETERNAL_GUARDIAN]: TankClass.ABSOLUTE_GUARDIAN,
};
export const APOTHEOSIS_MAP: Partial<Record<TankClass, TankClass>> = {
    [TankClass.COLOSSAL_ARTILLERY]: TankClass.GOD_OF_WAR, [TankClass.NUCLEAR_TEMPEST]: TankClass.NUCLEAR_SUN, [TankClass.BULLET_HURRICANE]: TankClass.INFINITE_RAIN, [TankClass.PHANTOM_HUNTER]: TankClass.STELLAR_PREDATOR, [TankClass.LIVING_CITADEL]: TankClass.SUPREME_ARCHITECT, [TankClass.PRISMATIC_SHIELD]: TankClass.DIMENSIONAL_SHIELD, [TankClass.ASCENDED_OVERMIND]: TankClass.COSMIC_OVERMIND, [TankClass.WAR_ENGINEER]: TankClass.SUPREME_ARTIFICER, [TankClass.STEEL_TITAN]: TankClass.COSMIC_GUARDIAN, [TankClass.MOBILE_WALL]: TankClass.WANDERING_FORTRESS, [TankClass.MINE_WEAVER]: TankClass.TRAP_MASTER, [TankClass.ABSOLUTE_GUARDIAN]: TankClass.SHIELD_COLOSSUS,
};
export const TRANSCENDENCE_MAP: Partial<Record<TankClass, TankClass>> = {
    [TankClass.GOD_OF_WAR]: TankClass.INFINITE_FURY, [TankClass.NUCLEAR_SUN]: TankClass.WAR_SUPERNOVA, [TankClass.INFINITE_RAIN]: TankClass.FIRE_TSUNAMI, [TankClass.STELLAR_PREDATOR]: TankClass.DIMENSIONAL_HUNTER, [TankClass.SUPREME_ARCHITECT]: TankClass.SUPREME_CONSCIOUSNESS, [TankClass.DIMENSIONAL_SHIELD]: TankClass.REALITY_WEAVER, [TankClass.COSMIC_OVERMIND]: TankClass.ELEMENTAL_MASTER, [TankClass.SUPREME_ARTIFICER]: TankClass.SUPREME_GENERAL, [TankClass.COSMIC_GUARDIAN]: TankClass.PURE_IMMORTALITY, [TankClass.WANDERING_FORTRESS]: TankClass.CRYSTAL_COLOSSUS, [TankClass.TRAP_MASTER]: TankClass.ETERNAL_MURAMASA, [TankClass.SHIELD_COLOSSUS]: TankClass.PLANETARY_GUARDIAN,
};

// Pacifist
export const PACIFIST_CLASSES = new Set([TankClass.MEDITATOR, TankClass.HARMONY_VIVA, TankClass.CHANNELER, TankClass.SPIRIT_OF_PEACE]);
export const PASSIVE_XP_RATES: Partial<Record<TankClass, number>> = {
    [TankClass.MEDITATOR]: 25, [TankClass.HARMONY_VIVA]: 50, [TankClass.CHANNELER]: 50, [TankClass.SPIRIT_OF_PEACE]: 75,
};
export const CHANNELER_DAMAGE_TO_XP = 0.5;
export const SPIRIT_OF_PEACE_DAMAGE_REDUCTION = 0.3;

// Drones
export const DRONE_CLASSES = new Set([TankClass.OVERLORD_SUPREMO, TankClass.DRONE_OVERMIND, TankClass.ASCENDED_OVERMIND, TankClass.COSMIC_OVERMIND, TankClass.SUPREME_GENERAL, TankClass.DRONE_HYBRID]);
export const DRONE_SPLITTING_CLASSES = new Set([TankClass.COSMIC_OVERMIND]);
export const MAX_DRONES: Partial<Record<TankClass, number>> = {
    [TankClass.OVERLORD_SUPREMO]: 8, [TankClass.DRONE_OVERMIND]: 10, [TankClass.ASCENDED_OVERMIND]: 12, [TankClass.COSMIC_OVERMIND]: 15, [TankClass.SUPREME_GENERAL]: 16, [TankClass.DRONE_HYBRID]: 4,
};
export const DRONE_SPAWN_RATE: Partial<Record<TankClass, number>> = { [TankClass.OVERLORD_SUPREMO]: 500, };
export const DRONE_DAMAGE = 8; export const DRONE_HEALTH = 10; export const DRONE_SPEED = 3.5;

// Mines
export const MINE_CLASSES = new Set([TankClass.MINE_LAYER, TankClass.SPIDER_MINES, TankClass.MINE_MASTER, TankClass.MINE_WEAVER, TankClass.TRAP_MASTER]);
export const SMART_MINE_CLASSES = new Set([TankClass.SPIDER_MINES, TankClass.TRAP_MASTER]);
export const TETHER_MINE_CLASSES = new Set([TankClass.MINE_WEAVER]);
export const MINE_DAMAGE = 100; export const MINE_RADIUS = 8; export const MINE_TRIGGER_RADIUS = 40; export const MINE_EXPLOSION_RADIUS = 120; export const SMART_MINE_SPEED = 2; export const MINE_TETHER_RANGE = 150; export const MINE_TETHER_DAMAGE = 0.5;

// Seekers
export const SEEKER_CLASSES = new Set([TankClass.LAUNCHER, TankClass.SEEKER, TankClass.SUPREME_HUNTER, TankClass.DIMENSIONAL_HUNTER]);
export const HOMING_STRENGTH = 0.02;

// Lasers
export const LASER_CLASSES = new Set([TankClass.RAILGUN]);
// Walls
export const WALL_CLASSES = new Set([TankClass.DEFENDER, TankClass.MURAMASA, TankClass.MOBILE_WALL, TankClass.ETERNAL_MURAMASA]);
// Reflectors
export const REFLECTOR_CLASSES = new Set([TankClass.REACTIVE_SHIELD, TankClass.PRISMATIC_SHIELD]);
// Chain Reaction
export const CHAIN_REACTION_CLASSES = new Set([TankClass.NUCLEAR_TEMPEST, TankClass.NUCLEAR_SUN, TankClass.WAR_SUPERNOVA]);
// Slowing
export const SLOWING_CLASSES = new Set([TankClass.REALITY_WEAVER]);

// Turrets & Structures
export const TURRET_CLASSES = new Set([TankClass.LIVING_FORTRESS, TankClass.LIVING_CITADEL, TankClass.SUPREME_GENERAL]);
export const MAX_TURRETS = 2; export const TURRET_ORBIT_RADIUS = 100; export const TURRET_FIRE_RATE = 500; export const TURRET_PROJECTILE_DAMAGE = 10; export const TURRET_PROJECTILE_SPEED = 7;
export const ARCHITECT_CLASSES = new Set([TankClass.SUPREME_ARCHITECT]);
export const MAX_STRUCTURES = 3;
export const STRUCTURE_STATS = { HEALTH: 200, DAMAGE: 15, RANGE: 400, FIRE_RATE: 400, RADIUS: 15 };

// Bosses
export const BOSS_SPAWN_TIME = 180000; // 3 minutes
export const BOSS_STATS = { RADIUS: 80, HEALTH: 5000, SPEED: 0.5, FIRE_RATE: 1000, PROJECTILE_SPEED: 6, PROJECTILE_DAMAGE: 40 };
export const SPAWNER_BOSS_STATS = { RADIUS: 100, HEALTH: 7000, SPEED: 0.3, SPAWN_RATE: 2000 };
export const SPAWNER_MINION_STATS = { RADIUS: 8, HEALTH: 5, SPEED: 2.5 };
export const ALPHA_PENTAGON_STATS = { RADIUS: 30, HEALTH: 200, SPEED: 1 };
export const GUARDIAN_BOSS_STATS = { RADIUS: 90, HEALTH: 8000, SPEED: 0.4, SHIELD_DURATION: 3000, SHIELD_COOLDOWN: 8000 };


// UI
export const STAT_NAMES: Record<keyof Stats, string> = {
    xpGain: "XP Gain",
    spawnRate: "Spawn Rate",
    passiveXpBoost: "Passive XP",
};
export const CLASS_DETAILS: Record<TankClass, { name: string, description: string }> = {
    [TankClass.DEFAULT]: { name: "Basic Tank", description: "The starting point. A reliable, all-around tank." },
    [TankClass.TWIN_SHOT]: { name: "Twin Shot", description: "Fires two parallel shots for increased area coverage." },
    [TankClass.SNIPER]: { name: "Sniper", description: "Long-range cannon with high-damage, high-speed projectiles." },
    [TankClass.MACHINE_GUN]: { name: "Machine Gun", description: "High fire rate with a wider, less accurate spread." },
    [TankClass.DESTROYER]: { name: "Destroyer", description: "Fires a massive, slow-moving shot that deals devastating damage." },
    [TankClass.BOMBER]: { name: "Bomber", description: "Launches projectiles that explode on impact, dealing area damage." },
    [TankClass.MEDITATOR]: { name: "Meditator", description: "Forgoes weapons to gain XP passively over time. Unlocks a unique stat." },
    [TankClass.TRIPLET]: { name: "Triplet", description: "Upgrades the Twin Shot with a third cannon for a focused barrage." },
    [TankClass.TWIN_HEAVY]: { name: "Twin Heavy", description: "Fires two larger, more damaging shots at a slightly slower rate." },
    [TankClass.ASSASSIN]: { name: "Assassin", description: "An advanced Sniper with even greater range and projectile speed." },
    [TankClass.RICOCHET]: { name: "Ricochet", description: "Fires bullets that can bounce off the arena walls." },
    [TankClass.GATLING]: { name: "Gatling Gun", description: "An evolution of the Machine Gun with an even more extreme fire rate." },
    [TankClass.HYBRID]: { name: "Hybrid", description: "Combines a Destroyer cannon with a drone spawner." },
    [TankClass.ANNIHILATOR]: { name: "Annihilator", description: "The ultimate Destroyer, firing a colossal, world-ending shot." },
    [TankClass.LAUNCHER]: { name: "Launcher", description: "Fires slow-moving but powerful projectiles." },
    [TankClass.CLUSTER]: { name: "Cluster Bomber", description: "Bombs that explode into smaller fragments." },
    [TankClass.MINE_LAYER]: { name: "Mine Layer", description: "Deploys stationary mines that explode when enemies get too close." },
    [TankClass.HARMONY_VIVA]: { name: "Harmony Viva", description: "Increases passive XP gain. Creates a healing aura for allies." },
    [TankClass.SPREADSHOT]: { name: "Spreadshot", description: "Fires a wide cone of five projectiles." },
    [TankClass.FORTRESS_TWIN]: { name: "Fortress Twin", description: "Slower, but with extremely powerful twin shots." },
    [TankClass.RAILGUN]: { name: "Railgun", description: "Fires an instantaneous, piercing laser beam." },
    [TankClass.PINBALL]: { name: "Pinball", description: "Bullets ricochet multiple times before disappearing." },
    [TankClass.VULCAN]: { name: "Vulcan", description: "An almost infinite stream of bullets, but accuracy is greatly reduced." },
    [TankClass.DRONE_HYBRID]: { name: "Drone Hybrid", description: "A Hybrid that can control more drones." },
    [TankClass.OBLITERATOR]: { name: "Obliterator", description: "An Annihilator with a single, cataclysmic shot and a very long reload." },
    [TankClass.SEEKER]: { name: "Seeker", description: "Launches missiles that home in on the nearest target." },
    [TankClass.NUKE_CLUSTER]: { name: "Nuke Cluster", description: "A massive explosion that spawns secondary explosions." },
    [TankClass.SPIDER_MINES]: { name: "Spider Mines", description: "Deploys mines that actively chase down nearby enemies." },
    [TankClass.CHANNELER]: { name: "Channeler", description: "Converts a portion of damage taken directly into XP." },
    [TankClass.OVERLORD_SUPREMO]: { name: "Overlord Supremo", description: "Controls a large swarm of powerful, autonomous drones." },
    [TankClass.DEFENDER]: { name: "Defender", description: "Fires slow projectiles that form a temporary defensive wall." },
    [TankClass.FORTRESS]: { name: "Fortress", description: "A heavily armored tank with multiple automatic cannons." },
    [TankClass.TITAN]: { name: "Titan", description: "A colossal cannon with few, but devastating, shots." },
    [TankClass.JUGGERNAUT]: { name: "Juggernaut", description: "A tough, armored body with medium cannons firing in all directions." },
    [TankClass.SPIRIT_OF_PEACE]: { name: "Spirit of Peace", description: "Passively reduces the damage of nearby enemies." },
    [TankClass.CANNON_COLOSSUS]: { name: "Cannon Colossus", description: "Multiple giant cannons for maximum offensive pressure." },
    [TankClass.NUCLEAR_SWARM]: { name: "Nuclear Swarm", description: "Launches a series of bombs that create chain-reaction explosions." },
    [TankClass.BULLET_STORM]: { name: "Bullet Storm", description: "An insane fire rate that can cover the entire screen in projectiles." },
    [TankClass.SUPREME_HUNTER]: { name: "Supreme Hunter", description: "Fires relentless guided projectiles that never stop chasing." },
    [TankClass.LIVING_FORTRESS]: { name: "Living Fortress", description: "Spawns autonomous turrets that fire alongside you." },
    [TankClass.REACTIVE_SHIELD]: { name: "Reactive Shield", description: "Your own bullets create barriers that can nullify enemy shots." },
    [TankClass.DRONE_OVERMIND]: { name: "Drone Overmind", description: "Controls vast swarms of drones with advanced intelligence." },
    [TankClass.ARTIFICER]: { name: "Artificer", description: "Can switch between different ammo types (Standard, Explosive, High-Velocity)." },
    [TankClass.ARMORED_TITAN]: { name: "Armored Titan", description: "An almost impenetrable armor with medium-power shots." },
    [TankClass.MURAMASA]: { name: "Muramasa", description: "Creates mobile walls and barriers made of durable projectiles." },
    [TankClass.MINE_MASTER]: { name: "Mine Master", description: "Fills the battlefield with a huge number of intelligent traps." },
    [TankClass.ETERNAL_GUARDIAN]: { name: "Eternal Guardian", description: "A giant, slow-moving defensive tower that is almost immortal." },
    [TankClass.COLOSSAL_ARTILLERY]: { name: "Colossal Artillery", description: "Fires projectiles nearly the size of the screen." },
    [TankClass.NUCLEAR_TEMPEST]: { name: "Nuclear Tempest", description: "Creates multiple, overlapping chain-reaction explosions." },
    [TankClass.BULLET_HURRICANE]: { name: "Bullet Hurricane", description: "A continuous stream of projectiles that sweeps the map." },
    [TankClass.PHANTOM_HUNTER]: { name: "Phantom Hunter", description: "Fires guided projectiles that are invisible until they strike." },
    [TankClass.LIVING_CITADEL]: { name: "Living Citadel", description: "Autonomous turrets are now mobile and follow you." },
    [TankClass.PRISMATIC_SHIELD]: { name: "Prismatic Shield", description: "Defensive barriers now reflect enemy projectiles." },
    [TankClass.ASCENDED_OVERMIND]: { name: "Ascended Overmind", description: "Drones can now form strategic formations." },
    [TankClass.WAR_ENGINEER]: { name: "War Engineer", description: "Tactically switch between bullets, lasers, mines, and missiles." },
    [TankClass.STEEL_TITAN]: { name: "Steel Titan", description: "Even more armor, making it nearly immune to small projectiles." },
    [TankClass.MOBILE_WALL]: { name: "Mobile Wall", description: "Creates walls of energy that move along with your tank." },
    [TankClass.MINE_WEAVER]: { name: "Mine Weaver", description: "Deploys mines that connect with damaging energy tethers." },
    [TankClass.ABSOLUTE_GUARDIAN]: { name: "Absolute Guardian", description: "A massive defensive tower that unleashes shockwaves." },
    [TankClass.GOD_OF_WAR]: { name: "God of War", description: "Fires immense projectiles that pierce through everything." },
    [TankClass.NUCLEAR_SUN]: { name: "Nuclear Sun", description: "Bombs that explode in multiple, devastating stages." },
    [TankClass.INFINITE_RAIN]: { name: "Infinite Rain", description: "A deluge of bullets that leaves no empty space on the map." },
    [TankClass.STELLAR_PREDATOR]: { name: "Stellar Predator", description: "Guided projectiles grow in size and damage the longer they travel." },
    [TankClass.SUPREME_ARCHITECT]: { name: "Supreme Architect", description: "Deploys powerful, stationary turrets on the battlefield with a right-click." },
    [TankClass.DIMENSIONAL_SHIELD]: { name: "Dimensional Shield", description: "Projectiles can enter portals and be redirected." },
    [TankClass.COSMIC_OVERMIND]: { name: "Cosmic Overmind", description: "Drones now have a chance to split into new drones on kill." },
    [TankClass.SUPREME_ARTIFICER]: { name: "Supreme Artificer", description: "Alternates between powerful elemental munitions." },
    [TankClass.COSMIC_GUARDIAN]: { name: "Cosmic Guardian", description: "Surrounded by energy rings that destroy projectiles." },
    [TankClass.WANDERING_FORTRESS]: { name: "Wandering Fortress", description: "An immense, slow-moving tank that is nearly indestructible." },
    [TankClass.TRAP_MASTER]: { name: "Trap Master", description: "Deploys intelligent mines that relentlessly pursue enemies." },
    [TankClass.SHIELD_COLOSSUS]: { name: "Shield Colossus", description: "Projects protective fields on nearby allies." },
    [TankClass.INFINITE_FURY]: { name: "Infinite Fury", description: "An endless stream of projectiles that never stops." },
    [TankClass.WAR_SUPERNOVA]: { name: "War Supernova", description: "Projectiles that explode like dying stars, with a secondary blast." },
    [TankClass.FIRE_TSUNAMI]: { name: "Fire Tsunami", description: "Unleashes devastating waves of energy that sweep the area." },
    [TankClass.DIMENSIONAL_HUNTER]: { name: "Dimensional Hunter", description: "Projectiles that can chase enemies through walls." },
    [TankClass.SUPREME_CONSCIOUSNESS]: { name: "Supreme Consciousness", description: "Spawns and controls two autonomous 'clone' tanks." },
    [TankClass.REALITY_WEAVER]: { name: "Reality Weaver", description: "Manipulates physics, firing projectiles that slow enemies on hit." },
    [TankClass.ELEMENTAL_MASTER]: { name: "Elemental Master", description: "Projectiles change type based on the enemy they hit." },
    [TankClass.SUPREME_GENERAL]: { name: "Supreme General", description: "A coordinated army of drones, turrets, and shots." },
    [TankClass.PURE_IMMORTALITY]: { name: "Pure Immortality", description: "Health regeneration is almost instantaneous." },
    [TankClass.CRYSTAL_COLOSSUS]: { name: "Crystal Colossus", description: "Reflects a portion of collision damage back at attackers." },
    [TankClass.ETERNAL_MURAMASA]: { name: "Eternal Muramasa", description: "Creates mobile walls of energy that never break." },
    [TankClass.PLANETARY_GUARDIAN]: { name: "Planetary Guardian", description: "Creates a gravity well aura that pulls in and destroys enemy shots." },
};
// Advanced Class Mechanics Sets
export const MOBILE_TURRET_CLASSES = new Set([TankClass.LIVING_CITADEL]);
export const CLONE_CLASSES = new Set([TankClass.SUPREME_CONSCIOUSNESS]);
export const GROWING_PROJECTILE_CLASSES = new Set([TankClass.STELLAR_PREDATOR]);
export const INVISIBLE_PROJECTILE_CLASSES = new Set([TankClass.PHANTOM_HUNTER]);
export const DAMAGE_REFLECTION_CLASSES = new Set([TankClass.CRYSTAL_COLOSSUS]);
export const GRAVITY_AURA_CLASSES = new Set([TankClass.PLANETARY_GUARDIAN]);
export const WAVE_ATTACK_CLASSES = new Set([TankClass.FIRE_TSUNAMI]);
export const MULTI_AMMO_CLASSES = new Set([TankClass.ARTIFICER, TankClass.WAR_ENGINEER, TankClass.SUPREME_ARTIFICER, TankClass.ELEMENTAL_MASTER]);

// Advanced Mechanics Balancing
export const GROWING_PROJECTILE_RATE = { damage: 0.1, radius: 0.05, speed: 0.01 }; // Per frame growth
export const DAMAGE_REFLECTION_SHARDS = 8;
export const DAMAGE_REFLECTION_DAMAGE_MOD = 0.25;
export const GRAVITY_AURA_RADIUS = 300;
export const GRAVITY_PULL_STRENGTH = 15;
export const WAVE_MAX_RADIUS = 400;
export const WAVE_EXPANSION_SPEED = 5;

export const AMMO_TYPE_PROPERTIES: Record<AmmoType, { damageMod: number, speedMod: number, radiusMod: number, isExplosive: boolean }> = {
    [AmmoType.STANDARD]: { damageMod: 1, speedMod: 1, radiusMod: 1, isExplosive: false },
    [AmmoType.EXPLOSIVE]: { damageMod: 1.5, speedMod: 0.7, radiusMod: 1.2, isExplosive: true },
    [AmmoType.HIGH_VELOCITY]: { damageMod: 0.8, speedMod: 1.8, radiusMod: 0.8, isExplosive: false },
};

export const CLONE_STATS = {
    RADIUS: 12,
    FIRE_RATE: 500,
    PROJECTILE_DAMAGE: 5,
    PROJECTILE_SPEED: 8,
    FOLLOW_DISTANCE: 80,
};