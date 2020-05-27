import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import { Rating } from "@material-ui/lab";
import { addTutor, deleteTutor } from "../store/tutorSearchList";

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
  const classes = useStyles();

  useEffect(() => {
    if (
      rating === null &&
      searchQuery === null &&
      languageQuery === null &&
      courseQuery === null
    ) {
      const getTutors = async () => {
        try {
          const response = await fetch("/api/tutors");
          const data = await response.json();
          data.map((tutor) => onAddTutor(tutor));
        } catch (error) {
          console.log("Error!!", error);
        }
      };
      getTutors();
    }
  }, [searchQuery, rating, languageQuery, courseQuery]);

  useEffect(() => {
    if (
      rating !== null ||
      searchQuery !== null ||
      languageQuery !== null ||
      courseQuery !== null
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
              start: "",
              end: "",
              course: courseQuery,
              language: languageQuery,
              rating: rating,
              key: searchQuery,
            }),
          });

          const data = await response.json();
          data.map((tutor) => onAddTutor(tutor));
        } catch (error) {
          console.log("Error!!", error);
        }
      };
      filterState();
    }
  }, [searchQuery, rating, languageQuery, courseQuery]);

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
