import * as React from "react";
import * as _ from "lodash";
const BEMBlock = require("bem-cn")

import {ViewSwitcher} from "./ViewSwitcher";

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

import "./../styles/customisations.scss";
import "searchkit/theming/theme.scss";

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>
      </a>
      <a href={url} target="_blank">
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.title",false) || result._source.title}}>
        </div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    const host = "http://demo.searchkit.co/api/movies"
    this.searchkit = new SearchkitManager(host)
    this.searchkit.translateFunction = (key)=> {
      return {"pagination.next":"Next Page", "pagination.previous":"Previous Page"}[key]
    }
    this.state = {
      view:"Grid"
    }
    super()
  }

  setView(view) {
    this.setState({view})
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
                queryFields={["actors^1","type^2","languages","title^5", "genres^2", "plot"]}/>
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
          				<HitsStats translations={{
                    "hitstats.results_found":"{hitCount} results found"
                  }}/>
                  <ViewSwitcher active={this.state.view} onChange={this.setView.bind(this)} views={["Grid", "List"]}/>
          				<SortingSelector options={[
          					{label:"Relevance", field:"_score", order:"desc",defaultOption:true},
          					{label:"Latest Releases", field:"released", order:"desc"},
          					{label:"Earliest Releases", field:"released", order:"asc"}
          				]}/>

          			</div>

                <div className="action-bar__filters">
                  <SelectedFilters/>
                  <ResetFilters/>
                </div>

              </div>
      				<Hits hitsPerPage={12} highlightFields={["title","plot"]}
                    sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                    mod={'sk-hits-'+this.state.view.toLowerCase()}
                    itemComponent={this.state.view == "Grid" ? MovieHitsGridItem : MovieHitsListItem}
                    scrollTo="body"
              />
              <NoHits suggestionsField={"title"}/>
              <InitialLoader/>
      				<Pagination showNumbers={false}/>
      			</div>
          </div>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</div>
      </div>
      </SearchkitProvider>
      </div>
	)}

}
