var express = require('express');
var expressNunjucks = require('express-nunjucks');
var nunjucks = require('nunjucks');
var path = require("path");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var webpackMiddleware = require('./webpack-middleware');
var Map = require('./models/Map');

var loginController = require('./controllers/login');
var mapController = require('./controllers/map');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('views', __dirname + '/templates');

var njk = expressNunjucks(app, {
    loader: nunjucks.FileSystemLoader,
    watch: true
});


app.use(webpackMiddleware);

app.use(loginController.requireLogin({
    excludePaths: ['/login', '/register']
}));
app.use(njk.ctxProc([
    (req, ctx) => {
        var user = req.user || {};
        ctx.user = {
            username: user.username
        }
    }
]));


app.get('/', (req, res) => {
    res.render('index')
});
app.get('/login', loginController.login);
app.post('/login', loginController.login);
app.get('/register', loginController.register);
app.post('/register', loginController.register);
app.get('/logout', loginController.logout);
app.get('/maps', mapController.index);
app.post('/maps', mapController.create);
app.post('/maps/:id', mapController.update);
app.post('/maps/:id/delete', mapController.delete);
app.get('/maps/:map_id/points', mapController.pointIndex);
app.post('/maps/:map_id/points', mapController.pointCreate);
app.post('/maps/:map_id/points/:id', mapController.pointUpdate);

app.listen(3000);
