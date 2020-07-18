import {
    ADD_NEW_GAME,
    ADD_NEW_ROUND,
    CREATE_NEW_TABLE,
    END_TABLE,
    FETCH_TABLES_SUCCESSFUL,
    FIX_BET,
    FOLD_ROUND,
    PLAY_ROUND,
    SELECT_GAME_NUMBER,
    SELECT_SCORE_CARD,
    SET_TABLE_NUMBER,
    SUBMIT_WINNER
} from "../action/ScoreAction";

const {Map, List} = require('immutable');


const names = List('Vikram', "Radhakrishna", "Sydulu", "Sharat", "Konda", "Swathi", "Madhan", "Thirapathi Rao", "Ramakrishna", "Ramakrishna Peddabbai", "Gopi", "Sydule Kukka", "Sydulu Thota");
const firstRoundBet = 10;
const tables = List();
const defaultState = Map({
    names,
    tables
});

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

function getNewTable(players, nameIdxMap, tableId, gameId, roundId) {
    return Map({
        games: List([getNewGame(players, gameId, roundId)]),
        scoreCard: List(),
        totalScore: List(),
        running: true,
        players: List(players),
        nameIdxMap: Map(nameIdxMap),
        selectGameNumber: 1,
        tableId
    });
}

function getNewRound(players, fixed, bet) {
    return Map({
        bet: bet,
        playerStatus: List(players.map(p => {
            return Map({name: p, action: 'playing'})
        })),
        fixed: fixed
    });


}

function getNewGame(players, gameId, roundId) {
    return Map({
        rounds: List([
            Map({
                bet: firstRoundBet,
                playerStatus: List(players.map(p => {
                    return Map({name: p, action: 'playing'})
                })),
                fixed: true,
                roundId
            }),
            Map({
                bet: firstRoundBet,
                playerStatus: List(players.map(p => {
                    return Map({name: p, action: 'playing'})
                })),
                fixed: false
            })
        ])
        ,
        running: true,
        gameId
    })
}

function getUpdatedPlayerStatus(state, action, foldOrPlaying) {
    const table = state.tables.get(action.tableNumber);
    const games = table.get("games");
    const game = games.get(action.gameNumber);
    const rounds = game.get("rounds");
    const round = rounds.get(action.roundNumber);
    const playerStatus = round.get("playerStatus");
    const player = playerStatus.get("action.playerIdx");
    return state.set("tables", state.tables.set(action.tableNumber, table.set("games", games.set(action.gameNumber, game.set("rounds", rounds.set(action.roundNumber, round.set("playerStatus", playerStatus.set(action.playerIdx, player.set("action", foldOrPlaying)))))))));
}

function getTable(state, tableNumber) {
    return state.get("tables").get(tableNumber);
}

function getTables(state) {
    return state.get("tables");
}

function getGames(state, tableNumber) {
    return getTable(state, tableNumber).get("games");
}

function getRounds(state, tableNumber, gameNumber) {
    return getGame(state, tableNumber, gameNumber).get("rounds");
}

function getPlayerStatuses(state, tableNumber, gameNumber, roundNumber) {
    return getRound(state, tableNumber, gameNumber, roundNumber).get("playerStatus")
}

function getGame(state, tableNumber, gameNumber) {
    return getTable(state, tableNumber).get("games").get(gameNumber);
}

function getRound(state, tableNumber, gameNumber, roundNumber) {
    return getGame(state, tableNumber, gameNumber).get("rounds").get(roundNumber);
}

function getPlayer(state, tableNumber, gameNumber, roundNumber, playerNumber) {
    return getRound(state, tableNumber, gameNumber, roundNumber).get("playerStatus").get(playerNumber);
}

function creatAndAddNewRound(state, tableNumber, gameNumber) {
    const game = getGame(state, tableNumber, gameNumber);
    const lastRoundNumber = game.get("rounds").size-1;
    const lastRound = game.get("rounds").get(lastRoundNumber);
    const playerStatuses = getPlayerStatuses(state, tableNumber, gameNumber, lastRoundNumber);
    const lastRoundPlayers = playerStatuses.filter(p => p.get("action") === "playing").map(p => p.get("name"));
    const newRound = getNewRound(lastRoundPlayers, false, lastRound.get("bet"));

    return state.set("tables", getTables(state)
        .set(tableNumber,
            getTable(state, tableNumber).set("games", getGames(state, tableNumber).set(gameNumber,
                game.set("rounds", getRounds(state, tableNumber, gameNumber).push(newRound))))));

}

