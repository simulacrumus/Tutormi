import React, { Component } from 'react';
import '../styles/TutorView.css';
<<<<<<< HEAD
import { store } from "../store/configureStore.js";
import { CHANGE_VIEWED_TUTOR } from "../store/profileReducer.js";
=======
import { store } from "../configureStore.js";
import { CHANGE_VIEWED_TUTOR } from "../reducers/profileReducer.js";
>>>>>>> 8d43487be2fb3ac6eb896d9c872c4eb4e7c3344b

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
