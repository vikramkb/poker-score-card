import React from 'react';
import {connect} from 'react-redux';
import MaterialTableDemo from './Table.jsx';
import Rounds from './Rounds.jsx';
import Button from "@material-ui/core/Button";
import SimpleTable from './SimpleTable.jsx';

export class Home extends React.Component {
  onClickEndGame() {

  }
  render() {
    return (
        <div>
            <Button variant="contained" color="primary">
                Create New Game
            </Button>
            <Button variant="contained" color="primary" onClick={this.onClickEndGame}>
                End Game
            </Button>
            {this.props.games.map((r, idx) => <Rounds rounds = {r.rounds} winner = {r.winner} running = {r.running} gameNumber = {idx} dispatch={this.props.dispatch}/>)}
          {/*<MaterialTableDemo score={this.props.score} scoreCard={this.props.scoreCard} nameIdxMap={this.props.nameIdxMap} dispatch={this.props.dispatch}/>*/}
            <SimpleTable names={this.props.names} values={this.props.totalScore}/>
            {this.props.scoreCard.map(s => <SimpleTable names={this.props.names} values={s}/>)}
        </div>
    )
  }
}

const mapStateToProps = state => ({
  score: state.score,
  scoreCard: state.score.scoreCard,
  totalScore: state.score.totalScore,
  nameIdxMap: state.score.nameIdxMap,
  games: state.score.games,
  names: state.score.names
});

export default connect(mapStateToProps)(Home);