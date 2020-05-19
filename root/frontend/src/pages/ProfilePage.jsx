import React, { Component } from 'react';
import ProfileNavBar from "../components/logged-in-nav-bar/ProfileNavBar.jsx";
import PersonalSummary from "../components/personal-summary/PersonalSummary.jsx";
import "./ProfilePage.css";
import { connect } from "react-redux";
import { store } from "../store/configureStore.js";

class ProfilePage extends Component {

    render() {
        console.log(store.getState());
        return (
            <div>
                <ProfileNavBar />
                <div className="profilePageContainer">
                    <PersonalSummary person={this.props.user} isUser={true} />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    console.log(store.getState());
    return {
        user: state.profileReducer.user,
        viewedTutor: state.profileReducer.viewedTutor
    };
}

export default connect(mapStateToProps)(ProfilePage);