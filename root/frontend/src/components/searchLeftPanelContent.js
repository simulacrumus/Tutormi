import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    minWidth: 190,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  slider: {
    minWidth: 190,
  },
  typographyStyles: {
    marginTop: 30,
    fontFamily: "Arial",
    fontWeight: "bold",
    marginBottom: 1,
    color: "#bfbfbf",
  },
}));

const valuetext = (value) => {
  return `${value}`;
};

const LeftPanelContent = () => {
  const classes = useStyles();
  return (
    <>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search Anything"
          inputProps={{ "aria-label": "search google maps" }}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={() => alert("Search executed!!")}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <Typography
        id="discrete-slider"
        gutterBottom
        className={classes.typographyStyles}
      >
        Price
      </Typography>
      <Slider
        defaultValue={20}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={50}
        className={classes.slider}
        color="secondary"
      />
    </>
  );
};

export default LeftPanelContent;
