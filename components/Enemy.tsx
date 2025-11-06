
import React from 'react';
import { type EnemyInstance } from '../types';
import { POKEMON_DATA, TILE_SIZE } from '../constants';

interface EnemyProps {
  enemy: EnemyInstance;
}

export const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const stats = POKEMON_DATA[enemy.type];
  const healthPercentage = (enemy.hp / enemy.maxHp) * 100;

  const isBoss = stats.isBoss === true;
  const size = isBoss ? TILE_SIZE * 1.5 : TILE_SIZE;
  const healthBarTop = isBoss ? '-0.5rem' : '-0.25rem';
  const healthBarHeight = isBoss ? '0.375rem' : '0.25rem';
  const bossClasses = isBoss ? 'ring-4 ring-red-500 animate-pulse' : 'border-2 border-black/50';


  return (
    <div
      className="absolute"
      style={{
        left: enemy.x - size / 2,
        top: enemy.y - size / 2,
        width: size,
        height: size,
        transition: 'left 50ms linear, top 50ms linear'
      }}
    >
        <div 
            className={`w-full h-full shadow-md ${bossClasses}`}
            style={{ backgroundColor: enemy.color }}
            aria-label={stats.name}
        />
        <div className="absolute w-full bg-gray-600 rounded" style={{ top: healthBarTop, height: healthBarHeight }}>
            <div className="h-full bg-red-500 rounded" style={{ width: `${healthPercentage}%` }}></div>
        </div>
    </div>
  );
};
