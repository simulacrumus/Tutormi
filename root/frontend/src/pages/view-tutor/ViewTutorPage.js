import React, { Component } from "react";
import PersonalSummary from "../../components/profile/PersonalSummary.js";
import "./ViewTutorPage.css";
import { connect } from "react-redux";
import WeeklySchedule from "../../components/scheduling/WeeklySchedule.js";

class ViewTutorPage extends Component {
  render() {
    return (
      <div className="profilePage">
        <div className="tutorWeekContainer">
          <WeeklySchedule />
        </div>
        <div className="tutorProfileContainer">
          <PersonalSummary person={this.props.viewedTutor} isUser={false} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    viewedTutor: state.viewedTutor.viewedTutor,
  };
}

export default connect(mapStateToProps)(ViewTutorPage);
