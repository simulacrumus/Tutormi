import { combineReducers } from "redux";
import tutorSearchListReducer from "./tutorSearchList";

// All reducers must be listed here so that they can be combined and associated with the store
export default combineReducers({ tutorSearchList: tutorSearchListReducer });
