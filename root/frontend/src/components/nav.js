import React from "react";
import styled from "styled-components";
import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";

//CSS
const NavBar = styled(AppBar)`
  background: linear-gradient(45deg, #8c366c, #6e64e7);
`;

const TypographyComponent = styled(Typography)`
  font-family: "Roboto Slab", serif;
  font-size: 18px;
  font-weight: bold;
`;

const useStyles = makeStyles(() => ({
  typographyStyles: {
    flex: 1, //This moves the icon to the right of the navBar
  },
  space: {
    padding: "0 30px",
  },
}));

const Nav = () => {
  const classes = useStyles();
  return (
    <NavBar position="static">
      <Toolbar>
        <TypographyComponent className={classes.typographyStyles}>
          Tutormi
        </TypographyComponent>
        <TypographyComponent className={classes.space}>
          {" "}
          Become a Tutor
        </TypographyComponent>
        <TypographyComponent className={classes.space}>
          {" "}
          Login
        </TypographyComponent>
        <TypographyComponent className={classes.space}>
          {" "}
          Account
        </TypographyComponent>
      </Toolbar>
    </NavBar>
  );
};

export default Nav;
