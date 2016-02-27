import * as React from "react";

import {
  SearchkitComponent,
  NumericOptionsAccessor,
  SearchkitComponentProps,
  RangeOption,
  FilterItemComponent,
  FilterCheckboxItemComponent,
  FastClick
} from "searchkit"

import { FilterItemList } from '../ui'

const block = require('bem-cn')

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const includes = require("lodash/includes")
const find = require("lodash/find")



export interface NumericRefinementListFilterProps extends SearchkitComponentProps {
  field:string
  title:string
  options:Array<RangeOption>
  id:string
  listComponent?: any
}

export class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
  accessor:NumericOptionsAccessor

  static propTypes = defaults({
    listComponent: React.PropTypes.any,
    field:React.PropTypes.string.isRequired,
    title:React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
    options:React.PropTypes.arrayOf(
      React.PropTypes.shape({
        title:React.PropTypes.string.isRequired,
        from:React.PropTypes.number,
        to:React.PropTypes.number,
        key:React.PropTypes.string
      })
    )
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: FilterItemList
  }

  defineAccessor() {
    const {id, field, options, title} = this.props
    return new NumericOptionsAccessor(id, {
      id, field, options, title
    })
  }

  defineBEMBlocks() {
    var blockName = this.props.mod || "sk-numeric-refinement-list"
    return {
      container: blockName,
      option: `${blockName}-option`
    }
  }

  toggleFilter(key) {
    const option = find(this.accessor.getBuckets(), it => it.key == key)
    this.accessor.setOption(option)
  }

  getSelectedItems() {
    let selectedOption = this.accessor.getSelectedOption()
    if (!selectedOption) return []
    else return [{key: selectedOption.title}]
  }

  hasOptions(): boolean {
      return this.accessor.getBuckets().length != 0
  }

  render() {
    const { listComponent } = this.props

    var block = this.bemBlocks.container
    var className = block()
      .mix(`filter--${this.props.id}`)
      .state({
          disabled: !this.hasOptions()
      })

    return (
      <div className={className}>
        <div className={block("header")}>{this.props.title}</div>
        {React.createElement(listComponent, {
          items: this.accessor.getBuckets(),
          selectedItems: this.getSelectedItems(),
          toggleItem: this.toggleFilter.bind(this)
        })}
      </div>
    );
  }
}
