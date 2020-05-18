import React from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { addTutor } from "../store/tutorSearchList";
import Nav from "./nav";
import SearchContent from "./searchContent";
import SearchRightPanel from "./searchRightPanel";
import SearchLeftPanel from "./searchLeftPanel";

const SearchMain = ({ tutorSearchList = [], onAddTutor }) => {
  return (
    <div className="App">
      <Grid container direction="column">
        <Grid item>
          <Nav />
        </Grid>
        <Grid item container>
          <Grid xs={false} sm={2}>
            <SearchLeftPanel />
          </Grid>
          <Grid item xs={12} sm={8}>
            <SearchContent />
          </Grid>
          <Grid xs={false} sm={2}>
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
