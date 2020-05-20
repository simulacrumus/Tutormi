import React, { Component } from "react";
import { connect } from "react-redux";
import { calcTotalHours, convertAppointmentsListToSingleHours, calcTotalHoursPerMonth } from "../../util/scheduleFunctions.js";
import './ScheduleMetrics.css';
import Chart from 'chart.js';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

class ScheduleMetrics extends Component {

    render() {
        return (
            <div className="scheduleMetricsContainer">
                <h4>Your Tutoring Stats</h4>
                <p>Number of open hours this week: <b>{calcTotalHours(this.props.availableHours, "week")}</b>
                    <br />
                Number of booked appointment hours this week: <b>{calcTotalHours(convertAppointmentsListToSingleHours(this.props.appointments), "week")}</b>
                </p>
                <p>Number of open hours this month: <b>{calcTotalHours(this.props.availableHours, "month")}</b>
                    <br />
                Number of booked appointment hours this month: <b>{calcTotalHours(convertAppointmentsListToSingleHours(this.props.appointments), "month")}</b>
                </p>
                <p>Number of open hours (all time): <b>{this.props.availableHours.length}</b>
                    <br />
                Number of booked appointment hours (all time): <b>{convertAppointmentsListToSingleHours(this.props.appointments).length}</b>
                </p>
                <Line width="400" height="250" data={this.createChartData()} />
            </div>
        );
    }

    createChartData() {
        let months = [];
        let availableHoursPerMonth = [];
        let appointmentHoursPerMonth = [];

        for (let i = 0; i < 6; i++) {
            months[i] = moment().startOf("month").subtract(i, "month").format("MMMM");
            availableHoursPerMonth[i] = calcTotalHoursPerMonth(this.props.availableHours, i);
            appointmentHoursPerMonth[i] = calcTotalHoursPerMonth(convertAppointmentsListToSingleHours(this.props.appointments), i);
        }

        let data = {
            labels: months.reverse(),
            datasets: [
                {
                    label: 'Available Hours',
                    backgroundColor: '#409c93',
                    borderColor: '#4DB6AC',
                    data: availableHoursPerMonth.reverse(),
                    fill: false
                },
                {
                    label: 'Appointment Hours',
                    backgroundColor: '#ADBF6C',
                    borderColor: '#c1d579',
                    data: appointmentHoursPerMonth.reverse(),
                    fill: false
                }
            ]
        };

        return data;
    }

}

function mapStateToProps(state) {
    return {
        appointments: state.profileReducer.user.appointments,
        availableHours: state.profileReducer.user.availableHours
    };
}

export default connect(mapStateToProps)(ScheduleMetrics);