import React from "react";
import { Grid } from "@material-ui/core";
import { Typography, makeStyles } from "@material-ui/core";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import RightPanelContent from "./RightPanelContent";

const useStyles = makeStyles({
  typographyStyle: {
    fontFamily: "Roboto Slab, serif",
    fontSize: "30px",
    fontWeight: "bold",
    paddingTop: "10px",
    color: "#D81B60",
  },
});
const SearchRightPanel = () => {
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
          Trending <WhatshotIcon style={{ color: "#D50000" }} />
        </Typography>
      </Grid>
      <Grid item xs={false} sm={2} />
      <Grid item xs={8}>
        <RightPanelContent
          username="SomeGuy22"
          description="1 Free tutoring session!"
        />
      </Grid>
      <Grid item xs={false} sm={2} />

      <Grid item xs={false} sm={2} />
      <Grid item xs={8}>
        <RightPanelContent
          username="JasonMitch"
          description="Refer a Friend, get $5"
        />
      </Grid>
      <Grid item xs={false} sm={2} />

      <Grid item xs={false} sm={2} />
      <Grid item xs={8}>
        <RightPanelContent
          username="Kathy_Dupali"
          description="$15 for first time users!"
        />
      </Grid>
      <Grid item xs={false} sm={2} />

      <Grid item xs={false} sm={2} />
      <Grid item xs={8}>
        <RightPanelContent
          username="jimDusman"
          description="Why java is the best language"
        />
      </Grid>
      <Grid item xs={false} sm={2} />
    </Grid>
  );
};

export default SearchRightPanel;
