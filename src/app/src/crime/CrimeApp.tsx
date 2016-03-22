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


export class CrimeApp extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    const host = "/api/crimes"
    this.searchkit = new SearchkitManager(host)
  }

  render(){

    return (
      <div>
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
        <div className="layout layout__crime-app">

          <div className="layout__body">

    			<div className="layout__filters">
    				<MenuFilter id="crime_type" title="Crime Type" field="crime_type.raw"/>
    				<MenuFilter id="force" title="Force" field="force.raw"/>
    			</div>
    			<div className="layout__results">
            <GeoMap/>
    			</div>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</div>
        </div>
      </div>
      </SearchkitProvider>
      </div>
	)}

}
