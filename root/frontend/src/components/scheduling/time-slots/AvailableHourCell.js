import React, { Component } from "react";
import { displayHour12Format } from "../../../util/scheduleFunctions";
import { connect } from "react-redux";
import { addTemporaryBookingHour, removeTemporaryBookingHour } from "../../../store/user/userActions";
import moment from "moment";

class AvailableHourCell extends Component {

    constructor(props) {
        super(props);
        this.handleSelection = this.handleSelection.bind(this);
    }

    render() {
        return (
            <td className="availableHourCell" onClick={this.handleSelection}>
                {`${displayHour12Format(this.props.timeSlot.time.start.hours())}-
                    ${displayHour12Format(this.props.timeSlot.time.end.hours())}`}
            </td>
        );
    }

    handleSelection(e) {
        if (e.target.className === "availableHourCell") {
            e.target.className = "temporaryAppointmentHour";
            addTemporaryBookingHour(this.props.timeSlot);
        } else {
            e.target.className = "availableHourCell";
            removeTemporaryBookingHour(this.props.timeSlot);
        }

    }

}

function mapStateToProps(state) {
    return {
        type: state.userReducer.user.user.type,
        tuteeId: state.userReducer.user._id,
        viewedTutor: state.viewedTutorReducer.viewedTutor
    };
}

export default connect(mapStateToProps)(AvailableHourCell);
