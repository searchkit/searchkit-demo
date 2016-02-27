/*
  CHANGELOG

  Use listComponent for rendering
  Switch on "ALL" value by default (and when removing other values)
  `multiselect` option
 */

import * as React from "react";

import {
  SearchkitComponent,
  // NumericOptionsAccessor,
  SearchkitComponentProps,
  RangeOption,
  FilterItemComponent,
  FilterCheckboxItemComponent,
  FastClick
} from "searchkit"

import {
  NumericOptionsAccessor
} from '../accessors'

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
  multiselect?: boolean
}

export class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
  accessor:NumericOptionsAccessor

  static propTypes = defaults({
    listComponent: React.PropTypes.any,
    field:React.PropTypes.string.isRequired,
    title:React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
    multiselect: React.PropTypes.bool,
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
    listComponent: FilterItemList,
    multiselect: false
  }

  defineAccessor() {
    const {id, field, options, title, multiselect} = this.props
    return new NumericOptionsAccessor(id, {
      id, field, options, title, multiselect
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
    this.accessor.toggleOption(key)
  }

  getSelectedItems() {
    const selectedOptions = this.accessor.getSelectedOrDefaultOptions() || []
    return map(selectedOptions, opt => ({key: opt.title}))
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
