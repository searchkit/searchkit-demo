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

require("./../styles/index.scss");

class MovieHits extends Hits {
  renderResult(result:any) {
    let url = "http://www.imdb.com/title/" + result._source.imdbId
    return (
      <div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
        <a href={url} target="_blank">
          <img className={this.bemBlocks.item("poster")} src={result._source.poster} width="180" height="270"/>
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
      return {"pagination.next":"Next Page"}[key]
    }
    super()
  }

  render(){

    return (
      <div>
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
        <div className="layout">
          <div className="layout__search-box">
            <SelectedFilters/>
            <SearchBox translations={{"searchbox.placeholder":"search movies"}} queryOptions={{"minimum_should_match":"70%"}} autofocus={true} searchOnChange={true} queryFields={["actors^1","type^2","languages","title^5", "genres^2"]}/>
          </div>

    			<div className="layout__filters">
    				<ResetFilters />
    				<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
            <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore"/>
            <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND" size={10}/>
    				<RefinementListFilter translations={{"facets.view_more":"View more writers"}} id="writers" title="Writers" field="writers.raw" operator="OR" size={10}/>
    				<RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={10}/>
          </div>
    			<div className="layout__results-info">
    				<HitsStats/>
    				<SortingSelector options={[
    					{label:"Relevance", field:"_score", order:"desc"},
    					{label:"Latest Releases", field:"released", order:"desc"},
    					{label:"Earliest Releases", field:"released", order:"asc"}
    				]}/>
    			</div>
    			<div className="layout__results">
    				<MovieHits hitsPerPage={10} highlightFields={["title"]}/>
            <NoHits suggestionsField={"title"}/>
    				<Pagination/>
    			</div>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</div>
      </div>
      </SearchkitProvider>
      </div>
	)}

}
