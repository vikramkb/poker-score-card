export const ADD_NEW_SCORE = 'ADD_NEW_SCORE';
export const EDIT_SCORE = 'EDIT_SCORE';
export const DELETE_SCORE = 'DELETE_SCORE';
export const FOLD_ROUND = 'FOLD_ROUND';
export const PLAY_ROUND = 'PLAY_ROUND';
export const FIX_BET = 'FIX_BET';
export const SUBMIT_WINNER = 'SUBMIT_WINNER';
export const CREATE_NEW_TABLE = 'CREATE_NEW_GAME';
export const END_TABLE = 'END_GAME';
export const SELECT_SCORE_CARD = 'SELECT_SCORE_CARD';
export const SELECT_GAME_NUMBER = 'SELECT_GAME_NUMBER';

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

export const foldRound = (tableNumber, gameNumber, roundNumber, playerIdx, playerName) => ({
  type: FOLD_ROUND,
  tableNumber,
  gameNumber,
  roundNumber,
  playerName,
  playerIdx
});

export const fixBet = (tableNumber, gameNumber, roundNumber, bet) => ({
  type: FIX_BET,
  tableNumber,
  gameNumber,
  roundNumber,
  bet
});

export const playRound = (tableNumber, gameNumber, roundNumber, playerIdx, playerName) => ({
  type: PLAY_ROUND,
  tableNumber,
  gameNumber,
  roundNumber,
  playerName,
  playerIdx
});

export const submitWinner = (tableNumber, gameNumber, winner) => ({
  type: SUBMIT_WINNER,
  tableNumber,
  gameNumber,
  winner
});

export const endTable = (tableNumber) => ({
  type: END_TABLE,
  tableNumber
});

export const createNewTable = () => ({
  type: CREATE_NEW_TABLE
});

export const selectScoreCard = (tableNumber, pageNumber) => ({
  type: SELECT_SCORE_CARD,
  tableNumber,
  pageNumber
});

export const selectGameNumber = (selectGameNumber) => ({
  type: SELECT_GAME_NUMBER,
  selectGameNumber
});