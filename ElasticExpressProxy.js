var elasticsearch = require("elasticsearch")
var _ = require("lodash")

module.exports = function(config, expressApp){
  var client = new elasticsearch.Client({
    host:config.host,
    log:'debug'
  });
  var index = config.index

  var promiseResponse = function(promiseInstance, req, res){
    promiseInstance.then(function(resp){
      res.send(resp)
    }, function(err){
      res.status(500).send(err)
    })
  }
  expressApp.post("/_search", function(req, res){
    var queryBody = req.body || {}
    promiseResponse(client.search({
      index:"movies",
      body:queryBody
    }),req, res)
  });

  expressApp.post("/_msearch", function(req, res){
    var queryBody = _.flatten(_.map(req.body, function(query){
        return [{}, query]
    }))
    promiseResponse(client.msearch({
      index:"movies",
      body:queryBody
    }), req, res)
  });

}
