import { combineReducers } from 'redux';
import profileReducer from './reducers/profileReducer.js';

// All reducers must be listed here so that they can be combined and associated with the store
export default combineReducers({
    profileReducer
});