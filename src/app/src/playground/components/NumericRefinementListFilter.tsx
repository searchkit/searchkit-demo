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

import { FilterItemList, Panel } from '../ui'

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
  multiselect?: boolean
  showCount?: boolean
  collapsable?: boolean
  listComponent?: any
  containerComponent?: any
}

export class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
  accessor:NumericOptionsAccessor

  static propTypes = defaults({
    listComponent: React.PropTypes.any,
    field:React.PropTypes.string.isRequired,
    title:React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
    multiselect: React.PropTypes.bool,
    showCount: React.PropTypes.bool,
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
    containerComponent: Panel,
    multiselect: false,
    showCount: true
  }

  defineAccessor() {
    const {id, field, options, title, multiselect} = this.props
    return new NumericOptionsAccessor(id, {
      id, field, options, title, multiselect
    })
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
    const { listComponent, containerComponent, showCount, title, id, collapsable } = this.props

    return React.createElement(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: !this.hasOptions(),
      collapsable
    }, [
      React.createElement(listComponent, {
        items: this.accessor.getBuckets(),
        selectedItems: this.getSelectedItems(),
        toggleItem: this.toggleFilter.bind(this),
        showCount
      })
    ]);
  }
}
