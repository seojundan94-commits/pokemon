
import { PokemonId, type PokemonStats, type Wave } from './types';

export const TILE_SIZE = 48;
export const BOARD_WIDTH_TILES = 20;
export const BOARD_HEIGHT_TILES = 15;

export const BOARD_WIDTH_PX = TILE_SIZE * BOARD_WIDTH_TILES;
export const BOARD_HEIGHT_PX = TILE_SIZE * BOARD_HEIGHT_TILES;

export const PATH = [
  { x: -1, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 3 },
  { x: 6, y: 3 },
  { x: 6, y: 11 },
  { x: 13, y: 11 },
  { x: 13, y: 2 },
  { x: 17, y: 2 },
  { x: 17, y: 7 },
  { x: 20, y: 7 },
];

export const INITIAL_PLAYER_HEALTH = 20;
export const INITIAL_PLAYER_MONEY = 250;
export const GACHA_COST = 200;
export const SELL_MULTIPLIER = 0.75;
export const MAX_TOWER_LEVEL = 5;

export const UPGRADE_SETTINGS = {
  costMultiplier: 1.5,
  damageMultiplier: 1.5,
  rangeMultiplier: 1.1,
}

const POKEMON_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

export const POKEMON_DATA: Record<PokemonId, PokemonStats> = {
  // Towers
  [PokemonId.BULBASAUR]: {
    name: 'Bulbasaur',
    sprite: `${POKEMON_SPRITE_URL}1.png`,
    cost: 100,
    damage: 15,
    range: 2.5,
    attackSpeed: 1000,
    projectile: { sprite: '🌿', speed: 8 },
  },
  [PokemonId.CHARMANDER]: {
    name: 'Charmander',
    sprite: `${POKEMON_SPRITE_URL}4.png`,
    cost: 125,
    damage: 25,
    range: 3,
    attackSpeed: 1500,
    projectile: { sprite: '🔥', speed: 7 },
  },
  [PokemonId.SQUIRTLE]: {
    name: 'Squirtle',
    sprite: `${POKEMON_SPRITE_URL}7.png`,
    cost: 125,
    damage: 10,
    range: 2.8,
    attackSpeed: 700,
    projectile: { sprite: '💧', speed: 10 },
  },
  [PokemonId.PIKACHU]: {
    name: 'Pikachu',
    sprite: `${POKEMON_SPRITE_URL}25.png`,
    cost: 200,
    damage: 35,
    range: 3.5,
    attackSpeed: 1200,
    projectile: { sprite: '⚡', speed: 12 },
  },
  // Gacha Pokemon
  [PokemonId.DIALGA]: {
    name: 'Dialga',
    sprite: `${POKEMON_SPRITE_URL}483.png`,
    cost: 1000, damage: 150, range: 4, attackSpeed: 2000,
    projectile: { sprite: '💠', speed: 10 },
  },
  [PokemonId.PALKIA]: {
    name: 'Palkia',
    sprite: `${POKEMON_SPRITE_URL}484.png`,
    cost: 1000, damage: 100, range: 4.5, attackSpeed: 1500,
    projectile: { sprite: '🟣', speed: 11 },
  },
  [PokemonId.ZACIAN]: {
    name: 'Zacian',
    sprite: `${POKEMON_SPRITE_URL}888.png`,
    cost: 1200, damage: 200, range: 3.5, attackSpeed: 1800,
    projectile: { sprite: '⚔️', speed: 15 },
  },
  [PokemonId.ZAMAZENTA]: {
    name: 'Zamazenta',
    sprite: `${POKEMON_SPRITE_URL}889.png`,
    cost: 1200, damage: 120, range: 5, attackSpeed: 1700,
    projectile: { sprite: '🛡️', speed: 10 },
  },
  [PokemonId.MEW]: {
    name: 'Mew',
    sprite: `${POKEMON_SPRITE_URL}151.png`,
    cost: 1500, damage: 250, range: 4, attackSpeed: 2200,
    projectile: { sprite: '✨', speed: 9 },
  },
  [PokemonId.MEWTWO]: {
    name: 'Mewtwo',
    sprite: `${POKEMON_SPRITE_URL}150.png`,
    cost: 2000, damage: 300, range: 5, attackSpeed: 2000,
    projectile: { sprite: '🔮', speed: 12 },
  },
  [PokemonId.ETERNATUS]: {
    name: 'Eternatus',
    sprite: `${POKEMON_SPRITE_URL}890.png`,
    cost: 5000, damage: 750, range: 7, attackSpeed: 3000,
    projectile: { sprite: '☄️', speed: 8 },
  },
  // Enemies
  [PokemonId.RATTATA]: {
    name: 'Rattata',
    sprite: `${POKEMON_SPRITE_URL}19.png`,
    hp: 50,
    speed: 1.5,
    reward: 5,
  },
  [PokemonId.ZUBAT]: {
    name: 'Zubat',
    sprite: `${POKEMON_SPRITE_URL}41.png`,
    hp: 40,
    speed: 2,
    reward: 7,
  },
  [PokemonId.GEODUDE]: {
    name: 'Geodude',
    sprite: `${POKEMON_SPRITE_URL}74.png`,
    hp: 120,
    speed: 1,
    reward: 10,
  },
  [PokemonId.GASTLY]: {
    name: 'Gastly',
    sprite: `${POKEMON_SPRITE_URL}92.png`,
    hp: 80,
    speed: 1.8,
    reward: 15,
  },
  [PokemonId.SNORLAX]: {
    name: 'Snorlax',
    sprite: `${POKEMON_SPRITE_URL}143.png`,
    hp: 1000,
    speed: 0.5,
    reward: 100,
  },
    // Bosses
  [PokemonId.GYARADOS]: {
    name: 'Gyarados (BOSS)',
    sprite: `${POKEMON_SPRITE_URL}130.png`,
    hp: 1400, speed: 1.2, reward: 150, isBoss: true,
  },
  [PokemonId.DRAGONITE]: {
    name: 'Dragonite (BOSS)',
    sprite: `${POKEMON_SPRITE_URL}149.png`,
    hp: 2500, speed: 1.0, reward: 200, isBoss: true,
  },
  [PokemonId.TYRANITAR]: {
    name: 'Tyranitar (BOSS)',
    sprite: `${POKEMON_SPRITE_URL}248.png`,
    hp: 3500, speed: 0.8, reward: 250, isBoss: true,
  },
  [PokemonId.METAGROSS]: {
    name: 'Metagross (BOSS)',
    sprite: `${POKEMON_SPRITE_URL}376.png`,
    hp: 5000, speed: 0.9, reward: 300, isBoss: true,
  },
  [PokemonId.GARCHOMP]: {
    name: 'Garchomp (BOSS)',
    sprite: `${POKEMON_SPRITE_URL}445.png`,
    hp: 7000, speed: 1.5, reward: 400, isBoss: true,
  },
  [PokemonId.HYDREIGON]: {
    name: 'Hydreigon (BOSS)',
    sprite: `${POKEMON_SPRITE_URL}635.png`,
    hp: 10000, speed: 1.1, reward: 500, isBoss: true,
  },
  [PokemonId.RAYQUAZA]: {
    name: 'Rayquaza (FINAL BOSS)',
    sprite: `${POKEMON_SPRITE_URL}384.png`,
    hp: 16000, speed: 1.0, reward: 1000, isBoss: true,
  },
};

