import React from 'react';
import { GameState, PokemonId, TowerInstance } from '../types';
import { POKEMON_DATA, TOWER_TYPES, WAVES, TOWER_COLORS, GACHA_COST, UPGRADE_SETTINGS, SELL_MULTIPLIER, MAX_TOWER_LEVEL } from '../constants';

interface GameUIProps {
  health: number;
  money: number;
  wave: number;
  gameState: GameState;
  onStartWave: () => void;
  selectedTowerType: PokemonId | null;
  onSelectTowerType: (type: PokemonId | null) => void;
  playerMoney: number;
  towers: TowerInstance[];
  selectedBoardTowerId: string | null;
  onSelectBoardTower: (towerId: string | null) => void;
  onSellTower: (towerId: string) => void;
  onUpgradeTower: (towerId: string) => void;
  onGachaPull: () => void;
  gachaTowerToPlace: PokemonId | null;
}

const StatDisplay: React.FC<{ label: string, value: string | number, icon: string }> = ({ label, value, icon }) => (
    <div className="bg-gray-700 p-3 rounded-lg flex items-center gap-4 border-2 border-gray-600">
        <span className="text-3xl">{icon}</span>
        <div>
            <div className="text-sm text-gray-400">{label}</div>
            <div className="text-xl text-yellow-300">{value}</div>
        </div>
    </div>
);

const TowerShop: React.FC<Pick<GameUIProps, 'onSelectTowerType' | 'selectedTowerType' | 'playerMoney'>> = ({ onSelectTowerType, selectedTowerType, playerMoney }) => (
    <div>
        <h3 className="text-xl text-center my-4 text-yellow-400">POKéMON</h3>
        <div className="grid grid-cols-2 gap-2">
            {TOWER_TYPES.map(type => {
                const stats = POKEMON_DATA[type];
                const canAfford = playerMoney >= stats.cost!;
                const isSelected = selectedTowerType === type;
                const colorClass = TOWER_COLORS[type] ?? 'bg-pink-500';

                return (
                    <button
                        key={type}
                        onClick={() => onSelectTowerType(isSelected ? null : type)}
                        disabled={!canAfford}
                        className={`p-2 border-2 rounded-lg text-center transition-all duration-200 flex flex-col items-center justify-center gap-1
                            ${isSelected ? 'bg-yellow-500 border-yellow-300 text-black' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}
                            ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <div className="w-16 h-16 flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full ${colorClass} border-2 border-black/50`} />
                        </div>
                        <div className="text-xs">{stats.name}</div>
                        <div className="font-bold text-yellow-300">${stats.cost}</div>
                    </button>
                );
            })}
        </div>
    </div>
);

const TowerInfoPanel: React.FC<{ tower: TowerInstance, onUpgrade: (id: string) => void, onSell: (id: string) => void, onClose: () => void, playerMoney: number }> = ({ tower, onUpgrade, onSell, onClose, playerMoney }) => {
    const stats = POKEMON_DATA[tower.type];
    const upgradeCost = Math.floor(stats.cost! * UPGRADE_SETTINGS.costMultiplier * tower.level);
    const sellValue = Math.floor(tower.totalSpent * SELL_MULTIPLIER);
    const canUpgrade = playerMoney >= upgradeCost && tower.level < MAX_TOWER_LEVEL;

    const damageMultiplier = Math.pow(UPGRADE_SETTINGS.damageMultiplier, tower.level - 1);
    const currentDamage = (stats.damage! * damageMultiplier).toFixed(0);
    const nextDamage = (stats.damage! * Math.pow(UPGRADE_SETTINGS.damageMultiplier, tower.level)).toFixed(0);

    return (
        <div className="bg-gray-700 p-3 rounded-lg border-2 border-gray-600 flex flex-col gap-2 text-sm">
             <div className="flex justify-between items-center">
                <h3 className="text-lg text-yellow-400">{stats.name} Lvl {tower.level}</h3>
                <button onClick={onClose} className="text-xl">×</button>
            </div>
            <p>Damage: {currentDamage}</p>
            
            <button
                onClick={() => onUpgrade(tower.id)}
                disabled={!canUpgrade}
                className="w-full mt-1 p-2 bg-blue-600 rounded border-2 border-blue-400 hover:bg-blue-500 disabled:bg-gray-600 disabled:border-gray-500 disabled:cursor-not-allowed"
            >
                Upgrade ({tower.level >= MAX_TOWER_LEVEL ? 'MAX' : `$${upgradeCost}`})
                {tower.level < MAX_TOWER_LEVEL && <span className="text-xs block">DMG: {currentDamage} → {nextDamage}</span>}
            </button>
             <button
                onClick={() => onSell(tower.id)}
                className="w-full mt-1 p-2 bg-red-600 rounded border-2 border-red-400 hover:bg-red-500"
            >
                Sell for ${sellValue}
            </button>
        </div>
    )
}


