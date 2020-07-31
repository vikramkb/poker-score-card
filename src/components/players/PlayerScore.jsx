import React from "react";
import SimpleAppBar from "../common/AppBar.jsx";
import {connect} from "react-redux";
import Players from "./Players.jsx";
import axios from "axios";
import config from "../common/configuration";
import {fetchPlayersSuccessful, fetchPlayerScoreSuccessful} from "../../action/ScoreAction";
import SimpleTable from "../common/SimpleTable.jsx";

export class NewTablePage extends React.Component {
    componentDidMount() {
        axios.get(`${config[config.env].apiBasePath}/player/score`)
            .then(playerScoreResult => {
                this.props.dispatch(fetchPlayerScoreSuccessful(playerScoreResult.data));
            })
    }

    render() {
        return (
            <div>
                <SimpleAppBar showAllTables={() => {this.props.history.push("/all-tables")}} onCreateTableFn={() => this.props.history.push("/create-table")} showPlayerScore={()=>this.props.history.push("/player-score")}/>
                {
                    !this.props.playerScores || this.props.playerScores.size === 0 ? '' :
                        Object.keys(this.props.playerScores.toJS()).map(date => {
                            const namesMap = this.props.playerScores.toJS();
                            return (
                                <div>
                                    <span>{date}</span>
                                    <SimpleTable names={Object.keys(namesMap[date])} values={Object.keys(namesMap[date]).map(k => namesMap[date][k])}/>
                                </div>
                            )
                        })
                }
            </div>
        )
    }

}

const mapStateToProps = state => ({
    playerScores: state.score.get("playerScores")
});

export default connect(mapStateToProps)(NewTablePage);