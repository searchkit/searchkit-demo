import * as React from "react";

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
	SortingSelector
} from "searchkit";

import {
	SearchkitComponent,
	Searcher,
	SearcherProvider,
	LoadingComponent
} from "searchkit";

require("./../styles/index.scss");

class MovieHits extends Hits {
	renderResult(result:any) {
		return (
			<div className="hit" key={result._id}>
				<img className="hit__poster" src={result._source.poster}/>
				<div className="hit__title">{result._source.title}</div>
			</div>
		)
	}
}

export class App extends SearchkitComponent<any, any> {
	primarySearcher:Searcher

	componentWillMount(){
		super.componentWillMount()
		this.primarySearcher = this.searchkit.createSearcher()
	}

	render(){
		return (
			<SearcherProvider searcher={this.primarySearcher}>
				<div className="layout">
					<div className="layout__search-box">
						<SelectedFilters/>
						<SearchBox searchOnChange={true} prefixQueryFields={["actors^1","type^2","languages","title^10"]}/>
					</div>

					<div className="layout__filters">
						<ResetFilters />
						<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
						<MenuFilter field="languages.raw" title="Languages" id="languages"/>
						<RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND"/>
						<RefinementListFilter id="writers" title="Writers" field="writers.raw" operator="OR"/>
						<RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR"/>
						<NumericRefinementListFilter id="metascore" title="Meta score" field="metaScore" options={[
							{title:"All"},
							{title:"up to 20", from:0, to:21},
							{title:"21 to 40", from:21, to:41},
							{title:"41 to 60", from:41, to:61},
							{title:"61 to 80", from:61, to:81},
							{title:"81 to 100", from:81, to:101}
						]} />
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
						<MovieHits hitsPerPage={50}/>
						<Pagination/>
					</div>
				</div>
			</SearcherProvider>

		);

	}

}
