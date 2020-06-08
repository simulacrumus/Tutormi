import React from "react";
import { Grid } from "@material-ui/core";
import Nav from "./Nav";
import SearchContent from "./SearchContent";
import SearchLeftPanel from "./SearchLeftPanel";

const SearchMain = () => {
  return (
    <div className="App">
      <Grid container direction="column">
        <Grid item>
          {/* <Nav /> */}
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
