import moment from 'moment';
import {
    USER_LOGGED_IN, USER_INFO_UPDATED, AVAILABILITY_OPENED,
    AVAILABILITY_CANCELED, APPOINTMENT_BOOKED, APPOINTMENT_CANCELED, USER_LOGGED_OUT,
    USER_IMAGE_UPDATED
} from './userActions';
import { convertTimeSlotToSingleHours } from "../../util/scheduleFunctions";

const initialState = {
    user: null, // User who is currently logged into the app
    token: null, // Token used to make API calls
    isLoggedIn: false, // Whether the user is logged in or not
}

export default function userReducer(state = initialState, action) {
    let copiedAvailableHours;
    let copiedNewAppointments;

    if (state.isLoggedIn) {
        copiedAvailableHours = state.user.user.type === "tutor" ? state.user.availableHours.slice() : undefined;
        copiedNewAppointments = state.user.appointments.slice();
    }

    switch (action.type) {
        case USER_LOGGED_IN:
            return { user: action.payload.user, token: action.payload.token, isLoggedIn: true }

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
            let deletedAppointments = state.user.appointments.filter((appointment) => !(appointment._id === action.payload._id));
            if (state.user.user.type === "tutee") {
                return { ...state, user: { ...state.user, appointments: deletedAppointments } }
            } else { // If the user is a tutor their available hours must be updated
                return {
                    ...state, user: {
                        ...state.user, appointments: deletedAppointments,
                        availableHours: copiedAvailableHours.concat(convertTimeSlotToSingleHours(action.payload))
                    }
                }
            }

        case USER_IMAGE_UPDATED:
            return { ...state, user: { ...state.user, profilePic: action.payload } }

        case USER_LOGGED_OUT:
            return initialState;

        default:
            return state;
    }

}