import Typography from "@material-ui/core/Typography";
import SimpleTable from "../common/SimpleTable.jsx";
import {setTableNumber} from "../../action/ScoreAction";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

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
    const classes = useStyles();
    console.log("ScoreTable props", props);
    return (
        <Card className={classes.root} variant="root">
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Table Total Score
                </Typography>
                <Typography variant="h5" gutterBottom display={"inline"}>
                    Table Name : {props.tableName}
                </Typography>
                <Typography variant="h5" gutterBottom display={"inline"}>
                    {props.isRealGame ? `Is Real Game? : ${props.isRealGame}` : ''}
                </Typography>
                <Typography variant="h5" gutterBottom display={"inline"}>
                    {props.isCompleted ? `Is Game Completed? : ${props.isCompleted}` : ''}
                </Typography>
                <SimpleTable names={props.names} values={props.totalScore}/>
            </CardContent>
            <CardActions>
                {
                    props.navigateToPlayPage ?
                        <Button variant="contained" color="primary" onClick={()=>{
                            props.dispatch(setTableNumber(props.tableNumber));
                            props.history.push("/home");
                        }}>
                            Playing Page
                        </Button> : ''
                }
            </CardActions>
        </Card>
    )

}