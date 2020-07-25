import React from 'react';
import {connect} from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './Game.jsx';
import {createNewTable, endTable, selectScoreCard, selectGameNumber} from '../../action/ScoreAction';
import SimpleAppBar from '../common/AppBar.jsx';
import ScoreTable from '../table/ScoreTable.jsx';
import GameScore from './GameScore.jsx';

export class Home extends React.Component {
  render() {
       console.log("Home", this.props.score.toJS());
      const score = this.props.score;
      if(!score.get("tables") || score.get("tables").size === 0){
          return (<SimpleAppBar showAllTables={()=> {this.props.history.push("/all-tables")}} onCreateTableFn={() => this.props.history.push("/create-table")}/>);
      }
      const tables = score.get("tables");
      const tableNumber = score.get("tables").size-1;
      const table = tables.get(tableNumber);
      const tableId = table.get("tableId");
      const gameScores = table.get("gameScores");
      const totalScore = table.get("totalScore");
      const nameIdxMap = score.get("nameIdxMap");
      const games = table.get("games");
      const names = table.get("players");
      const pageNumber = table.get("pageNumber");
      const selectedGameNumber = table.get("selectedGameNumber") ? table.get("selectedGameNumber") : 1;

    const r = games.get(selectedGameNumber-1);
    return (
        <div>
            <SimpleAppBar showAllTables={()=> {this.props.history.push("/all-tables")}} onCreateTableFn={() => this.props.history.push("/create-table")}  showPlayerScore={()=>this.props.history.push("/player-score")}/>
            <Game
                isTableClosed = {table.get("closed")}
                rounds = {r.get("rounds")}
                winner = {r.get("winner")}
                tablePlayers = {table.get("players")}
                running = {r.get("running")}
                tableRunning = {table.get("running")}
                tableNumber={tableNumber}
                tableId={tableId}
                gameId={r.get("gameId")}
                gameNumber = {selectedGameNumber-1}
                dispatch={this.props.dispatch}
                page={selectedGameNumber}
                count={games.size}
                onChangeFn={(selectedGameNumber)=> {
                this.props.dispatch(selectGameNumber(tableNumber, selectedGameNumber))
            }}/>
            <ScoreTable
                title="Table Total Score"
                names={names}
                totalScore={totalScore}
                scoreCard={gameScores}
                pageNumber={pageNumber}
                games={games}
                dispatch={this.props.dispatch}
                history={this.props.history}
            />
            <GameScore
                title="Table Total Score"
                names={names}
                totalScore={totalScore}
                gameScores={gameScores}
                pageNumber={pageNumber}
                games={games}
                dispatch={this.props.dispatch}
                history={this.props.history}
                tableNumber={tableNumber}
                count={gameScores.size}
            />
        </div>
    )
  }
}

const mapStateToProps = state => ({
  score: state.score,
  // tables: state.score.tables,
  // scoreCard: state.score.tables[state.score.tables.length-1].scoreCard,
  // totalScore: state.score.tables[state.score.tables.length-1].totalScore,
  // nameIdxMap: state.score.nameIdxMap,
  // games: state.score.tables[state.score.tables.length-1].games,
  // names: state.score.tables[state.score.tables.length-1].players,
  // tableNumber: state.score.tables.length-1,
  // pageNumber: state.score.tables[state.score.tables.length-1].pageNumber,
  // selectGameNumber: state.score.selectGameNumber ? state.score.selectGameNumber : 1
});

export default connect(mapStateToProps)(Home);