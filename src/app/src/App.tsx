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
	SortingSelector,
	SearchkitComponent,
	Searcher,
	SearcherProvider
} from "searchkit";

require("./../styles/index.scss");

class MovieHits extends Hits {
	renderResult(result:any) {
		let url = "http://www.imdb.com/title/" + result._source.imdbId
		return (
			<div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
				<a href={url} target="_blank">
					<img className={this.bemBlocks.item("poster")} src={result._source.poster} width="180" height="270"/>
				</a>
				<a href={url} target="_blank">
					<div className={this.bemBlocks.item("title")}>{result._source.title}</div>
				</a>
			</div>
		)
	}
}

export class App extends SearchkitComponent<any, any> {

	render(){ return (
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
				<MovieHits hitsPerPage={20}/>
				<Pagination/>
			</div>
		</div>
	)}
}
