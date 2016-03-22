import * as React from "react";
import * as _ from "lodash";
import {MovieHitsGridItem} from "./HitItems.tsx";

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
  ViewSwitcherHits,
  ItemHistogramList
} from "searchkit";

import "searchkit/theming/theme.scss";

export class Demo2 extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    // new searchkit Manager connecting to ES server
    const host = "http://demo.searchkit.co/api/movies"
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
                searchOnChange={true}
                queryFields={["title^5", "actors"]}
                />
            </div>
          </div>

          <div className="sk-layout__body">

            <div className="sk-layout__filters">
              <HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
              <RangeFilter min={0} max={100} field="metaScore" id="metascore" title="Metascore" showHistogram={true}/>
              <RefinementListFilter listComponent={ItemHistogramList} id="actors" title="Actors" field="actors.raw" size={10} operator="AND"/>
              <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
                {title:"All"},
                {title:"up to 20", from:0, to:20},
                {title:"21 to 60", from:21, to:60},
                {title:"60 or more", from:61, to:1000}
              ]}/>
            </div>

      			<div className="sk-layout__results sk-results-list sk-results-list__no-filters">

              <div className="sk-results-list__action-bar sk-action-bar">

                <div className="sk-action-bar__info">
          				<HitsStats/>
          			</div>

                <div className="sk-action-bar__filters">
                  <SelectedFilters/>
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
