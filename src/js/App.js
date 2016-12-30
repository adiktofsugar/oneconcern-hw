import React from 'react';
import MapListContainer from 'MapListContainer';
import MapViewContainer from 'MapViewContainer';
import MapEditContainer from 'MapEditContainer';


const App = ({
    mapId,
    isMapEditMode,
    isMapViewMode
}) => (
    <div className="container">
    <div className="row">
    <div className="col m10">
        {isMapEditMode
            
            ? <MapEditContainer mapId={mapId}/>
            : isMapViewMode
                ? <MapViewContainer mapId={mapId}/>
                : <MapListContainer />
        }
    </div>
    </div>
    </div>
)

export default App;
