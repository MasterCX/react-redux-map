import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import mapAppReducer from './reducers/mapAppReducer';
import App from './App';
import './stylesheets/index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const loggerMiddleware = createLogger()

const store = createStore(mapAppReducer,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    ),
    rootElement = document.getElementById('root');
    
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);
