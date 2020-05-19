import React, { Component } from 'react';
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.jsx";
import WeeklySchedule from "../components/scheduling/WeeklySchedule.jsx";
import "./DashboardPage.css";
import { connect } from "react-redux";
import FavoriteTutorsView from "../components/favorite-tutors/FavoriteTutorsView.jsx";

class TutorDashboardPage extends Component {

    render() {
        return (
            <div>
                <ProfileNavBar />
                <div className="dashboardContainer">
                    <div className="innerDashboardContainer">
                        <WeeklySchedule
                            appointments={this.props.user.appointments}
                            tutorHours={this.props.user.availableHours} />
                    </div>
                    <div className="innerDashboardContainer">
                        <h4>Metrics</h4>
                        <p>Number of open hours: {this.props.user.availableHours.length}</p>
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