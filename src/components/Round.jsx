import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import {playRound, foldRound, fixBet} from "../action/ScoreAction";
export default function Round(props) {
    const round = props.round;
    const tableNumber = props.tableNumber;
    const roundNumber = props.roundNumber;
    const gameNumber = props.gameNumber;
    const dispatch = props.dispatch;
    const [bet, setBet] = React.useState(props.round.bet);


    function player(playerIdx, roundNumber, player, fixed) {
        const handleChange = (event) => {
            console.log("playerIdx : ", playerIdx, " : roundNumber : ", roundNumber, " : player : ", player, " : fixed : ", fixed);
            if (event.target.checked) {
                dispatch(playRound(tableNumber, gameNumber, roundNumber, playerIdx, event.target.name));
            } else {
                dispatch(foldRound(tableNumber, gameNumber, roundNumber, playerIdx, event.target.name));
            }
        };

        return (
            <span>
            <span>{player.name}</span>
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
        <div>
            <Typography variant="body2" component="p">
                <span> {`Round ${roundNumber + 1}`} </span>
                <TextField id="outlined-basic" label="Bet" variant="outlined" disabled={round.fixed}
                           defaultValue={round.bet} onChange={(event)=>setBet(parseInt(event.target.value, 10))} type="number"/>
                <span> Players : </span>
                {
                    round.playerStatus.map((p, idx) => player(idx, roundNumber, p, round.fixed))
                }
                {
                    round.fixed === false ? <Button variant="contained" color="primary" onClick={hanldeFixBet}>
                        Fix Bet
                    </Button> : ''
                }
            </Typography>
            <br></br>
        </div>
    );
}
