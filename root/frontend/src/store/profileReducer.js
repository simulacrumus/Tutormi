import initialState from '../initialState.js';
import { PURGE } from 'redux-persist';
import moment from 'moment';

export const CHANGE_VIEWED_TUTOR = "CHANGE_VIEWED_TUTOR";
export const CLEAR_VIEWED_TUTOR = "CLEAR_VIEWED_TUTOR";
export const BOOK_SLOT = "BOOK_SLOT";
export const UPDATE_USER = "UPDATE_USER";
export const CANCEL_APPOINTMENT = "CANCEL_APPOINTMENT";
export const OPEN_TIME_SLOT = "OPEN_TIME_SLOT";
export const CANCEL_AVAILABILITY = "CANCEL_AVAILABILITY";
export const USER_LOGGED_IN = "USER_LOGGED_IN";

export default function profileReducer(state = initialState, action) {
    let copiedAvailableHours = state.user.availableHours.slice();
    let copiedNewAppointments = state.user.appointments.slice();
    switch (action.type) {
        case USER_LOGGED_IN:
            return {...state, user: action.payload}

        case CHANGE_VIEWED_TUTOR:
            return { ...state, viewedTutor: action.payload }

        case CLEAR_VIEWED_TUTOR:
            return { ...state, viewedTutor: {} }

        case BOOK_SLOT:
            copiedNewAppointments.push(action.payload);
            return {...state,  user: {...state.user, appointments: copiedNewAppointments}};

        case UPDATE_USER:
            return {...state, user: {...state.user, 
                imgPath: action.payload.imgPath,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                about: action.payload.about,
                // languages: action.payload.languages,
                location: action.payload.location}};

        case CANCEL_APPOINTMENT: // Awful way of doing it because date formats are all messed up, will clean later 
        let deletedAppointments = state.user.appointments.filter( (appointment) => 
            !(appointment.tutorID === action.payload.tutorID && 
                new Date(appointment.time.start).getHours() === action.payload.time.start.getHours() && 
                new Date(appointment.time.start).getDay() === action.payload.time.start.getDay() && 
                new Date(appointment.time.start).getDay() === action.payload.time.start.getDay() && 
                new Date(appointment.time.end).getHours() === action.payload.time.end.getHours()));
            return { 
                ...state, user: {...state.user, appointments: deletedAppointments }
            }

        case OPEN_TIME_SLOT:
            copiedAvailableHours.push(action.payload);
            return { 
                ...state, user: {...state.user, availableHours: copiedAvailableHours }
            };

        case CANCEL_AVAILABILITY:
            copiedAvailableHours = copiedAvailableHours.filter( (hour) => !action.payload.some( (cancelHour) => 
            moment(hour).isSame(moment(cancelHour))));
            return {...state,  user: {...state.user, availableHours: copiedAvailableHours }};

        case PURGE: // Clears the cache, I use this for testing purposes 
            return initialState;

        default:
            return state;
    }
}