import * as React from "react";
import * as _ from "lodash";

export const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://195.26.178.77/" + result._source.imdbId+ "/" + result._source.plot
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} onClick={(e)=>{e.preventDefault(); console.log("195.26.178.77/plugins/imageviewer/site/direct.php?s="+result._source.imdbId)}}>
        <div >
          <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.poster} width="240" height="240"/>
          <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
          </div>
        </div>
      </a>
    </div>
  )
}

export const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}
