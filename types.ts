
export enum GameState {
  START_MENU,
  PLAYING,
  WAVE_TRANSITION,
  GAME_OVER,
  VICTORY,
}

export enum PokemonId {
  // Towers
  BULBASAUR = 'BULBASAUR',
  CHARMANDER = 'CHARMANDER',
  SQUIRTLE = 'SQUIRTLE',
  PIKACHU = 'PIKACHU',
  // Gacha towers
  DIALGA = 'DIALGA',
  PALKIA = 'PALKIA',
  ZACIAN = 'ZACIAN',
  ZAMAZENTA = 'ZAMAZENTA',
  MEW = 'MEW',
  MEWTWO = 'MEWTWO',
  ETERNATUS = 'ETERNATUS',
  // Enemies
  RATTATA = 'RATTATA',
  ZUBAT = 'ZUBAT',
  GEODUDE = 'GEODUDE',
  GASTLY = 'GASTLY',
  SNORLAX = 'SNORLAX',
  // Bosses
  GYARADOS = 'GYARADOS',
  DRAGONITE = 'DRAGONITE',
  TYRANITAR = 'TYRANITAR',
  METAGROSS = 'METAGROSS',
  GARCHOMP = 'GARCHOMP',
  HYDREIGON = 'HYDREIGON',
  RAYQUAZA = 'RAYQUAZA',
}

export interface PokemonStats {
  name: string;
  sprite: string;
  // Tower-specific
  cost?: number;
  damage?: number;
  range?: number; // in tiles
  attackSpeed?: number; // ms between attacks
  projectile?: {
    sprite: string;
    speed: number; // tiles per second
  };
  // Enemy-specific
  hp?: number;
  speed?: number; // tiles per second
  reward?: number;
  isBoss?: boolean;
}

export interface TowerInstance {
  id: string;
  type: PokemonId;
  x: number; // grid x
  y: number; // grid y
  lastAttackTime: number;
  level: number;
  totalSpent: number;
}

export interface EnemyInstance {
  id: string;
  type: PokemonId;
  hp: number;
  maxHp: number;
  x: number; // pixel x
  y: number; // pixel y
  pathIndex: number;
  progress: number;
  color: string;
}

export interface ProjectileInstance {
  id: string;
  towerId: string;
  targetId: string;
  type: PokemonId;
  x: number;
  y: number;
}

export interface Wave {
  enemies: PokemonId[];
  spawnInterval: number; // ms
  boss?: PokemonId;
}
