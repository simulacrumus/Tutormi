import { combineReducers } from "redux";
import tutorSearchListReducer from "./tutorSearchList";
import profileReducer from './profileReducer.js';

// All reducers must be listed here so that they can be combined and associated with the store
export default combineReducers(
    { profileReducer: profileReducer },
    { tutorSearchList: tutorSearchListReducer }
);


