elasticsearch = require "elasticsearch"
promise       = require "bluebird"
movies        = require "./imdbMoviesNew"
moment        = require "moment"
_             = require "lodash"
args = process.argv.slice(2);


client = new elasticsearch.Client({
  host:args[0] or "localhost:9200"
})


toNumber = (str)->
  return undefined unless str
  Number(str.replace(/\D+/g,""))

splitComma = (str)->
  return [] if str is "N/A"
  return str.split(", ")

splitWriter = (str)->
  _.uniq _.map splitComma(str), (writer)->
    writer.replace(/\s\(.+\)/,"")

processAwards = (str)->

notNA = (str)-> str isnt "N/A"

getYears = (str)->
  return {} if str is "N/A"
  tokens = str.split("–")
  return {
    year:toNumber(tokens[0])
    yearEnded:toNumber(tokens[1])
  }

compact = (ob)->
  for k,v of ob
    delete ob[k] unless v and v isnt "N/A"
  return ob
processedMovies = movies.map (movie)->
  years = getYears(movie.Year)  
  poster =
    if process.env.LOCAL && movie.PosterS3
      movie.PosterS3.replace(/https:\/\/s3-eu-west-1\.amazonaws\.com\/imdbimages/, "")
    else
      movie.PosterS3
  return compact({
    title:movie.Title
    year:years.year
    yearEnded:years.yearEnded
    rated:splitComma(movie.Rated)
    released:moment(movie.Released, "DD MMM YYYY").format("YYYY-MM-DD") if notNA(movie.Released)
    runtimeMinutes:toNumber(movie.Runtime)
    genres:splitComma(movie.Genre)
    directors:splitComma(movie.Director)
    writers:splitWriter(movie.Writer)
    actors:splitComma(movie.Actors)
    plot:movie.Plot
    languages:splitComma(movie.Language)
    countries:splitComma(movie.Country)
    awards:movie.Awards if notNA(movie.Awards)
    poster:poster
    metaScore:Number(movie.Metascore) if notNA(movie.Metascore)
    imdbRating:Number(movie.imdbRating)
    imdbVotes:toNumber(movie.imdbVotes)
    imdbId:movie.imdbID
    type:_.capitalize(movie.Type)
    suggest:{
      input:movie.Title?.split?(" ") or []
      output: movie.Title
      payload: {id:movie.imdbID}
    }
  })

getMultiFieldDef = (name) ->
  def = {
    type: "multi_field"
    fields: {
      "raw": {type:"string", "index": "not_analyzed"}
    }
  }

  def.fields[name] =  {"type" : "string", "index" : "analyzed"}

  def

# console.log processedMovies

settings = {
  "analysis": {
    "char_filter": {
       "replace": {
        "type": "mapping",
        "mappings": [
          "&=> and "
        ]
      }
    },
    "filter": {
      "word_delimiter" : {
        "type" : "word_delimiter",
        "split_on_numerics" : false,
        "split_on_case_change" : true,
        "generate_word_parts" : true,
        "generate_number_parts" : true,
        "catenate_all" : true,
        "preserve_original":true,
        "catenate_numbers":true
      }
    },
    "analyzer": {
      "default": {
        "type": "custom",
        "char_filter": [
          "html_strip",
          "replace"
        ],
        "tokenizer": "whitespace",
        "filter": [
            "lowercase",
            "word_delimiter"
        ]
      }
    }
  }
}

mapping = {
  index:"movies"
  type:"movie"
  body:
    movie:
      properties:
        year:{type:"integer"}
        yearEnded:{type:"integer"}
        released:{type:"date"}
        runtimeMinutes:{type:"integer"}
        rated: getMultiFieldDef("rated")
        genres: getMultiFieldDef("genres")
        countries: getMultiFieldDef("countries")
        languages: getMultiFieldDef("languages")
        metaScore:{type:"integer"}
        imdbRating:{type:"float"}
        imdbVotes:{type:"integer"}
        writers: getMultiFieldDef("writers")
        directors: getMultiFieldDef("directors")
        actors: getMultiFieldDef("actors")
        type: getMultiFieldDef("type")
        suggest: {
          type:"completion",
          payloads:true
        }
}
commands = []

for m in processedMovies
  commands.push {index:{_index:"movies", _type:"movie", _id:m.imdbId}}
  commands.push(m)
client.indices.delete {index:"movies"}, (err, res)->
  console.log(err, res)
  client.indices.create {index:"movies", body:{settings:settings}}, (err, res)->
    console.log(err, res)

    client.indices.putMapping mapping, (err, res)->
      console.log(err, res)
      client.bulk {body:commands}, (err, res)->
        if err
          return console.log err
        if res.errors
          return console.log(errors)

        console.log "indexed #{res.items.length} items in #{res.took}ms"
