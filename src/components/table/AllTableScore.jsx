import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import SimpleAppBar from "../common/AppBar.jsx";
import {createNewTable} from "../../action/ScoreAction";
import CardActions from "@material-ui/core/CardActions";
import React from "react";
import ScoreTable from "./ScoreTable.jsx";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        padding: "1em",
        margin: "2em"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
export default function AllTableScore(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                {
                    props.tables.filter(t =>  t.get("tablePlayerTotalScore").get("playerNames").size > 0).map((t,idx) => {
                        console.log("vikram", t.toJS());
                        const players = t.get("tablePlayerTotalScore").get("playerNames");
                        const scores = t.get("tablePlayerTotalScore").get("scores");
                        const table = t.get("table");
                        return (<ScoreTable
                            title="Table Total Score"
                            isRealGame={table.get("realGame")}
                            isCompleted={table.get("isRunning")}
                            tableName={table.get("tableName")}
                            names={players}
                            totalScore={scores}
                            dispatch={props.dispatch}
                            history={props.history}
                            tableNumber={idx+1}
                            navigateToPlayPage={true}
                        />)
                    })
                }
            </CardContent>
            <CardActions>
                {/*<BasicPagination page={props.page} count={props.count} onChangeFn={props.onChangeFn}/>*/}
            </CardActions>
        </Card>
    )
}