import React, { Component } from "react";
import { connect } from "react-redux";
import {
  calcTotalHours,
  convertAppointmentsListToSingleHours,
  calcTotalHoursPerMonth,
} from "../../util/scheduleFunctions.js";
import "./ScheduleMetrics.css";
import Chart from "chart.js";
import moment from "moment";
import { Line } from "react-chartjs-2";

class ScheduleMetrics extends Component {
  render() {
    return (
      <div className="scheduleMetricsContainer">
        <h4>Your Tutoring Stats</h4>
        <p>
          Number of booked appointment hours this week:
          <b>{` ${calcTotalHours(convertAppointmentsListToSingleHours(this.props.appointments), "week")}`}</b>
        </p>
        <p>
          Number of booked appointment hours this month:
          <b>{` ${calcTotalHours(convertAppointmentsListToSingleHours(this.props.appointments), "month")}`}</b>
        </p>
        <p>
          Number of booked appointment hours (all time):
          <b>{` ${convertAppointmentsListToSingleHours(this.props.appointments).length}`}</b>
        </p>
        <Line width="400" height="250" data={this.createChartData()} />
      </div>
    );
  }

  createChartData() {
    let months = [];
    let appointmentHoursPerMonth = [];

    for (let i = 0; i < 6; i++) {
      months[i] = moment().startOf("month").subtract(i, "month").format("MMMM");
      appointmentHoursPerMonth[i] = calcTotalHoursPerMonth(convertAppointmentsListToSingleHours(this.props.appointments), i);
    }

    let data = {
      labels: months.reverse(),
      datasets: [
        {
          label: "Appointment Hours",
          backgroundColor: "#ADBF6C",
          borderColor: "#c1d579",
          data: appointmentHoursPerMonth.reverse(),
          fill: false,
        }
      ],
    };

    return data;
  }
}

function mapStateToProps(state) {
  return {
    appointments: state.user.user.appointments,
    availableHours: state.user.user.availableHours,
  };
}

export default connect(mapStateToProps)(ScheduleMetrics);
