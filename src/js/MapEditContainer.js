import React from 'react';
import {connect} from 'react-redux';
import MapEdit from 'MapEdit';
import {mapSwitchModeToList, mapEdit, mapEditValidate} from 'actions';
import validate from "validate.js";

var lngConstraint = {
    presence: true,
    numericality: true
};
var latConstraint = {
    presence: true,
    numericality: {
        greaterThanOrEqualTo: -90,
        lessThanOrEqualTo: 90
    }
};
var constraints = {
    sw_lng: lngConstraint,
    sw_lat: latConstraint,
    ne_lng: lngConstraint,
    ne_lat: latConstraint
};


export default connect(
    (state, ownProps) => {
        var mapId = ownProps.mapId;
        var {editError, editValidation} = state.maps;
        
        var sw_lng = '';
        var sw_lat = '';
        var ne_lng = '';
        var ne_lat = '',

        editValidation = editValidation || {};
        var sw_lngError = editValidation.sw_lng;
        var sw_latError = editValidation.sw_lat;
        var ne_lngError = editValidation.ne_lng;
        var ne_latError = editValidation.ne_lat;

        return {
            mapId,
            editError,
            sw_lng, sw_lat, 
            ne_lng, ne_lat,
            sw_lngError, sw_latError,
            ne_lngError, ne_latError
        };
    },
    (dispatch, ownProps) => {
        var mapId = ownProps.mapId;
        return {
            onListMapMode() {
                dispatch(mapSwitchModeToList());
            },
            onSubmit(mapParams) {
                var validationErrors = validate(mapParams, constraints);
                if (!validationErrors) {
                    return dispatch(mapEdit(mapId, mapParams));
                }
                dispatch(mapEditValidate(validationErrors));
            }
        }
    }
)(MapEdit);
