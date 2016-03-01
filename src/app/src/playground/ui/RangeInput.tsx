import * as React from "react";

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const clamp = require("lodash/clamp")

export class Input extends React.Component<any, any> {

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
      value: props.value
    }
  }

  static defaultProps = {
    value: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
  }

  isValid(value) {
    value = '' + value // ensure string
    // Weird number check, please do something else
    return ('' + parseInt(value, 10) == value)
  }

  onChange(e) {
    const { field, onChange } = this.props

    const value = e.target.value
    this.setState({ value })
    if (this.isValid(value) && onChange) {
      onChange(value, field)
    }
  }

  render() {
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


export class RangeInput extends React.Component<any, {}> {

  static defaultProps = {
    mod: "sk-range-input"
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(value, key) {
    const { min, max, minValue, maxValue, onFinished } = this.props
    const values = defaults({
      [key]: clamp(value, min, max)
    }, {
      min: minValue, max: maxValue
    })
    onFinished([values.min, values.max])
  }

  render() {
    const { mod, minValue, maxValue } = this.props

    return (
      <form className={mod} onSubmit={() => { } }>
        <Input value={minValue} field="min" onChange={this.handleInputChange} />
        <Input value={maxValue} field="max" onChange={this.handleInputChange} />
      </form>
    )
  }

}
