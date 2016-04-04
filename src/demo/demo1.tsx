import * as React from "react";
import * as _ from "lodash";
import {MovieHitsGridItem} from "./HitItems.tsx";

import {
  SearchBox,
  Hits,
  HitsStats,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  ViewSwitcherToggle,
  ViewSwitcherHits,
  Pagination,
  Layout, LayoutBody, LayoutResults,
  SideBar, TopBar,
  ActionBar, ActionBarRow
} from "searchkit";

import "searchkit/theming/theme.scss";

export class Demo1 extends React.Component<any, any> {

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
              queryFields={["title", "actors"]}
              />
          </TopBar>
          <LayoutBody>
      			<LayoutResults>
              <ActionBar>
                <ActionBarRow>
          				<HitsStats/>
          			</ActionBarRow>
              </ActionBar>
              <Hits
                itemComponent={MovieHitsGridItem}
                mod="sk-hits-grid"
                hitsPerPage={12}
                highlightFields={["title"]}
                />
              <NoHits suggestionsField="title"/>
              <Pagination showNumbers={true}/>
      			</LayoutResults>
          </LayoutBody>
    		</Layout>
      </SearchkitProvider>
	)}

}
