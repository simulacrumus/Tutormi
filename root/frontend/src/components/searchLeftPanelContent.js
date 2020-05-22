import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { Rating } from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { addTutor } from "../store/tutorSearchList";

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
  iconButton: {
    padding: 10,
  },
}));

const LeftPanelContent = ({ languages, onAddTutor }) => {
  const [rating, setRating] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  //const [languageQuery, setLanguageQuery] = useState(null); Forget this for now, major bug, keeps re rendering
  const [anchorEl, setAnchorEl] = useState(null); //pretty much the same as languageQuery
  const classes = useStyles();

  useEffect(() => {
    if (rating === null && searchQuery === null) {
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
    } else {
      //Now filter the list, just filter it in real time
      console.log("THERE HAS BEEN A CHANGE!!");
    }
  }, [searchQuery, rating]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search"
          onChange={(event) => {
            setSearchQuery(event.target.value);
            console.log("On Change!!", searchQuery);
          }}
        />
        {/*<IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={(event) => {
            console.log("SEARCH QUERY!!", searchQuery);
          }}
        >
          <SearchIcon />
        </IconButton>*/}
      </Paper>
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newRating) => {
          setRating(newRating);
          console.log("Value!!!!!!", rating);
        }}
      />

      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          Languages
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {languages.map((language) => (
            <MenuItem key={language} onClick={handleClose}>
              {language}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  onAddTutor: (tutor) => dispatch(addTutor(tutor)),
});
export default connect(null, mapDispatchToProps)(LeftPanelContent);
