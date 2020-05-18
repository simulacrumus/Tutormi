import React from "react";
import { Grid } from "@material-ui/core";
import { Typography, makeStyles } from "@material-ui/core";
import LeftPanelContent from "./searchLeftPanelContent";

const useStyles = makeStyles({
  typographyStyle: {
    fontFamily: "Roboto Slab, serif",
    fontSize: "30px",
    fontWeight: "bold",
    paddingTop: "10px",
    color: "#D81B60",
  },
});

const SearchLeftPanel = () => {
  const classes = useStyles();
  return (
    <Grid container spacing={12}>
      <Grid item xs={12}>
        <Typography
          align="center"
          variant="h1"
          className={classes.typographyStyle}
          gutterBottom
        >
          Filter
        </Typography>
      </Grid>
      <Grid xs={false} sm={2} />
      <Grid item xs={8}>
        <LeftPanelContent />
      </Grid>
      <Grid xs={false} sm={2} />
    </Grid>
  );
};

export default SearchLeftPanel;