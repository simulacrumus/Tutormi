import React, { Component } from 'react';
import ProfileNavBar from "../components/ProfileNavBar.jsx";
import PersonalSummary from "../components/PersonalSummary.jsx";
import "../styles/TutorViewPage.css";
import { connect } from "react-redux";
import WeeklySchedule from '../components/WeeklySchedule.jsx';


class TutorViewPage extends Component {

    render() {
        return (
            <div>
                <ProfileNavBar />
                <div className="profilePage">
                <div className="tutorWeekContainer">
                        <WeeklySchedule
                            tuteeAppointments={this.props.user.appointments}
                            tutorAppointments={this.props.viewedTutor.appointments}
                            tutorAvailableHours={this.props.viewedTutor.availableHours}
                            viewedTutor={this.props.viewedTutor} />
                    </div>
                    <div className="tutorProfileContainer">
                        <PersonalSummary person={this.props.viewedTutor} isUser={false} />
                    </div>
                    
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        user: state.profileReducer.user,
        viewedTutor: state.profileReducer.viewedTutor
    };
}

export default connect(mapStateToProps)(TutorViewPage);