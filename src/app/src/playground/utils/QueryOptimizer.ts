
import * as _ from "lodash";

var serialize = JSON.stringify;

function filterMap(boolMust) {
  var filters = {}
  _.forEach(boolMust, filter => {
    filters[serialize(filter)] = filter
  })
  return filters
}

export function queryOptimizer(query) {
  console.log(query)
  console.log("initial:", JSON.stringify(query).length, "bytes")

  // Find common filters...
  if (!query.filter || !query.filter.bool || !query.filter.bool.must) {
    console.log('No common filters');
    return query
  }
  var commonFilters = filterMap(query.filter.bool.must)
  console.log('Filters to check', _.keys(commonFilters))

  if (query.aggs) {
    // Find missing keys...
    _.forIn(query.aggs, (agg, name) => {
      const boolMust = (agg.filter && agg.filter.bool && agg.filter.bool.must) || [];
      if (boolMust.length == 0) {
        console.log('Empty filters for', name)
        commonFilters = {} // flush
        return
      }
      const filtersToCheck = filterMap(boolMust)
      // Remove non-common filters
      _.forEach(_.keys(commonFilters), key => {
        if (!filtersToCheck[key]) {
          console.log('delete', key, ', missing from ', name)
          delete commonFilters[key]
        }
      })
    })
  }

  if (_.keys(commonFilters).length == 0) {
    // Nothing to optimize
    console.log('Nothing to optimize')
    return query
  }

  console.log('Found filters to optimize !!', commonFilters)

  // Add filters query to query
  if (query.query) {
    query.query.bool.filter = {
      bool: {
        must: _.values(commonFilters)
      }
    }
  } else {

    query.query = {
      bool: {
        filter: {
          bool: {
            must: _.values(commonFilters)
          }
        }
      }
    }
  }

  // Remove these filters everywhere else...
  if (query.aggs) {
    _.forIn(query.aggs, (agg, name) => {
      const boolMust = (agg.filter && agg.filter.bool && agg.filter.bool.must) || [];
      agg.filter.bool.must = _.filter(agg.filter.bool.must, filter => {
        // Keep filters NOT in the common filters
        return !(serialize(filter) in commonFilters)
      })
    })
  }

  console.log("=>", JSON.stringify(query).length, "bytes")

  return query
}
