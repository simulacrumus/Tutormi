import React, { Component } from "react";
import moment from "moment";
import { displayHour12Format } from "../../util/scheduleFunctions.js";
import TodayIcon from '@material-ui/icons/Today';

export default class AppointmentView extends Component {

    render() {
        return (
            <div tabIndex="0" className="appointmentView" >
                <h5><TodayIcon /> {`${displayHour12Format(moment(this.props.appointment.time.start).hours())} 
                ${moment(this.props.appointment.time.start).format("DD MMM")} - ${this.calcAppointmentLength()} hour(s)`}</h5>
                {`Tutor:  ${this.props.appointment.tutor.name}`}
                <br />
                {`Subject:  ${this.props.appointment.subject}`}
                <br />
                {`Notes:  ${this.props.appointment.note}`}
            </div>
        );
    }

    calcAppointmentLength() {
        let difference = moment.duration(moment(this.props.appointment.time.end).diff(moment(this.props.appointment.time.start)));
        return difference.asHours();
    }

}
