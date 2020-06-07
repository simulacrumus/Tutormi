import { store } from "../configureStore";
import { cancelViewedTutorAppointment } from "../viewed-tutor/viewedTutorActions";
import { isViewedTutorSet } from "../../util/authenticationFunctions";
import { logIn } from "../../util/apiCallFunctions";

// General user actions
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const USER_WITHOUT_PROFILE_LOGGED_IN = "USER_WITHOUT_PROFILE_LOGGED_IN";
export const TOKEN_ACQUIRED = "TOKEN_ACQUIRED";
export const USER_INFO_UPDATED = "USER_INFO_UPDATED";
export const USER_IMAGE_UPDATED = "USER_IMAGE_UPDATED";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const USER_ADDED_TO_FAVORITES = "USER_ADDED_TO_FAVORITES";
export const USER_REMOVED_FAVORITE = "USER_REMOVED_FAVORITE";
export const USER_RATED_TUTOR = "USER_RATED_TUTOR";
// Schedule specific actions
export const AVAILABILITY_OPENED = "AVAILABILITY_OPENED";
export const AVAILABILITY_CANCELED = "AVAILABILITY_CANCELED";
export const APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED";
export const APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED";

export function addRatingToTutor(rating) {
  store.dispatch({
    type: USER_RATED_TUTOR,
    payload: { rating: rating }
  })
}

export function addTutorToFavorites(tutor) {
  store.dispatch({
    type: USER_ADDED_TO_FAVORITES,
    payload: tutor
  });
}

export function removeTutorFromFavorites(tutorId) {
  store.dispatch({
    type: USER_REMOVED_FAVORITE,
    payload: tutorId
  });
}

export function userWithProfileLoggedIn(user) {
  store.dispatch({
    type: USER_LOGGED_IN,
    payload: { user: user },
  });
}

export function userWithoutProfileLoggedIn(userType) {
  store.dispatch({
    type: USER_WITHOUT_PROFILE_LOGGED_IN,
    payload: { type: userType }
  });
}

export function addToken(token) {
  store.dispatch({
    type: TOKEN_ACQUIRED,
    payload: { token: token }
  });
}

export function logout() {
  store.dispatch({ type: USER_LOGGED_OUT });
}

export function changeUserImage(profilePic) {
  store.dispatch({ type: USER_IMAGE_UPDATED, payload: profilePic });
}

export function cancelAppointment(appointment) {
  store.dispatch({
    type: APPOINTMENT_CANCELED,
    payload: appointment,
  });

  if (isViewedTutorSet() && store.getState().viewedTutor.viewedTutor._id === appointment.tutor.id)
    cancelViewedTutorAppointment(appointment); // Clear the viewed tutor appointment to keep page responsive
}

export async function updateUser(updateInfo) {
  await store.dispatch({
    type: USER_INFO_UPDATED,
    payload: updateInfo,
  });
}

export function openAvailabilityHour(availabilityDate) {
  store.dispatch({
    type: AVAILABILITY_OPENED,
    payload: availabilityDate,
  });
}

export function bookAppointment(appointment) {
  store.dispatch({
    type: APPOINTMENT_BOOKED,
    payload: appointment,
  });
}
