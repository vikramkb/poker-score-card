import React from 'react';
import {connect} from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './Game.jsx';
import {createNewTable, endTable, selectScoreCard, selectGameNumber} from '../action/ScoreAction';
import SimpleAppBar from './AppBar.jsx';
import ScoreTable from './ScoreTable.jsx';
import GameScore from './GameScore.jsx';

export class Home extends React.Component {
   showAllTables(history) {
        history.push("all-tables");
  }
  render() {
       console.log("Home", this.props);
      const score = this.props.score;
      if(!score.tables || score.tables.length === 0){
          return (<SimpleAppBar showAllTables={()=> {this.showAllTables(this.props.history)}} onCreateTableFn={() => this.props.history.push("/create-table")}/>);
      }
      const tables = score.tables;
      const tableNumber = score.tables.length-1;
      const table = tables[tableNumber];
      const scoreCard = table.scoreCard;
      const totalScore = table.totalScore;
      const nameIdxMap = score.nameIdxMap;
      const games = table.games;
      const names = table.players;
      const pageNumber = table.pageNumber;
      const selectGameNumber = score.selectGameNumber ? score.selectGameNumber : 1;

    const r = games[selectGameNumber-1];
    return (
        <div>
            <SimpleAppBar showAllTables={()=> {this.showAllTables(this.props.history)}} onCreateTableFn={() => this.props.history.push("/create-table")}/>
            <Game
                rounds = {r.rounds}
                winner = {r.winner}
                running = {r.running}
                tableNumber={tableNumber}
                gameNumber = {selectGameNumber-1}
                dispatch={this.props.dispatch}
                page={selectGameNumber}
                count={games.length}
                onChangeFn={(gameNumber)=> {
                this.props.dispatch(selectGameNumber(gameNumber))
            }}/>
            <ScoreTable
                title="Table Total Score"
                names={names}
                totalScore={totalScore}
                scoreCard={scoreCard}
                pageNumber={pageNumber}
                games={games}
            />
            <GameScore
                title="Table Total Score"
                names={names}
                totalScore={totalScore}
                scoreCard={scoreCard}
                pageNumber={pageNumber}
                games={games}
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