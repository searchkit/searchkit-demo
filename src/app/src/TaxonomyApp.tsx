import * as React from "react";
import {
  SearchBox,
  Hits,
  HierarchicalRefinementFilter,
  Pagination,
  ResetFilters,
  SelectedFilters,
  SearchkitComponent,
  HitsStats,
  SearchkitManager,
  SearchkitProvider,
  NoHits,
  InitialLoader
} from "searchkit";

// import "searchkit/release/theme.css";


const TaxonomyHitsItem = (props)=> {
  const {result, bemBlocks} = props
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))}>
      {result._source.name}
    </div>
  )
}

export class TaxonomyApp extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    const host = "https://d78cfb11f565e845000.qb0x.com/taxonomynested"
    this.searchkit = new SearchkitManager(host)
    super()
  }

  render(){ return (
    <div>
    <SearchkitProvider searchkit={this.searchkit}>
    <div className="layout">

      <div className="layout__top-bar top-bar">
        <div className="top-bar__content">
          <div className="my-logo">Searchkit Acme co</div>
          <SearchBox
            translations={{"searchbox.placeholder":"search regions"}}
            queryOptions={{"minimum_should_match":"70%"}}
            autofocus={true}
            searchOnChange={true}
            queryFields={["title^5"]}/>
        </div>
      </div>

      <div className="layout__body">

  			<div className="layout__filters">
          <HierarchicalRefinementFilter field="taxonomy" id="categories" title="Region" startLevel={2}/>
  			</div>

        <div className="layout__results results-list">

          <div className="results-list__action-bar action-bar">

            <div className="action-bar__info">
              <HitsStats/>
            </div>

            <div className="action-bar__filters">
              <SelectedFilters/>
              <ResetFilters/>
            </div>
          </div>

  				<Hits hitsPerPage={10} itemComponent={TaxonomyHitsItem}/>
          <NoHits/>
          <InitialLoader/>
  				<Pagination showNumbers={true}/>
        </div>
			</div>
			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
		</div>
    </SearchkitProvider>
    </div>
	)}

}
