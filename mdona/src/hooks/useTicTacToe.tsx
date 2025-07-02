import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import GameBoard from './GameBoard';
import useTicTacToe, { Player } from '@/hooks/useTicTacToe';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Confetti } from './Confetti';

const TicTacToe: React.FC = () => {
  const { gameState, handleSquareClick, resetGame } = useTicTacToe();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Find winning pattern for highlighting squares
  const winningPattern = useMemo(() => {
    if (!gameState.winner) return null;
    
    const patterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6]             // Diagonal
    ];
    
    return patterns.find(pattern => {
      const [a, b, c] = pattern;
      return gameState.board[a] && 
             gameState.board[a] === gameState.board[b] && 
             gameState.board[a] === gameState.board[c];
    }) || null;
  }, [gameState.winner, gameState.board]);

  // Show confetti when there's a winner
  useEffect(() => {
    if (gameState.winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState.winner]);

  // Get status message
  const statusMessage = useMemo(() => {
    if (gameState.winner) {
      return `Player ${gameState.winner} wins!`;
    } else if (gameState.isDraw) {
      return "It's a draw!";
    } else {
      return `Current player: ${gameState.currentPlayer}`;
    }
  }, [gameState.winner, gameState.isDraw, gameState.currentPlayer]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Tic-Tac-Toe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className={`text-center text-xl font-medium mb-4 ${
            gameState.winner 
              ? 'text-green-600 dark:text-green-400' 
              : gameState.isDraw 
                ? 'text-amber-600 dark:text-amber-400'
                : ''
          }`}>
            {statusMessage}
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <PlayerIndicator 
              player="X" 
              isActive={gameState.currentPlayer === 'X' && !gameState.winner && !gameState.isDraw} 
            />
            <PlayerIndicator 
              player="O" 
              isActive={gameState.currentPlayer === 'O' && !gameState.winner && !gameState.isDraw} 
            />
          </div>
        </div>
        
        <GameBoard 
          board={gameState.board}
          onSquareClick={handleSquareClick}
          winningPattern={winningPattern}
        />
        
        {showConfetti && <Confetti />}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={resetGame} 
          className="w-full" 
          variant="outline"
        >
          New Game
        </Button>
      </CardFooter>
    </Card>
  );
};

// Player indicator component
const PlayerIndicator: React.FC<{ player: Player; isActive: boolean }> = ({ player, isActive }) => {
  return (
    <motion.div 
      className={`flex items-center justify-center h-12 w-12 rounded-full border-2 ${
        player === 'X' 
          ? 'text-blue-600 dark:text-blue-400 border-blue-400' 
          : 'text-rose-600 dark:text-rose-400 border-rose-400'
      } ${isActive ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent'}`}
      animate={{ scale: isActive ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span className="text-xl font-bold">{player}</span>
    </motion.div>
  );
};

// Confetti component
export const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none flex justify-center">
      <div className="w-full h-full absolute">
        {Array.from({ length: 100 }).map((_, index) => (
          <div
            key={index}
            className={`absolute animate-confetti w-2 h-2 rounded-full opacity-70 ${
              index % 3 === 0 ? 'bg-blue-500' : 
              index % 3 === 1 ? 'bg-green-500' : 'bg-rose-500'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;