import { createAction } from "@reduxjs/toolkit";

//Actions
export const greetUser = createAction("GREET_USER");
export const addTutor = createAction("ADD_TUTOR");

//Reducer
export default function tutorSearchListReducer(state = [], action) {
  switch (action.type) {
    case addTutor.type:
      return [
        ...state,
        {
          name: action.payload.name,
          subject: action.payload.subject,
        },
      ];
    case greetUser.type:
      alert("Hello new User");
      return state;

    default:
      return state;
  }
}
