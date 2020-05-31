import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { Rating } from "@material-ui/lab";
import { addTutor, deleteTutor } from "../store/tutorSearchList";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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
}));

const LeftPanelContent = ({
  token = "",
  tutorList = [],
  onAddTutor,
  clearTutors,
}) => {
  const [rating, setRating] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
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
  const classes = useStyles();

  const handleDateChange = (date, number) => {
    let calendarDate = date.toString().substring(0, 15);
    let currentStart = startQuery.toString().substring(15);
    let currentEnd = endQuery.toString().substring(15);
    date = calendarDate + currentStart;
    setDateQuery(date);
    if (number === 1) {
      setStartQuery(date);
    }
    date = calendarDate + currentEnd;
    setEndQuery(date);
  };

  const handleStartChange = (date) => {
    let calendarDate = dateQuery.toString().substring(0, 15);
    let userDate = date.toString().substring(15);
    date = calendarDate + userDate;
    setStartQuery(date);
  };

  const handleEndChange = (date, number) => {
    let calendarDate = dateQuery.toString().substring(0, 15);
    let userDate = date.toString().substring(15);
    date = calendarDate + userDate;
    setEndQuery(date);
    /*if (number == 1) {
      setStartQuery("2020-05-17T10:00:00.000Z")
    setStartQuery(calendarDate + startQuery.toString().substring(15));
    }*/
  };

  useEffect(() => {
    if (
      rating === 1 &&
      searchQuery === null &&
      languageQuery === null &&
      courseQuery === null &&
      moment(startQuery).isSame(initialStart)
    ) {
      const getTutors = async () => {
        try {
          tutorList.map((tutor) => clearTutors(tutor));
          const response = await fetch("/api/tutors");
          const data = await response.json();
          data.map((tutor) => onAddTutor(tutor));
          console.log("FIRST EFFECT!!!!");
        } catch (error) {
          console.log("Error!!", error);
        }
      };
      getTutors();
    }
  }, [
    searchQuery,
    rating,
    languageQuery,
    courseQuery,
    startQuery,
    initialStart,
  ]);

  useEffect(() => {
    if (
      rating !== 1 ||
      searchQuery !== null ||
      languageQuery !== null ||
      courseQuery !== null ||
      !moment(startQuery).isSame(initialStart) ||
      (!moment(startQuery).isSame(initialStart) &&
        !moment(dateQuery).isSame(initialDate))
    ) {
      const filterState = async () => {
        try {
          tutorList.map((tutor) => clearTutors(tutor));

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
              key: searchQuery,
            }),
          });
          console.log("Start TIME!!: ", startQuery);
          console.log("END TIME!!: ", endQuery);
          const data = await response.json();
          data.map((tutor) => onAddTutor(tutor));
          console.log("DATA FETCHED!!");
        } catch (error) {
          console.log("Error!!", error);
        }
      };
      filterState();
    }
  }, [
    searchQuery,
    rating,
    languageQuery,
    courseQuery,
    startQuery,
    initialStart,
  ]);

  return (
    <>
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
          placeholder="Search Tutors"
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
        />
      </Paper>

      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search for a language"
          onChange={(event) => {
            setLanguageQuery(event.target.value);
          }}
        />
      </Paper>

      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search for a course"
          onChange={(event) => {
            setCourseQuery(event.target.value);
          }}
        />
      </Paper>
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
            moment(startQuery).isSame(initialStart)
              ? handleDateChange(date, 0)
              : handleDateChange(date, 1);
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
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.user.token,
  tutorList: state.tutorSearchList,
});

const mapDispatchToProps = (dispatch) => ({
  onAddTutor: (tutor) => dispatch(addTutor(tutor)),
  clearTutors: (tutor) => dispatch(deleteTutor(tutor)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LeftPanelContent);
