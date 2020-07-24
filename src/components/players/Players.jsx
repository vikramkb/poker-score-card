import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {green} from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {createNewTable, fetchTablesSuccessful} from '../../action/ScoreAction';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Button from "@material-ui/core/Button";
import axios from "axios";
import config from "../common/configuration";
import OrderList from "../common/OrderList.jsx";
import TextField from "@material-ui/core/TextField";
import CardContent from "@material-ui/core/CardContent";

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function Players(props) {
    const [state, setState] = React.useState({});
    const [topPlayersCount, setTopPlayersCount] = React.useState(0);
    const [selectedPlayers, setSelectedPlayers] = React.useState(props.playerNames);


    const handleChange = (event) => {
        // setState({...state, [event.target.name]: event.target.checked});
        // if(event.target.checked){
        //     let newSelectedPlayers = selectedPlayers.map(p=>p);
        //     newSelectedPlayers.push(event.target.name);
        //     setSelectedPlayers([
        //         ...selectedPlayers,
        //         event.target.name
        //     ]);
        // }else{
        //     setSelectedPlayers(selectedPlayers.filter(p => p !== event.target.name));
        // }
    };

    function createTable() {
        const playersMap = {};
        const players = selectedPlayers.filter((p,idx) => idx < topPlayersCount);
        players.forEach(p => {
            playersMap[p] = true;
        });
        axios.post(`${config[config.env].apiBasePath}/table`, {
            "tableName": "test table",
            "createdPlayerName": "vikram",
            "isRunning": true
        }).then(tableResult => {
            // const players = Object.keys(state).filter(idx => state[idx]);

            axios.post(`${config[config.env].apiBasePath}/table/player`, {
                "tableId": tableResult.data,
                "players": players
            }).then(playerResult => {
                axios.post(`${config[config.env].apiBasePath}/table/game`, {
                    "tableId": tableResult.data,
                    "gameSequence": 1,
                    "isRunning": true
                }).then(gameResult => {

                    axios.post(`${config[config.env].apiBasePath}/table/game/round`, {
                        "tableId": tableResult.data,
                        "gameId": gameResult.data,
                        "roundSequence": 1,
                        "playerNames": players,
                        "bidAmount": 10
                    }).then(roundResult => {
                        props.history.push("/home");
                        props.dispatch(createNewTable(tableResult.data, gameResult.data, roundResult.data, playersMap));
                    }, {
                        "Access-Control-Allow-Origin": "*"
                    });
                });
            });
        });
    }

    return (
        <div>
            <FormGroup row>
                {/*{*/}
                {/*    props.playerNames.map(n => {*/}
                {/*        return (*/}
                {/*            <FormControlLabel*/}
                {/*                control={*/}

                {/*                    <Checkbox*/}
                {/*                        onChange={handleChange}*/}
                {/*                        name={n}*/}
                {/*                        color="primary"*/}
                {/*                    />*/}
                {/*                }*/}
                {/*                label={n}*/}
                {/*            />)*/}
                {/*    })*/}
                {/*}*/}
                <OrderList players={props.playerNames} setSelectedPlayers={setSelectedPlayers}/>
                <FormControlLabel
                    control={
                        <TextField id="outlined-basic" label="Which players from top?" variant="outlined"
                                   defaultValue={0} onChange={(event)=>setTopPlayersCount(parseInt(event.target.value, 10))} type="number"/>
                    }
                    label=""
                />

                <FormControlLabel
                    control={
                        <Button variant="contained" color="primary" onClick={createTable}>
                            Start Playing
                        </Button>
                    }
                    label=""
                />
            </FormGroup>
        </div>
    );
}
