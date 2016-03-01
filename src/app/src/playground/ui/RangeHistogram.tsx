import * as React from "react";

import { PureRender } from "searchkit"

const Rcslider = require("rc-slider")

const maxBy = require("lodash/maxBy")
const map = require("lodash/map")

function computeMaxValue(items, field) {
  if (!items || items.length == 0) return 0
  return maxBy(items, field)[field]
}

@PureRender
export class RangeHistogram extends React.Component<any, {}> {
  render() {
    const { min, max, minValue, maxValue, items=[] } = this.props

    const maxCount = computeMaxValue(items, "doc_count")
    if (maxCount == 0) return null

    let bars = map(items, ({key, doc_count}) => {
      var className = "bar-chart__bar";
      if (key < minValue || key > maxValue) className += " is-out-of-bounds";
      return (
        <div className={className}
          key={key}
          style={{
          height: `${(doc_count / maxCount) * 100}%`
          }}>
        </div>
      )
    })

    return (
      <div className="bar-chart">
        {bars}
      </div>
    )
  }
}
