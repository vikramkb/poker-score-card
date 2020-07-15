import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function BasicPagination(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Pagination page={props.page} count={props.count} color="primary" onChange={((event,pageNumber) => {props.onChangeFn(pageNumber)})}/>
        </div>
    );
}