export const WAVES: Wave[] = [
  { enemies: Array(10).fill(PokemonId.RATTATA), spawnInterval: 1000, boss: PokemonId.GYARADOS },
  { enemies: [...Array(8).fill(PokemonId.RATTATA), ...Array(5).fill(PokemonId.ZUBAT)], spawnInterval: 800, boss: PokemonId.DRAGONITE },
  { enemies: [...Array(10).fill(PokemonId.ZUBAT), ...Array(5).fill(PokemonId.GEODUDE)], spawnInterval: 700, boss: PokemonId.TYRANITAR },
  { enemies: [...Array(10).fill(PokemonId.GEODUDE), ...Array(8).fill(PokemonId.GASTLY)], spawnInterval: 600, boss: PokemonId.METAGROSS },
  { enemies: [...Array(15).fill(PokemonId.GASTLY), PokemonId.SNORLAX], spawnInterval: 500, boss: PokemonId.GARCHOMP },
  { enemies: [...Array(10).fill(PokemonId.GEODUDE), ...Array(15).fill(PokemonId.ZUBAT), ...Array(10).fill(PokemonId.GASTLY)], spawnInterval: 400, boss: PokemonId.HYDREIGON },
  { enemies: [PokemonId.SNORLAX, ...Array(20).fill(PokemonId.GEODUDE), PokemonId.SNORLAX], spawnInterval: 600, boss: PokemonId.RAYQUAZA },
];

export const TOWER_TYPES = [PokemonId.BULBASAUR, PokemonId.CHARMANDER, PokemonId.SQUIRTLE, PokemonId.PIKACHU];

export const TOWER_COLORS: Partial<Record<PokemonId, string>> = {
  [PokemonId.BULBASAUR]: 'bg-green-500',
  [PokemonId.CHARMANDER]: 'bg-orange-500',
  [PokemonId.SQUIRTLE]: 'bg-blue-500',
  [PokemonId.PIKACHU]: 'bg-yellow-400',
  [PokemonId.DIALGA]: 'bg-blue-800',
  [PokemonId.PALKIA]: 'bg-pink-500',
  [PokemonId.ZACIAN]: 'bg-cyan-400',
  [PokemonId.ZAMAZENTA]: 'bg-red-600',
  [PokemonId.MEW]: 'bg-pink-300',
  [PokemonId.MEWTWO]: 'bg-purple-600',
  [PokemonId.ETERNATUS]: 'bg-indigo-700',
};

const BASIC_TOWERS = [PokemonId.BULBASAUR, PokemonId.CHARMANDER, PokemonId.SQUIRTLE, PokemonId.PIKACHU];
export const GACHA_POOL = [
    { type: 'BASIC', probability: 0.50 },
    { type: PokemonId.DIALGA, probability: 0.10 },
    { type: PokemonId.PALKIA, probability: 0.10 },
    { type: PokemonId.ZACIAN, probability: 0.10 },
    { type: PokemonId.ZAMAZENTA, probability: 0.10 },
    { type: PokemonId.MEW, probability: 0.05 },
    { type: PokemonId.MEWTWO, probability: 0.04 },
    { type: PokemonId.ETERNATUS, probability: 0.01 },
];

export const pullFromGacha = (): PokemonId => {
    const rand = Math.random();
    let cumulative = 0;
    for (const item of GACHA_POOL) {
        cumulative += item.probability;
        if (rand < cumulative) {
            if (item.type === 'BASIC') {
                return BASIC_TOWERS[Math.floor(Math.random() * BASIC_TOWERS.length)];
            }
            return item.type as PokemonId;
        }
    }
    return BASIC_TOWERS[0]; // Fallback
};
