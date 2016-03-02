import * as React from "react";
import {
FastClick
} from "searchkit"

const block = require('bem-cn')

const map = require("lodash/map")
const includes = require("lodash/includes")
const sortBy = require("lodash/sortBy")
const minBy = require("lodash/minBy")
const maxBy = require("lodash/maxBy")

require('./TagCloud.scss');

const TagItem = ({toggleItem, bemBlocks, active, disabled, label, url, fontSize}) => {

  const className = bemBlocks.container("item").state({ active, disabled })
  var component;
  const style = { fontSize }
  if (url) {
    component = <a href={url} className={className} style={style}> {label}</a>
  } else {
    component = <span className={className} style={style}>{label}</span>
  }
  return <FastClick handler={toggleItem}>{component}</FastClick>
}

function computeMinMax(items, field) {
  if (!items || items.length == 0) return {min: 0, max: 0}
  return {
    min: minBy(items, field)[field],
    max: maxBy(items, field)[field]
  }
}


export class TagCloud extends React.Component<any, any> {

  static defaultProps: any = {
    mod: "sk-tag-cloud",
    urlBuilder: () => undefined,
    itemComponent: TagItem,
    showCount: false,
    minSize: 10,
    maxSize: 15
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled, urlBuilder, showCount, minSize, maxSize } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const sortedItems = sortBy(items, it => it.title || it.label || it.key)
    const { min, max } = computeMinMax(items, "doc_count")


    const children = map(sortedItems, (option) => {
      var label = option.title || option.label || option.key
      if (showCount && (option.doc_count !== undefined)) label += ` (${option.doc_count})`
      const sizeRatio = (min === max) ? 0.5 : ((option.doc_count - min) / (max - min))
      const fontSize = minSize + (sizeRatio * sizeRatio) * (maxSize - minSize) // with squared ratio
      return React.createElement(itemComponent, {
        label,
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        url: urlBuilder && urlBuilder(option),
        active: includes(selectedItems, option.key),
        fontSize
      })
    })
    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        {children}
      </div>
    )
  }
}
