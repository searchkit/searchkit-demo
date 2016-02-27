import * as React from "react";
import * as _ from "lodash";

const Perf = require('react-addons-perf');

import {
SearchBox,
Hits,
HitsStats,
// RefinementListFilter,
Pagination as OriginalPagination,
ResetFilters,
MenuFilter,
SelectedFilters,
HierarchicalMenuFilter,
// NumericRefinementListFilter,
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

import { ViewSwitcher, Sorting, Pagination, PageSizeSelector } from './components';
import { CheckboxFilter, TagFilter, RangeInputFilter, RefinementListFilter, NumericRefinementListFilter } from './components';

import { Toggle, Selector } from './ui';
import { queryOptimizer } from './utils';
import { MovieHitsGridItem, MovieHitsListItem } from './MovieHitsItems';



// import { RefinementListFilter } from './RefinementListFilter'


// "title", "poster", "imdbId", "released", "rated", "genres", "writers", "actors", "plot"]



export class PlaygroundApp extends React.Component<any, any> {

  searchkit: SearchkitManager

  constructor() {
    super()
    // const host = "http://localhost:9200/imdb/movies"
    const host = "http://demo.searchkit.co/api/movies"

    this.searchkit = new SearchkitManager(host)
    // this.searchkit.setQueryProcessor(queryOptimizer)
    this.searchkit.translateFunction = (key) => {
      return { "pagination.previous": "<", "pagination.next": ">" }[key]
    }
    this.state = {
      displayMode: "thumbnail",
      hitsPerPage: 12,
      operator: "OR"
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

  handleOperatorChange(e){
    this.setState({operator: e.target.value})
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
              {/*<button onClick={this.refresh.bind(this)}>Click to refresh</button>*/}
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                  { title: "All" },
                  { title: "≤20", from: 0, to: 20 },
                  { title: "21\u201160", from: 21, to: 60 },
                  { title: "≥60", from: 61, to: 1000 }
              ]} listComponent={Toggle} multiselect={true} />
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                  { title: "All" },
                  { title: "≤20", from: 0, to: 20 },
                  { title: "21\u201160", from: 21, to: 60 },
                  { title: "≥60", from: 61, to: 1000 }
              ]} multiselect={true} collapsable={true} />
              <NumericRefinementListFilter id="imdbRating" title="IMDB Rating" field="imdbRating" options={[
                  { title: "All" },
                  { title: "\u2605\u2605\u2605\u2605\u2606 & up", from: 8, to: 10 },
                  { title: "\u2605\u2605\u2605\u2606\u2606 & up", from: 6, to: 10 },
                  { title: "\u2605\u2605\u2606\u2606\u2606 & up", from: 4, to: 10 },
                  { title: "\u2605\u2606\u2606\u2606\u2606 & up", from: 2, to: 10 },
              ]} listComponent={Selector} />
              <NumericRefinementListFilter id="imdbRating" title="IMDB Rating (showCount=false)" field="imdbRating" options={[
                  { title: "All" },
                  { title: "\u2605\u2605\u2605\u2605\u2606 & up", from: 8, to: 10 },
                  { title: "\u2605\u2605\u2605\u2606\u2606 & up", from: 6, to: 10 },
                  { title: "\u2605\u2605\u2606\u2606\u2606 & up", from: 4, to: 10 },
                  { title: "\u2605\u2606\u2606\u2606\u2606 & up", from: 2, to: 10 },
              ]} listComponent={Selector} showCount={false} />
              <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeInputFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>


              <MultiSelectFilter id="actors" title="Actors" field="actors.raw" size={200}/>
              <FacetEnabler id="genres" title="Genres" field="genres.raw" operator="AND"/>
              <MultiSelectFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={100}/>
              <CheckboxFilter id="rating" title="Rating" field="rated.raw" value="R" label="Rated 'R'"/>
              <select value={this.state.operator} onChange={this.handleOperatorChange.bind(this) }>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
              <RefinementListFilter translations={{ "facets.view_more": "View more writers" }} id="writers" title="Writers" field="writers.raw" operator={this.state.operator} size={10}/>
              <NumericRefinementListFilter id="imdbRating" title="IMDB Rating" field="imdbRating" options={[
                  { title: "All" },
                  { title: "\u2605\u2605\u2605\u2605\u2606 & up", from: 8, to: 10 },
                  { title: "\u2605\u2605\u2605\u2606\u2606 & up", from: 6, to: 10 },
                  { title: "\u2605\u2605\u2606\u2606\u2606 & up", from: 4, to: 10 },
                  { title: "\u2605\u2606\u2606\u2606\u2606 & up", from: 2, to: 10 },
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
                  <PageSizeSelector options={[4, 8, 12, 24 ]}/>

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
                <Pagination showNumbers={true} listComponent={Selector} />
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
