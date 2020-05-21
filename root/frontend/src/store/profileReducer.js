import initialState from "../initialState.js";

export const CHANGE_VIEWED_TUTOR = "CHANGE_VIEWED_TUTOR";
export const CLEAR_VIEWED_TUTOR = "CLEAR_VIEWED_TUTOR";
export const BOOK_SLOT = "BOOK_SLOT";
export const UPDATE_USER = "UPDATE_USER";
export const CANCEL_APPOINTMENT = "CANCEL_APPOINTMENT";

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEWED_TUTOR:
      return { ...state, viewedTutor: action.payload };

    case CLEAR_VIEWED_TUTOR:
      return { ...state, viewedTutor: {} };

    case BOOK_SLOT:
      let newAppointments = state.user.appointments.slice();
      newAppointments.push(action.payload);
      return {
        ...state,
        user: { ...state.user, appointments: newAppointments },
      };

    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          imgPath: action.payload.imgPath,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          about: action.payload.about,
          // languages: action.payload.languages,
          location: action.payload.location,
        },
      };

    case CANCEL_APPOINTMENT: // Awful way of doing it because date formats are all messed up, will clean later
      let deletedAppointments = state.user.appointments.filter(
        (appointment) =>
          !(
            appointment.tutorID === action.payload.tutorID &&
            new Date(appointment.timeBlock.startTime).getHours() ===
              action.payload.timeBlock.startTime.getHours() &&
            new Date(appointment.timeBlock.startTime).getDay() ===
              action.payload.timeBlock.startTime.getDay() &&
            new Date(appointment.timeBlock.startTime).getDay() ===
              action.payload.timeBlock.startTime.getDay() &&
            new Date(appointment.timeBlock.endTime).getHours() ===
              action.payload.timeBlock.endTime.getHours()
          )
      );
      return {
        ...state,
        user: { ...state.user, appointments: deletedAppointments },
      };

    default:
      return state;
  }
}
