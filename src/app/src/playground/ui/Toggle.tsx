import * as React from "react";
import {
FastClick
} from "searchkit"

const block = require('bem-cn')
const map = require("lodash/map")
const find = require("lodash/find")

require('./Toggle.scss');

const ViewItemComponent = ({toggleItem, bemBlocks, active, disabled, view, url}) => {

  // < a className= { className } href= { urlBuilder(pageNumber) } >
  //       <div className={bemBlocks.option("text") }>{displayText}</div>
  //   </a >
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

    const bemBlocks = {
      container: block(mod)
    }

    const actions = map(items, (option) => {
      const label = option.title || option.label
      return React.createElement(itemComponent, {
        view: label,
        toggleItem: () => toggleItem(option),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        url: urlBuilder && urlBuilder(option),
        active: find(selectedItems, (it) => it.label === label || it.title === label) != undefined
      })
    })
    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        {actions}
      </div>
    )
  }
}
