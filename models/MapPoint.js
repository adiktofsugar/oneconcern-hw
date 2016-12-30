var Sequelize = require('sequelize');
var connection = require('./connection');
var Map = require('./Map');

var MapPoint = connection.define('map_point', {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    map_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Map,
            key: 'id'
        }
    },
    lng: {type: Sequelize.FLOAT, allowNull: false},
    lat: {type: Sequelize.FLOAT, allowNull: false},
    name: {type: Sequelize.STRING},
    description: {type: Sequelize.STRING},
    num_residents: {type: Sequelize.INTEGER},
});

module.exports = MapPoint;
