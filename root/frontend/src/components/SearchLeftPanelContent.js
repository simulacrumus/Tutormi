import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { Rating } from "@material-ui/lab";
import { addTutor, deleteTutor } from "../store/tutorSearchList";
import Button from "@material-ui/core/Button";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 10,
    maxWidth: 215,
  },
  input: {
    flex: 2,
    alignItems: "center",
  },
  buttonColor: {
    fontWeight: "bold",
    fontFamily: "Arial",
    marginBottom: 10,
  },
  faqRoot: {
    width: "100%",
    marginBottom: 10,
    background: "#304FFE",
  },
  heading: {
    fontFamily: "Arial",
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightRegular,
    color: "#BBDEFB",
  },
  expansion: {
    display: "flex",
    justifyContent: "center",
    flexFlow: "column wrap",
    alignItems: "left",
  },
}));

const LeftPanelContent = ({ token = "", onAddTutor, clearTutors }) => {
  const classes = useStyles();
  const [rating, setRating] = useState(1);
  const [nameQuery, setNameQuery] = useState(null);
  const [languageQuery, setLanguageQuery] = useState(null);
  const [courseQuery, setCourseQuery] = useState(null);
  const [dateQuery, setDateQuery] = useState(
    moment(new Date().toString().replace(/:([0-9])+:([0-9])+/, ":00:00"))
  );
  const [initialDate] = useState(moment(dateQuery));
  const [startQuery, setStartQuery] = useState(dateQuery);
  const [endQuery, setEndQuery] = useState(dateQuery);
  const [initialStart] = useState(moment(startQuery));
  const [initialEnd] = useState(moment(endQuery));
  const [btnClicked, setBtnValue] = useState(false);

  const handleDateChange = (date) => {
    let calendarDate = date.toString().substring(0, 15);
    let currentStart = startQuery.toString().substring(15);
    let currentEnd = endQuery.toString().substring(15);
    date = calendarDate + currentStart;
    setDateQuery(date);
    setStartQuery(date);
    date = calendarDate + currentEnd;
    setEndQuery(date);
  };

  const handleStartChange = (date) => {
    let calendarDate = dateQuery.toString().substring(0, 15);
    let userDate = date.toString().substring(15);
    date = calendarDate + userDate;
    setStartQuery(date);
  };

  const handleEndChange = (date) => {
    let calendarDate = dateQuery.toString().substring(0, 15);
    let userDate = date.toString().substring(15);
    date = calendarDate + userDate;
    setEndQuery(date);
  };

  useEffect(() => {
    if (courseQuery === null && btnClicked === false && rating === 1) {
      const getTutors = async () => {
        try {
          clearTutors();
          const response = await fetch("/api/tutors");
          const data = await response.json();
          console.log(data);
          onAddTutor(data);
          console.log("FIRST EFFECT!!!!");
        } catch (error) {
          console.log("Error!!", error);
        }
      };
      getTutors();
    }
  }, [courseQuery, btnClicked]);

  useEffect(() => {
    if (btnClicked !== false) {
      const filterState = async () => {
        try {
          clearTutors();
          console.log("SECOND FETCH!!");
          const response = await fetch("/api/tutors/search", {
            method: "POST",
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start: !moment(startQuery).isSame(initialStart) ? startQuery : "",
              end:
                !moment(startQuery).isSame(initialStart) &&
                !moment(endQuery).isSame(initialEnd)
                  ? endQuery
                  : "",
              course: courseQuery,
              language: languageQuery,
              rating: rating,
              name: nameQuery,
            }),
          });
          const data = await response.json();
          console.log("RESPONSE!!!!!! ", data);
          onAddTutor(data);
          setBtnValue(false);
        } catch (error) {
          console.log("Error!!", error);
        }
      };
      filterState();
    }
  }, [btnClicked]);

  return (
    <>
      {/*Course Search*/}
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search for a course"
          onChange={(event) => {
            setCourseQuery(event.target.value);
          }}
        />
      </Paper>

      {/*Date Search*/}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Select a date"
          value={dateQuery}
          onChange={(date) => {
            handleDateChange(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          variant="inline"
          margin="normal"
          id="start"
          label="Start Time"
          views="hours"
          value={startQuery}
          onChange={(date) => {
            handleStartChange(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
        <KeyboardTimePicker
          variant="inline"
          margin="normal"
          id="end"
          label="End Time"
          views="hours"
          value={endQuery}
          onChange={(date) => {
            handleEndChange(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
      </MuiPickersUtilsProvider>

      {/*Advanced Search*/}
      <ExpansionPanel className={classes.faqRoot}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography className={classes.heading}>Advanced Search</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansion}>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newRating) => {
              setRating(newRating);
            }}
          />

          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search by tutor"
              onChange={(event) => {
                setNameQuery(event.target.value);
              }}
            />
          </Paper>

          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search by language"
              onChange={(event) => {
                setLanguageQuery(event.target.value);
              }}
            />
          </Paper>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      {/*Submission*/}
      <Button
        size="small"
        variant="outlined"
        color="primary"
        className={classes.buttonColor}
        onClick={() => setBtnValue(true)}
      >
        Search
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  onAddTutor: (tutor) => dispatch(addTutor(tutor)),
  clearTutors: () => dispatch(deleteTutor()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LeftPanelContent);
