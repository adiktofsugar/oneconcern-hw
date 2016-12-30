import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import ReduxThunk from 'redux-thunk';

var autoPointId = 1;
const getPointId = () => {
    return autoPointId++;
}

function mapPoints(state={
    points: {
        // key is point id
    },
    mapIdToPointIds: {
        // key is map id. points to array of point ids
    },
    editErrors: {
        // key is map id
    },
    deleteErrors: {
        // key is map id
    },
    fetchErrors: {
        // key is map id
    }
}, action) {
    switch(action.type) {

        case "POINT_FETCH_SUCCESS": {
            let {mapId, response} = action;
            // response is points in array

            let newPoints = Object.assign({}, state.points);
            let mapPointIds = [];
            response.forEach((point) => {
                newPoints[point.id] = point;
                mapPointIds.push(point.id);
            });

            return Object.assign({}, state, {
                points: newPoints,
                mapIdToPointIds: Object.assign({}, state.mapIdToPointIds, {
                    [mapId]: mapPointIds
                }),
                fetchErrors: Object.assign({}, state.fetchErrors, {
                    [mapId]: null
                })
            });
        }
        case "POINT_FETCH_ERROR": {
            let {mapId, error} = action;
            return Object.assign({}, state, {
                fetchErrors: Object.assign({}, state.fetchErrors, {
                    [mapId]: error
                })
            });

        }
        
        case "POINT_EDIT": {
            let {pointId, mapId, pointAttributes} = action;
            
            let existingPoint = state.points[pointId] || {};
            let newPoints = Object.assign({}, state.points);
            let mapPointIds = state.mapIdToPointIds[mapId] || [];
            
            if (!pointId) {
                pointId = getPointId();
            }
            let point = Object.assign({}, existingPoint, pointAttributes, {id:pointId});
            newPoints[point.id] = point;
            mapPointIds.push(point.id);

            return Object.assign({}, state, {
                points: newPoints,
                mapIdToPointIds: Object.assign({}, state.mapIdToPointIds, {
                    [mapId]: mapPointIds
                })
            });
        }

        case "POINT_EDIT_SUCCESS": {
            let {mapId, pointId, response} = action;
            
            let newMapIdToPointIds = Object.assign({}, state.mapIdToPointIds);
            if (!newMapIdToPointIds[mapId]) {
                newMapIdToPointIds[mapId] = [];
            }
            if (newMapIdToPointIds[mapId].indexOf(pointId) == -1) {
                newMapIdToPointIds[mapId].push(pointId);
            }

            return Object.assign({}, state, {
                points: Object.assign({}, state.points, {
                    [pointId]: response
                }),
                mapIdToPointIds: newMapIdToPointIds,
                editErrors: Object.assign({}, state.editErrors, {
                    [mapId]: null
                }),
                deleteErrors: Object.assign({}, state.deleteErrors, {
                    [mapId]: null
                })
            });
        }
        case "POINT_EDIT_ERROR": {
            let {mapId, pointId, error} = action;
            return Object.assign({}, state, {
                editErrors: Object.assign({}, state.editErrors, {
                    [mapId]: error
                })
            });
        }
        case "POINT_DELETE_SUCCESS": {
            let {mapId, pointId} = action;
            
            let newPoints = Object.assign({}, state.points);
            delete newPoints[pointId];

            let newMapIdToPointIds = Object.assign({}, state.newMapIdToPointIds);
            newMapIdToPointIds[mapId] = (newMapIdToPointIds[mapId] || [])
                .filter((existingPointId) => {
                    return existingPointId != pointId;
                });
            
            return Object.assign({}, state, {
                points: newPoints,
                mapIdToPointIds: newMapIdToPointIds,
                editErrors: Object.assign({}, state.editErrors, {
                    [mapId]: null
                }),
                deleteErrors: Object.assign({}, state.deleteErrors, {
                    [mapId]: null
                })
            });

        }
        case "POINT_DELETE_ERROR": {
            let {mapId, pointId, error} = action;
            return Object.assign({}, state, {
                deleteErrors: Object.assign({}, state.deleteErrors, {
                    [mapId]: error
                })
            });
        }
        default:
            return state;
    }
};

function maps(state={
    isEditMode: false,
    isViewMode: false,

    maps: {
        // keys are map ids
    },
    
    fetchError: null,
    editError: null,
    editValidation: null,
    deleteErrors: {
        // keys are map ids
    },

    mapId: null
}, action) {
    switch(action.type) {
        case "MAPS_LIST_MODE":
            return Object.assign({}, state, {
                isEditMode: false,
                isViewMode: false,
                mapId: null
            });
        
        
        case "MAPS_EDIT_MODE":
            return Object.assign({}, state, {
                isEditMode: true,
                isViewMode: false,
                mapId: action.mapId,
                editValidation: null
            });

        case "MAPS_VIEW_MODE":
            return Object.assign({}, state, {
                isEditMode: false,
                isViewMode: true,
                mapId: action.mapId
            });

        case "MAPS_FETCH_SUCCESS":
            var mapsAsObject = {};
            (action.response || []).forEach((map) => {
                mapsAsObject[map.id] = map;
            });
            return Object.assign({}, state, {
                maps: Object.assign({}, state.maps, mapsAsObject)
            });
        
        case "MAPS_FETCH_ERROR":
            return Object.assign({}, state, {
                fetchError: action.error
            });

        case "MAPS_EDIT_VALIDATE": {
            return Object.assign({}, state, {
                editValidation: action.editValidation
            });
        }

        case "MAPS_EDIT_SUCCESS":
            var map = action.response;
            return Object.assign({}, state, {
                maps: Object.assign({}, state.maps, {
                    [map.id]: map
                }),
                isEditMode: false,
                isViewMode: false
            });
        
        case "MAPS_EDIT_ERROR":
            return Object.assign({}, state, {
                editError: action.error
            });

        case "MAPS_DELETE_SUCCESS": {
            let mapId = action.mapId;
            let newMaps = Object.assign({}, state.maps);
            delete newMaps[mapId];
            let newDeleteErrors = Object.assign({}, state.deleteErrors);
            delete newDeleteErrors[mapId];
            
            return Object.assign({}, state, {
                maps: newMaps,
                deleteErrors: newDeleteErrors,
                isEditMode: false,
                isViewMode: false
            });
        }
        case "MAPS_DELETE_ERROR": {
            let mapId = action.mapId;
            let newDeleteErrors = Object.assign({}, state.deleteErrors);
            newDeleteErrors[mapId] = action.error;
            return Object.assign({}, state, {
                deleteErrors: newDeleteErrors
            });
        }
        
        default:
            return state;
    }
}

const reducer = combineReducers({
    maps,
    mapPoints
});
const store = createStore(reducer, window.INITIAL_STATE, compose(
    applyMiddleware(ReduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
));
export default store;
