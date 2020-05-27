import React, { Component } from "react";
import "./FavoriteTutorsView.css";
import { connect } from "react-redux";
import TutorView from "./TutorView.js";

class FavoriteTutorsView extends Component {
  render() {
    return (
      <div className="favoriteContainer">
        <div className="headerContainer">
          <h5>Favorite Tutors</h5>
        </div>
        <div className="tutors">{this.displayTutors()}</div>
      </div>
    );
  }

  displayTutors() {
    // Tutee has no favorites
    if (
      typeof this.props.favoriteTutors === "undefined" ||
      this.props.favoriteTutors.length === 0
    ) {
      return (
        <div className="tutorRowContainer">
          <p>
            You don't have any tutors in your favorites list yet, try{" "}
            <a href="/search">searching</a> for one.
          </p>
        </div>
      );
    } else {
      // If the tutee has favorites display them
      let tutors = [];
      let tutorRow = [];
      for (let index = 0; index < this.props.favoriteTutors.length; index++) {
        if (index !== 0 && index % 3 === 0) {
          tutors.push(<div className="tutorRowContainer">{tutorRow}</div>);
          tutorRow = [];
        }
        tutorRow[index] = (
          <TutorView tutor={this.props.favoriteTutors[index]} />
        );
      }
      tutors.push(<div className="tutorRowContainer">{tutorRow}</div>);
      return tutors;
    }
  }
}

function mapStateToProps(state) {
  return {
    favoriteTutors: state.user.user.favoriteTutors,
  };
}

export default connect(mapStateToProps)(FavoriteTutorsView);
