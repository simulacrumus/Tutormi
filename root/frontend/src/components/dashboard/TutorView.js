import React, { Component } from "react";
import "./TutorView.css";
import { setViewedTutor } from "../../store/viewed-tutor/viewedTutorActions";
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import customTheme from "../../styles/materialUiTheme";

export default class TutorView extends Component {

  render() {
    return (
      <div tabIndex="0" className="tutorView" onClick={() => setViewedTutor(this.props.tutor._id)}>
        <img src={require(`../../images/uploads/${this.props.tutor.profilePic}`)} />
        <h6>
          {this.props.tutor.user.name}
        </h6>
        <ThemeProvider theme={customTheme}>
          <Button color="primary" variant="contained" size="small" variant="outlined"
            onClick={() => {
              setViewedTutor(this.props.tutor._id)
                .then(() => window.location.href = "/viewTutor"); // Change page only after tutor is set
            }}
          >View Profile</Button>
        </ThemeProvider>
      </div>
    );
  }
}
