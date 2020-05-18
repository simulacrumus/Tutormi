import React, { Component } from 'react';
import ProfileNavBar from "../components/ProfileNavBar.jsx";
import PersonalSummary from "../components/PersonalSummary.jsx";
import "../styles/ProfilePage.css";
import FavoriteTutorsView from "../components/FavoriteTutorsView.jsx";
import { connect } from "react-redux";
import {store} from "../store/configureStore.js";

class ProfilePage extends Component {
    
    render() {
        console.log(store.getState());
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
    console.log(store.getState());
    return {
        user: state.profileReducer.user,
        viewedTutor: state.profileReducer.viewedTutor
    };
}

export default connect(mapStateToProps)(ProfilePage);