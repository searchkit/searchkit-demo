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
  TagCloud,
  Layout, LayoutBody, LayoutResults,
  SideBar, TopBar,
  ActionBar, ActionBarRow
} from "searchkit";

import "searchkit/theming/theme.scss";

export class Demo2 extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    // new searchkit Manager connecting to ES server
    const host = "http://demo.searchkit.co/api/movies"
    // const host = "/api/movies"
    this.searchkit = new SearchkitManager(host)
  }


  render(){

    return (
      <SearchkitProvider searchkit={this.searchkit}>
        <Layout size="l">

          <TopBar>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              queryFields={["title^5", "actors"]}
              />
          </TopBar>

          <LayoutBody>

            <SideBar>
              <RangeFilter
                min={0}
                max={100}
                field="metaScore"
                id="metascore"
                title="Metascore"
              />

              <RefinementListFilter
                id="actors"
                title="Actors"
                field="actors.raw"
                operator="OR"
                size={10}
                listComponent={ItemHistogramList}
              />

              <RefinementListFilter
                id="author"
                title="Author"
                field="author.raw"
                operator="OR"
                size={10}
                listComponent={ItemHistogramList}
              />

              <RefinementListFilter
                id="writers"
                title="Writers"
                field="writers.raw"
                operator="OR"
                size={10}
              />

              <HierarchicalMenuFilter
                fields={["type.raw", "genres.raw"]}
                title="Categories"
                id="categories"/>



            </SideBar>

      			<LayoutResults>

              <ActionBar>
                <ActionBarRow>
          				<HitsStats/>
          			</ActionBarRow>
                <ActionBarRow>
                  <SelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>

              <Hits
                itemComponent={MovieHitsGridItem}
                mod="sk-hits-grid"
                hitsPerPage={15}
                highlightFields={["title"]}/>
              <NoHits suggestionsField="title"/>

      			</LayoutResults>
          </LayoutBody>

    		</Layout>
      </SearchkitProvider>
	)}

}
