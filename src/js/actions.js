/* global $ */

export const _getErrorFromXhr = (jqXHR) => {
    var error;
    try {
        var json = JSON.parse(jqXHR.responseText);
        error = json.error;
    } catch (e) {
        error = jqXHR.responseText;
    }
    return error || "Unknown Error";
}



export const mapFetch = () => (dispatch, getState) => {
    $.get('/maps')
    .done((response) => {
        dispatch({
            type: "MAPS_FETCH_SUCCESS",
            response
        });
    })
    .fail((jqXHR, textStatus) => {
        dispatch({
            type: "MAPS_FETCH_ERROR",
            error: _getErrorFromXhr(jqXHR)
        });
    });
}

export const mapEditValidate = (editValidation) => {
    return {
        type: "MAPS_EDIT_VALIDATE",
        editValidation
    }
}


export const mapEdit = (mapId, {sw_lng, sw_lat, ne_lng, ne_lat}) => (dispatch, getState) => {
    var url = mapId ? '/maps/' + mapId : '/maps';
    $.ajax(url, {
        type:'post',
        data: JSON.stringify({sw_lng, sw_lat, ne_lng, ne_lat}),
        processData: false,
        contentType: 'application/json'
    })
    .done((response) => {
        dispatch({
            type: "MAPS_EDIT_SUCCESS",
            mapId,
            response
        });
    })
    .fail((jqXHR) => {
        dispatch({
            type: "MAPS_EDIT_ERROR",
            mapId,
            error: _getErrorFromXhr(jqXHR)
        });
    });
}

export const mapDelete = (mapId) => (dispatch, getState) => {
    $.post('/maps/' + mapId + '/delete')
    .done((response) => {
        dispatch({
            type: "MAPS_DELETE_SUCCESS",
            mapId
        });
    })
    .fail((jqXHR) => {
        dispatch({
            type: "MAPS_DELETE_ERROR",
            mapId,
            error: _getErrorFromXhr(jqXHR)
        });
    });
}

export const mapSwitchModeToList = () => {
    return {
        type: "MAPS_LIST_MODE"
    }
}
export const mapSwitchModeToView = (mapId) => (dispatch, getState) => {
    dispatch({
        type: "MAPS_VIEW_MODE",
        mapId
    });
    dispatch(mapPointFetch(mapId));
}
export const mapSwitchModeToEdit = (mapId) => {
    return {
        type: "MAPS_EDIT_MODE",
        mapId
    }
}

export const mapPointFetch = (mapId) => (dispatch) => {
    $.get('/maps/' + mapId + '/points')
    .done((response) => {
        dispatch({
            type: "POINT_FETCH_SUCCESS",
            mapId,
            response
        });
    })
    .fail((jqXHR) => {
        dispatch({
            type: "POINT_FETCH_ERROR",
            mapId,
            error: _getErrorFromXhr(jqXHR)
        });
    });
}

// export const mapPointEdit = (pointId, mapId, pointAttributes) => {
//     return {
//         type: "POINT_EDIT",
//         mapId,
//         pointId,
//         pointAttributes
//     }
// }

export const mapPointEdit = (pointId, mapId, pointAttributes) => (dispatch, getState) => {
    var url = '/maps/' + mapId + '/points';
    if (pointId) {
        url = url + '/' + pointId;
    }
    var existingPointAttributes = pointId && getState().mapPoints.points[pointId];
    pointAttributes = Object.assign({}, (existingPointAttributes || {}), pointAttributes);
    
    $.ajax(url, {
        type:'post',
        data: JSON.stringify(pointAttributes),
        processData: false,
        contentType: 'application/json'
    })
    .done((response) => {
        pointId = response.id;
        dispatch({
            type: "POINT_EDIT_SUCCESS",
            mapId, pointId, response
        });

    })
    .fail((jqXHR) => {
        dispatch({
            type: "POINT_EDIT_ERROR",
            mapId, pointId,
            error: _getErrorFromXhr(jqXHR)
        });
    });
}

export const mapPointDelete = (pointId, mapId) => (dispatch, getState) => {
    var url = '/maps/' + mapId + '/points/' + pointId + '/delete';
    $.post(url, {
        contentType: 'application/json'
    })
    .done((response) => {
        dispatch({
            type: "POINT_DELETE_SUCCESS",
            mapId, pointId
        });

    })
    .fail((jqXHR) => {
        dispatch({
            type: "POINT_DELETE_ERROR",
            mapId, pointId,
            error: _getErrorFromXhr(jqXHR)
        });
    });
}

