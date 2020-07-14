export const ADD_NEW_SCORE = 'ADD_NEW_SCORE';
export const EDIT_SCORE = 'EDIT_SCORE';
export const DELETE_SCORE = 'DELETE_SCORE';
export const FOLD_ROUND = 'FOLD_ROUND';
export const PLAY_ROUND = 'PLAY_ROUND';
export const FIX_BET = 'FIX_BET';
export const SUBMIT_WINNER = 'SUBMIT_WINNER';

export const addNewScore = newData => ({
  type: ADD_NEW_SCORE,
  newData
});

export const editScore = (index, newData) => ({
  type: EDIT_SCORE,
  index,
  newData
});

export const deleteScore = (index) => ({
  type: DELETE_SCORE,
  index
});

export const foldRound = (gameNumber, roundNumber, playerIdx, playerName) => ({
  type: FOLD_ROUND,
  gameNumber,
  roundNumber,
  playerName,
  playerIdx
});

export const fixBet = (gameNumber, roundNumber, bet) => ({
  type: FIX_BET,
  gameNumber,
  roundNumber,
  bet
});

export const playRound = (gameNumber, roundNumber, playerIdx, playerName) => ({
  type: PLAY_ROUND,
  gameNumber,
  roundNumber,
  playerName,
  playerIdx
});

export const submitWinner = (gameNumber, winner) => ({
  type: SUBMIT_WINNER,
  gameNumber,
  winner
});