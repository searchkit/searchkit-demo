import * as React from "react";
import * as _ from "lodash";

import {
SearchBox,
Hits,
HitsStats,
RefinementListFilter,
Pagination,
ResetFilters,
MenuFilter,
SelectedFilters,
HierarchicalMenuFilter,
NumericRefinementListFilter,
SortingSelector,
SearchkitComponent,
SearchkitProvider,
SearchkitManager,
NoHits,
RangeFilter,
InitialLoader,
ViewSwitcherToggle,
ViewSwitcherHits
} from "searchkit";

import "./../../styles/customisations.scss";
import "searchkit/theming/theme.scss";

import MultiSelectFilter from './MultiSelectFilter/MultiSelectFilter';
import GroupedSelectedFilters from './GroupedSelectedFilters/GroupedSelectedFilters';
import CheckboxFilter from './CheckboxFilter';
import TagFilter from './TagFilter';
import FacetEnabler from './FacetEnabler';



const MovieHitsGridItem = (props) => {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source: any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster") } src={result._source.poster} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title") } dangerouslySetInnerHTML={{ __html: source.title }}>
          </div>
        </a>
      </div>
  )
}

function mapAndJoin(array=[], func, joinString=", "){
  const result = []
  const length = array.length
  array.forEach((c, idx) => {
    result.push(func(c))
    if (idx < length - 1) result.push(<span key={"joinString-" + idx}>{joinString}</span>)
  })
  return result;
}



const MovieHitsListItem = (props) => {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source: any = _.extend({}, result._source, result.highlight)
  const { title, poster, writers = [], actors = [], genres = [], plot, released, rated } = source;

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } data-qa="hit">
      <div className={bemBlocks.item("poster") }>
        <img data-qa="poster" src={result._source.poster}/>
        </div>
      <div className={bemBlocks.item("details") }>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title") } dangerouslySetInnerHTML={{ __html: source.title }}></h2></a>
        <h3 className={bemBlocks.item("subtitle") }>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <ul style={{ marginTop: 8, marginBottom: 8, listStyle: 'none', paddingLeft: 20 }}>
          <li>Released: {released}</li>
          <li>Rating: {rated}</li>
          <li>Genres: {mapAndJoin(genres, a => <TagFilter key={a} field="genres.raw" value={a}>{a}</TagFilter>) }</li>
          <li>Writers: {mapAndJoin(writers, a => <TagFilter key={a} field="writers.raw" value={a}>{a}</TagFilter>) }</li>
          <li>Actors: {mapAndJoin(actors, a => <TagFilter key={a} field="actors.raw" value={a}>{a}</TagFilter>) }</li>
        </ul>
        <div className={bemBlocks.item("text") } dangerouslySetInnerHTML={{ __html: source.plot }}></div>
        </div>
      </div>
  )
}
// "title", "poster", "imdbId", "released", "rated", "genres", "writers", "actors", "plot"]

var serialize = JSON.stringify;

function filterMap(boolMust) {
  var filters = {}
  _.forEach(boolMust, filter => {
    filters[serialize(filter)] = filter
  })
  return filters
}

