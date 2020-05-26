import { createAction } from "@reduxjs/toolkit";

//Actions
export const addTutor = createAction("ADD_TUTOR");
export const deleteTutor = createAction("CLEAR_TUTORS");

//Reducer
export default function tutorSearchListReducer(state = [], action) {
  switch (action.type) {
    case addTutor.type:
      if (
        state.filter((tutor) => tutor.name === action.payload.name).length === 0
      ) {
        return [
          ...state,
          {
            bio: action.payload.bio,
            courses: action.payload.courses,
            languages: action.payload.languages,
            rating: action.payload.rating,
            name: action.payload.user.name,
            id: action.payload._id,
          },
        ];
      }
      break;

    case deleteTutor.type:
      return state.filter((tutor) => tutor === action.payload.tutor);

    default:
      return state;
  }
}
