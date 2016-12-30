import React from 'react';
import {connect} from 'react-redux';
import {mapSwitchModeToList, mapPointEdit} from 'actions';
import MapView from 'MapView';

export default connect(
    (state, ownProps) => {
        var mapId = ownProps.mapId;
        var map = state.maps.maps[mapId];
        var pointIds = state.mapPoints.mapIdToPointIds[mapId] || [];
        var points = pointIds.map((pointId) => {
            return state.mapPoints.points[pointId];
        });
        points.push({
            id:100,
            description: 'whatever',
            num_residents: 3,
            lng: -122.30280273302705,
            lat: 37.539297580788244
        });
        return {
            map,
            points
        };
    },
    (dispatch, ownProps) => {
        var mapId = ownProps.mapId;
        return {
            onListMapMode() {
                dispatch(mapSwitchModeToList());
            },
            onPointEdit(pointId, point) {
                dispatch(mapPointEdit(pointId, mapId, point));
            }
        }
    }
)(MapView);
