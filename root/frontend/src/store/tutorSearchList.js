import { createAction } from "@reduxjs/toolkit";
import { produce } from "immer";

//Actions
export const addTutor = createAction("ADD_TUTOR");
export const deleteTutor = createAction("CLEAR_TUTORS");

//Reducer
export default function tutorSearchListReducer(state = { tutors: [] }, action) {
  switch (action.type) {
    case addTutor.type:
      return produce(state, (draftState) => {
        draftState.tutors = action.payload;
      });

    case deleteTutor.type:
      return produce(state, (draftState) => {
        draftState.tutors.length = 0;
      });

    default:
      return state;
  }
}
