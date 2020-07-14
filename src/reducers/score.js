import {
    ADD_NEW_SCORE,
    EDIT_SCORE,
    DELETE_SCORE,
    PLAY_ROUND,
    FOLD_ROUND,
    FIX_BET,
    SUBMIT_WINNER
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
                playerStatus: [{name: 'Vikram', action: 'playing'},{name: 'Radha', action: 'fold'}, {name: 'Sydulu', action: 'playing'}, {name: 'Sharat', action: 'fold'}],
                fixed: true
            },
            {
                bet: 40,
                playerStatus: [{name: 'Vikram', action: 'playing'}, {name: 'Sydulu', action: 'playing'}],
                fixed: true
            }]
        ,
        winner: 'vikram',
        running: false
    },
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

const defaultState = {
    scoreCard,
    names,
    nameIdxMap,
    totalScore,
    games
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

function getUpdatedPlayerStatus(state, action, foldOrPlaying) {
    console.log("game number : ", action.gameNumber, " round number : ", action.roundNumber, "player idx : ", action.playerIdx);
    const x = state.games[action.gameNumber].rounds[action.roundNumber].playerStatus[action.playerIdx];
    console.log("play round", x);

    let newPlayerStatus = state.games[action.gameNumber].rounds[action.roundNumber].playerStatus.map(p => {
        return {name: p.name, action: p.action};
    });
    newPlayerStatus[action.playerIdx].action = foldOrPlaying;
    const newRound = {
        ...state.games[action.gameNumber].rounds[action.roundNumber],
        playerStatus: newPlayerStatus,
        bet: state.games[action.gameNumber].rounds[action.roundNumber].bet,
        fixed: state.games[action.gameNumber].rounds[action.roundNumber].fixed
    };

    let newRounds = state.games[action.gameNumber].rounds.map(r => r);
    newRounds[action.roundNumber] = newRound;

    const newGame = {
        ...state.games[action.gameNumber].rounds,
        rounds: newRounds,
        running: true
    };

    let newGames = state.games.map(g => g);
    newGames[action.gameNumber] = newGame;
    return {
        ...state,
        games: newGames,
        scoreCard: state.scoreCard,
        names: state.names,
        nameIdxMap: state.nameIdxMap,
        totalScore: state.totalScore
    };
}

function getUpdatedRoundStatus(state, action) {
    console.log("game number : ", action.gameNumber, " round number : ", action.roundNumber, "player idx : ", action.playerIdx);
    const x = state.games[action.gameNumber].rounds[action.roundNumber].playerStatus[action.playerIdx];
    console.log("play round", x);

    const newRound = {
        ...state.games[action.gameNumber].rounds[action.roundNumber],
        playerStatus: state.games[action.gameNumber].rounds[action.roundNumber].playerStatus,
        bet: action.bet,
        fixed: true
    };

    let newRounds = state.games[action.gameNumber].rounds.map(r => r);
    const isRunning = newRounds.length !== 3;
    newRounds[action.roundNumber] = newRound;
    const playingPlayers = newRound.playerStatus.filter(p => p.action === 'playing');
    if(newRounds.length !== 3) {
        newRounds.push({
            bet: newRound.bet,
            playerStatus: playingPlayers,
            fixed: false
        })
    }

    const newGame = {
        ...state.games[action.gameNumber].rounds,
        rounds: newRounds,
        winner: state.games[action.gameNumber].winner,
        running: isRunning
    };
    if(playingPlayers.length === 1) {
        newGame.winner = playingPlayers[0].name;
        newGame.running = false;
    }

    let newGames = state.games.map(g => g);
    newGames[action.gameNumber] = newGame;
    const newState={
        ...state,
        games: newGames,
        scoreCard: state.scoreCard,
        names: state.names,
        nameIdxMap: state.nameIdxMap,
        totalScore: state.totalScore
    };
    if(playingPlayers.length === 1) {
        action.winner = playingPlayers[0].name;
        return submitWinner(newState, action);
    }
    return newState;
}

function submitWinner(state, action) {
    const newGame = {
        ...state.games[action.gameNumber],
        rounds: state.games[action.gameNumber].rounds,
        winner: action.winner,
        running: false
    };

    let newGames = state.games.map(g => g);
    newGames[action.gameNumber] = newGame;
    const newScore = getUpdatedScore(newGames[action.gameNumber], state.totalScore);
    console.log("newScore", newScore);
    let newScoreCard = state.scoreCard.map(s => s.map(k => k));
    newScoreCard.push(newScore.newScoreCard);
    return {
        ...state,
        games: newGames,
        scoreCard: newScoreCard,
        names: state.names,
        nameIdxMap: state.nameIdxMap,
        totalScore: newScore.newTotalScore
    };
}
export default function score(state = defaultState, action = {}) {
    switch (action.type) {
        case ADD_NEW_SCORE: {
            const newScore = state.names.map(n => parseInt(action.newData[n], 10));
            let newScoreTable = state.scoreCard.map(x => x);
            newScoreTable.push(newScore);
            return {
                names: state.names,
                nameIdxMap: state.nameIdxMap,
                scoreCard: newScoreTable
            };
        }
        case EDIT_SCORE: {
            const index = action.index;
            const newScore = state.names.map(n => parseInt(action.newData[n], 10));
            let newScoreTable = state.scoreCard.map(x => x);
            newScoreTable[index] = newScore;
            return {
                names: state.names,
                nameIdxMap: state.nameIdxMap,
                scoreCard: newScoreTable
            };
        }
        case DELETE_SCORE: {
            const deleteIndex = action.index;
            return {
                names: state.names,
                nameIdxMap: state.nameIdxMap,
                scoreCard: state.scoreCard.map((idx, x) => idx !== deleteIndex)
            };
        }
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
        default:
            return state;
    }
}

// export default function score(state = {title : "report-ui"}, action={}) {
//     const names = ['Vikram', "Radha", "Sydulu", "Sharat"];
//     const nameIdxMap = {
//         'Vikram': 0,
//         'Radha': 1,
//         'Sydulu': 2,
//         'Sharat': 3
//     };
//     const scoreCard = [[0, 10, 20, 30],[90, 0, 20, 30],[0, 10, 20, 30],[0, 10, 20, 30]];
//     state = {
//         scoreCard,
//         names,
//         nameIdxMap
//     };
//     return state;
// }