import initialState from '../../initialState';
import moment from 'moment';
import {
    USER_LOGGED_IN, TOKEN_ACQUIRED, USER_INFO_UPDATED, AVAILABILITY_OPENED,
    AVAILABILITY_CANCELED, APPOINTMENT_BOOKED, APPOINTMENT_CANCELED,
    TUTEE_CHOSE_ONE_APPOINTMENT_HOUR, TEMP_LIST_CLEARED, TEMP_HOUR_REMOVED
} from './userActions';
import { fallsOnSameDay } from "../../util/scheduleFunctions"

export default function userReducer(state = initialState, action) {
    let copiedAvailableHours = state.user.availableHours !== undefined
        ? state.user.availableHours.slice() : undefined;
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

        case APPOINTMENT_CANCELED:
            let deletedAppointments = state.user.appointments.filter((appointment) =>
                !(appointment.tutor === action.payload.tutor && appointment.tutor === action.payload.tutor
                    && moment(appointment.time.start).isSame(moment(action.payload.time.start))
                    && moment(appointment.time.end).isSame(moment(action.payload.time.end))));
            return {
                ...state, user: { ...state.user, appointments: deletedAppointments }
            }

        case TUTEE_CHOSE_ONE_APPOINTMENT_HOUR:
            let newTempList = state.tempBooking.slice();
            newTempList.push(action.payload);
            return { ...state, tempBooking: newTempList };

        case TEMP_HOUR_REMOVED:
            let newTempList2 = state.tempBooking.slice();
            newTempList2 = newTempList2.filter((timeSlot) => !(moment(timeSlot.time.start).isSame(moment(action.payload.time.start))));
            return { ...state, tempBooking: newTempList2 };

        case TEMP_LIST_CLEARED:
            return { ...state, tempBooking: [] };

        default:
            return state;
    }

}