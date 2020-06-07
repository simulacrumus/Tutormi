import moment from 'moment';
import {
    USER_LOGGED_IN, USER_INFO_UPDATED, AVAILABILITY_OPENED,
    AVAILABILITY_CANCELED, APPOINTMENT_BOOKED, APPOINTMENT_CANCELED, USER_LOGGED_OUT,
    USER_IMAGE_UPDATED, USER_ADDED_TO_FAVORITES, USER_REMOVED_FAVORITE, USER_WITHOUT_PROFILE_LOGGED_IN
} from './userActions';
import { convertTimeSlotToSingleHours } from "../../util/scheduleFunctions";

const initialState = {
    user: null, // User who is currently logged into the app
    token: null, // Token used to make API calls
    isLoggedIn: false, // Whether the user is logged in or not
    hasSetupUpProfile: false
}

export default function userReducer(state = initialState, action) {
    let copiedAvailableHours;
    let copiedNewAppointments;

    if (state.isLoggedIn && state.hasSetupUpProfile) {
        copiedAvailableHours = state.user.user.type === "tutor" ? state.user.availableHours.slice() : undefined;
        copiedNewAppointments = state.user.appointments.slice();
    }

    switch (action.type) {
        case USER_LOGGED_IN:
            return {
                user: action.payload.user,
                token: action.payload.token,
                isLoggedIn: true,
                hasSetupUpProfile: true
            }

        case USER_WITHOUT_PROFILE_LOGGED_IN:
            return {
                token: action.payload.token,
                isLoggedIn: true,
                user: { user: { type: action.payload.type } }
            }

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

        case USER_ADDED_TO_FAVORITES:
            let favoritesList = state.user.favorites.slice();
            favoritesList.push(action.payload);
            return { ...state, user: { ...state.user, favorites: favoritesList } };

        case USER_REMOVED_FAVORITE:
            let favoritesListDel = state.user.favorites.slice();
            favoritesListDel = favoritesListDel.filter((tutor) => tutor._id !== action.payload);
            return { ...state, user: { ...state.user, favorites: favoritesListDel } };

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