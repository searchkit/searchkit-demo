import * as React from "react";
import { TagFilter } from './components';

export function MovieHitsGridItem(props) {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source: any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster") } src={result._source.poster} width="170" height="240"/>
        <div data-qa="title" className={bemBlocks.item("title") } dangerouslySetInnerHTML={{ __html: source.title }}>
        </div>
      </a>
    </div>
  )
}

function mapAndJoin(array=[], func, joinString=", "){
  const result = []
  const length = array.length
  array.forEach((c, idx) => {
    result.push(func(c))
    if (idx < length - 1) result.push(<span key={"joinString-" + idx}>{joinString}</span>)
  })
  return result;
}



export function MovieHitsListItem(props) {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source: any = _.extend({}, result._source, result.highlight)
  const { title, poster, writers = [], actors = [], genres = [], plot, released, rated } = source;

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item")) } data-qa="hit">
      <div className={bemBlocks.item("poster") }>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details") }>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title") } dangerouslySetInnerHTML={{ __html: source.title }}></h2></a>
        <h3 className={bemBlocks.item("subtitle") }>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <ul style={{ marginTop: 8, marginBottom: 8, listStyle: 'none', paddingLeft: 20 }}>
          <li>Rating: {rated}</li>
          <li>Genres: {mapAndJoin(genres, a => <TagFilter key={a} field="genres.raw" value={a}>{a}</TagFilter>) }</li>
          <li>Writers: {mapAndJoin(writers, a => <TagFilter key={a} field="writers.raw" value={a}>{a}</TagFilter>) }</li>
          <li>Actors: {mapAndJoin(actors, a => <TagFilter key={a} field="actors.raw" value={a}>{a}</TagFilter>) }</li>
        </ul>
        <div className={bemBlocks.item("text") } dangerouslySetInnerHTML={{ __html: source.plot }}></div>
      </div>
    </div>
  )
}


