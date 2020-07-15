import React from 'react';
import {connect} from 'react-redux';
import MaterialTableDemo from './Table.jsx';
import Rounds from './Rounds.jsx';
import Button from "@material-ui/core/Button";
import SimpleTable from './SimpleTable.jsx';
import {createNewTable, endTable, selectScoreCard, selectGameNumber} from '../action/ScoreAction';
import BasicPagination from './BasicPagination.jsx';
import SimpleAppBar from './AppBar.jsx';

export class Home extends React.Component {
  render() {
    const r = this.props.games[this.props.selectGameNumber-1];
    return (
        <div>
            <SimpleAppBar onCreateTableFn={() => this.props.dispatch(createNewTable())} onEndTableFn={() => this.props.dispatch(endTable(this.props.tableNumber))}/>
            <Rounds rounds = {r.rounds} winner = {r.winner} running = {r.running} tableNumber={this.props.tableNumber} gameNumber = {this.props.selectGameNumber-1} dispatch={this.props.dispatch} page={this.props.selectGameNumber} count={this.props.games.length} onChangeFn={(gameNumber)=> {
                this.props.dispatch(selectGameNumber(gameNumber))
            }}/>
            <SimpleTable names={this.props.names} values={this.props.totalScore}/>
            {this.props.scoreCard.length > 0 ? <SimpleTable names={this.props.names} values={this.props.scoreCard[this.props.pageNumber && this.props.pageNumber-1 >= 0 ? this.props.pageNumber-1 : 0]} count={this.props.games.length-1} onChangeFn={(pageNumber)=> {
                this.props.dispatch(selectScoreCard(this.props.tableNumber, pageNumber))
            }}/> : ''}
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