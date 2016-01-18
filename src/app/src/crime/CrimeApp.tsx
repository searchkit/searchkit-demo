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
  NoHits
} from "searchkit";

import {
  CrimeAccessor,
  GeoMap
} from "./CrimeAggs"

require("./../../styles/index.scss");

class CrimeHits extends Hits {
  renderResult(result:any) {
    let url = "http://www.imdb.com/title/" + result._source.imdbId
    return (
      <div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
        {result._id}
      </div>
    )
  }
}

export class CrimeApp extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    const host = "https://d78cfb11f565e845000.qb0x.com/crimes"
    this.searchkit = new SearchkitManager(host)
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
          </div>

    			<div className="layout__filters">
    				<ResetFilters />
    				<MenuFilter id="crime_type" title="Crime Type" field="crime_type.raw"/>
    				<MenuFilter id="force" title="Force" field="force.raw"/>
    			</div>
    			<div className="layout__results-info">
    				<HitsStats/>
    			</div>
    			<div className="layout__results">
            <GeoMap/>
    			</div>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</div>
      </div>
      </SearchkitProvider>
      </div>
	)}

}
