var Sequelize = require('sequelize');
var connection = require('./connection');

var User = connection.define('user', {
    id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, allowNull: false},
    password: {type: Sequelize.STRING, allowNull: false}
});

module.exports = User;
