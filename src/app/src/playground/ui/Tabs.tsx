import * as React from "react"

import {
FastClick
} from "searchkit"

const block = require('bem-cn')
const map = require("lodash/map")
const find = require("lodash/find")
const includes = require("lodash/includes")

require('./Tabs.scss');

const Tab = ({toggleItem, bemBlocks, active, disabled, label, url}) => {

  const className = bemBlocks.container("tab").state({ active, disabled })
  var component;
  if (url) {
    component = <li className={className}><a href={url}>{label}</a></li>
  } else {
    component = <li className={className}>{label}</li>
  }
  return <FastClick handler={toggleItem}>{component}</FastClick>
}


export class Tabs extends React.Component<any, any> {

  static defaultProps: any = {
    mod: "sk-tabs",
    urlBuilder: () => undefined,
    itemComponent: Tab
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled, urlBuilder, showCount } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const options = map(items, (option) => {
      var label = option.title || option.label || option.key
      if (showCount && (option.doc_count !== undefined)) label += ` (${option.doc_count})`
      return React.createElement(itemComponent, {
        label,
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        url: urlBuilder && urlBuilder(option),
        active: includes(selectedItems, option.key)
      })
    })
    return (
      <ul className={bemBlocks.container().state({ disabled }) }>
        {options}
      </ul>
    )
  }
}
