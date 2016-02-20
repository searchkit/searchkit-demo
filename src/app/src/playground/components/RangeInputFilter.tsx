import * as React from "react";

import {
  SearchkitManager,
  SearchkitComponent,
  SearchkitComponentProps,
  FastClick,
  RangeAccessor,
  RangeFilter
} from "searchkit";


const defaults = require("lodash/defaults")


// class Input extends React.Component {

//   constructor(props){
//     super(props)
//     this.onChange = this.onChange.bind(this)

//     state = {
//       value: props.value
//     }
//   }

//   isValidvalue(value){
//     value = '' + value // ensure string
//     if (parseInt(value, 10) ==
//     return true
//   }

//   onChange(e){

//   }

//   render(){
//     const inputProps = defaults({
//       value: this.state.value,
//       onChange: this.onChange
//     }, this.props)

//     return React.createElement('input', inputProps)
//   }
// }

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
    this.state = {
      min: "" + props.min,
      max: "" + props.max
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sliderUpdate = this.sliderUpdate.bind(this);
  }

  sliderUpdate(newValues){
    if ((newValues[0] == this.props.min) && (newValues[1] == this.props.max)){
      this.accessor.state = this.accessor.state.clear()
    } else {
      this.accessor.state = this.accessor.state.setValue({min:newValues[0], max:newValues[1]})
    }
    this.setState({
      min: "" + newValues[0],
      max: "" + newValues[1]
    });
  }

  handleSubmit(e){
    e.preventDefault()
    this.sliderUpdateAndSearch([
      parseInt(this.state.min, 10),
      parseInt(this.state.max, 10)
    ])
  }

  handleInputChange(type, e){
    this.setState({[type]: e.target.value})
  }

  render(){

    return (
      <div>
        {super.render()}
        <form  onSubmit={this.handleSubmit}>
          <input style={{display: "inline-block", maxWidth: 70, margin: 4}} value={this.state.min} onChange={e => this.handleInputChange("min", e)} />
          <input style={{display: "inline-block", maxWidth: 70, margin: 4}} value={this.state.max} onChange={e => this.handleInputChange("max", e)}  />
          <input type="submit"  style={{display: "inline-block", maxWidth: 70, margin: 4}} />
        </form>
      </div>
    )
  }

}
