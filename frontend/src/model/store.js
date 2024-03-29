import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createLogger } from 'redux-logger';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import { userInfoReducer } from './userInfo';
import { roomReducer } from "./room";

const loggerMiddleware = createLogger();

const history = createBrowserHistory();

const store = configureStore({
    reducer: {
        router: connectRouter(history),
        userInfo: userInfoReducer,
        room: roomReducer
    },
    middleware: [...getDefaultMiddleware(), routerMiddleware(history), loggerMiddleware]
});

export { history, store };
