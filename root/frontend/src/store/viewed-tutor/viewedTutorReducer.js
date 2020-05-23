import { VIEWED_TUTOR_SET, VIEWED_TUTOR_CLEARED } from "./viewedTutorActions";

export default function viewedTutorReducer(
  state = { viewedTutor: null },
  action
) {
  switch (action.type) {
    case VIEWED_TUTOR_SET:
      return { ...state, viewedTutor: action.payload };

    case VIEWED_TUTOR_CLEARED:
      return { ...state, viewedTutor: null };

    default:
      return state;
  }
}
