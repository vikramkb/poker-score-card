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
                    props.tables.map((t,idx) => {
                        return (<ScoreTable
                            title="Table Total Score"
                            names={t.players}
                            totalScore={t.totalScore}
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