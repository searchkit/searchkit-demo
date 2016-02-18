import * as React from "react";
import {
FastClick
} from "searchkit"

const block = require('bem-cn')
const map = require("lodash/map")
const transform = require("lodash/transform")

require('./Toggle.scss');

const ViewItemComponent = (props) => {
  return (
    <FastClick handler={props.toggleItem}>
      <div className={props.bemBlocks.container("action").state({ active: props.isActive }) }>
        {props.view}
      </div>
    </FastClick>
  )
}


export class Toggle extends React.Component<any, any> {

  static defaultProps: any = {
    mod: "sk-toggle",
    itemComponent: ViewItemComponent
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    const actions = map(items, (option) => {
      return React.createElement(itemComponent, {
        view: option.title || option.label,
        toggleItem: () => toggleItem(option),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled,
        isActive: selectedItems.indexOf(option) != -1
      })
    })

    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        {actions}
      </div>
    )
  }
}
