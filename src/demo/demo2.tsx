import * as React from "react";
import * as _ from "lodash";
import {MovieHitsGridItem} from "./HitItems.tsx";

import {
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  ResetFilters,
  SelectedFilters,
  HierarchicalMenuFilter,
  NumericRefinementListFilter,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  RangeFilter,
  ItemHistogramList,
  TagCloud
} from "searchkit";

import "searchkit/theming/theme.scss";

export class Demo2 extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    // new searchkit Manager connecting to ES server
    // const host = "http://demo.searchkit.co/api/movies"
    const host = "/api/movies"
    this.searchkit = new SearchkitManager(host)
  }


  render(){

    return (
      <SearchkitProvider searchkit={this.searchkit}>
      <div>
        <div className="sk-layout sk-layout__size-l">

          <div className="sk-layout__top-bar sk-top-bar">
            <div className="sk-top-bar__content">

              <SearchBox
                autofocus={true}
                searchOnChange={false}
                queryFields={["title^5", "actors"]}
                />
            </div>
          </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">

              add filters here

            </div>

      			<div className="sk-layout__results sk-results-list sk-results-list__no-filters">

              <div className="sk-results-list__action-bar sk-action-bar">

                <div className="sk-action-bar__info">
          				<HitsStats/>
          			</div>

                <div className="sk-action-bar__filters">
                  <ResetFilters/>
                </div>

              </div>

              <Hits
                itemComponent={MovieHitsGridItem}
                mod="sk-hits-grid"
                hitsPerPage={12}
                highlightFields={["title"]}/>
              <NoHits suggestionsField="title"/>

      			</div>
          </div>

    		</div>
      </div>
      </SearchkitProvider>
	)}

}
