import * as React from "react";
import {
FastClick
} from "searchkit"

const block = require('bem-cn')
const map = require("lodash/map")
const find = require("lodash/find")
const includes = require("lodash/includes")


require('./Toggle.scss');

const ToggleItem = ({toggleItem, bemBlocks, active, disabled, label, url}) => {

  const className = bemBlocks.container("action").state({ active, disabled })
  var component;
  if (url) {
    component = <a href={url} className={className}>{label}</a>
  } else {
    component = <div className={className}>{label}</div>
  }
  return <FastClick handler={toggleItem}>{component}</FastClick>
}


export class Toggle extends React.Component<any, any> {

  static defaultProps: any = {
    mod: "sk-toggle",
    urlBuilder: () => undefined,
    itemComponent: ToggleItem
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled, urlBuilder } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const actions = map(items, (option) => {
      const label = option.title || option.label || option.key
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
      <div className={bemBlocks.container().state({ disabled }) }>
        {actions}
      </div>
    )
  }
}
