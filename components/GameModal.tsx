
import React from 'react';
import { GameState } from '../types';

interface GameModalProps {
  gameState: GameState;
  onStartGame: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ gameState, onStartGame }) => {
  const getModalContent = () => {
    switch (gameState) {
      case GameState.START_MENU:
        return {
          title: "Welcome!",
          message: "Defend the path from wild Pokémon!",
          buttonText: "Start Game",
        };
      case GameState.GAME_OVER:
        return {
          title: "Game Over",
          message: "The Pokémon overran your defenses.",
          buttonText: "Try Again",
        };
      case GameState.VICTORY:
        return {
          title: "Victory!",
          message: "You successfully defended against all waves!",
          buttonText: "Play Again",
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-4 border-yellow-400 p-8 rounded-lg text-center max-w-md">
        <h2 className="text-4xl text-yellow-400 mb-4">{content.title}</h2>
        <p className="text-lg mb-8">{content.message}</p>
        <button
          onClick={onStartGame}
          className="w-full p-4 text-2xl bg-green-600 rounded-lg border-2 border-green-400 hover:bg-green-500 transition-all duration-200"
        >
          {content.buttonText}
        </button>
      </div>
    </div>
  );
};
