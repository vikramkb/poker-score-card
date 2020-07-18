import { combineReducers } from 'redux';
import score2 from "./reducers/score";

const appStore = combineReducers({
    score: score2
});

export default appStore;