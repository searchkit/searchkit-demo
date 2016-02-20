import * as React from "react";

const block = require('bem-cn')
const map = require("lodash/map")
const filter = require("lodash/filter")
const transform = require("lodash/transform")
const find = require("lodash/find")

require('./Selector.scss');

function filterSelectorItems(items){
  return filter(items, ({ hideInSelector = false }) => !hideInSelector)
}

export class Selector extends React.Component<any, any> {

  static defaultProps: any = {
    mod: "sk-selector"
  }

  onChange(e){
    const { items, toggleItem } = this.props
    const key = e.target.value
    toggleItem(key)
  }

  getSelectedValue(){
    const { selectedItems=[] } = this.props
    if (selectedItems.length == 0) return null
    return selectedItems[0].key
  }

  render() {
    const { mod, items, disabled } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        <select onChange={this.onChange.bind(this)} value={this.getSelectedValue() }>
          {map(filterSelectorItems(items), ({key, label, title, disabled}, idx) => {
            const l = label || title
            return <option key={idx + '-' + l} value={key} disabled={disabled}>{l}</option>
          })}
          </select>
      </div>
    )
  }
}
