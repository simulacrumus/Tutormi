import { combineReducers } from "redux";
import tutorSearchListReducer from "./tutorSearchList";
import userReducer from "./user/userReducer.js";
import viewedTutorReducer from "../store/viewed-tutor/viewedTutorReducer";

// All reducers must be listed here so that they can be combined and associated with the store
export default combineReducers({
  profileReducer: userReducer,
  tutorSearchList: tutorSearchListReducer,
  viewedTutorReducer: viewedTutorReducer,
});
