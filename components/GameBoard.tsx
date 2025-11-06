import React, { useState } from 'react';
import { Tower } from './Tower';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { type PokemonId, type TowerInstance, type EnemyInstance, type ProjectileInstance } from '../types';
import { BOARD_WIDTH_TILES, BOARD_HEIGHT_TILES, TILE_SIZE, PATH, POKEMON_DATA, BOARD_WIDTH_PX, BOARD_HEIGHT_PX, TOWER_COLORS } from '../constants';

interface GameBoardProps {
  towers: TowerInstance[];
  enemies: EnemyInstance[];
  projectiles: ProjectileInstance[];
  onPlaceTower: (x: number, y: number) => void;
  selectedTowerType: PokemonId | null;
  onSelectBoardTower: (towerId: string | null) => void;
  selectedBoardTowerId: string | null;
  gachaTowerToPlace: PokemonId | null;
}

const pathData = PATH.map((p, i) => {
  const x = p.x * TILE_SIZE + TILE_SIZE / 2;
  const y = p.y * TILE_SIZE + TILE_SIZE / 2;
  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
}).join(' ');

export const GameBoard: React.FC<GameBoardProps> = ({ towers, enemies, projectiles, onPlaceTower, selectedTowerType, onSelectBoardTower, selectedBoardTowerId, gachaTowerToPlace }) => {
  const [hoveredTile, setHoveredTile] = useState<{x: number, y: number} | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    if (x >= 0 && x < BOARD_WIDTH_TILES && y >= 0 && y < BOARD_HEIGHT_TILES) {
        setHoveredTile({ x, y });
    } else {
        setHoveredTile(null);
    }
  };

  const handleClick = () => {
    if (!hoveredTile) return;

    if (selectedTowerType || gachaTowerToPlace) {
      onPlaceTower(hoveredTile.x, hoveredTile.y);
      return;
    }

    const clickedTower = towers.find(t => t.x === hoveredTile.x && t.y === hoveredTile.y);
    if (clickedTower) {
      onSelectBoardTower(clickedTower.id === selectedBoardTowerId ? null : clickedTower.id);
    } else {
      onSelectBoardTower(null);
    }
  };

  const isPathTile = (x: number, y: number) => {
    for (let i = 0; i < PATH.length - 1; i++) {
        const p1 = PATH[i];
        const p2 = PATH[i+1];
        if (p1.x === p2.x && x === p1.x) { if (y >= Math.min(p1.y, p2.y) && y <= Math.max(p1.y, p2.y)) return true; }
        if (p1.y === p2.y && y === p1.y) { if (x >= Math.min(p1.x, p2.x) && x <= Math.max(p1.x, p2.x)) return true; }
    }
    return false;
  };

  const isOccupied = (x: number, y: number) => towers.some(t => t.x === x && t.y === y);

  const renderPlacementPreview = () => {
    const towerToPreview = selectedTowerType || gachaTowerToPlace;
    if (!towerToPreview || !hoveredTile) return null;
    
    const { x, y } = hoveredTile;
    const stats = POKEMON_DATA[towerToPreview];
    const rangePx = stats.range! * TILE_SIZE;
    const canPlace = !isPathTile(x, y) && !isOccupied(x,y);
    const colorClass = TOWER_COLORS[towerToPreview] ?? 'bg-pink-500';

    return (
      <div className="absolute pointer-events-none flex items-center justify-center" style={{ left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
        <div className={`w-3/4 h-3/4 rounded-full ${colorClass} opacity-50`} />
        <div className="absolute rounded-full border" style={{
            left: `calc(50% - ${rangePx}px)`, top: `calc(50% - ${rangePx}px)`,
            width: rangePx * 2, height: rangePx * 2,
            borderColor: canPlace ? 'rgba(255,255,255,0.5)' : 'rgba(255,0,0,0.5)',
            backgroundColor: canPlace ? 'rgba(255,255,255,0.1)' : 'rgba(255,0,0,0.1)',
          }}
        />
      </div>
    );
  };

  return (
    <div 
      className="bg-green-800 relative border-4 border-yellow-400 overflow-hidden cursor-pointer" 
      style={{ width: BOARD_WIDTH_PX, height: BOARD_HEIGHT_PX }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredTile(null)}
      onClick={handleClick}
    >
      <svg width={BOARD_WIDTH_PX} height={BOARD_HEIGHT_PX} className="absolute top-0 left-0">
        <path d={pathData} fill="none" stroke="#a16207" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathData} fill="none" stroke="#facc15" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Array.from({ length: BOARD_WIDTH_TILES }).map((_, i) => (
          <div key={`v-${i}`} className="absolute bg-white/10" style={{ left: i * TILE_SIZE, top: 0, width: 1, height: '100%' }} />
        ))}
        {Array.from({ length: BOARD_HEIGHT_TILES }).map((_, i) => (
          <div key={`h-${i}`} className="absolute bg-white/10" style={{ left: 0, top: i * TILE_SIZE, width: '100%', height: 1 }} />
        ))}
      </div>

      {towers.map(tower => <Tower key={tower.id} tower={tower} isSelected={tower.id === selectedBoardTowerId}/>)}
      {enemies.map(enemy => <Enemy key={enemy.id} enemy={enemy} />)}
      {projectiles.map(projectile => <Projectile key={projectile.id} projectile={projectile} />)}
      {renderPlacementPreview()}
    </div>
  );
};