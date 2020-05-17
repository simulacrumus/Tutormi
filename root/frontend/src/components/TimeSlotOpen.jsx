import React, { Component } from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import '../styles/TimeSlotOpen.css';
import { store } from "../configureStore.js";
import { BOOK_SLOT } from "../reducers/profileReducer.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class TimeSlotOpen extends Component {

    render() {
        return (
            <OverlayTrigger trigger="click" placement="bottom" overlay={this.popover}>
                <td rowSpan={parseInt(this.props.timeSlot.endTime.getHours()) - parseInt(this.props.timeSlot.startTime.getHours())} className="open">
                    {this.props.timeSlot.startTime.getHours() + ":00-" + this.props.timeSlot.endTime.getHours()}:00 PM</td>
            </OverlayTrigger>
        );
    }

    popover = (
        <Popover id="popover-basic">
            <Popover.Title >
                <div className="popoverTitleContainer">
                    <div>
                        <img className="timeIcon" src={require("../images/time-icon.png")}></img>
                        {this.props.timeSlot.startTime.getHours() + ":00-" + this.props.timeSlot.endTime.getHours()}:00 PM
                    </div>
                </div>
            </Popover.Title>
            <Popover.Content>
                {/* {`${this.props.tutor.firstName} ${this.props.tutor.lastName}`} */}
                <Form.Label>Course</Form.Label>
                <Form.Control size="sm" as="select" id="coursesSelect">
                    {this.props.tutor.courses.map((course) => <option value={course}>{course}</option>)}
                </Form.Control>
                <Form.Control size="sm" type="text" placeholder="Notes" id="notesInput" />
                <button onClick={() => this.bookSlot()}>Book Appointment</button>
            </Popover.Content>
        </Popover>
    );

    bookSlot() {
        store.dispatch({
            type: BOOK_SLOT,
            payload: {
                tutorID: this.props.tutor.firstName + " " + this.props.tutor.lastName,
                timeBlock: {
                    startTime: this.props.timeSlot.startTime,
                    endTime: this.props.timeSlot.endTime
                },
                subject: document.getElementById("coursesSelect").value,
                note: document.getElementById("notesInput").value
            }
        });
    }

}