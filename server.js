var path = require("path");
var express = require("express");
var elasticsearch = require("elasticsearch")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var compression = require("compression")
var _ = require("lodash")
var cors = require('cors')
var SearchkitExpress = require("searchkit-express")

module.exports = {
  start: function(prodMode) {

    var env = {
      production: process.env.NODE_ENV === 'production'
    };

    var express = require('express');
    var app = express();
    app.use(compression())
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/server/views');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(methodOverride())

    var port = Number(process.env.PORT || 3000);

    if (!env.production) {
      var webpack = require("webpack");
      var webpackMiddleware = require("webpack-dev-middleware");
      var webpackHotMiddleware = require('webpack-hot-middleware');
      var config = require("./webpack.dev.config.js");
      var compiler = webpack(config);

      app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
      }));

      app.use(webpackHotMiddleware(compiler));


    } else {
      app.use("/static", express.static(__dirname + '/dist'));
    }


    var host = "http://d78cfb11f565e845000.qb0x.com"
    app.use("/api", cors({
      origin:"*",
      maxAge:20*24*60*60 //20 days like elastic
    }))
    app.use("/api/movies", SearchkitExpress.createRouter({
      host: host, index:"movies"
    }))

    app.use("/api/crimes", SearchkitExpress.createRouter({
      host: host, index:"crimes"
    }))

    app.use("/api/taxonomy", SearchkitExpress.createRouter({
      host: host, index:"taxonomynested"
    }))


    app.get('*', function(req, res) {
      res.render('index');
    });

    app.listen(port, function () {
      console.log('server running at localhost:3000, go refresh and see magic');
    });
  }
}
