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
export const SET_TABLE_NUMBER = 'SET_TABLE_NUMBER';
export const FETCH_TABLES_SUCCESSFUL = 'FETCH_TABLES_SUCCESSFUL';
export const ADD_NEW_GAME = 'ADD_NEW_GAME';
export const ADD_NEW_ROUND = 'ADD_NEW_ROUND';

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

export const fixBet = (tableNumber, gameNumber, roundNumber, bet, nextGameId) => ({
  type: FIX_BET,
  tableNumber,
  gameNumber,
  roundNumber,
  bet,
  nextGameId
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

export const addNewGame = (tableNumber, gameId, roundId) => ({
  type: ADD_NEW_GAME,
  tableNumber,
  gameId,
  roundId
});

export const addNewRound = (tableNumber, gameNumber) => ({
  type: ADD_NEW_ROUND,
  tableNumber,
  gameNumber
});

export const createNewTable = (tableId, gameId, roundId, players) => ({
  type: CREATE_NEW_TABLE,
  tableId,
  gameId,
  roundId,
  players
});

export const selectScoreCard = (tableNumber, pageNumber) => ({
  type: SELECT_SCORE_CARD,
  tableNumber,
  pageNumber
});

export const selectGameNumber = (tableNumber, selectedGameNumber) => ({
  type: SELECT_GAME_NUMBER,
  tableNumber,
  selectedGameNumber
});

export const setTableNumber = (tableNumber) => ({
  type: SET_TABLE_NUMBER,
  tableNumber
});

export const fetchTablesSuccessful = (playersData, tablesData) => ({
  type: FETCH_TABLES_SUCCESSFUL,
  playersData,
  tablesData
});