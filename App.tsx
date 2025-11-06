
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameUI } from './components/GameUI';
import { GameModal } from './components/GameModal';
import { GameState, type PokemonId, type TowerInstance, type EnemyInstance, type ProjectileInstance } from './types';
import {
  WAVES,
  INITIAL_PLAYER_HEALTH,
  INITIAL_PLAYER_MONEY,
  POKEMON_DATA,
  PATH,
  TILE_SIZE,
  UPGRADE_SETTINGS,
  SELL_MULTIPLIER,
  GACHA_COST,
  pullFromGacha,
  MAX_TOWER_LEVEL,
} from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START_MENU);
  const [playerHealth, setPlayerHealth] = useState(INITIAL_PLAYER_HEALTH);
  const [playerMoney, setPlayerMoney] = useState(INITIAL_PLAYER_MONEY);
  const [currentWave, setCurrentWave] = useState(0);

  const [towers, setTowers] = useState<TowerInstance[]>([]);
  const [enemies, setEnemies] = useState<EnemyInstance[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileInstance[]>([]);

  const [selectedTowerType, setSelectedTowerType] = useState<PokemonId | null>(null);
  const [selectedBoardTowerId, setSelectedBoardTowerId] = useState<string | null>(null);
  const [gachaTowerToPlace, setGachaTowerToPlace] = useState<PokemonId | null>(null);


  const waveEnemiesToSpawn = useRef<PokemonId[]>([]);
  const lastSpawnTime = useRef(0);

  // Fix: Initialize useRef with an argument to avoid errors. Using null is a common practice for refs that will be assigned a value later.
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    setPlayerHealth(INITIAL_PLAYER_HEALTH);
    setPlayerMoney(INITIAL_PLAYER_MONEY);
    setCurrentWave(0);
    setTowers([]);
    setEnemies([]);
    setProjectiles([]);
    setSelectedTowerType(null);
    setSelectedBoardTowerId(null);
    setGachaTowerToPlace(null);
    waveEnemiesToSpawn.current = [];
    lastSpawnTime.current = 0;
  }, []);
  
  const startGame = () => {
    resetGame();
    setGameState(GameState.WAVE_TRANSITION);
  };

  const gameLoop = useCallback((time: number) => {
    // Fix: Check against null, as the ref is initialized with null.
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = time - previousTimeRef.current;

    let newEnemies = [...enemies];
    let newProjectiles = [...projectiles];
    let newTowers = towers.map(t => ({...t})); // Prevent direct state mutation
    let moneyGained = 0;
    let healthLost = 0;

    // 1. Spawn Enemies
    if (gameState === GameState.PLAYING && waveEnemiesToSpawn.current.length > 0) {
        const currentWaveData = WAVES[currentWave];
        if (time - lastSpawnTime.current > currentWaveData.spawnInterval) {
            const enemyType = waveEnemiesToSpawn.current.shift()!;
            const enemyStats = POKEMON_DATA[enemyType];
            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            const newEnemy: EnemyInstance = {
                id: `enemy_${Math.random()}`,
                type: enemyType,
                hp: enemyStats.hp!, maxHp: enemyStats.hp!,
                x: PATH[0].x * TILE_SIZE + TILE_SIZE / 2, y: PATH[0].y * TILE_SIZE + TILE_SIZE / 2,
                pathIndex: 0, progress: 0,
                color: randomColor,
            };
            newEnemies.push(newEnemy);
            lastSpawnTime.current = time;
        }
    }

    // 2. Move Enemies
    newEnemies = newEnemies.filter(enemy => {
      const enemyStats = POKEMON_DATA[enemy.type];
      const speed = enemyStats.speed! * TILE_SIZE * (deltaTime / 1000);
      enemy.progress += speed;

      const p1 = PATH[enemy.pathIndex];
      const p2 = PATH[enemy.pathIndex + 1];
      
      if (!p2) { healthLost++; return false; }
      
      const segmentLength = Math.hypot((p2.x - p1.x) * TILE_SIZE, (p2.y - p1.y) * TILE_SIZE);

      if (enemy.progress >= segmentLength) {
        enemy.pathIndex++;
        enemy.progress -= segmentLength; 
        if (enemy.pathIndex >= PATH.length - 1) { healthLost++; return false; }
      }

      const currentPoint = PATH[enemy.pathIndex];
      const nextPoint = PATH[enemy.pathIndex + 1];
      const angle = Math.atan2((nextPoint.y - currentPoint.y), (nextPoint.x - currentPoint.x));
      
      enemy.x = (currentPoint.x * TILE_SIZE + TILE_SIZE / 2) + Math.cos(angle) * enemy.progress;
      enemy.y = (currentPoint.y * TILE_SIZE + TILE_SIZE / 2) + Math.sin(angle) * enemy.progress;
      
      return true;
    });

    if (healthLost > 0) setPlayerHealth(prev => Math.max(0, prev - healthLost));

    // 3. Towers attack
    for (const tower of newTowers) {
      const towerStats = POKEMON_DATA[tower.type];
      const damageMultiplier = Math.pow(UPGRADE_SETTINGS.damageMultiplier, tower.level - 1);
      const rangeMultiplier = Math.pow(UPGRADE_SETTINGS.rangeMultiplier, tower.level - 1);
      const currentRangePx = towerStats.range! * TILE_SIZE * rangeMultiplier;

      if (time - tower.lastAttackTime > towerStats.attackSpeed!) {
        const towerX = tower.x * TILE_SIZE + TILE_SIZE / 2;
        const towerY = tower.y * TILE_SIZE + TILE_SIZE / 2;
        let target = null;
        let maxProgress = -1;

        for (const enemy of newEnemies) {
          const distance = Math.hypot(enemy.x - towerX, enemy.y - towerY);
          if (distance <= currentRangePx) {
            const totalProgress = enemy.pathIndex + (enemy.progress / 1000);
            if (totalProgress > maxProgress) {
              maxProgress = totalProgress;
              target = enemy;
            }
          }
        }

        if (target) {
          tower.lastAttackTime = time;
          newProjectiles.push({
            id: `proj_${Math.random()}`, towerId: tower.id, targetId: target.id,
            type: tower.type, x: towerX, y: towerY,
          });
        }
      }
    }

    // 4. Move projectiles and deal damage
    const hitEnemyIds = new Set<string>();
    newProjectiles = newProjectiles.filter(proj => {
        const towerStats = POKEMON_DATA[proj.type];
        const projSpeed = towerStats.projectile!.speed * TILE_SIZE * (deltaTime / 1000);
        const target = newEnemies.find(e => e.id === proj.targetId);
        if (!target) return false;

        const angle = Math.atan2(target.y - proj.y, target.x - proj.x);
        proj.x += Math.cos(angle) * projSpeed;
        proj.y += Math.sin(angle) * projSpeed;

        if (Math.hypot(target.x - proj.x, target.y - proj.y) < TILE_SIZE / 4) {
            const tower = newTowers.find(t => t.id === proj.towerId);
            if(tower) {
                const damageMultiplier = Math.pow(UPGRADE_SETTINGS.damageMultiplier, tower.level - 1);
                const currentDamage = towerStats.damage! * damageMultiplier;
                target.hp -= currentDamage;
                if (target.hp <= 0) {
                  hitEnemyIds.add(target.id);
                  moneyGained += POKEMON_DATA[target.type].reward!;
                }
            }
            return false;
        }
        return true;
    });
    
    if(moneyGained > 0) setPlayerMoney(prev => prev + moneyGained);
    newEnemies = newEnemies.filter(e => !hitEnemyIds.has(e.id));

    setEnemies(newEnemies);
    setProjectiles(newProjectiles);
    setTowers(newTowers);

    // 6. Check for Game/Wave End
    if (gameState === GameState.PLAYING && newEnemies.length === 0 && waveEnemiesToSpawn.current.length === 0) {
      if (currentWave >= WAVES.length - 1) {
        setGameState(GameState.VICTORY);
      } else {
        setGameState(GameState.WAVE_TRANSITION);
        setCurrentWave(prev => prev + 1);
        setSelectedBoardTowerId(null);
      }
    }
    
    if (playerHealth <= 0) { setGameState(GameState.GAME_OVER); }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [currentWave, enemies, projectiles, towers, gameState, playerHealth]);

  useEffect(() => {
    if (gameState === GameState.PLAYING || gameState === GameState.WAVE_TRANSITION) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    // Fix: Type-safe cleanup for requestAnimationFrame and resetting previousTimeRef to null.
    return () => { 
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = null;
    };
  }, [gameState, gameLoop]);
  
  const handleStartWave = () => {
    if (gameState === GameState.WAVE_TRANSITION) {
      const waveData = WAVES[currentWave];
      const enemiesToSpawn = [...waveData.enemies];
      if (waveData.boss) {
        enemiesToSpawn.push(waveData.boss);
      }
      waveEnemiesToSpawn.current = enemiesToSpawn;
      lastSpawnTime.current = performance.now();
      setGameState(GameState.PLAYING);
    }
  };

    const isPathTile = useCallback((x: number, y: number) => {
        for (let i = 0; i < PATH.length - 1; i++) {
            const p1 = PATH[i]; const p2 = PATH[i+1];
            if (p1.x === p2.x && x === p1.x) { if (y >= Math.min(p1.y, p2.y) && y <= Math.max(p1.y, p2.y)) return true; }
            if (p1.y === p2.y && y === p1.y) { if (x >= Math.min(p1.x, p2.x) && x <= Math.max(p1.x, p2.x)) return true; }
        }
        return false;
    }, []);

  const handlePlaceTower = (x: number, y: number) => {
    if (isPathTile(x, y) || towers.some(t => t.x === x && t.y === y)) {
      if (gachaTowerToPlace) setGachaTowerToPlace(null);
      return;
    }

    const towerToPlaceType = gachaTowerToPlace || selectedTowerType;
    if (!towerToPlaceType) return;

    const towerStats = POKEMON_DATA[towerToPlaceType];
    const cost = gachaTowerToPlace ? 0 : towerStats.cost!;

    if (playerMoney >= cost) {
      setPlayerMoney(prev => prev - cost);
      const newTower: TowerInstance = {
        id: `tower_${Math.random()}`, type: towerToPlaceType, x, y,
        lastAttackTime: 0, level: 1, totalSpent: gachaTowerToPlace ? GACHA_COST : towerStats.cost!,
      };
      setTowers(prev => [...prev, newTower]);
      if (gachaTowerToPlace) setGachaTowerToPlace(null);
    }
  };
  
  const handleSelectTowerType = (type: PokemonId | null) => {
    setSelectedTowerType(type);
    setSelectedBoardTowerId(null);
    setGachaTowerToPlace(null);
  };

  const handleSelectBoardTower = (towerId: string | null) => {
    setSelectedBoardTowerId(towerId);
    setSelectedTowerType(null);
    setGachaTowerToPlace(null);
  }

  const handleSellTower = (towerId: string) => {
    const towerToSell = towers.find(t => t.id === towerId);
    if (towerToSell) {
      const moneyBack = Math.floor(towerToSell.totalSpent * SELL_MULTIPLIER);
      setPlayerMoney(prev => prev + moneyBack);
      setTowers(prev => prev.filter(t => t.id !== towerId));
      setSelectedBoardTowerId(null);
    }
  };

  const handleUpgradeTower = (towerId: string) => {
    setTowers(prevTowers => prevTowers.map(t => {
      if (t.id === towerId) {
        const cost = Math.floor(POKEMON_DATA[t.type].cost! * UPGRADE_SETTINGS.costMultiplier * t.level);
        if (playerMoney >= cost && t.level < MAX_TOWER_LEVEL) {
          setPlayerMoney(prev => prev - cost);
          return { ...t, level: t.level + 1, totalSpent: t.totalSpent + cost };
        }
      }
      return t;
    }));
  };
  
  const handleGachaPull = () => {
    if (playerMoney >= GACHA_COST) {
      setPlayerMoney(prev => prev - GACHA_COST);
      const pulledPokemon = pullFromGacha();
      setGachaTowerToPlace(pulledPokemon);
      setSelectedTowerType(null);
      setSelectedBoardTowerId(null);
    }
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-yellow-400 selection:text-black">
      <h1 className="text-4xl md:text-5xl text-yellow-400 mb-4 tracking-wider">Pokémon Tower Defense</h1>
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl">
        <GameBoard 
          towers={towers} enemies={enemies} projectiles={projectiles}
          onPlaceTower={handlePlaceTower}
          selectedTowerType={selectedTowerType}
          onSelectBoardTower={handleSelectBoardTower}
          selectedBoardTowerId={selectedBoardTowerId}
          gachaTowerToPlace={gachaTowerToPlace}
        />
        <GameUI 
          health={playerHealth} money={playerMoney} wave={currentWave} gameState={gameState}
          onStartWave={handleStartWave}
          selectedTowerType={selectedTowerType} onSelectTowerType={handleSelectTowerType}
          playerMoney={playerMoney} towers={towers} selectedBoardTowerId={selectedBoardTowerId}
          onSelectBoardTower={handleSelectBoardTower} onSellTower={handleSellTower} onUpgradeTower={handleUpgradeTower}
          onGachaPull={handleGachaPull} gachaTowerToPlace={gachaTowerToPlace}
        />
      </div>
      {(gameState === GameState.GAME_OVER || gameState === GameState.VICTORY || gameState === GameState.START_MENU) && (
        <GameModal gameState={gameState} onStartGame={startGame} />
      )}
    </div>
  );
};

export default App;
