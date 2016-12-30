var querystring = require('querystring');
var User = require('../models/User');

const setUser = (res, user) => {
    if (user) {
        res.cookie('user_id', user.id);
    } else {
        res.clearCookie('user_id');
    }
}
const getUser = (req, callback) => {
    var userId = req.cookies['user_id'];
    if (!userId) {
        return callback();
    }

    User.findById(userId).then((user) => {
        callback(null, user);
    });
}

exports.login = (req, res) => {
    var {error, next} = req.query;

    if (req.method !== 'POST') {
        return res.render('login', {error, next});
    }
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
        where: {
            username,
            password
        }
    })
    .then((user) => {
        if (!user) {
            return res.render('login', {
                error: 'Username and password dont match',
                next
            });
        }
        setUser(res, user);
        next = next || '/';
        return res.redirect(next);
    });
}


exports.register = (req, res) => {
    var {error, next} = req.query;
    
    if (req.method !== 'POST') {
        return res.render('register', {error, next});
    }
    var username = req.body.username;
    var password = req.body.password;
    User.count({
        where: { username }
    })
    .then((userCount) => {
        if (userCount > 0) {
            return res.render('register', {
                error: 'That user already exists',
                next
            });
        }
        User.create({ username, password })
        .then((user) => {
            setUser(res, user);
            next = next || '/';
            return res.redirect(next);
        });
    });
}

exports.logout = (req, res) => {
    setUser(res, null);
    res.redirect('/');
}

exports.requireLogin = (options) => {
    options = options || {};
    var excludePaths = options.excludePaths || [];
    
    return (req, res, next) => {
        var pathIsExcluded = excludePaths.indexOf(req.path) > -1;

        function onLoginSuccess(user) {
            req.user = user;
            next();
        }
        function onLoginFail() {
            setUser(res, null);
            res.redirect('/login?' + querystring.stringify({
                error: 'You must be logged in',
                next: req.originalUrl
            }));
        }
        
        if (pathIsExcluded) {
            getUser(req, (error, user) => {
                onLoginSuccess(user);
            });
        
        } else if (req.cookies['user_id']) {
            getUser(req, (error, user) => {
                if (user) {
                    onLoginSuccess(user);
                } else {
                    onLoginFail();
                }
            });

        } else {
            onLoginFail();
        }
    }
}
