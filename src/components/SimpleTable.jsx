import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import BasicPagination from "./BasicPagination.jsx";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    table: {
        width: "100vw",
    },
});

function createData(name, score) {
    return { name, score };
}


export default function SimpleTable(props) {
    console.log("Simple Table Prop : ", props);
    const rows = props.values.map((v, idx) => {
        return createData(props.names[idx], v);
    });
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {
                                    ['name', 'score'].map(h => {
                                        return (
                                            <TableCell className={classes.tableCell}>{h}</TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
            </CardContent>
            <CardActions>
                {props.count ? <BasicPagination count={props.count} onChangeFn={props.onChangeFn}/> : ''}
            </CardActions>
        </Card>

    );
}
