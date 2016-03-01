import * as React from 'react'

import { RangeHistogram, RangeSlider } from './'

export class RangeSliderHistogram extends React.Component<any, {}> {
  render(){
    return (
      <div>
        <RangeHistogram {...this.props} />
        <RangeSlider {...this.props} />
      </div>
    )
  }
}
