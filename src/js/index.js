import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer';
import style from 'less/style.less';
import store from 'store';
import {Provider} from 'react-redux';
import {mapFetch} from 'actions';



if (document.getElementById('app')) {
    ReactDOM.render(
        (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        ), document.getElementById('app')
    );
    store.dispatch(mapFetch());
}
