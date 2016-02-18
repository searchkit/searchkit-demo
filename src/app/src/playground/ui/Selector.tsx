import * as React from "react";

const block = require('bem-cn')
const map = require("lodash/map")
const transform = require("lodash/transform")

require('./Selector.scss');

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
          {map(items, ({label, title}) => {
            const l = label || title
            return <option key={l} value={l}>{l}</option>
          })}
          </select>
      </div>
    )
  }
}
