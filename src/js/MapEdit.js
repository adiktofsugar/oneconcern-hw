import React from 'react';
import classnames from 'classnames';

const MapEditInput = ({
    name, value, label, error
}) => (
    <div className="input-field col s6">
        <input
            type="text"
            name={name}
            className={classnames('validate', {'valid': !error, 'invalid': !!error})}
            defaultValue={value} />
        <label
            htmlFor={name}
            className={classnames('active')}>
            {error ? error.join(", ") : label}</label>
    </div>
);

export default ({
    editError,
    mapId,
    sw_lng,
    sw_lat,
    ne_lng,
    ne_lat,
    sw_lngError,
    sw_latError,
    ne_lngError,
    ne_latError,
    onSubmit,
    onListMapMode
}) => {
    
    return (
        <div>
            {editError &&
                <p className="card-panel red">{ editError }</p>}
            
            <h1>{mapId ? "Edit map" : "Create a new map"}</h1>

            <form onSubmit={(e) => {
                e.preventDefault();
                var params = {};
                ['sw_lng', 'sw_lat', 'ne_lng', 'ne_lat'].forEach((paramName) => {
                    let value = e.target[paramName].value;
                    params[paramName] = value;
                });
                onSubmit(params);
                
            }}>
                <div className="row">
                    
                    <MapEditInput
                        name="sw_lng"
                        value={sw_lng}
                        error={sw_lngError}
                        label="Southwest Longitude" />
                    <MapEditInput
                        name="sw_lat"
                        value={sw_lng}
                        error={sw_lngError}
                        label="Southwest Latitude" />
                </div>
                <div className="row">
                    <MapEditInput
                        name="ne_lng"
                        value={ne_lng}
                        error={ne_lngError}
                        label="Northeast Longitude" />
                    <MapEditInput
                        name="ne_lat"
                        value={ne_lat}
                        error={ne_latError}
                        label="Northeast Latitude" />
                </div>
                <button className="btn">Submit</button>
                <button className="btn-flat"
                    onClick={(e)=> {e.preventDefault(); onListMapMode()}}>
                    Cancel</button>
            </form>
        </div>
    );
};
