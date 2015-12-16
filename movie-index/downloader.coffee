request = require("request")
movies = require("./imdbMovies")
_ = require "lodash"
path = require "path"
fs = require "fs"
Promise = require "bluebird"

# s3Prefix = "https://s3-eu-west-1.amazonaws.com/imdbimages/images/"
# newMovies = _.map movies, (movie)->
#   if movie.Poster isnt "N/A"
#     filename = movie.Poster.split("/").pop()
#     movie.PosterS3 = s3Prefix + filename
#   return movie
#
# fs.writeFileSync(
#   __dirname + "/./imdbMoviesNew.js",
#   "module.exports = " + JSON.stringify(newMovies, null, 2)
# )

# download = (uri, filename)-> new Promise (resolve, reject)->
#   console.log("downloading", uri)
#   request.get(uri)
#     .on('error', reject)
#     .on('response', resolve)
#     .pipe(fs.createWriteStream(__dirname+"/../images/#{filename}"))
#
#
# promiseQueue = (fns)->
#   queue = Promise.resolve(true)
#   for f in fns
#     queue = queue.then(f)
#       .catch (e)->
#         console.log "some error", e
#   return queue
#
# promises = _.map movies, (movie)-> return ()->
#   if movie.Poster isnt "N/A"
#     filename = movie.Poster.split("/").pop()
#     return download(movie.Poster, filename)
#       .catch (e)-> console.log("error", e)
#   return Promise.resolve(true)
#
# console.log promises.length
# promiseQueue(promises).done (e)->
#   console.log(e, "finished")
#
# setTimeout ->
#   console.log("hi")
# ,10000
