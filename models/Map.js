var Sequelize = require('sequelize');
var connection = require('./connection');
var User = require('./User');

var Map = connection.define('map', {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    sw_lng: {type: Sequelize.FLOAT, allowNull: false},
    sw_lat: {type: Sequelize.FLOAT, allowNull: false},
    ne_lng: {type: Sequelize.FLOAT, allowNull: false},
    ne_lat: {type: Sequelize.FLOAT, allowNull: false}
});

module.exports = Map;
