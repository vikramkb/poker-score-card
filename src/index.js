import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import Home from './components/play/Home.jsx';
import AllTables from './components/table/AllTables.jsx';
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appStore from './reducers';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NewTablePage from "./components/players/NewTablePage.jsx";
export const store = createStore(appStore, applyMiddleware(thunkMiddleware));


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={AllTables} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/all-tables" component={AllTables} />
                    <Route exact path="/create-table" component={NewTablePage} />
                </Switch>

            </div>
        </Router>
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
