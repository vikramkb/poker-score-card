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
    const r = this.props.games[this.props.selectGameNumber-1];
    return (
        <div>
            <SimpleAppBar showAllTables={()=> {this.showAllTables(this.props.history)}} onCreateTableFn={() => this.props.history.push("/create-table")}/>
            <Game rounds = {r.rounds} winner = {r.winner} running = {r.running} tableNumber={this.props.tableNumber} gameNumber = {this.props.selectGameNumber-1} dispatch={this.props.dispatch} page={this.props.selectGameNumber} count={this.props.games.length} onChangeFn={(gameNumber)=> {
                this.props.dispatch(selectGameNumber(gameNumber))
            }}/>
            <ScoreTable
                title="Table Total Score" names={this.props.names}
                totalScore={this.props.totalScore}
                scoreCard={this.props.scoreCard}
                pageNumber={this.props.pageNumber}
                games={this.props.games}
            />
            <GameScore
                title="Table Total Score" names={this.props.names}
                totalScore={this.props.totalScore}
                scoreCard={this.props.scoreCard}
                pageNumber={this.props.pageNumber}
                games={this.props.games}
            />
        </div>
    )
  }
}

const mapStateToProps = state => ({
  score: state.score,
  tables: state.score.tables,
  scoreCard: state.score.tables[state.score.tables.length-1].scoreCard,
  totalScore: state.score.tables[state.score.tables.length-1].totalScore,
  nameIdxMap: state.score.nameIdxMap,
  games: state.score.tables[state.score.tables.length-1].games,
  names: state.score.names,
  tableNumber: state.score.tables.length-1,
  pageNumber: state.score.tables[state.score.tables.length-1].pageNumber,
  selectGameNumber: state.score.selectGameNumber ? state.score.selectGameNumber : 1
});

export default connect(mapStateToProps)(Home);