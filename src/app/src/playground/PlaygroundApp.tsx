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
InitialLoader
} from "searchkit";

import "./../../styles/customisations.scss";
import "searchkit/theming/theme.scss";
import MultiSelectFilter from './MultiSelectFilter/MultiSelectFilter';
import CheckboxFilter from './CheckboxFilter';

const MovieHitsItem = (props) => {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) }>
      <a href={url} target="_blank">
        <img className={bemBlocks.item("poster") } src={result._source.poster} width="170" height="240"/>
        </a>
      <a href={url} target="_blank">
        <div className={bemBlocks.item("title") } dangerouslySetInnerHTML={{ __html: _.get(result, "highlight.title", false) || result._source.title }}>
          </div>
        </a>
      </div>
  )
}



const MovieHitsDetails = (props) => {
  const { bemBlocks, result } = props
  const source = result._source;
  let url = "http://www.imdb.com/title/" + result._source.imdbId

  const { title, poster, writers = [], actors = [], genres = [], plot, released, rated } = source;

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } key={result._id} style={{
      width: '99%',
      minWidth: '99%',
      display: 'table-row'
    }}>
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ display: "table-cell", height: 200 }}>
          <a href={url} target="_blank">
            <div className={bemBlocks.item("poster") } style={{
              width: 180, height: 280,
              background: 'url(' + poster + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }} />
          </a>
        </div>
        <div style={{ display: "table-cell", verticalAlign: 'top', paddingLeft: 8 }}>
          <h2 style={{ marginTop: 0, marginBottom: 0 }}>{title}</h2>
          <ul style={{ marginTop: 8, marginBottom: 8, listStyle: 'none', paddingLeft: 20 }}>
            <li>Released: {released}</li>
            <li>Rating: {rated}</li>
            <li>Writers: {writers.join(', ')}</li>
            <li>Actors: {actors.join(', ') }</li>
          </ul>
          <div style={{ marginTop: 8, marginBottom: 8 }}>{plot}</div>
        </div>
      </div>
    </div>
  )
}
// "title", "poster", "imdbId", "released", "rated", "genres", "writers", "actors", "plot"]


export class PlaygroundApp extends React.Component<any, any> {

  searchkit: SearchkitManager

  constructor() {
    super()
    const host = "http://demo.searchkit.co/api/movies"
    // const host = "/api/mock"
    this.searchkit = new SearchkitManager(host)
    this.searchkit.translateFunction = (key) => {
      return { "pagination.next": "Next Page", "pagination.previous": "Previous Page" }[key]
    }
    this.state = {
      displayMode: "thumbnail"
    }
  }

  onDisplayModeChange(e) {
    this.setState({ displayMode: e.target.value })
  }

  render() {

    return (
      <div>
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
      hello
        <div className="layout">

          <div className="layout__top-bar top-bar">
            <div className="top-bar__content">
              <div className="my-logo">Searchkit Acme co</div>
              <SearchBox
                translations={{ "searchbox.placeholder": "search movies" }}
                queryOptions={{ "minimum_should_match": "70%" }}
                autofocus={true}
                searchOnChange={true}
                queryFields={["actors^1", "type^2", "languages", "title^5", "genres^2"]}/>
              </div>
            </div>

          <div className="layout__body">

            <div className="layout__filters">
              <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <NumericRefinementListFilter id="imdbRating" title="IMDB Rating" field="imdbRating" options={[
                { title: "All" },
                { title: "\u2605\u2605\u2605\u2605\u2606 & up", from: 8, to: 10 },
                { title: "\u2605\u2605\u2605\u2606\u2606 & up", from: 6, to: 10 },
                { title: "\u2605\u2605\u2606\u2606\u2606 & up", from: 4, to: 10 },
                { title: "\u2605\u2606\u2606\u2606\u2606 & up", from: 2, to: 10 },
              ]}/>
              <MultiSelectFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={100}/>
              <CheckboxFilter id="rating" title="Rating" field="rated" value={"r"} label="Rated 'R'"/>
              <RefinementListFilter id="actors" title="Actors" field="actors.raw" size={10}/>
              <RefinementListFilter translations={{ "facets.view_more": "View more writers" }} id="writers" title="Writers" field="writers.raw" operator="OR" size={10}/>
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                { title: "All" },
                { title: "up to 20", from: 0, to: 20 },
                { title: "21 to 60", from: 21, to: 60 },
                { title: "60 or more", from: 61, to: 1000 }
              ]}/>
              </div>

            <div className="layout__results results-list">

              <div className="results-list__action-bar action-bar">

                <div className="action-bar__info">
                  <HitsStats/>


                  <div className="sorting-selector" style={{ marginRight: 8 }}>
                    <select value={this.state.displayMode} onChange={this.onDisplayModeChange.bind(this) }>
                      <option value="thumbnail">Thumbnails</option>
                      <option value="list">List</option>
                    </select>
                  </div>

                  <SortingSelector options={[
                    { label: "Relevance", field: "_score", order: "desc", defaultOption: true },
                    { label: "Latest Releases", field: "released", order: "desc" },
                    { label: "Earliest Releases", field: "released", order: "asc" }
                  ]}/>
                  </div>

                <div className="action-bar__filters">
                  <SelectedFilters/>
                  <ResetFilters/>
                  </div>

                </div>
              <Hits hitsPerPage={12} highlightFields={["title"]}
                    itemComponent={this.state.displayMode == "thumbnail" ? MovieHitsItem : MovieHitsDetails }
                    sourceFilter={["title", "poster", "imdbId", "released", "rated", "genres", "writers", "actors", "plot"]}
                    scrollTo="body"
                />
              <NoHits suggestionsField={"title"}/>
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
