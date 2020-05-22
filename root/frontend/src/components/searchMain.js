import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { addTutor } from "../store/tutorSearchList";
import Nav from "./Nav";
import SearchContent from "./SearchContent";
import SearchLeftPanel from "./SearchLeftPanel";

/*Currently there is a bug, due to the local storage. This component loads all the tutors
from the db prior to accessing the persisted state, as such regardless of any measures put 
in place in the addTutor reducer, errors will arise, since addTutor is currently always executed
prior to accessing the information stored in the local storage. Will fix this next update, for now 
its fine */
const SearchMain = () => {
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
    <div className="App">
      <Grid container direction="column">
        <Grid item>
          <Nav />
        </Grid>
        <Grid item container>
          <Grid item xs={false} sm={3}>
            <SearchLeftPanel />
          </Grid>
          <Grid item xs={12} sm={9}>
            <SearchContent />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchMain;
