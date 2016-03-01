import * as React from 'react'

import { RangeHistogram, RangeSlider, RangeInput } from './'

export class RangeComponent extends React.Component<any, {}> {
    render() {
        const { showHistogram, showSlider, showInput } = this.props
      return (
        <div>
          {showHistogram ? <RangeHistogram {...this.props} /> : undefined}
          {showSlider ? <RangeSlider {...this.props} /> : undefined}
          {showInput ? <RangeInput {...this.props} /> : undefined}
        </div>
      )
    }
}

export function RangeBuilder(components) {
  return (props) => <RangeComponent {...props} {...components} />
}

export const RangeSliderHistogram = RangeBuilder({showHistogram: true, showSlider: true})
export const RangeSliderHistogramInput = RangeBuilder({showHistogram: true, showSlider: true, showInput: true})
export const RangeSliderInput = RangeBuilder({showSlider: true, showInput: true})
export const RangeHistogramInput = RangeBuilder({showHistogram: true, showInput: true})
