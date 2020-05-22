import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { Typography, makeStyles } from "@material-ui/core";
import LeftPanelContent from "./SearchLeftPanelContent";
import { addTutor } from "../store/tutorSearchList";

const useStyles = makeStyles({
  typographyStyle: {
    fontFamily: "Roboto Slab, serif",
    fontSize: "30px",
    fontWeight: "bold",
    paddingTop: "10px",
    color: "#D81B60",
  },
});

const languages = ["French", "English"];

const SearchLeftPanel = ({ onAddTutor }) => {
  const classes = useStyles();
  /*useEffect(() => {
    const getTutors = async () => {
      try {
        const response = await fetch("/api/tutors");
        const data = await response.json();
        data.map((tutor) => onAddTutor(tutor));
        console.log("Passed data!!");
      } catch (error) {
        console.log("Error!!", error);
      }
    };
    getTutors();
  }, []);*/
  return (
    <Grid container spacing={10}>
      <Grid item xs={false} sm={2} />
      <Grid item xs={8}>
        <LeftPanelContent languages={languages} />
      </Grid>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  onAddTutor: (tutor) => dispatch(addTutor(tutor)),
});
export default SearchLeftPanel;
