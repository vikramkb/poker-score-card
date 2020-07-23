import React from "react";
import SimpleAppBar from "../common/AppBar.jsx";
import {connect} from "react-redux";
import Players from "./Players.jsx";
import axios from "axios";
import config from "../common/configuration";
import {fetchPlayersSuccessful} from "../../action/ScoreAction";

export class NewTablePage extends React.Component {
    componentDidMount() {
        axios.get(`${config[config.env].apiBasePath}/players`)
            .then(playerResult => {
                this.props.dispatch(fetchPlayersSuccessful(playerResult.data));
            })
    }

    render() {
        return (
            <div>
                <SimpleAppBar showAllTables={() => {
                    this.props.history.push("/all-tables")
                }} onCreateTableFn={() => this.props.history.push("/create-table")}/>
                {
                    !this.props.names || this.props.names.size === 0 ? '' :
                        <Players playerNames={this.props.names} dispatch={this.props.dispatch} history={this.props.history}/>
                }
            </div>
        )
    }

}

const mapStateToProps = state => ({
    names: state.score.get("names")
});

export default connect(mapStateToProps)(NewTablePage);