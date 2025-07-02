import { useState, useCallback } from 'react';

// Define the game player types
export type Player = 'X' | 'O' | null;

// Define game state interface
export interface GameState {
  board: Player[];
  currentPlayer: Player;
  winner: Player;
  isDraw: boolean;
}

// Custom hook to manage the game logic
export default function useTicTacToe() {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
  });

  // Function to check for a winner
  const checkWinner = useCallback((board: Player[]): Player => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }, []);

  // Function to check if the game is a draw
  const checkDraw = useCallback((board: Player[]): boolean => {
    return !board.includes(null);
  }, []);

  // Handle click on a square
  const handleSquareClick = useCallback((index: number) => {
    setGameState((prevState) => {
      // If square is already filled or game has ended, do nothing
      if (prevState.board[index] || prevState.winner || prevState.isDraw) {
        return prevState;
      }

      // Create a new board with the current player's mark
      const newBoard = [...prevState.board];
      newBoard[index] = prevState.currentPlayer;

      // Check for winner or draw
      const winner = checkWinner(newBoard);
      const isDraw = !winner && checkDraw(newBoard);

      // Update game state
      return {
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        isDraw,
      };
    });
  }, [checkWinner, checkDraw]);

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
    });
  }, []);

  return {
    gameState,
    handleSquareClick,
    resetGame,
  };
}