function queryOptimizer(query){
  console.log(query)
  console.log("initial:", JSON.stringify(query).length, "bytes")

  // Find common filters...
  if (!query.filter || !query.filter.bool || !query.filter.bool.must) {
    console.log('No common filters');
    return query
  }
  var commonFilters = filterMap(query.filter.bool.must)
  console.log('Filters to check', _.keys(commonFilters))

  if (query.aggs){
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
        if (!filtersToCheck[key]){
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
  if (query.query){
    query.query.bool.filter = {
      bool:{
        must:_.values(commonFilters)
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


export class PlaygroundApp extends React.Component<any, any> {

  searchkit: SearchkitManager

  constructor() {
    super()
    const host = "http://localhost:9200/imdb/movies"
    // const host = "http://demo.searchkit.co/api/movies"
    // const host = "/api/mock"
    this.searchkit = new SearchkitManager(host)
    // this.searchkit.setQueryProcessor(queryOptimizer)
    this.searchkit.translateFunction = (key) => {
      return { "pagination.next": "Next Page", "pagination.previous": "Previous Page" }[key]
    }
    this.state = {
      displayMode: "thumbnail",
      hitsPerPage: 12
    }
  }

  // queryOptimizer(query){
  //   if (this.state.optimizeQuery)
  // }

  onDisplayModeChange(e) {
    this.setState({ displayMode: e.target.value })
  }

  onHitsPerPageChange(e) {
    this.setState({ hitsPerPage: parseInt(e.target.value, 10) })
  }

  render() {
    const { displayMode, hitsPerPage } = this.state;
    return (
      <div>
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
      hello
        <div className="sk-layout">

          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">
              <div className="my-logo">Searchkit Acme co</div>
              <SearchBox
                translations={{ "searchbox.placeholder": "search movies" }}
                queryOptions={{ "minimum_should_match": "70%" }}
                autofocus={true}
                searchOnChange={true}
                queryFields={["actors^1", "type^2", "languages", "title^5", "genres^2"]}/>
              </div>
            </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">
              <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <NumericRefinementListFilter id="imdbRating" title="IMDB Rating" field="imdbRating" options={[
                { title: "All" },
                { title: "\u2605\u2605\u2605\u2605\u2606 & up", from: 8, to: 10 },
                { title: "\u2605\u2605\u2605\u2606\u2606 & up", from: 6, to: 10 },
                { title: "\u2605\u2605\u2606\u2606\u2606 & up", from: 4, to: 10 },
                { title: "\u2605\u2606\u2606\u2606\u2606 & up", from: 2, to: 10 },
              ]}/>
              <FacetEnabler id="genres" title="Genres" field="genres.raw" operator="AND"/>
              <MultiSelectFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={100}/>
              <CheckboxFilter id="rating" title="Rating" field="rated.raw" value="R" label="Rated 'R'"/>
              <RefinementListFilter id="actors" title="Actors" field="actors.raw" size={10}/>
              <RefinementListFilter translations={{ "facets.view_more": "View more writers" }} id="writers" title="Writers" field="writers.raw" operator="OR" size={10}/>
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                { title: "All" },
                { title: "up to 20", from: 0, to: 20 },
                { title: "21 to 60", from: 21, to: 60 },
                { title: "60 or more", from: 61, to: 1000 }
              ]}/>
              </div>

            <div className="sk-layout__results sk-results-list">

              <div className="sk-results-list__action-bar sk-action-bar">

                <div className="sk-action-bar__info">
                  <HitsStats/>


                  <div className="sk-sorting-selector" style={{ marginRight: 8 }}>
                    <select value={"" + hitsPerPage} onChange={this.onHitsPerPageChange.bind(this) }>
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                      </select>
                    </div>

                  <ViewSwitcherToggle/>

                  <SortingSelector options={[
                    { label: "Relevance", field: "_score", order: "desc", defaultOption: true },
                    { label: "Latest Releases", field: "released", order: "desc" },
                    { label: "Earliest Releases", field: "released", order: "asc" }
                  ]}/>
                </div>

                <div className="sk-action-bar__filters">
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </div>

              </div>
              <ViewSwitcherHits
                hitsPerPage={12} highlightFields={["title", "plot"]}
                sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year", "actors", "writers", "genres", "rated"]}
                hitComponents = {[
                  { key: "grid", title: "Grid", itemComponent: MovieHitsGridItem, defaultOption: true },
                  { key: "list", title: "List", itemComponent: MovieHitsListItem }
                ]}
                scrollTo="body"
                />
              {/*<NoHits suggestionsField={"title"}/>*/}
              <InitialLoader/>
              <Pagination showNumbers={true}/>
              </div>
            </div>
          <a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
          </div>
        </div>
        </SearchkitProvider>
        </div>
    )
  }

}
