import React from 'react';
import GameSquare from './GameSquare';
import { Player } from '@/hooks/useTicTacToe';

interface GameBoardProps {
  board: Player[];
  onSquareClick: (index: number) => void;
  winningPattern: number[] | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onSquareClick, winningPattern }) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-md mx-auto aspect-square">
      {board.map((square, index) => (
        <GameSquare
          key={index}
          value={square}
          onClick={() => onSquareClick(index)}
          winningSquare={winningPattern?.includes(index)}
        />
      ))}
    </div>
  );
};

export default GameBoard;