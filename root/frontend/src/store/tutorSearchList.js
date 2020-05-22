import { createAction } from "@reduxjs/toolkit";

//Actions
export const addTutor = createAction("ADD_TUTOR");

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
            name: action.payload.user.name, //This field's no longer are present, but somehow this works
            id: action.payload.user._id, //This field's no longer are present, but somehow this works
          },
        ];
      }

    default:
      return state;
  }
}
