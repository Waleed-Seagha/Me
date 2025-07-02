import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/hooks/useTicTacToe';

interface GameSquareProps {
  value: Player;
  onClick: () => void;
  winningSquare?: boolean;
}

const GameSquare: React.FC<GameSquareProps> = ({ value, onClick, winningSquare = false }) => {
  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: value ? 1 : 1.05 },
    tap: { scale: value ? 1 : 0.95 }
  };

  return (
    <motion.button
      className={`w-full aspect-square flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-bold rounded-lg
                 ${winningSquare 
                   ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500' 
                   : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
      onClick={onClick}
      disabled={!!value}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      transition={{ duration: 0.2 }}
    >
      {value && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`${value === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
};

export default GameSquare;