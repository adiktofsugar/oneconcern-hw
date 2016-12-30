import React from 'react';
import {connect} from 'react-redux';
import MapListItem from 'MapListItem';
import {mapSwitchModeToView, mapSwitchModeToEdit, mapDelete} from 'actions';

export default connect(
    (state, ownProps) => {
        var mapId = ownProps.id;
        var map = state.maps.maps[mapId];
        var {sw_lng, sw_lat, ne_lng, ne_lat} = map;
        var deleteError = state.maps.deleteErrors[mapId];
        return {
            mapId,
            sw_lng, sw_lat, ne_lng, ne_lat,
            deleteError
        }
    },
    (dispatch, ownProps) => {
        var mapId = ownProps.id;
        return {
            onViewClick() {
                dispatch(mapSwitchModeToView(mapId));
            },
            onEditClick() {
                dispatch(mapSwitchModeToEdit(mapId));
            },
            onDeleteClick() {
                dispatch(mapDelete(mapId));
            }
        }
    }
)(MapListItem);
