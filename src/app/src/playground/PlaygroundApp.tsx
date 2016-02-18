import * as React from "react";
import * as _ from "lodash";

const Perf = require('react-addons-perf');

import {
SearchBox,
Hits,
HitsStats,
RefinementListFilter,
Pagination as OriginalPagination,
ResetFilters,
MenuFilter,
SelectedFilters,
HierarchicalMenuFilter,
NumericRefinementListFilter,
// SortingSelector,
SearchkitComponent,
SearchkitProvider,
SearchkitManager,
NoHits,
RangeFilter,
InitialLoader,
// ViewSwitcherToggle,
ViewSwitcherHits
} from "searchkit";

import "./../../styles/customisations.scss";
import "searchkit/theming/theme.scss";

import MultiSelectFilter from './MultiSelectFilter/MultiSelectFilter';
import GroupedSelectedFilters from './GroupedSelectedFilters/GroupedSelectedFilters';
import FacetEnabler from './FacetEnabler';

import { ViewSwitcher, Sorting, CheckboxFilter, TagFilter, Pagination } from './components';
import { Toggle, Selector } from './ui';
import { queryOptimizer } from './helpers';


// import { RefinementListFilter } from './RefinementListFilter'


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



export class PlaygroundApp extends React.Component<any, any> {

  searchkit: SearchkitManager

  constructor() {
    super()
    const host = "http://localhost:9200/imdb/movies"
    // const host = "http://demo.searchkit.co/api/movies"

    this.searchkit = new SearchkitManager(host)
    // this.searchkit.setQueryProcessor(queryOptimizer)
    this.searchkit.translateFunction = (key) => {
      return { "pagination.previous": "<", "pagination.next": ">" }[key]
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

  refresh(e){
    Perf.start()
    this.forceUpdate(() => {
      Perf.stop()
      Perf.printWasted(Perf.getLastMeasurements())
    })
  }

  render() {
    const { hitsPerPage } = this.state;
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
              <button onClick={this.refresh.bind(this)}>Click to refresh</button>
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

                  {/*
                  <div className="sk-sorting-selector" style={{ marginRight: 8 }}>
                    <select value={"" + hitsPerPage} onChange={this.onHitsPerPageChange.bind(this) }>
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                      </select>
                    </div>*/}

                  <ViewSwitcher/>
                  <ViewSwitcher listComponent={Selector}/>

                  <Sorting listComponent={Toggle} options={[
                    { label: "Relevance", field: "_score", order: "desc", defaultOption: true },
                    { label: "Latest", field: "released", order: "desc" },
                    { label: "Earliest", field: "released", order: "asc" }
                  ]}/>
                  <Sorting options={[
                    { label: "Relevance", field: "_score", order: "desc", defaultOption: true },
                    { label: "Latest", field: "released", order: "desc" },
                    { label: "Earliest", field: "released", order: "asc" }
                  ]}/>
                </div>

              <div className="sk-action-bar__info">
                <Pagination showNumbers={true}/>
              </div>

                <div className="sk-action-bar__filters">
                  <GroupedSelectedFilters/>
                  <ResetFilters/>
                </div>

              </div>
              <ViewSwitcherHits
                hitsPerPage={hitsPerPage} highlightFields={["title", "plot"]}
                sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year", "actors", "writers", "genres", "rated"]}
                hitComponents = {[
                  { key: "grid", title: "Grid", itemComponent: MovieHitsGridItem, defaultOption: true },
                  { key: "list", title: "List", itemComponent: MovieHitsListItem }
                ]}
                scrollTo="body"
                />
              {/*<NoHits suggestionsField={"title"}/>*/}
              <InitialLoader/>
              <OriginalPagination showNumbers={true}/>
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