function getUpdatedRoundStatus(state, action) {
    let tableNumber = action.tableNumber;
    let gameNumber = action.gameNumber;
    let roundNumber = action.roundNumber;

    const newRound = Map({
        playerStatus: getRound(state, tableNumber, gameNumber, roundNumber).get("playerStatus"),
        bet: action.bet,
        fixed: true
    });

    const isGameRunning = getRounds(state, tableNumber, gameNumber).size !== 3;
    let updatedGame = getGame(state, tableNumber, gameNumber).set("running", isGameRunning);

    const playingPlayers = getPlayerStatuses(state, tableNumber, gameNumber, roundNumber).filter(p => p.get("action") === "playing");
    if (playingPlayers.size === 1) {
        updatedGame = updatedGame.set("winner", playingPlayers.get(0).get("name")).set("running", false);
    }

    let newState = state.set("tables", getTables(state)
        .set(tableNumber,
            getTable(state, tableNumber).set("games", getGames(state, tableNumber).set(gameNumber,
                updatedGame
                    .set("rounds", getRounds(state, tableNumber, gameNumber)
                        .set(roundNumber, newRound)
                    )))));

    let rounds = getRounds(newState, tableNumber, gameNumber);
    if(rounds.size !== 3) {
        return creatAndAddNewRound(newState, tableNumber, gameNumber);
    }
    return newState;
}

function submitWinner(state, action) {
    let tableNumber = action.tableNumber;
    let gameNumber = action.gameNumber;
    const updatedGame = getGame(state, tableNumber, gameNumber).set("winner", action.winner).set("running", false);
    const updatedTable = getTable(state, tableNumber).set("running", false);
    return  state.set("tables", getTables(state)
        .set(tableNumber, updatedTable
                .set("games", getGames(state, tableNumber)
                    .set(gameNumber, updatedGame))));
}

export default function score(state = defaultState, action = {}) {
    switch (action.type) {
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
        case ADD_NEW_GAME: {
            const tableNumber = action.tableNumber;
            const table = getTable(state, tableNumber);
            const newGame = getNewGame(table.get("players"));
            const updatedTable = getTable(state, tableNumber).set("selectedGameNumber", getGames(state, tableNumber).size)
            return state.set("tables", getTables(state)
                .set(tableNumber,
                    updatedTable.set("games", getGames(state, tableNumber).push(newGame))));
        }
        case ADD_NEW_ROUND: {
        }
        case END_TABLE: {
            // const newTables = state.tables.map(t => t);
            // const table = state.tables[action.tableNumber];
            // newTables[action.tableNumber] = {
            //     ...table,
            //     games: table.games.filter(g => !g.running),
            //     scoreCard: table.scoreCard,
            //     totalScore: table.totalScore,
            //     running: false
            // };
            // return {
            //     names,
            //     tables: newTables
            // };
        }
        case CREATE_NEW_TABLE: {
            const tableId = action.tableId;
            const gameId = action.gameId;
            const roundId = action.roundId;
            const players = Object.keys(action.players).filter(idx => action.players[idx]);
            const nameIdxMap = {};
            Object.keys(action.players).forEach((p, idx) => {
                nameIdxMap[p] = idx
            });
            const newTable = getNewTable(players, nameIdxMap, tableId, gameId, roundId);
            return state.set("tables", getTables(state).push(newTable));
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
            const players = List(action.playersData.map(p => p.playerName));
            // const tables = action.tablesData
            //     .filter(t => t.players && t.players.players && t.players.players.length > 0)
            //     .filter(t => t.tableTotalScore && t.tableTotalScore.playerNames && t.tableTotalScore.playerNames.length > 0)
            //     .map(t => {
            //         const totalGames = t.games.length;
            //         let table = {};
            //         table.players = t.players.players;
            //         const nameIdxMap = {};
            //         t.players.players.forEach((p, idx) => {
            //             nameIdxMap[p] = idx;
            //         });
            //         table.totalScore = t.players.players.map((p) => t.tableTotalScore.scores[t.tableTotalScore.playerNames.indexOf(p)]);
            //         table.running = t.table.running;
            //         table.nameIdxMap = nameIdxMap;
            //         table.rounds = Array(totalGames).fill(0).map((p, idx) => {
            //             let gameSeq = idx + 1;
            //             const game = t.games.filter(g => g.gameSequence = gameSeq)[0];
            //             return {
            //                 bet: game.bidAmount,
            //                 fixed: !game.running,
            //                 playerStatus: table.players.map(p => {
            //                     return {
            //                         name: p,
            //                         action: 'playing'
            //                     }
            //                 })
            //             }
            //         });
            //         let totalScore = Array(t.tableTotalScore.playerNames.length).fill(0);
            //         t.tableTotalScore.playerNames.forEach((p, idx) => {
            //             totalScore[idx] = t.tableTotalScore.scores[nameIdxMap[p]];
            //         });
            //         table.totalScore = totalScore;
            //         table.selectedGameNumber = 1;
            //         table.pageNumber = 1;
            //         return table;
            //     });
            // console.log(tables);
            return Map({
                names: players,
                // selectGameNumber: 1,
                pageNumber: 1,
                tables: List()
            });
        }
        default:
            return state;
    }
}