import React from 'react';
import MapListItemContainer from 'MapListItemContainer';

export default ({
    maps,
    fetchError,
    onEditMapMode
}) => (
    <div>
        {fetchError &&
            <p className="card-panel red">{ fetchError }</p>}
        
        <a className="btn-flat right"
            onClick={(e) => {e.preventDefault(); onEditMapMode() }}>
            Create New</a>
        
        <h1>Maps</h1>
        {maps.map((m) => {
            return <MapListItemContainer key={m.id} id={m.id} />
        })}
    </div>
);
