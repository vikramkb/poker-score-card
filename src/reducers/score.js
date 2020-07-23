import {
    ADD_NEW_GAME,
    ADD_NEW_ROUND,
    CREATE_NEW_TABLE,
    END_TABLE,
    FETCH_PLAYERS_SUCCESSFUL,
    FETCH_TABLES_SUCCESSFUL,
    FIX_BET,
    FOLD_ROUND,
    PLAY_ROUND,
    SELECT_GAME_NUMBER,
    SELECT_SCORE_CARD,
    SET_TABLE_NUMBER,
    SUBMIT_WINNER
} from "../action/ScoreAction";
import axios from 'axios';
import config from "../components/common/configuration";


const {Map, List, fromJS} = require('immutable');


const firstRoundBet = 10;
const defaultState = Map({
    names: List(),
    tables: List(),
    allTables: List()
});

function getUpdatedScore(game, totalScore) {
    let newTotalScore = totalScore;
    let newScoreCard = Map();
    const tableAmount = game.get("rounds").map(r => {
        r.get("playerStatus").filter(p => p.get("action") === 'playing').forEach(p => {
            if (!newTotalScore.get(p.get('name'))) {
                newTotalScore = newTotalScore.set(p.get('name'), 0);
            }
            if (!newScoreCard.get(p.get('name'))) {
                newScoreCard = newScoreCard.set(p.get('name'), 0);
            }
            newTotalScore = newTotalScore.set(p.get('name'), newTotalScore.get(p.get('name')) - r.get('bet'));
            newScoreCard = newScoreCard.set(p.get('name'), newScoreCard.get(p.get('name')) - r.get('bet'));
        });
        return r.get("playerStatus").filter(p => p.get("action") === 'playing').size * r.get("bet");
    }).reduce((accumulator, currentValue) => accumulator + currentValue);
    newTotalScore = newTotalScore.set(game.get("winner"), newTotalScore.get(game.get("winner")) + tableAmount);
    newScoreCard = newScoreCard.set(game.get("winner"), newScoreCard.get(game.get("winner")) + tableAmount);
    return Map({
        newTotalScore,
        newScoreCard
    });
}

