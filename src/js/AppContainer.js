import React from 'react';
import {connect} from 'react-redux';
import App from './App';

export default connect(
    (state) => {
        var {isEditMode, isViewMode, mapId} = state.maps;
        
        return {
            mapId,
            isMapEditMode: isEditMode,
            isMapViewMode: isViewMode
        };
    }
)(App);
