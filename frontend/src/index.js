import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'es6-promise/auto'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import 'bootstrap/dist/css/bootstrap.min.css';

import * as serviceWorker from './serviceWorker';
import { history, store } from './model/store';
import { App } from './view/App';

ReactDOM.render(
    //    <React.StrictMode>
    <Provider store={store}>
        <ConnectedRouter history={history}> { /* place ConnectedRouter under Provider */}
            <App />
        </ConnectedRouter>
    </Provider>
    //    </React.StrictMode >
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
