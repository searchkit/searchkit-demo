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
  RangeFilter
} from "searchkit";

import "./../styles/customisations.scss";
import "searchkit/release/theme.css";


class MovieHits extends Hits {
  renderResult(result:any) {
    let url = "http://www.imdb.com/title/" + result._source.imdbId
    return (
      <div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
        <a href={url} target="_blank">
          <img className={this.bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
        </a>
        <a href={url} target="_blank">
          <div className={this.bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.title",false) || result._source.title}}>
          </div>
        </a>
      </div>
    )
  }
}


export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    const host = "https://d78cfb11f565e845000.qb0x.com/movies"
    this.searchkit = new SearchkitManager(host)
    this.searchkit.translateFunction = (key)=> {
      return {"pagination.next":"Next Page", "pagination.previous":"Previous Page"}[key]
    }
    super()
  }

  render(){

    return (
      <div>
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
        <div className="layout">

          <div className="layout__top-bar top-bar">
            <div className="top-bar__content">
              <div className="my-logo">Searchkit Acme co</div>
              <SearchBox
                translations={{"searchbox.placeholder":"search movies"}}
                queryOptions={{"minimum_should_match":"70%"}}
                autofocus={true}
                searchOnChange={true}
                queryFields={["actors^1","type^2","languages","title^5", "genres^2"]}/>
            </div>
          </div>

          <div className="layout__body">

      			<div className="layout__filters">
      				<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <RangeFilter min={0} max={10} field="imdbRating" id="imdbRating" title="IMDB Rating" showHistogram={true}/>
              <RefinementListFilter id="actors" title="Actors" field="actors.raw" size={10}/>
      				<RefinementListFilter translations={{"facets.view_more":"View more writers"}} id="writers" title="Writers" field="writers.raw" operator="OR" size={10}/>
      				<RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={10}/>
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                {title:"All"},
                {title:"up to 20", from:0, to:20},
                {title:"21 to 60", from:21, to:60},
                {title:"60 or more", from:61, to:1000}
              ]}/>
            </div>

      			<div className="layout__results results-list">

              <div className="results-list__action-bar action-bar">

                <div className="action-bar__info">
          				<HitsStats/>
          				<SortingSelector options={[
          					{label:"Relevance", field:"_score", order:"desc"},
          					{label:"Latest Releases", field:"released", order:"desc"},
          					{label:"Earliest Releases", field:"released", order:"asc"}
          				]}/>
          			</div>

                <div className="action-bar__filters">
                  <SelectedFilters/>
                  <ResetFilters/>
                </div>

              </div>
      				<MovieHits hitsPerPage={12} highlightFields={["title"]}/>
              <NoHits suggestionsField={"title"}/>
      				<Pagination showNumbers={true}/>
      			</div>
          </div>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</div>
      </div>
      </SearchkitProvider>
      </div>
	)}

}
