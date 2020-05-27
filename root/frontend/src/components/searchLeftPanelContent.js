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
  const [rating, setRating] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [languageQuery, setLanguageQuery] = useState(null);
  const [courseQuery, setCourseQuery] = useState(null);
  const [dateQuery, setDateQuery] = useState(moment(new Date().toString()));
  const [endQuery, setEndQuery] = useState(dateQuery);
  const [initialDate] = useState(moment(dateQuery));
  const [initialEnd] = useState(moment(endQuery));
  const classes = useStyles();

  const handleDateChange = (date) => {
    setDateQuery(date);
    console.log("FORMAT: ", dateQuery.toISOString().substring(0, 23));
  };

  useEffect(() => {
    if (
      rating === null &&
      searchQuery === null &&
      languageQuery === null &&
      courseQuery === null &&
      moment(dateQuery).isSame(initialDate) &&
      moment(endQuery).isSame(initialEnd)
    ) {
      const getTutors = async () => {
        try {
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
    dateQuery,
    initialDate,
    endQuery,
    initialEnd,
  ]);

  useEffect(() => {
    if (
      rating !== null ||
      searchQuery !== null ||
      languageQuery !== null ||
      courseQuery !== null ||
      !moment(dateQuery).isSame(initialDate) ||
      !moment(endQuery).isSame(initialEnd)
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
              start: dateQuery.toISOString(),
              end: endQuery.toISOString(),
              course: courseQuery,
              language: languageQuery,
              rating: rating,
              key: searchQuery,
            }),
          });

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
    dateQuery,
    initialDate,
    endQuery,
    initialEnd,
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
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="start"
          label="Start Time"
          value={dateQuery}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="end"
          label="End Time"
          value={endQuery}
          onChange={(date) => {
            setEndQuery(date);
            console.log("END TIME!!: ", endQuery);
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
  token: state.userReducer.token,
  tutorList: state.tutorSearchList,
});

const mapDispatchToProps = (dispatch) => ({
  onAddTutor: (tutor) => dispatch(addTutor(tutor)),
  clearTutors: (tutor) => dispatch(deleteTutor(tutor)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LeftPanelContent);
