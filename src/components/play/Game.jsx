import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import {
    playRound,
    foldRound,
    fixBet,
    endTable,
    submitWinner,
    selectGameNumber,
    setTableNumber,
    addNewGame,
    addNewRound, createNewTable
} from "../../action/ScoreAction";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import AlertDialog from './AlertDialog.jsx';
import Round from './Round.jsx';
import Paper from "@material-ui/core/Paper";
import BasicPagination from "../common/BasicPagination.jsx";
import axios from "axios";
import config from "../common/configuration";


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
    const tablePlayers = props.tablePlayers;
    const tableId = props.tableId;
    const
        gameId = props.gameId;
    const gameNumber = props.gameNumber;
    const dispatch = props.dispatch;
    const winner = props.winner;
    const running = props.running;
    const classes = useStyles();
    const [finalWinner, setFinalWinner] = React.useState('');


    function handleWinnerSubmit() {
        axios.post(`${config[config.env].apiBasePath}/table/game/status`, {
            "tableId": tableId,
            "gameId": gameId,
            "winnerName": finalWinner,
            "isRunning": false
        }).then(result => {
            dispatch(submitWinner(tableNumber, gameNumber, finalWinner, tableId, gameId));
        });

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
                                value={p.get("name")}
                                control={<Radio color="primary" value={p.get("name")} name={p.get("name")}
                                                onChange={handleChange}/>}
                                label={<Typography variant="h6" component="h6"
                                                   display="inline">{p.get("name")}</Typography>}
                                key={p.get("name")}
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
                      tableId={tableId}
                      gameId={gameId}
                      dispatch={dispatch}
                      isTableClosed={props.isTableClosed}
        />
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
                    rounds.size === 3 && !winner && !running && !props.isTableClosed ?
                        <div>
                            <Typography className={classes.title} color="textPrimary">
                                Choose Winner
                            </Typography>
                            {finalRoundPlayer(gameNumber, rounds.get(2).get("playerStatus").filter(p => p.get("action") === 'playing'))}
                            <AlertDialog disableButton={!finalWinner} submitFn={handleWinnerSubmit}
                                         title={`Submit Winner : ${finalWinner}`}/>
                        </div>
                        : ''
                }
            </CardContent>
            <CardActions>
                <BasicPagination page={props.page} count={props.count} onChangeFn={props.onChangeFn}/>
                {
                    !running && winner && !props.isTableClosed ?
                        <Button variant="contained" color="primary" onClick={() => {
                            axios.post(`${config[config.env].apiBasePath}/table/game`, {
                                "tableId": tableId,
                                "gameSequence": props.page+1,
                                "isRunning": true
                            }).then(gameResult => {
                                axios.post(`${config[config.env].apiBasePath}/table/game/round`, {
                                    "tableId": tableId,
                                    "gameId": gameResult.data,
                                    "roundSequence": 1,
                                    "playerNames": tablePlayers.toJS(),
                                    "bidAmount": 10
                                }).then(roundResult => {
                                    props.dispatch(addNewGame(props.tableNumber, gameResult.data));
                                });
                            });
                        }}>
                            Add New Game
                        </Button> : ''
                }
                {
                    props.tableRunning ?
                        <Button variant="contained" color="primary" onClick={() => {
                            axios.post(`${config[config.env].apiBasePath}/table/status`, {
                                "tableId": tableId,
                                "isRunning": false
                            }).then(result => {
                                props.dispatch(endTable(props.tableNumber))
                            });

                        }}>
                            Close Table
                        </Button>
                        : ''
                }
            </CardActions>
        </Card>
    );
}
