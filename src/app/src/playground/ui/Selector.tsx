import * as React from "react";

const block = require('bem-cn')
const map = require("lodash/map")
const filter = require("lodash/filter")
const transform = require("lodash/transform")

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
    const value = e.target.value
    toggleItem(items.find(it => (it.label === value) || (it.title == value)))
  }

  getSelectedValue(){
    const { selectedItems=[] } = this.props
    if (selectedItems.length == 0) return null
    return selectedItems[0].label || selectedItems[0].title
  }

  render() {
    const { mod, items, disabled } = this.props

    const bemBlocks = {
      container: block(mod)
    }

    return (
      <div className={bemBlocks.container().state({ disabled }) }>
        <select onChange={this.onChange.bind(this)} value={this.getSelectedValue() }>
          {map(filterSelectorItems(items), ({label, title, disabled}, idx) => {
            const l = label || title
            return <option key={idx + '-' + l} value={l} disabled={disabled}>{l}</option>
          })}
          </select>
      </div>
    )
  }
}
