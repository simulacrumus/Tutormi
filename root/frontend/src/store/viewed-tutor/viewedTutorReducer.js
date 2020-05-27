import {
  VIEWED_TUTOR_SET, VIEWED_TUTOR_CLEARED,
  VIEWED_TUTOR_AVAILABILITY_UPDATED, VIEWED_TUTOR_APPOINTMENT_BOOKED, VIEWED_TUTOR_APPOINTMENT_CANCELED
} from "./viewedTutorActions";
import moment from 'moment';
import { convertTimeSlotToSingleHours } from "../../util/scheduleFunctions";

export default function viewedTutorReducer(state = { viewedTutor: {} }, action) {
  switch (action.type) {
    case VIEWED_TUTOR_SET:
      return { ...state, viewedTutor: action.payload };

    case VIEWED_TUTOR_CLEARED:
      return { ...state, viewedTutor: null };

    case VIEWED_TUTOR_AVAILABILITY_UPDATED:
      let copiedAvailableHours = state.viewedTutor.availableHours.slice();
      copiedAvailableHours = copiedAvailableHours.filter((hour) => !action.payload.some((cancelHour) =>
        moment(hour).isSame(moment(cancelHour))));
      return { ...state, viewedTutor: { ...state.viewedTutor, availableHours: copiedAvailableHours } };

    case VIEWED_TUTOR_APPOINTMENT_BOOKED:
      let copiedNewAppointments = state.viewedTutor.appointments.slice();
      copiedNewAppointments.push(action.payload);
      return { ...state, viewedTutor: { ...state.viewedTutor, appointments: copiedNewAppointments } };

    case VIEWED_TUTOR_APPOINTMENT_CANCELED:
      let updatedOpenHours = state.viewedTutor.availableHours.concat(convertTimeSlotToSingleHours(action.payload));

      let deletedAppointments = state.viewedTutor.appointments.filter((appointment) =>
        !(appointment.tutor === action.payload.tutor && appointment.tutor === action.payload.tutor
          && moment(appointment.time.start).isSame(moment(action.payload.time.start))
          && moment(appointment.time.end).isSame(moment(action.payload.time.end))));
      return {
        ...state, viewedTutor: {
          ...state.viewedTutor,
          availableHours: updatedOpenHours,
          appointments: deletedAppointments
        }
      }

    default:
      return state;
  }
}