import * as React from "react";

import { FilterItemComponent, FilterCheckboxItemComponent } from "./FilterItem"

const block = require('bem-cn')

const map = require("lodash/map")
const includes = require("lodash/includes")
const defaults = require("lodash/defaults")

require('./FilterItemList.scss');



export class AbstractFilterItemList extends React.Component<any, {}> {
  static defaultProps: any = {
    mod: "sk-filter-item-list",
    urlBuilder: () => undefined
  }

  render() {
    const { mod, itemComponent, items, selectedItems = [], toggleItem, disabled, urlBuilder } = this.props
    const keys = map(selectedItems, "key")

    const bemBlocks = {
      container: block(mod),
      option: block(`${mod}-option`)
    }

    const actions = map(items, (option) => {
        const label = option.title || option.label || option.key
      return React.createElement(itemComponent, {
        // view: label,
        label: label,
        toggleItem: () => toggleItem(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        disabled: disabled || option.disabled,
        url: urlBuilder && urlBuilder(option),
        count: option.doc_count,
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

export class FilterItemList extends AbstractFilterItemList {
    static defaultProps = defaults({
        itemComponent: FilterItemComponent
    }, AbstractFilterItemList.defaultProps)
}

export class FilterCheckboxItemList extends AbstractFilterItemList {
    static defaultProps = defaults({
        itemComponent: FilterCheckboxItemComponent
    }, AbstractFilterItemList.defaultProps)
}
