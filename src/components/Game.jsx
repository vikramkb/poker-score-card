import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import {playRound, foldRound, fixBet, endTable, submitWinner, selectGameNumber, setTableNumber} from "../action/ScoreAction";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import AlertDialog from './AlertDialog.jsx';
import Round from './Round.jsx';
import Paper from "@material-ui/core/Paper";
import BasicPagination from "./BasicPagination.jsx";


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
    spacing: {
        marginRight: 20,
        marginLeft: 5,
        fontSize: "1.2em",
        fontWeight: "bold"
    }
});
export default function Game(props) {
    const rounds = props.rounds;
    const tableNumber = props.tableNumber;
    const gameNumber = props.gameNumber;
    const dispatch = props.dispatch;
    const winner = props.winner;
    const running = props.running;
    const classes = useStyles();
    const [finalWinner, setFinalWinner] = React.useState('');


    function handleWinnerSubmit() {
        dispatch(submitWinner(tableNumber, gameNumber, finalWinner));
    }

    function finalRoundPlayer(gameNumber, players) {
        function handleChange(event) {
            if (event.target.checked) {
                setFinalWinner(event.target.name);
            }
        }

        return (
            <FormControl component="fieldset">
                {/*<FormLabel component="legend">Decide Winner</FormLabel>*/}
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                    {
                        players.map(p => {
                            return (<FormControlLabel
                                value={p.name}
                                control={<Radio color="primary" value={p.name} name={p.name} onChange={handleChange}/>}
                                label={<Typography variant="h6" component="h6" display="inline">{p.name}</Typography>}
                                key={p.name}
                                labelPlacement="start"
                            />)
                        })
                    }
                </RadioGroup>
            </FormControl>
        )
    }

    function roundDetails(idx, round) {
        return <Round round={round} tableNumber={tableNumber} gameNumber={gameNumber} roundNumber={idx}
                      dispatch={dispatch}/>
    }

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography variant="h6" component="h2" display="inline" className={classes.spacing}>
                    {`Table Number : ${tableNumber + 1}`}
                </Typography>
                <Typography variant="h6" component="h2" display="inline" className={classes.spacing}>
                    {`Game Number : ${gameNumber + 1}`}
                </Typography>
                <Typography variant="h6" component="h2" display="inline" className={classes.spacing}>
                    {`${!running && winner ? `Winner: ${winner}` : "Status: Running"}`}
                </Typography>
                {/*<Typography variant="h6" component="h2">*/}
                {/*    {!running && winner ? `Winner: ${winner}` : "Running"}*/}
                {/*</Typography>*/}
                <br></br>
                {
                    rounds.map((r, idx) => roundDetails(idx, r))
                }
                {
                    rounds.length === 3 && !winner && !running ?
                        <div>
                            <Typography className={classes.title} color="textPrimary">
                                Choose Winner
                            </Typography>
                            {finalRoundPlayer(gameNumber, rounds[2].playerStatus.filter(p => p.action === 'playing'))}
                            <AlertDialog disableButton={!finalWinner} submitFn={handleWinnerSubmit}
                                         title={`Submit Winner : ${finalWinner}`}/>
                        </div>
                        : ''
                }
            </CardContent>
            <CardActions>
                <BasicPagination page={props.page} count={props.count} onChangeFn={props.onChangeFn}/>
                {
                    props.tableRunning ?
                    <Button variant="contained" color="primary" onClick={() => {
                        props.dispatch(endTable(props.tableNumber))
                    }}>
                        Close Table
                    </Button>
                        : ''
                }
            </CardActions>
        </Card>
    );
}
