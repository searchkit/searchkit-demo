import * as React from "react";

const Select = require('react-select');

require('./MultiSelect.scss')

const map = require('lodash/map');

export class MultiSelect extends React.Component<any, {}>{

  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selectedOptions = []) {
    const { setItems, selectedItems=[] } = this.props
    setItems(map(selectedOptions, 'value'))
  }

  render() {
    const { placeholder, clearable = true, items, selectedItems = [], disabled, showCount } = this.props

    const keys = map(selectedItems, "key")

    const options = map(items, (option) => {
      let label = option.title || option.label || option.key
      if (showCount) label += ` (${option.doc_count}) `
      return { value: option.key, label}
    })

    return (
      <Select multi disabled={disabled} value={keys}
        placeholder={placeholder}
        options={options}
        valueRenderer={(v) => v.value}
        clearable={clearable}
        onChange={this.handleChange} />
    )
  }
}
