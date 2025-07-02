import React from 'react';
import TicTacToe from '@/components/game/TicTacToe';

const Game: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Tic-Tac-Toe Game
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Take turns placing your marks and try to get three in a row horizontally, vertically, or diagonally!
          </p>
        </div>
        
        <TicTacToe />
        
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-500">
          <p>Made with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Game;