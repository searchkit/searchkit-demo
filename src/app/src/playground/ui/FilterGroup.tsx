import * as React from 'react'
import './FilterGroup.scss'

import {
  ReactComponentType,
  PureRender
} from "searchkit"

const bemBlock = require('bem-cn')
const size = require('lodash/size')
const toArray = require('lodash/toArray')

import { mapAndJoin } from '../utils'

export interface FilterItemProps {
  key: string
  bemBlocks?: any
  label: string
  filter: any
  removeFilter: Function
}

@PureRender
export class FilterItem extends React.Component<FilterItemProps, any> {

  constructor(props){
    super(props)
    this.removeFilter = this.removeFilter.bind(this)
  }

  removeFilter(){
    const { removeFilter, filter } = this.props;
    if (removeFilter){
      removeFilter(filter)
    }
  }

  render() {
    const { bemBlocks, label } = this.props

    return (
      <div className={bemBlocks.option("value") } onClick={this.removeFilter}>{label}</div>
    )
  }
}

export interface FilterGroupProps {
  mod?: string
  title: string
  filters: Array<any>
  translate?: Function
  removeFilter: Function
  removeFilters: Function
}

export class FilterGroup extends React.Component<FilterGroupProps, any> {

  constructor(props){
    super(props)
    this.removeFilters = this.removeFilters.bind(this)
  }

  static defaultProps = {
    mod: "sk-filter-group",
    translate: (str) => str
  }

  removeFilters(){
    const { removeFilters, filters } = this.props
    if (removeFilters){
      removeFilters(filters)
    }
  }

  renderFilter(filter, bemBlocks) {
    const { translate, removeFilter } = this.props

    return (
      <FilterItem key={filter.value}
                  bemBlocks={bemBlocks}
                  filter={filter}
                  label={translate(filter.value)}
                  removeFilter={removeFilter} />
    )
  }

  render() {
    const { mod, title, filters, removeFilters, removeFilter } = this.props

    const bemBlocks = {
        container: bemBlock(mod),
        option: bemBlock (`${mod}-option`)
    }

    const className = bemBlocks.option()
      .mix(bemBlocks.container("item"))
      .mix(`selected-filter--${title}`)()
    return (
      <div key={title} className={className}>
        {removeFilters
            ? <div className={bemBlocks.option("remove-action") } onClick={this.removeFilters}>X</div>
            : undefined}
        <div className={bemBlocks.option("title") }>{title}: </div>
        {mapAndJoin(filters, filter => this.renderFilter(filter, bemBlocks))}
      </div>
    )
  }
}
