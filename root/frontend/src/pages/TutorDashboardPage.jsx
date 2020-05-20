import React, { Component } from 'react';
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.jsx";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.jsx";
import "./TutorDashboardPage.css";
import { connect } from "react-redux";
import FavoriteTutorsView from "../components/favorite-tutors/FavoriteTutorsView.jsx";
import ScheduleMetrics from "../components/scheduling/ScheduleMetrics.jsx";

class TutorDashboardPage extends Component {

    render() {
        return (
            <div>
                <ProfileNavBar />
                <div className="tutorDashboardContainer">
                    <div className="tutorInnerDashboardContainer">
                        <WeeklySchedule
                            appointments={this.props.user.appointments}
                            tutorHours={this.props.user.availableHours} />
                    </div>
                    <div className="tutorInnerDashboardContainer">
                        <ScheduleMetrics />
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        user: state.profileReducer.user,
    };
}

export default connect(mapStateToProps)(TutorDashboardPage);