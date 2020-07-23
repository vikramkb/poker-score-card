import React from 'react';
import {createNewTable} from "../../action/ScoreAction";
import SimpleAppBar from "../common/AppBar.jsx";
import {connect} from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import {makeStyles} from "@material-ui/core/styles";
import {fetchTablesSuccessful} from '../../action/ScoreAction';
import config from "../common/configuration";
import axios from 'axios';

import AllTableScore from "./AllTableScore.jsx";

export class AllTables extends React.Component {
    componentDidMount() {
        axios.get(`${config[config.env].apiBasePath}/full-tables`)
        .then(tableResult => {
            this.props.dispatch(fetchTablesSuccessful(tableResult.data));
        });
    }

    render() {
        const score = this.props.score;
        if(!score.tables || score.tables.length === 0){
            return (<SimpleAppBar showAllTables={()=> {this.props.history.push("/all-tables")}} onCreateTableFn={() => this.props.history.push("/create-table")}/>);
        }
        const tables = score.tables;
        // const tableNumber = score.tables.length-1;
        // const table = tables[tableNumber];
        // const scoreCard = table.scoreCard;
        // const totalScore = table.totalScore;
        // const nameIdxMap = score.nameIdxMap;
        // const games = table.games;
        const names = score.names;
        // const pageNumber = table.pageNumber;
        // const selectGameNumber = score.selectGameNumber ? score.selectGameNumber : 1;

        return (
            <div>
                <SimpleAppBar showAllTables={() => this.props.history.push("/all-tables")} onCreateTableFn={() => this.props.history.push("/create-table")}/>
                <AllTableScore
                    tables={tables}
                    names={names}
                    dispatch={this.props.dispatch}
                    history={this.props.history}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    score: state.score
});

export default connect(mapStateToProps)(AllTables);