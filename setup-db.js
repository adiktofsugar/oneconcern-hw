#!/usr/bin/env node
var db = require('./db');
db.connection.sync().then(() => {
    console.log('Database setup');
    process.exit();
});
