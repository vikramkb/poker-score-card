import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {green} from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {createNewTable, fetchTablesSuccessful} from '../action/ScoreAction';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Button from "@material-ui/core/Button";
import axios from "axios";
import config from "./configuration";

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

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked});
    };

    function createTable() {
        axios.post(`${config[config.env].apiBasePath}/table`, {
            "tableName": "test table",
            "createdPlayerName": "vikram",
            "isRunning": true
        }).then(tableResult => {
            const players = Object.keys(state).filter(idx => state[idx]);

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
                        props.dispatch(createNewTable(tableResult.data, gameResult.data, roundResult.data, state));
                    }, {
                        "Access-Control-Allow-Origin": "*"
                    });
                });
            });
        });
    }

    return (
        <FormGroup row>
            {
                props.playerNames.map(n => {
                    return (
                        <FormControlLabel
                            control={

                                <Checkbox
                                    onChange={handleChange}
                                    name={n}
                                    color="primary"
                                />
                            }
                            label={n}
                        />)
                })
            }
            <FormControlLabel
                control={
                    <Button variant="contained" color="primary" onClick={createTable}>
                        Start Playing
                    </Button>
                }
                label=""
            />
        </FormGroup>
    );
}
