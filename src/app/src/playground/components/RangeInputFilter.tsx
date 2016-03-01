import * as React from "react";

import {
  SearchkitManager,
  SearchkitComponent,
  SearchkitComponentProps,
  FastClick,
  RangeAccessor
} from "searchkit";

import { RangeFilter } from './RangeFilter'

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const clamp = require("lodash/clamp")


class Input extends React.Component<any, any> {

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
      value: props.value
    }
  }

  static defaultProps = {
    value: ''
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.props.value){
      this.setState({value: nextProps.value})
    }
  }

  isValid(value){
    value = '' + value // ensure string
    // Weird number check, please do something else
    return ('' + parseInt(value, 10) == value)
  }

  onChange(e){
    const { field, onChange } = this.props

    const value = e.target.value
    this.setState( { value })
    if (this.isValid(value) && onChange){
      onChange(value, field)
    }
  }

  render(){
    const inputProps = defaults({
      value: this.state.value,
      onChange: this.onChange,
      style: {
        margin: 4,
        display: 'inline-block',
        width: '45%',
        placeholder: this.props.field
      }
    }, this.props)

    return React.createElement('input', inputProps)
  }
}

export interface RangeFilterProps extends SearchkitComponentProps {
  field:string
  min:number
  max:number
  id:string
  title:string
  interval?:number
  showHistogram?:boolean
}

export class RangeInputFilter extends RangeFilter {

  constructor(props){
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(value, key){
    const { min, max } = this.props
    const values = defaults({
      [key]: clamp(value, min, max)
    }, this.accessor.state.getValue())
    this.accessor.state = this.accessor.state.setValue(values)
    this.searchkit.performSearch()
  }

  getValue(key, defaultValue){
    return get(this.accessor.state.getValue(), key, defaultValue)
  }

  render(){

    return (
      <div>
        {super.render()}
        <form  onSubmit={() => {}}>
          <Input value={this.getValue('min', this.props.min)} field="min" onChange={this.handleInputChange} />
          <Input value={this.getValue('max', this.props.max)} field="max" onChange={this.handleInputChange} />
        </form>
      </div>
    )
  }

}
