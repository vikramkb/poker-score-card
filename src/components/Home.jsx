import React from 'react';
import {connect} from 'react-redux';
import MaterialTableDemo from './Table.jsx';
import Rounds from './Rounds.jsx';
import Button from "@material-ui/core/Button";
import SimpleTable from './SimpleTable.jsx';
import {createNewTable, endTable, selectScoreCard} from '../action/ScoreAction';
import BasicPagination from './BasicPagination.jsx';
import SimpleAppBar from './AppBar.jsx';

export class Home extends React.Component {
  render() {
      console.log("Home Props : ", this.props.totalScore);
    return (
        <div>
            <SimpleAppBar onCreateTableFn={() => this.props.dispatch(createNewTable())} onEndTableFn={() => this.props.dispatch(endTable(this.props.tableNumber))}/>
            {/*<Button variant="contained" color="primary" onClick={() => this.props.dispatch(createNewTable())}>*/}
            {/*    Create New Table*/}
            {/*</Button>*/}
            {/*<Button variant="contained" color="primary" onClick={() => this.props.dispatch(endTable(this.props.tableNumber))}>*/}
            {/*    Close Table*/}
            {/*</Button>*/}
            {this.props.games.map((r, idx) => <Rounds rounds = {r.rounds} winner = {r.winner} running = {r.running} tableNumber={this.props.tableNumber} gameNumber = {idx} dispatch={this.props.dispatch}/>)}
            <SimpleTable names={this.props.names} values={this.props.totalScore}/>
            {this.props.scoreCard.length > 0 ? <SimpleTable names={this.props.names} values={this.props.scoreCard[this.props.pageNumber && this.props.pageNumber-1 >= 0 ? this.props.pageNumber-1 : 0]}/> : ''}
            <BasicPagination count={this.props.games.length-1} onChangeFn={(pageNumber)=> {
                this.props.dispatch(selectScoreCard(this.props.tableNumber, pageNumber))
            }}/>
        </div>
    )
  }
}

const mapStateToProps = state => ({
  score: state.score,
  scoreCard: state.score.tables[state.score.tables.length-1].scoreCard,
  totalScore: state.score.tables[state.score.tables.length-1].totalScore,
  nameIdxMap: state.score.nameIdxMap,
  games: state.score.tables[state.score.tables.length-1].games,
  names: state.score.names,
  tableNumber: state.score.tables.length-1,
  pageNumber: state.score.tables[state.score.tables.length-1].pageNumber
});

export default connect(mapStateToProps)(Home);