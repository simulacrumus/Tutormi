import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { addTutor } from "../store/tutorSearchList";
import Nav from "./nav";
import SearchContent from "./SearchContent";
import SearchRightPanel from "./SearchRightPanel";
import SearchLeftPanel from "./SearchLeftPanel";

const SearchMain = ({ tutorSearchList = [], onAddTutor }) => {
  useEffect(() => {
    const getTutors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tutors");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("Error!!", error);
      }
    };
    getTutors();
  }, []);

  return (
    <div className="App">
      <Grid container direction="column">
        <Grid item>
          <Nav />
        </Grid>
        <Grid item container>
          <Grid item xs={false} sm={2}>
            <SearchLeftPanel />
          </Grid>
          <Grid item xs={12} sm={8}>
            <SearchContent />
          </Grid>
          <Grid item xs={false} sm={2}>
            <SearchRightPanel />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tutorSearchList: state.tutorSearchList,
});
const mapDispatchToProps = (dispatch) => ({
  onAddTutor: () => dispatch(addTutor({ name: "Test", subject: "Math" })),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchMain);
