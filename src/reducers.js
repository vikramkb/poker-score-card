import { combineReducers } from 'redux';
import score from "./reducers/score";

const appStore = combineReducers({
    score: score
});

export default appStore;