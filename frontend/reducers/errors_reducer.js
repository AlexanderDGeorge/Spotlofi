import { RECEIVE_ERRORS, RECEIVE_USER, CLEAR_ERRORS } from "../actions/session_actions";

const errorsReducer = (oldState = [], action) => {
    Object.freeze(oldState);
    switch (action.type) {
        case RECEIVE_ERRORS:
            return action.errors;
        case RECEIVE_USER:
            return [];
        case CLEAR_ERRORS:
            return [];
        default:
            return oldState;
  }
};

export default errorsReducer;