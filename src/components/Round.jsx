import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import {playRound, foldRound, fixBet} from "../action/ScoreAction";
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
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
    const tableNumber = props.tableNumber;
    const roundNumber = props.roundNumber;
    const gameNumber = props.gameNumber;
    const dispatch = props.dispatch;
    const [bet, setBet] = React.useState(props.round.bet);


    function player(playerIdx, roundNumber, player, fixed) {
        const handleChange = (event) => {
            if (event.target.checked) {
                dispatch(playRound(tableNumber, gameNumber, roundNumber, playerIdx, event.target.name));
            } else {
                dispatch(foldRound(tableNumber, gameNumber, roundNumber, playerIdx, event.target.name));
            }
        };

        return (
            <span>
            <Typography variant="h6" component="h6" display="inline">
                {player.name}
            </Typography>
            <Switch
                checked={player.action === 'playing'}
                onChange={handleChange}
                color="primary"
                name={player}
                disabled={fixed}
                inputProps={{'aria-label': 'primary checkbox'}}
            />
        </span>
        )

    }

    function hanldeFixBet() {
        dispatch(fixBet(tableNumber, gameNumber, roundNumber, bet));
    }
    return (
        <div className="round">
            {/*<Paper elevation={1} className={classes.paper}>*/}
                <Card className={classes.root} variant="outlined">
                    <Typography className={classes.title} color="textPrimary">
                        {`Round ${roundNumber + 1}`}
                    </Typography>

                    <CardContent>
                        <TextField id="outlined-basic" label="Bet" variant="outlined" disabled={round.fixed}
                                   defaultValue={round.bet} onChange={(event)=>setBet(parseInt(event.target.value, 10))} type="number"/>
                        {/*<Typography variant="h6" component="h6">*/}
                        {/*    Players*/}
                        {/*</Typography>*/}
                        <br></br>
                        <br></br>
                        {
                            round.playerStatus.map((p, idx) => player(idx, roundNumber, p, round.fixed))
                        }
                    </CardContent>
                    <CardActions>
                        {
                            round.fixed === false ? <Button variant="contained" color="primary" onClick={hanldeFixBet}>
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
