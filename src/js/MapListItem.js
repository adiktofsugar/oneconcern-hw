import React from 'react';

export default ({
    mapId,
    sw_lng, sw_lat, ne_lng, ne_lat,
    deleteError,
    onViewClick,
    onEditClick,
    onDeleteClick
}) => (
    <div className="card-panel">
        {deleteError && (
            <div className="card-panel red">{{ deleteError }}</div>
        )}
        <div>SW: {sw_lng}, {sw_lat}</div>
        <div>NE: {ne_lng}, {ne_lat}</div>
        
        <button className="btn-flat"
            onClick={(e) => { e.preventDefault(); onViewClick() }}>
            View</button>
        <button className="btn-flat"
            onClick={(e) => { e.preventDefault(); onEditClick() }}>
            Edit</button>
        <button className="btn-flat"
            onClick={(e) => { e.preventDefault(); onDeleteClick()}}>
            Delete</button>
    </div>
);
