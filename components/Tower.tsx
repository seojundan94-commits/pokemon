import React from 'react';
import { type TowerInstance } from '../types';
import { POKEMON_DATA, TILE_SIZE, TOWER_COLORS, UPGRADE_SETTINGS } from '../constants';

interface TowerProps {
  tower: TowerInstance;
  isSelected: boolean;
}

export const Tower: React.FC<TowerProps> = ({ tower, isSelected }) => {
  const stats = POKEMON_DATA[tower.type];
  const rangeMultiplier = Math.pow(UPGRADE_SETTINGS.rangeMultiplier, tower.level - 1);
  const currentRangePx = stats.range! * TILE_SIZE * rangeMultiplier;
  const colorClass = TOWER_COLORS[tower.type] ?? 'bg-pink-500';

  return (
    <div 
      className="absolute flex items-center justify-center group"
      style={{
        left: tower.x * TILE_SIZE,
        top: tower.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      <div 
        className={`absolute rounded-full border transition-opacity ${isSelected ? 'border-yellow-300 opacity-100' : 'border-white/30 bg-white/10 opacity-0 group-hover:opacity-100'}`}
        style={{
          width: currentRangePx * 2,
          height: currentRangePx * 2,
        }}
      />
      <div
        className={`w-3/4 h-3/4 rounded-full ${colorClass} border-2 border-black/50 z-10 shadow-lg flex items-center justify-center transition-all duration-200 ${isSelected ? 'ring-4 ring-yellow-300' : ''}`}
        aria-label={stats.name}
      >
        <span className="font-bold text-lg text-white" style={{ textShadow: '0px 0px 4px black' }}>
          {tower.level}
        </span>
      </div>
    </div>
  );
};