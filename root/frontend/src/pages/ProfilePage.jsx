import React, { Component } from 'react';
import ProfileNavBar from "../components/ProfileNavBar.jsx";
import PersonalSummary from "../components/PersonalSummary.jsx";
import "../styles/ProfilePage.css";
import FavoriteTutorsView from "../components/FavoriteTutorsView.jsx";
import { connect } from "react-redux";

class ProfilePage extends Component {

    render() {
        return (
            <div>
                <ProfileNavBar />
                <div className="profilePageContainer">
                    <div className="innerProfileContainer">
                        <PersonalSummary person={this.props.user} isUser={true} />
                    </div>
                    <div className="innerProfileContainer">
                        <FavoriteTutorsView />
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

export default connect(mapStateToProps)(ProfilePage);