function getNewTable(players, nameIdxMap, tableId, gameId, roundId) {
    return Map({
        games: List([getNewGame(players, gameId, roundId)]),
        gameScores: List(),
        totalScore: Map(),
        running: true,
        players: List(players),
        nameIdxMap: Map(nameIdxMap),
        selectedGameNumber: 1,
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
    const tableNumber = action.tableNumber;
    const gameNumber = action.gameNumber;
    const roundNumber = action.roundNumber;
    const playerIdx = action.playerIdx;
    const newRound = getRound(state, tableNumber, gameNumber, roundNumber).set("playerStatus",
        getPlayerStatuses(state, tableNumber, gameNumber, roundNumber)
            .set(playerIdx,
                getPlayer(state, tableNumber, gameNumber, roundNumber, playerIdx).set("action", foldOrPlaying)));

    let newState = state.set("tables", getTables(state)
        .set(tableNumber,
            getTable(state, tableNumber).set("games", getGames(state, tableNumber).set(gameNumber,
                getGame(state, tableNumber, gameNumber)
                    .set("rounds", getRounds(state, tableNumber, gameNumber)
                        .set(roundNumber, newRound)
                    )))));
    return newState;
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
    const lastRoundNumber = game.get("rounds").size - 1;
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
    if (playingPlayers.size !== 1 && rounds.size !== 3) {
        return creatAndAddNewRound(newState, tableNumber, gameNumber);
    }
    if (playingPlayers.size === 1) {
        action.winner = playingPlayers.get(0).get("name");
        action.tableId = getTable(newState, tableNumber).get("tableId");
        action.gameId = getGame(newState, tableNumber, gameNumber).get("gameId");
        return submitWinner(newState, action);
    }

    return newState;
}

function submitWinner(state, action) {
    let tableNumber = action.tableNumber;
    let gameNumber = action.gameNumber;
    const updatedGame = getGame(state, tableNumber, gameNumber)
        .set("winner", action.winner)
        .set("running", false);
    let table = getTable(state, tableNumber);
    const score = getUpdatedScore(updatedGame, table.get("totalScore"));
    const updatedTable = table
        .set("totalScore", score.get("newTotalScore"))
        .set("gameScores", table.get("gameScores").push(score.get("newScoreCard")));
    const newState = state.set("tables", getTables(state)
        .set(tableNumber, updatedTable.set("games",
            getGames(state, tableNumber).set(gameNumber,
                updatedGame))));

    let playerNames = [];
    let scores = [];
    Object.keys(score.get("newTotalScore").toJS()).forEach(playerName => {
        playerNames.push(playerName);
        scores.push(score.get("newScoreCard").get(playerName));
    });
    axios.post(`${config[config.env].apiBasePath}/table/game/scores`, {
        "gameId": action.gameId,
        "tableId": action.tableId,
        "playerNames": playerNames,
        "scores": scores
    }).then(result => {
        console.log("table game scores saving is successful in database")
    }).catch(result => {
        console.log("table game scores saving is failed in database")
    });

    playerNames = [];
    scores = [];
    Object.keys(score.get("newScoreCard").toJS()).forEach(playerName => {
        playerNames.push(playerName);
        scores.push(score.get("newTotalScore").get(playerName));
    });
    axios.post(`${config[config.env].apiBasePath}/table/player/scores`, {
        "tableId": action.tableId,
        "playerNames": playerNames,
        "scores": scores
    }).then(result => {
        console.log("table total scores saving is successful in database")
    }).catch(result => {
        console.log("table total scores saving is failed in database")
    });

    console.log("Submit score : ", newState.toJS());
    return newState;
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
            const gameId = action.gameId;
            const roundId = action.roundId;
            const newGame = getNewGame(table.get("players"), gameId, roundId);
            // const updatedTable = getTable(state, tableNumber).set("selectedGameNumber", getGames(state, tableNumber).size)
            const newState = state.set("tables", getTables(state)
                .set(tableNumber,
                    getTable(state, tableNumber).set("games", getGames(state, tableNumber).push(newGame))));
            return state.set("tables", getTables(newState)
                .set(tableNumber, getTable(newState, tableNumber).set("selectedGameNumber", getGames(newState, tableNumber).size)));
        }
        case ADD_NEW_ROUND: {
        }
        case END_TABLE: {
            const table = getTable(state, action.tableNumber)
                .set("running", false).set("closed", true);
            return state.set("tables", getTables(state)
                .set(action.tableNumber, table));
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
            const updatedTable = getTable(state, action.tableNumber).set("pageNumber", action.pageNumber);
            return state.set("tables", getTables(state)
                .set(action.tableNumber, updatedTable));
        }
        case SELECT_GAME_NUMBER: {
            const updatedTable = getTable(state, action.tableNumber).set("selectedGameNumber", action.selectedGameNumber);
            return state.set("tables", getTables(state)
                .set(action.tableNumber, updatedTable));
        }
        case SET_TABLE_NUMBER: {
            return {
                ...state,
                tableNumber: action.tableNumber
            }
        }
        case FETCH_TABLES_SUCCESSFUL: {
            let tables = action.tablesData;
            let allTables = state.set("allTables", fromJS(tables));
            console.log("FETCH_TABLES_SUCCESSFUL", allTables.toJS());
            return allTables;
            // tables.map(t => {
            //     const tableId = t.table.tableId;
            //     const gameId = t.games.length-1;
            //     const roundId =
            //
            // });
            //
            // const roundId = action.roundId;
            // const players = Object.keys(action.players).filter(idx => action.players[idx]);
            // const nameIdxMap = {};
            // Object.keys(action.players).forEach((p, idx) => {
            //     nameIdxMap[p] = idx
            // });
            // const newTable = getNewTable(players, nameIdxMap, tableId, gameId, roundId);


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
                // names: players,
                // selectGameNumber: 1,
                // pageNumber: 1,
                tables: List()
            });
        }
        case FETCH_PLAYERS_SUCCESSFUL: {
            const players = List(action.playersData.map(p => p.playerName));
            return state.set("names", players);
        }
        default:
            return state;
    }
}