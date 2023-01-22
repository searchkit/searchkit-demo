import { InstantSearch, SearchBox, Hits, Highlight, DynamicWidgets, RefinementList, ToggleRefinement, Panel, Pagination, Stats, connectSearchBox, NumericMenu, RangeInput, CurrentRefinements, QueryRuleCustomData, Snippet, SortBy } from 'react-instantsearch-dom';
import Client from '@searchkit/instantsearch-client'
import Searchkit from "searchkit"
import { config } from "./api/config"


// This is setup to use Searchkit to call Elasticsearch directly.
// If you want to proxy the search request through your API, you can use the commented out code below.
// and will use the pages/api/search.ts file to proxy the request.

const searchkitClient = new Searchkit(config)
const searchClient = Client(searchkitClient);


// Uncomment this code to use the pages/api/search.ts file to proxy the request.
// and uncomment the two lines above to stop calling Elasticsearch directly.

// const searchClient = Client({
//   url: '/api/search',
// });

const hitView = (props: any) => {
  return (
    <div>
      <img src={props.hit.poster} className="hit-image" />
      <h2><Highlight hit={props.hit} attribute="title" /></h2>
      <br />
      
      <Snippet hit={props.hit} attribute="plot" />

    </div>
  )
}

export default function Web() {
    return (
      <div className="ais-InstantSearch bg-gray-100 h-screen p-4">
            <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/algolia-min.css"
    />
  
      <InstantSearch
        indexName="imdb_movies"
        searchClient={searchClient}
      >
        <SearchBox />
        <div className="left-panel">
          {/* @ts-ignore */}
          <DynamicWidgets maxValuesPerFacet={5} fallbackWidget={RefinementList}>
            <Panel header="Type">
              <RefinementList attribute="type" searchable={true}/>
            </Panel>
            <Panel header="actors">
              <RefinementList attribute="actors" searchable={true} limit={10} />
            </Panel>
            <Panel header="imdbrating">
              <NumericMenu
                attribute="imdbrating"
                items={[
                  { label: '5 - 7', start: 5, end: 7 },
                  { label: '7 - 9', start: 7, end: 9 },
                  { label: '>= 9', start: 9 },
                ]}
              />
            </Panel>
            <Panel header="metascore">
              <RangeInput attribute="metascore" header="Range Input" />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="right-panel">
        <QueryRuleCustomData>
        {({ items }) =>
          items.map(({ title }) => {
            if (!title) {
              return null;
            }

            return (
              <section key={title}>
                <h2>{title}</h2>
                <p>You have typed in movie, show something wild about movies!</p>
              </section>
            );
          })
        }
      </QueryRuleCustomData>
        <div className="flex">
          <div className="flex-auto w-full py-2 px-4">
            <Stats />
            <CurrentRefinements />
          </div>
          <div className="flex-none">
            <SortBy defaultRefinement='imdb_movies' items={[
              { value: 'imdb_movies', label: 'Relevance' },
              { value: 'imdb_movies_rated_desc', label: 'Highly Rated Movies' },
            ]}
            />
          </div>
          </div>

          <Hits hitComponent={hitView}/>
          <Pagination />
        </div>
      </InstantSearch>
      </div>
    );
}
