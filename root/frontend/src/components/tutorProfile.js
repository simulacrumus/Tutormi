import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Avatar, IconButton, CardMedia } from "@material-ui/core";
import FavoriteSharpIcon from "@material-ui/icons/FavoriteSharp";

const useStyles = makeStyles(() => ({
  blueColor: {
    background: `linear-gradient(45.34deg, #EA52F8 5.66%, #0066FF 94.35%)`,
    fontWeight: "bold",
  },
  greenColor: {
    background: "linear-gradient(45deg, #119DA4, #04B46D ,  #FBF33C)",
    fontWeight: "bold",
  },
}));

const TutorProfile = ({ avatarSrc, title, subTitle, description, imgSrc }) => {
  const classes = useStyles();
  return (
    <Card raised>
      <CardHeader
        avatar={<Avatar src={avatarSrc} />}
        action={
          <IconButton aria-label="settings">
            <FavoriteSharpIcon color="secondary" />
          </IconButton>
        }
        title={title}
        subheader={subTitle}
      />
      <CardMedia style={{ height: "150px" }} image={imgSrc} />
      <CardContent>
        <Typography variant="body2" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          className={classes.blueColor}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => alert("PROFILE!!")}
        >
          Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default TutorProfile;
