import React from 'react';
import {connect} from 'react-redux';
import MapList from './MapList';
import {mapSwitchModeToEdit, mapSwitchModeToView} from 'actions';

export default connect(
    (state, ownProps) => {
        var mapId = ownProps.mapId;
        var maps = state.maps.maps;
        var mapsAsArray = Object.keys(maps).map((mapId) => maps[mapId]);
        var fetchError = state.maps.fetchError;

        return { 
            maps: mapsAsArray
        };
    },
    (dispatch, ownProps) => {
        var mapId = ownProps.mapId;
        return {
            onEditMapMode() {
                dispatch(mapSwitchModeToEdit(mapId));
            },
            onViewMapMode() {
                dispatch(mapSwitchModeToView(mapId));
            }
        }
    }
)(MapList);
