{
  "image": {
    "properties": {
      "title": {
        "type": "string"
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
