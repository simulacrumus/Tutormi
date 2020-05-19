import React, { Component } from 'react';
import './OpenableTimeSlot.css';
import { store } from "../../store/configureStore.js";
import { OPEN_TIME_SLOT } from "../../store/profileReducer.js";

export default class OpenableTimeSlot extends Component {

    constructor(props) {
        super(props);
        this.openSlot = this.openSlot.bind(this);
    }

    render() {
        return (
            <td className="openableSlot" onClick={this.openSlot}
                onMouseOver={
                    (e) => {
                        if (e.buttons === 1) // If left button was clicked when mouse went over cell (drag event)
                            this.openSlot();
                    }}
                onMouseDown={(e) => {
                    if (e.buttons === 1) // Only want this behavior for left mouse button down
                        this.openSlot();
                }}></td>
        );
    }

    openSlot() {
        let date = new Date(this.props.date.year(), this.props.date.month(), this.props.date.date(), this.props.hour);
        store.dispatch({
            type: OPEN_TIME_SLOT,
            payload: { start: date }
        });
    }

}

