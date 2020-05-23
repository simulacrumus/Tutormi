import React, { Component } from "react";
import "./TutorView.css";
import { store } from "../../store/configureStore.js";
import { setViewedTutor } from "../../store/viewed-tutor/viewedTutorActions";

export default class TutorView extends Component {
  render() {
    return (
      <div
        tabIndex="0"
        className="tutorView"
        onClick={() => setViewedTutor(this.props.tutor._id)}
      >
        <img src={this.props.tutor.imgPath} />

        <h6>
          {this.props.tutor.firstName} {this.props.tutor.lastName}
        </h6>
        <button
          className="goToProfileBtn"
          onClick={() => {
            setViewedTutor(this.props.tutor._id).then(
              () => (window.location.href = "/viewTutor")
            ); // Change page only after tutor is set
          }}
        >
          View Profile
        </button>
      </div>
    );
  }
}
