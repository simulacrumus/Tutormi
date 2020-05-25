import initialState from '../../initialState';
import moment from 'moment';
import {
    USER_LOGGED_IN, TOKEN_ACQUIRED, USER_INFO_UPDATED, AVAILABILITY_OPENED,
    AVAILABILITY_CANCELED, APPOINTMENT_BOOKED, APPOINTMENT_CANCELED
} from './userActions';

export default function userReducer(state = initialState, action) {
    let copiedAvailableHours = state.user.availableHours.slice();
    let copiedNewAppointments = state.user.appointments.slice();

    switch (action.type) {
        case USER_LOGGED_IN:
            return { ...state, user: action.payload }

        case TOKEN_ACQUIRED:
            return { ...state, token: action.payload }

        case USER_INFO_UPDATED:
            return {
                ...state, user: {
                    ...state.user,
                    user: { ...state.user.user, name: action.payload.name },
                    imgPath: action.payload.imgPath,
                    bio: action.payload.bio,
                    courses: action.payload.courses,
                    languages: action.payload.languages,
                    location: action.payload.location,
                    social: action.payload.social
                }
            };

        case AVAILABILITY_OPENED:
            copiedAvailableHours.push(action.payload);
            return {
                ...state, user: { ...state.user, availableHours: copiedAvailableHours }
            };

        case AVAILABILITY_CANCELED:
            copiedAvailableHours = copiedAvailableHours.filter((hour) => !action.payload.some((cancelHour) =>
                moment(hour).isSame(moment(cancelHour))));
            return { ...state, user: { ...state.user, availableHours: copiedAvailableHours } };

        case APPOINTMENT_BOOKED:
            copiedNewAppointments.push(action.payload);
            return { ...state, user: { ...state.user, appointments: copiedNewAppointments } };

        case APPOINTMENT_CANCELED: // Awful way of doing it because date formats are all messed up, will clean later 
            let deletedAppointments = state.user.appointments.filter((appointment) =>
                !(appointment.tutorID === action.payload.tutorID &&
                    new Date(appointment.time.start).getHours() === action.payload.time.start.getHours() &&
                    new Date(appointment.time.start).getDay() === action.payload.time.start.getDay() &&
                    new Date(appointment.time.start).getDay() === action.payload.time.start.getDay() &&
                    new Date(appointment.time.end).getHours() === action.payload.time.end.getHours()));
            return {
                ...state, user: { ...state.user, appointments: deletedAppointments }
            }

        default:
            return state;
    }

}