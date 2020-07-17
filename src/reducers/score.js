import {
    ADD_NEW_SCORE,
    EDIT_SCORE,
    DELETE_SCORE,
    SET_TABLE_NUMBER,
    PLAY_ROUND,
    FOLD_ROUND,
    FIX_BET,
    SUBMIT_WINNER,
    END_TABLE,
    CREATE_NEW_TABLE,
    SELECT_SCORE_CARD,
    SELECT_GAME_NUMBER, FETCH_TABLES_SUCCESSFUL
} from "../action/ScoreAction";

const names = ['Vikram', "Radhakrishna", "Sydulu", "Sharat", "Konda", "Swathi", "Madhan", "Thirapathi Rao", "Ramakrishna", "Ramakrishna Peddabbai", "Gopi", "Sydule Kukka", "Sydulu Thota"];
const firstRoundBet = 10;
const tables = [];
const defaultState = {
    names,
    tables
};

function getUpdatedScore(game, totalScore, nameIdxMap) {
    const newTotalScore = totalScore.map(t => t);
    const newScoreCard = totalScore.map(t => 0);
    const tableAmount = game.rounds.map(r => {
        r.playerStatus.filter(p => p.action === 'playing').forEach(p => {
            newTotalScore[nameIdxMap[p.name]] = newTotalScore[nameIdxMap[p.name]] - r.bet;
            newScoreCard[nameIdxMap[p.name]] = newScoreCard[nameIdxMap[p.name]] - r.bet;
        });
        return r.playerStatus.filter(p => p.action === 'playing').length * r.bet
    }).reduce((accumulator, currentValue) => accumulator + currentValue);
    newTotalScore[nameIdxMap[game.winner]] += tableAmount;
    newScoreCard[nameIdxMap[game.winner]] += tableAmount;
    return {
        newTotalScore,
        newScoreCard
    };
}

function getNewTable(players, nameIdxMap) {
    return {
        games: [getNewGame(players)],
        scoreCard: [],
        totalScore: players.map(p => 0),
        players: players,
        running: true,
        nameIdxMap,
        selectGameNumber: 1
    };
}

function getNewGame(players) {
    return {
        rounds: [
            {
                bet: firstRoundBet,
                playerStatus: players.map(p => {
                    return {name: p, action: 'playing'}
                }),
                fixed: true
            },
            {
                bet: firstRoundBet,
                playerStatus: players.map(p => {
                    return {name: p, action: 'playing'}
                }),
                fixed: false
            }
        ]
        ,
        running: true
    }
}

function getUpdatedPlayerStatus(state, action, foldOrPlaying) {
    const table = state.tables[action.tableNumber];
    const game = table.games[action.gameNumber];
    let newPlayerStatus = game.rounds[action.roundNumber].playerStatus.map(p => {
        return {name: p.name, action: p.action};
    });
    newPlayerStatus[action.playerIdx].action = foldOrPlaying;
    const newRound = {
        ...game.rounds[action.roundNumber],
        playerStatus: newPlayerStatus,
        bet: game.rounds[action.roundNumber].bet,
        fixed: game.rounds[action.roundNumber].fixed
    };

    let newRounds = game.rounds.map(r => r);
    newRounds[action.roundNumber] = newRound;

    const newGame = {
        rounds: newRounds,
        running: true
    };

    let newGames = table.games.map(g => g);
    newGames[action.gameNumber] = newGame;

    let newTables = state.tables.map(t => t);
    newTables[action.tableNumber] = {
        ...state.tables[action.tableNumber],
        games: newGames,
        scoreCard: state.tables[action.tableNumber].scoreCard,
        totalScore: state.tables[action.tableNumber].totalScore,
        running: true
    };
    return {
        ...state,
        tables: newTables,
        names: state.names,
        nameIdxMap: state.nameIdxMap
    };
}

function getUpdatedRoundStatus(state, action) {
    const table = state.tables[action.tableNumber];
    const game = table.games[action.gameNumber];

    const newRound = {
        playerStatus: game.rounds[action.roundNumber].playerStatus,
        bet: action.bet,
        fixed: true
    };

    let newRounds = game.rounds.map(r => r);
    const isRunning = newRounds.length !== 3;
    newRounds[action.roundNumber] = newRound;
    const playingPlayers = newRound.playerStatus.filter(p => p.action === 'playing');
    if (playingPlayers.length >= 2 && newRounds.length !== 3) {
        newRounds.push({
            bet: newRound.bet,
            playerStatus: playingPlayers,
            fixed: false
        })
    }

    const newGame = {
        ...game.rounds,
        rounds: newRounds,
        winner: game.winner,
        running: isRunning
    };
    if (playingPlayers.length === 1) {
        newGame.winner = playingPlayers[0].name;
        newGame.running = false;
    }

    let newGames = table.games.map(g => g);
    newGames[action.gameNumber] = newGame;

    let newTables = state.tables.map(t => t);
    newTables[action.tableNumber] = {
        ...state.tables[action.tableNumber],
        games: newGames,
        scoreCard: state.tables[action.tableNumber].scoreCard,
        totalScore: state.tables[action.tableNumber].totalScore,
        running: true
    };
    const newState = {
        ...state,
        tables: newTables,
        names: state.names,
        nameIdxMap: state.nameIdxMap
    };

    if (playingPlayers.length === 1) {
        action.winner = playingPlayers[0].name;
        return submitWinner(newState, action);
    }
    return newState;
}

