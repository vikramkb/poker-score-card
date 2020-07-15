import {
    ADD_NEW_SCORE,
    EDIT_SCORE,
    DELETE_SCORE,
    PLAY_ROUND,
    FOLD_ROUND,
    FIX_BET,
    SUBMIT_WINNER,
    END_TABLE,
    CREATE_NEW_TABLE
} from "../action/ScoreAction";

const names = ['Vikram', "Radha", "Sydulu", "Sharat"];
const nameIdxMap = {
    'Vikram': 0,
    'Radha': 1,
    'Sydulu': 2,
    'Sharat': 3
};
const scoreCard = [];
const totalScore = [0, 0, 0, 0];
const firstRoundBet = 10;
const games = [
    {
        rounds: [
            {
                bet: 10,
                playerStatus: [{name: 'Vikram', action: 'playing'},{name: 'Radha', action: 'playing'}, {name: 'Sydulu', action: 'playing'}, {name: 'Sharat', action: 'playing'}],
                fixed: true
            },
            {
                bet: 10,
                playerStatus: [{name: 'Vikram', action: 'playing'},{name: 'Radha', action: 'playing'}, {name: 'Sydulu', action: 'playing'}, {name: 'Sharat', action: 'playing'}],
                fixed: false
            }
        ]
        ,
        running: true
    }
];
const tables = [{
    games: games,
    scoreCard: scoreCard,
    totalScore: totalScore,
    running: true
}
];
const defaultState = {
    names,
    nameIdxMap,
    tables
};
function getUpdatedScore(game, totalScore) {
    const newTotalScore = totalScore.map(t => t);
    const newScoreCard = totalScore.map(t => 0);
    const tableAmount = game.rounds.map(r => {
        r.playerStatus.filter(p => p.action === 'playing').forEach(p => {
            newTotalScore[nameIdxMap[p.name]] = newTotalScore[nameIdxMap[p.name]]-r.bet;
            newScoreCard[nameIdxMap[p.name]] = newScoreCard[nameIdxMap[p.name]]-r.bet;
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
function getNewTable(players) {
    return {
        games: [getNewGame(players)],
        scoreCard: [players.map(p => 0)],
        totalScore: players.map(p => 0),
        running: true
    };
}

function getNewGame(players) {
    return     {
        rounds: [
            {
                bet: firstRoundBet,
                playerStatus: players.map(p=>{return {name: p, action: 'playing'}}),
                fixed: true
            },
            {
                bet: firstRoundBet,
                playerStatus: players.map(p=>{return {name: p, action: 'playing'}}),
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
        ...games,
        rounds: newRounds,
        running: true
    };

    let newGames = table.games.map(g => g);
    newGames[action.gameNumber] = newGame;

    let newTables = state.tables.map(t => t);
    newTables[action.tableNumber] = {
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
        ...game.rounds[action.roundNumber],
        playerStatus: game.rounds[action.roundNumber].playerStatus,
        bet: action.bet,
        fixed: true
    };

    let newRounds = game.rounds.map(r => r);
    const isRunning = newRounds.length !== 3;
    newRounds[action.roundNumber] = newRound;
    const playingPlayers = newRound.playerStatus.filter(p => p.action === 'playing');
    if(playingPlayers.length >= 2 &&newRounds.length !== 3) {
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
    if(playingPlayers.length === 1) {
        newGame.winner = playingPlayers[0].name;
        newGame.running = false;
    }

    let newGames = table.games.map(g => g);
    newGames[action.gameNumber] = newGame;

    let newTables = state.tables.map(t => t);
    newTables[action.tableNumber] = {
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

    if(playingPlayers.length === 1) {
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
    const newScore = getUpdatedScore(newGames[action.gameNumber], table.totalScore);
    let newScoreCard = table.scoreCard.map(s => s.map(k => k));
    newScoreCard.push(newScore.newScoreCard);
    newGames.push(getNewGame(state.names));

    let newTables = state.tables.map(t => t);
    newTables[action.tableNumber] = {
        games: newGames,
        scoreCard: newScoreCard,
        totalScore: newScore.newTotalScore,
        running: true
    };
    return {
        ...state,
        tables: newTables,
        names: state.names,
        nameIdxMap: state.nameIdxMap
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
            newTables[action.tableNumber] =  {
                ...table,
                games: table.games.filter(g => !g.running),
                scoreCard: table.scoreCard,
                totalScore: table.totalScore,
                running: false
            };
            return {
                names,
                nameIdxMap,
                tables: newTables
            };
        }
        case CREATE_NEW_TABLE: {
            const newTables = tables.map(t=>t);
            const newTable = getNewTable(state.names);
            newTables.push(newTable);
            return {
                names,
                nameIdxMap,
                tables: newTables
            };
        }
        default:
            return state;
    }
}