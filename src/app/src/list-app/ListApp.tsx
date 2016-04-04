import {
  SearchkitManager,SearchkitProvider,
  SearchBox, Hits, RefinementListFilter, Pagination,
  MenuFilter, HitsStats, SortingSelector, NoHits,
  ItemList, CheckboxItemList, ItemHistogramList,
  Tabs, TagCloud, Toggle, Select,
  Layout, LayoutBody, LayoutResults,
  SideBar, TopBar,
  ActionBar, ActionBarRow
} from "searchkit";
const host = "/api/movies"
import * as ReactDOM from "react-dom";
import * as React from "react";
const searchkit = new SearchkitManager(host)

const _ = require("lodash")
import "searchkit/theming/theme.scss";
import "./customisations.scss";

import {MovieHitsGridItem, MovieHitsListItem} from "../ResultComponents"


export class ListApp extends React.Component<any, any> {
  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout className="list-app">

          <TopBar>
            <div className="my-logo">Filter list components</div>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
          </TopBar>

          <LayoutBody>

            <SideBar>
              <div className="sk-layout__filters-row">
                <MenuFilter field={"type.raw"} title="ItemList" id="item-list" listComponent={ItemList} />
                <MenuFilter field={"type.raw"} title="CheckboxItemList" id="checkbox-item-list" listComponent={CheckboxItemList} />
                <MenuFilter field={"type.raw"} title="ItemHistogramList" id="histogram-list" listComponent={ItemHistogramList} />
                <MenuFilter field={"type.raw"} title="TagCloud" id="tag-cloud" listComponent={TagCloud} />
                <MenuFilter field={"type.raw"} title="Toggle" id="toggle" listComponent={Toggle} />
                <MenuFilter field={"type.raw"} title="Tabs" id="tabs" listComponent={Tabs} />
                <MenuFilter field={"type.raw"} title="Select" id="select" listComponent={Select} />
              </div>
            </SideBar>

            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats translations={{
                    "hitstats.results_found":"{hitCount} results found"
                  }}/>
                </ActionBarRow>
              </ActionBar>
              <Hits
                  hitsPerPage={12} highlightFields={["title","plot"]}
                  sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                  mod="sk-hits-grid" itemComponent={MovieHitsGridItem} scrollTo="body"
              />
              <NoHits suggestionsField={"title"}/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}