function submitWinner(state, action) {
    const table = state.tables[action.tableNumber];
    const game = table.games[action.gameNumber];

    const newGame = {
        ...game,
        rounds: game.rounds,
        winner: action.winner,
        running: false
    };

    let newGames = table.games.map(g => g);
    newGames[action.gameNumber] = newGame;
    const newScore = getUpdatedScore(newGames[action.gameNumber], table.totalScore, table.nameIdxMap);
    let newScoreCard = table.scoreCard.map(s => s.map(k => k));
    newScoreCard.push(newScore.newScoreCard);
    newGames.push(getNewGame(state.tables[action.tableNumber].players));

    let newTables = state.tables.map(t => t);
    newTables[action.tableNumber] = {
        ...newTables[action.tableNumber],
        games: newGames,
        scoreCard: newScoreCard,
        totalScore: newScore.newTotalScore,
        running: true
    };
    return {
        ...state,
        tables: newTables,
        names: state.names,
        nameIdxMap: state.nameIdxMap,
        selectGameNumber: newTables[state.tables.length - 1].games.length
    };
}

export default function score(state = defaultState, action = {}) {
    switch (action.type) {
        // case ADD_NEW_SCORE: {
        //     const newScore = state.names.map(n => parseInt(action.newData[n], 10));
        //     let newScoreTable = state.scoreCard.map(x => x);
        //     newScoreTable.push(newScore);
        //     return {
        //         names: state.names,
        //         nameIdxMap: state.nameIdxMap,
        //         scoreCard: newScoreTable
        //     };
        // }
        // case EDIT_SCORE: {
        //     const index = action.index;
        //     const newScore = state.names.map(n => parseInt(action.newData[n], 10));
        //     let newScoreTable = state.scoreCard.map(x => x);
        //     newScoreTable[index] = newScore;
        //     return {
        //         names: state.names,
        //         nameIdxMap: state.nameIdxMap,
        //         scoreCard: newScoreTable
        //     };
        // }
        // case DELETE_SCORE: {
        //     const deleteIndex = action.index;
        //     return {
        //         names: state.names,
        //         nameIdxMap: state.nameIdxMap,
        //         scoreCard: state.scoreCard.map((idx, x) => idx !== deleteIndex)
        //     };
        // }
        case PLAY_ROUND: {
            return getUpdatedPlayerStatus(state, action, 'playing');
        }
        case FOLD_ROUND: {
            return getUpdatedPlayerStatus(state, action, 'fold');
        }
        case FIX_BET: {
            return getUpdatedRoundStatus(state, action);

        }
        case SUBMIT_WINNER: {
            return submitWinner(state, action);
        }
        case END_TABLE: {
            const newTables = state.tables.map(t => t);
            const table = state.tables[action.tableNumber];
            newTables[action.tableNumber] = {
                ...table,
                games: table.games.filter(g => !g.running),
                scoreCard: table.scoreCard,
                totalScore: table.totalScore,
                running: false
            };
            return {
                names,
                tables: newTables
            };
        }
        case CREATE_NEW_TABLE: {
            const players = Object.keys(action.players).filter(idx => action.players[idx]);
            const nameIdxMap = {};
            Object.keys(action.players).forEach((p, idx) => {
                nameIdxMap[p] = idx
            });
            const newTable = getNewTable(players, nameIdxMap);
            const newTables = state.tables.map(t => t);
            newTables.push(newTable);
            const newState = {
                names: state.names,
                tables: newTables
            };
            console.log(newState);
            return newState;
        }
        case SELECT_SCORE_CARD: {
            const newTables = state.tables.map(t => t);
            newTables[action.tableNumber].pageNumber = action.pageNumber;
            return {
                names: state.names,
                nameIdxMap: state.nameIdxMap,
                tables: newTables
            };
        }
        case SELECT_GAME_NUMBER: {
            return {
                ...state,
                selectGameNumber: action.selectGameNumber
            }
        }
        case SET_TABLE_NUMBER: {
            return {
                ...state,
                tableNumber: action.tableNumber
            }
        }
        case FETCH_TABLES_SUCCESSFUL: {
            const players = action.playersData.map(p => p.playerName);
            const tables = action.tablesData
                .filter(t => t.players && t.players.players && t.players.players.length > 0)
                .filter(t => t.tableTotalScore && t.tableTotalScore.playerNames && t.tableTotalScore.playerNames.length > 0)
                .map(t => {
                    const totalGames = t.games.length;
                    let table = {};
                    table.players = t.players.players;
                    const nameIdxMap = {};
                    t.players.players.forEach((p, idx) => {
                        nameIdxMap[p] = idx;
                    });
                    table.totalScore = t.players.players.map((p) => t.tableTotalScore.scores[t.tableTotalScore.playerNames.indexOf(p)]);
                    table.running = t.table.running;
                    table.nameIdxMap = nameIdxMap;
                    table.rounds = Array(totalGames).fill(0).map((p, idx) => {
                        let gameSeq = idx + 1;
                        const game = t.games.filter(g => g.gameSequence = gameSeq)[0];
                        return {
                            bet: game.bidAmount,
                            fixed: !game.running,
                            playerStatus: table.players.map(p => {
                                return {
                                    name: p,
                                    action: 'playing'
                                }
                            })
                        }
                    });
                    let totalScore = Array(t.tableTotalScore.playerNames.length).fill(0);
                    t.tableTotalScore.playerNames.forEach((p, idx) => {
                        totalScore[idx] = t.tableTotalScore.scores[nameIdxMap[p]];
                    });
                    table.totalScore = totalScore;
                    table.selectedGameNumber = 1;
                    table.pageNumber = 1;
                    return table;
                });
            console.log(tables);
            return {
                names: players,
                selectGameNumber: 1,
                pageNumber: 1,
                tables
            }
        }
        default:
            return state;
    }
}