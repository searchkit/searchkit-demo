import * as React from "react";
const Rcslider = require("rc-slider")

import {
  SearchkitManager,
  SearchkitComponent,
  SearchkitComponentProps,
  RangeAccessor,
  PureRender,
  ReactComponentType
} from "searchkit"

import { Panel, RangeSlider, RangeSliderHistogram } from '../ui'

const defaults = require("lodash/defaults")
const maxBy = require("lodash/maxBy")
const get = require("lodash/get")

function computeMaxValue(items, field) {
  if (!items || items.length == 0) return 0
  return maxBy(items, field)[field]
}

export interface RangeFilterProps extends SearchkitComponentProps {
  field:string
  min:number
  max:number
  id:string
  title:string
  interval?:number
  showHistogram?:boolean
  containerComponent?: ReactComponentType<any>
  rangeComponent?: ReactComponentType<any>
  collapsable?: boolean
}

export class RangeFilter extends SearchkitComponent<RangeFilterProps, any> {
  accessor:RangeAccessor

  static propTypes = defaults({
    field:React.PropTypes.string.isRequired,
    title:React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    containerComponent: Panel,
    rangeComponent: RangeSliderHistogram,
    showHistogram: true,
    collapsable: false
  }

  constructor(props){
    super(props)
    this.sliderUpdate = this.sliderUpdate.bind(this)
    this.sliderUpdateAndSearch = this.sliderUpdateAndSearch.bind(this)
  }

  defineAccessor() {
    const { id, title, min, max, field, interval } = this.props
    return new RangeAccessor(
      id,
      {id, min, max, title, field, interval}
    )
  }

  sliderUpdate(newValues) {
    if ((newValues[0] == this.props.min) && (newValues[1] == this.props.max)){
      this.accessor.state = this.accessor.state.clear()
    } else {
      this.accessor.state = this.accessor.state.setValue({min:newValues[0], max:newValues[1]})
    }
    this.forceUpdate()
  }

  sliderUpdateAndSearch(newValues){
    this.sliderUpdate(newValues)
    this.searchkit.performSearch()
  }

  getRangeComponent():ReactComponentType<any>{
    const { rangeComponent, showHistogram } = this.props
    if (!showHistogram && (rangeComponent === RangeSliderHistogram)) {
      return RangeSlider
    } else {
      return rangeComponent
    }
  }

  render() {
    const { id, title, containerComponent, collapsable } = this.props

    const maxValue = computeMaxValue(this.accessor.getBuckets(), "doc_count")

    return React.createElement(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: maxValue == 0,
      collapsable
    }, this.renderRangeComponent(this.getRangeComponent()))
  }

  renderRangeComponent(Component: ReactComponentType<any>) {
    const { min, max } = this.props
    const state = this.accessor.state.getValue()
    return React.createElement(Component, {
      min, max,
      minValue: get(state, "min", min),
      maxValue: get(state, "max", max),
      items: this.accessor.getBuckets(),
      onChange: this.sliderUpdate,
      onFinished: this.sliderUpdateAndSearch
    })
  }
}
