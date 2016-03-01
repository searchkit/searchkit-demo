import * as React from "react";
const Rcslider = require("rc-slider")

require('./RangeSlider.scss')

export class RangeSlider extends React.Component<any, {}> {
  render(){
    const { min, max, minValue, maxValue, onChange, onFinished } = this.props

    return (
      <div className="sk-range-slider">
        <Rcslider
          min={min}
          max={max}
          marks={{[min]:min, [max]:max}}
          range={true}
          value={[minValue, maxValue]}
          onChange={onChange}
          onAfterChange={onFinished}/>
      </div>
    )
  }
}
