import { combineReducers } from 'redux';
<<<<<<< HEAD:root/frontend/src/store/rootReducer.js
import profileReducer from '../reducers/profileReducer.js';
=======
import profileReducer from './reducers/profileReducer.js';
>>>>>>> 8d43487be2fb3ac6eb896d9c872c4eb4e7c3344b:root/frontend/src/rootReducer.js

// All reducers must be listed here so that they can be combined and associated with the store
export default combineReducers({
    profileReducer
});