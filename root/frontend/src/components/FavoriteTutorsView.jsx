import React, { Component } from 'react';
import "../styles/FavoriteTutorsView.css";
import { connect } from "react-redux";
import TutorView from "../components/TutorView.jsx";

class FavoriteTutorsView extends Component {

    render() {
        return (
            <div className="favoriteContainer">
                <div className="headerContainer"><h5>Favorite Tutors</h5></div>
                <div className="tutors">{this.displayTutors()}</div>
            </div>
        );
    }

    displayTutors() {
        let tutors = [];
        let tutorRow = [];
        for (let index = 0; index < this.props.favoriteTutors.length; index++) {
            if (index !== 0 && index % 3 === 0) {
                tutors.push(<div className="tutorRowContainer">{tutorRow}</div>)
                tutorRow = [];
            }
            tutorRow[index] = <TutorView tutor={this.props.favoriteTutors[index]} />;
        }
        tutors.push(<div className="tutorRowContainer">{tutorRow}</div>)
        return tutors;
    }

}

function mapStateToProps(state) {
    return {
        user: state.profileReducer.user,
        favoriteTutors: state.profileReducer.user.favoriteTutors,
        viewedTutor: state.profileReducer.viewedTutor
    };
}

export default connect(mapStateToProps)(FavoriteTutorsView);