import * as React from "react";
import {
FastClick
} from "searchkit"

const block = require('bem-cn')
const map = require("lodash/map")
const find = require("lodash/find")
const includes = require("lodash/includes")


require('./Toggle.scss');

const ViewItemComponent = ({toggleItem, bemBlocks, active, disabled, view, url}) => {

  const className = bemBlocks.container("action").state({ active, disabled })
  var component;
  if (url) {
    component = <a href={url} className={className}>{view}</a>
  } else {
    component = <div className={className}>{view}</div>
  }
  return <FastClick handler={toggleItem}>{component}</FastClick>
}


export class Toggle extends React.Component<any, any> {

  static defaultProps: any = {
    mod: "sk-toggle",
    urlBuilder: () => undefined,
    itemComponent: ViewItemComponent
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled, urlBuilder } = this.props

    const keys = map(selectedItems, "key")

    const bemBlocks = {
      container: block(mod)
    }

    const actions = map(items, (option) => {
      const label = option.title || option.label || option.key
      return React.createElement(itemComponent, {
        view: label,
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        url: urlBuilder && urlBuilder(option),
        active: includes(keys, option.key)
      })
    })
    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        {actions}
      </div>
    )
  }
}
