import React from 'react';
import Map from 'components/Map';

function _mapToBounds(map) {
    var {sw_lng, sw_lat, ne_lng, ne_lat} = map;
    return mapboxgl.LngLatBounds.convert([
        mapboxgl.LngLat.convert([ // SW
            parseFloat(sw_lng),
            parseFloat(sw_lat)
        ]),
        mapboxgl.LngLat.convert([ // NE
            parseFloat(ne_lng),
            parseFloat(ne_lat)
        ])
    ]);
}

export default ({
    map,
    points,
    onListMapMode,
    onPointEdit
}) => (
    <div>
        <h1>Viewing map with bounds {map.sw_lng}, {map.sw_lat}, {map.ne_lng}, {map.ne_lat}</h1>
        <button className="btn-flat"
            onClick={(e) => {e.preventDefault(); onListMapMode()}}>Back to list</button>
        <Map 
            bounds={_mapToBounds(map)}
            points={points}
            onPointEdit={onPointEdit} />
    </div>
);