export const GameUI: React.FC<GameUIProps> = (props) => {
    const { health, money, wave, gameState, onStartWave, selectedTowerType, onSelectTowerType, playerMoney, towers, selectedBoardTowerId, onGachaPull, gachaTowerToPlace } = props;
    const selectedBoardTower = towers.find(t => t.id === selectedBoardTowerId);

    return (
        <div className="w-full lg:w-80 bg-gray-900 p-4 border-4 border-yellow-400 flex flex-col gap-4">
            <h2 className="text-2xl text-center text-yellow-400">STATUS</h2>
            <div className="grid grid-cols-2 gap-2">
                <StatDisplay label="Health" value={health} icon="❤️" />
                <StatDisplay label="Money" value={`$${money}`} icon="💰" />
            </div>
            <StatDisplay label="Wave" value={gameState === GameState.VICTORY ? 'VICTORY!' : `${wave + 1} / ${WAVES.length}`} icon="🌊" />
            
            <div className="flex-grow flex flex-col justify-between">
                { gachaTowerToPlace ? (
                    <div className="text-center p-4 bg-purple-800 rounded-lg my-4 border-2 border-purple-500">
                        <p className="text-lg text-yellow-300">뽑기 성공!</p>
                        <p className="font-bold text-xl">{POKEMON_DATA[gachaTowerToPlace].name}</p>
                        <p>맵에 포켓몬을 배치하세요!</p>
                    </div>
                ) : selectedBoardTower ? (
                    <TowerInfoPanel tower={selectedBoardTower} playerMoney={playerMoney} onUpgrade={props.onUpgradeTower} onSell={props.onSellTower} onClose={() => props.onSelectBoardTower(null)} />
                ) : (
                    <TowerShop selectedTowerType={selectedTowerType} onSelectTowerType={onSelectTowerType} playerMoney={playerMoney} />
                )}

                <div className="mt-4">
                     <button
                        onClick={onGachaPull}
                        disabled={playerMoney < GACHA_COST || gachaTowerToPlace !== null || selectedBoardTowerId !== null}
                        className="w-full mb-4 p-3 text-xl bg-purple-600 rounded-lg border-2 border-purple-400 hover:bg-purple-500 transition-all duration-200 disabled:bg-gray-600 disabled:border-gray-500 disabled:cursor-not-allowed"
                     >
                        뽑기 (${GACHA_COST})
                     </button>
                    <button 
                        onClick={onStartWave}
                        disabled={gameState !== GameState.WAVE_TRANSITION}
                        className="w-full p-4 text-2xl bg-green-600 rounded-lg border-2 border-green-400 hover:bg-green-500 transition-all duration-200 disabled:bg-gray-600 disabled:border-gray-500 disabled:cursor-not-allowed"
                    >
                        {gameState === GameState.WAVE_TRANSITION ? `START WAVE ${wave + 1}` : 'WAVE IN PROGRESS'}
                    </button>
                </div>
            </div>
        </div>
    );
};