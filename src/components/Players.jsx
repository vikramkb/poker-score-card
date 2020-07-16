import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {createNewTable} from '../action/ScoreAction';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Button from "@material-ui/core/Button";

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
    const [state, setState] = React.useState({
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    function createTable() {
        props.history.push("/home");
        props.dispatch(createNewTable(state));
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
