import Typography from "@material-ui/core/Typography";
import SimpleTable from "./SimpleTable.jsx";
import {selectScoreCard} from "../action/ScoreAction";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

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

export default function ScoreTable(props) {
    console.log("Score Table", props);
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="root">
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    All Games Score Table
                </Typography>
                {props.scoreCard.size > 0 ? <SimpleTable names={props.names}
                                                           values={props.scoreCard.get(props.pageNumber && props.pageNumber - 1 >= 0 ? props.pageNumber - 1 : 0)}
                                                           count={props.games.filter(g => !g.running).length} onChangeFn={(pageNumber) => {

                    props.dispatch(selectScoreCard(props.tableNumber, pageNumber))
                }}/> : ''}
            </CardContent>
        </Card>
    )

}