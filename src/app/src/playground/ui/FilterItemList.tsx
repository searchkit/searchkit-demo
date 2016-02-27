import * as React from "react";

import { FilterItemComponent } from "./FilterItem"

const block = require('bem-cn')

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const includes = require("lodash/includes")

require('./FilterItemList.scss');


// hasOptions():boolean {
//   return this.props.buckets.length != 0
// }

// render() {

//   const { id, title, bemBlocks, buckets } = this.props

//   let block = bemBlocks.container
//   let className = block()
//     .mix(`filter--${id}`)
//     .state({
//       disabled: !this.hasOptions()
//     })

//   return (
//     <div data-qa={`filter--${this.props.id}`} className={className}>
//         <div data-qa="header" className={block("header") }>{title}</div>
//         <div data-qa="options" className={block("options") }>
//           {map(buckets, this.renderOption.bind(this)) }
//           </div>
//         {this.renderShowMore() }
//       </div>
//   );
// }

// renderOption(option) {
//   const { itemComponent, bemBlocks, state, toggleFilter, translate } = this.props

//   return React.createElement(itemComponent, {
//     key: option.key,
//     label: translate(option.key),
//     count: option.doc_count,
//     selected: state.contains(option.key),
//     translate,
//     bemBlocks,
//     toggleFilter: () => toggleFilter(option.key)
//   });
// }


export class FilterItemList extends React.Component<any, {}> {
  static defaultProps: any = {
    mod: "sk-filter-item-list",
    urlBuilder: () => undefined,
    itemComponent: FilterItemComponent
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
