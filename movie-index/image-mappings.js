{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "title_analyzer": {
            "type": "custom",
            "tokenizer": "lowercase",
            "filter": [
              "title_ngram"
            ]
          }
        },
        "filter": {
          "title_ngram": {
            "type": "nGram",
            "min_gram": 3,
            "max_gram": 5
          }
        }
      }
    }
  },
  "mappings": {
    "image": {
      "properties": {
        "title": {
          "type": "string",
          "analyzer": "title_analyzer",
          "boost": 10
        },
        "author": {
          "type": "string",
          "fields": {
            "raw": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        },
        "exifimagelength": {
          "type": "integer"
        },
        "exifimagewidth": {
          "type": "integer"
        },
        "poster": {
          "type": "string"
        },
        "suggest": {
          "type": "completion",
          "analyzer": "simple",
          "payloads": true,
          "preserve_separators": true,
          "preserve_position_increments": true,
          "max_input_length": 50
        }
      }
    }
  }
}
