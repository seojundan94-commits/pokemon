
import React from 'react';
import { type ProjectileInstance } from '../types';
import { POKEMON_DATA } from '../constants';

interface ProjectileProps {
  projectile: ProjectileInstance;
}

export const Projectile: React.FC<ProjectileProps> = ({ projectile }) => {
  const stats = POKEMON_DATA[projectile.type];
  const projectileInfo = stats.projectile;

  return (
    <div
      className="absolute text-2xl"
      style={{
        left: projectile.x,
        top: projectile.y,
        transition: 'left 50ms linear, top 50ms linear'
      }}
    >
      {projectileInfo?.sprite || '•'}
    </div>
  );
};
