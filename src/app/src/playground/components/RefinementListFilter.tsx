import * as React from "react";

import {
SearchkitManager,
SearchkitComponent,
FacetAccessor,
ISizeOption,
SearchkitComponentProps,
FastClick,
ReactComponentType,
ArrayState,
} from "searchkit"

import {FilterCheckboxItemComponent, FilterItemComponentProps} from "searchkit";

import { FilterCheckboxItemList, Panel } from '../ui'

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const isNumber = require("lodash/isNumber")


export interface RefinementListFilterProps extends SearchkitComponentProps {
    field: string
    operator?: string
    size?: number
    title: string
    id: string
    containerComponent?: ReactComponentType<any>
    itemComponent?: ReactComponentType<FilterItemComponentProps>
    listComponent?: ReactComponentType<any>
    orderKey?: string
    orderDirection?: string
    include?: Array<string> | string
    exclude?: Array<string> | string
    collapsable?: boolean
    showCount?: boolean
}

export class RefinementListFilter extends SearchkitComponent<RefinementListFilterProps, any> {
  accessor: FacetAccessor

  static propTypes = defaults({
    field: React.PropTypes.string.isRequired,
    operator: React.PropTypes.oneOf(["AND", "OR"]),
    size: React.PropTypes.number,
    title: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    translations: SearchkitComponent.translationsPropType(
        FacetAccessor.translations
    ),
    orderKey: React.PropTypes.string,
    orderDirection: React.PropTypes.oneOf(["asc", "desc"]),
    include: React.PropTypes.oneOfType([
        React.PropTypes.string, React.PropTypes.array
    ]),
    exclude: React.PropTypes.oneOfType([
        React.PropTypes.string, React.PropTypes.array
    ]),
    collapsable: React.PropTypes.bool,
    showCount: React.PropTypes.bool,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: FilterCheckboxItemList,
    containerComponent: Panel,
    // component: RefinementListFilterDisplay,
    // itemComponent: FilterCheckboxItemComponent,
    size: 50,
    collapsable: false,
    showCount: true
  }

  constructor(props){
    super(props)

    this.toggleViewMoreOption = this.toggleViewMoreOption.bind(this)
  }

  defineAccessor() {
    const {
      field, id, operator, title, include, exclude,
      size, translations, orderKey, orderDirection
    } = this.props
    return new FacetAccessor(field, {
      id, operator, title, size, include, exclude,
      translations, orderKey, orderDirection
    })
  }

  defineBEMBlocks() {
    var blockName = this.props.mod || "sk-refinement-list"
    return {
      container: blockName,
      option: `${blockName}-option`
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.operator != this.props.operator) {
      this.accessor.options.operator = this.props.operator
      this.searchkit.performSearch()
    }
  }

  toggleFilter(key) {
    this.accessor.state = this.accessor.state.toggle(key)
    this.searchkit.performSearch()
  }

  setFilters(keys) {
    this.accessor.state = this.accessor.state.setValue(keys)
    this.searchkit.performSearch()
  }

  toggleViewMoreOption(option: ISizeOption) {
    this.accessor.setViewMoreOption(option);
    this.searchkit.performSearch()
  }

  hasOptions(): boolean {
      return this.accessor.getBuckets().length != 0
  }

  getSelectedItems(){
    return map(this.accessor.state.getValue(), key => ({key}))
  }

  getItems(){
    return this.accessor.getBuckets()
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
          items: this.getItems(),
          selectedItems: this.getSelectedItems(),
          toggleItem: this.toggleFilter.bind(this),
          setItems: this.setFilters.bind(this),
          showCount
      }),
      this.renderShowMore()
    ]);
  }

  renderShowMore() {
    const option = this.accessor.getMoreSizeOption()

    if (!option) {
        return null;
    }

    return (
      <FastClick handler={() => this.toggleViewMoreOption(option) }>
        <div data-qa="show-more" className={this.bemBlocks.container("view-more-action") }>
          {this.translate(option.label) }
        </div>
      </FastClick>
    )
  }
}
