import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(() => ({
  root: {
    padding: "2px 4px",
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    minWidth: 250,
  },
  input: {
    flex: 1,
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
  },
}));

const LeftPanelContent = () => {
  const classes = useStyles();
  return (
    <>
      <Paper component="form" className={classes.root}>
        <InputBase className={classes.input} placeholder="Search" />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={() => alert("Search executed!!")}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
};

export default LeftPanelContent;
