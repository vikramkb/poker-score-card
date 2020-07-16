import React from "react";
import SimpleAppBar from "./AppBar.jsx";
import {connect} from "react-redux";
import Players from "./Players.jsx";

export class NewTablePage extends React.Component {
    render() {
        return (
            <div>
                <SimpleAppBar showAllTables={()=> {this.showAllTables(this.props.history)}} onCreateTableFn={() => this.props.history.push("/create-table")}/>
                <Players playerNames={this.props.names} dispatch={this.props.dispatch} history={this.props.history}/>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    names: state.score.names
});

export default connect(mapStateToProps)(NewTablePage);