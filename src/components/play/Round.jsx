import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import {playRound, foldRound, fixBet} from "../../action/ScoreAction";
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import config from "../common/configuration";
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        padding: theme.spacing(0, 3),
    },
    paper: {
        margin: `${theme.spacing(0.5)}px auto`,
        padding: theme.spacing(0.5),
    },
}));
export default function Round(props) {
    const classes = useStyles();
    const round = props.round;
    const tableId=props.tableId;
    const gameId=props.gameId;
    const tableNumber = props.tableNumber;
    const roundNumber = props.roundNumber;
    const gameNumber = props.gameNumber;
    const dispatch = props.dispatch;
    const [bet, setBet] = React.useState(props.round.get("bet"));


    function player(playerIdx, roundNumber, player, fixed) {
        const handleChange = (event) => {
            if (event.target.checked) {
                dispatch(playRound(tableNumber, gameNumber, roundNumber, playerIdx, event.target.name));
            } else {
                dispatch(foldRound(tableNumber, gameNumber, roundNumber, playerIdx, event.target.name));
            }
        };

        return (
            <FormControlLabel
                control={
                    <span>
                        <Typography variant="h6" component="h6" display="inline">
                            {player.get("name")}
                        </Typography>

                        <Switch
                        checked={player.get("action") === 'playing'}
                        onChange={handleChange}
                        color="primary"
                        name={player}
                        disabled={fixed || props.isTableClosed}
                        inputProps={{'aria-label': 'primary checkbox'}}
                        />
                        |
                    </span>
                }
                label={''}
            />
        )

    }

    function hanldeFixBet() {
        axios.post(`${config[config.env].apiBasePath}/table/game/round`, {
            "tableId": tableId,
            "gameId": gameId,
            "roundSequence": roundNumber+1,
            "playerNames": round.get("playerStatus").filter(p => p.get("action") === 'playing').map(p => p.get("name")),
            "bidAmount": bet
        }).then(result => {
            dispatch(fixBet(tableNumber, gameNumber, roundNumber, bet));
        });
    }
    return (
        <div className="round">
            {/*<Paper elevation={1} className={classes.paper}>*/}
                <Card className={classes.root} variant="outlined">
                    <Typography className={classes.title} color="textPrimary">
                        {`Round ${roundNumber + 1}`}
                    </Typography>

                    <CardContent>
                        <TextField id="outlined-basic" label="Bet" variant="outlined" disabled={round.get("fixed")}
                                   defaultValue={round.get("bet")} onChange={(event)=>setBet(parseInt(event.target.value, 10))} type="number"/>
                        {/*<Typography variant="h6" component="h6">*/}
                        {/*    Players*/}
                        {/*</Typography>*/}
                        <br></br>
                        <br></br>
                        {
                            <FormGroup row>
                                {round.get("playerStatus").map((p, idx) => player(idx, roundNumber, p, round.get("fixed")))}
                            </FormGroup>
                        }
                    </CardContent>
                    <CardActions>
                        {
                            round.get("fixed") === false ? <Button variant="contained" color="primary" onClick={hanldeFixBet} disabled={props.isTableClosed}>
                                Fix Bet
                            </Button> : ''
                        }
                    </CardActions>
                </Card>

                {/*<Typography variant="body2" component="p" className="round-body">*/}
                {/*    <div> {`Round ${roundNumber + 1}`} </div>*/}
                {/*    <TextField id="outlined-basic" label="Bet" variant="outlined" disabled={round.fixed}*/}
                {/*               defaultValue={round.bet} onChange={(event)=>setBet(parseInt(event.target.value, 10))} type="number"/>*/}
                {/*    <div> Players : </div>*/}
                {/*    {*/}
                {/*        round.playerStatus.map((p, idx) => player(idx, roundNumber, p, round.fixed))*/}
                {/*    }*/}
                {/*    {*/}
                {/*        round.fixed === false ? <Button variant="contained" color="primary" onClick={hanldeFixBet}>*/}
                {/*            Fix Bet*/}
                {/*        </Button> : ''*/}
                {/*    }*/}
                {/*</Typography>*/}
                <br></br>
            {/*</Paper>*/}
        </div>
    );
}
