import React, { Component } from 'react';
import '../styles/TutorView.css';
import { store } from "../configureStore.js";
import { CHANGE_VIEWED_TUTOR } from "../reducers/profileReducer.js";

export default class TutorView extends Component {

    render() {
        return (
            <div tabIndex="0" className='tutorView' onClick={
                () => {
                    store.dispatch({ type: CHANGE_VIEWED_TUTOR, payload: this.props.tutor });
                }}>
                <img src={this.props.tutor.imgPath} />

                <h6>{this.props.tutor.firstName} {this.props.tutor.lastName}</h6>
                <button className="goToProfileBtn" onClick={() => {
                    store.dispatch({ type: CHANGE_VIEWED_TUTOR, payload: this.props.tutor });
                    setTimeout(() => window.location.href = "/viewTutor", 1);}}>View Profile</button>
            </div>
        );
    }


}
