import React from 'react';
import {createNewTable} from "../action/ScoreAction";
import SimpleAppBar from "./AppBar.jsx";
import {connect} from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import {makeStyles} from "@material-ui/core/styles";
import AllTableScore from "./AllTableScore.jsx";

export class AllTables extends React.Component {
    render() {
        return (
            <div>
                <SimpleAppBar showAllTables={()=> {this.showAllTables(this.props.history)}} onCreateTableFn={() => this.props.history.push("/")}/>
                <AllTableScore tables={this.props.tables} names={this.props.names} dispatch={this.props.dispatch} history={this.props.history}/>
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

export default connect(mapStateToProps)(AllTables);