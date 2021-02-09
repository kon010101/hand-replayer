import React, { useEffect, useState } from "react";

//import table parts
import EnhancedTableHead from "./table/EnhancedTableHead";
import EnhancedTableToolbar from "./table/EnhancedTableToolbar";

//import material ui components
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import { lighten, makeStyles } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
}));

function HandList2({ gParsedHands, setSelectedHands }) {
    //table variables and states
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const [sumNetWin, setSumNetWin] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        //set data (rows)
        const newRows = gParsedHands.map((hand) => {
            const handId = hand.info.handid;
            const date = `${hand.info.year}/${hand.info.month}/${
                hand.info.day
            } ${hand.info.hour}:${
                hand.info.min.toString().length > 1
                    ? hand.info.min
                    : "0" + hand.info.min
            }`;
            const board = hand.board
                ? Object.keys(hand.board).map((key, index) => {
                      if (key !== "metadata") return hand.board[key];
                  })
                : [];
            const cards = hand.holecards
                ? Object.keys(hand.holecards).map((key, index) => {
                      if (key !== "metadata") return hand.holecards[key];
                  })
                : [];
            const boardCards = board.filter((item) => item !== undefined);
            const holeCards = cards.filter((item) => item !== undefined);
            const position = hand.position;
            const netWin = hand.winnings[hand.hero]
                ? hand.winnings[hand.hero]
                : 0;
            const absWin = Math.abs(netWin);
            const stakes = `${hand.info.currency}${hand.info.sb}/${hand.info.bb} ${hand.info.limit} ${hand.info.pokertype}`;
            return {
                handId: handId,
                date: date,
                holeCards: holeCards,
                boardCards: boardCards,
                netWin: netWin,
                stakes: stakes,
                position: position,
                absWin: absWin,
            };
        });

        //set total winnings of session
        const sum = newRows.reduce((acc, row) => acc + row.netWin, 0);
        setSumNetWin(sum);

        //set rows
        setRows(newRows);
    }, [gParsedHands]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortMax = () => {};

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.handId);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleClickPlay = () => {
        //set state (selected hands which gets returned to app)
        //filter gparsed and put selected ones to app

        const filtered = gParsedHands.filter((el) => {
            return selected.some((f) => {
                return f === el.info.handid;
            });
        });
        console.log(filtered);

        setSelectedHands(filtered);
    };

    return (
        <div>
            <Paper>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    handleClickPlay={handleClickPlay}
                />
                <TableContainer>
                    <div>NetWin Total: {sumNetWin}</div>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            sortMax={sortMax}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(
                                        row.handId
                                    );
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(event, row.handId)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.handId}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.date.toString()}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.holeCards.map((card) => (
                                                    <img
                                                        style={{
                                                            margin: "1px",
                                                            borderRadius: "1px",
                                                            border:
                                                                "1px black solid",
                                                        }}
                                                        src={
                                                            card !== "Ad"
                                                                ? `/card_images2/${card}.png`
                                                                : "/card_images2/AceDia.png"
                                                        }
                                                        width="18"
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.boardCards.map((card) => (
                                                    <img
                                                        style={{
                                                            margin: "1px",
                                                            borderRadius: "1px",
                                                            border:
                                                                "1px black solid",
                                                        }}
                                                        src={
                                                            card !== "Ad"
                                                                ? `/card_images2/${card}.png`
                                                                : "/card_images2/AceDia.png"
                                                        }
                                                        width="18"
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    color:
                                                        row.netWin < 0
                                                            ? "red"
                                                            : "green",
                                                }}
                                            >
                                                {row.netWin}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.absWin}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.stakes}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.position}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            />
        </div>
    );
}

export default HandList2;
