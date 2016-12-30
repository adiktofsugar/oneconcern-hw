var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");
var path = require("path");

var nodeModulesRoot = path.resolve(__dirname, "node_modules");

var isInPathMatcher = function(relativePath, reverse) {
    var rp = path.resolve(__dirname, relativePath);
    return function (absPath) {
        var r = new RegExp('^' + rp);
        var didMatch = Boolean(absPath.match(r));
        if (reverse) {
            didMatch = !didMatch;
        }
        return didMatch;
    }
}
var compiler = webpack({
    resolve: {
        root: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'src/js')
        ]
    },
    devtool: 'inline-source-map',
    entry: [
        "./src/js/index.js",
        "./src/less/style.less",
    ],
    output: {
        path: '/',
        publicPath: "/assets/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less']
            }
        ]
    }
});



module.exports = webpackDevMiddleware(compiler, {
    publicPath: '/assets/'
});
