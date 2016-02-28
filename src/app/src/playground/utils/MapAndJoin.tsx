import * as React from "react";

export function mapAndJoin(array = [], func, joinString = ", ") {
  const result = []
  const length = array.length
  array.forEach((c, idx) => {
    result.push(func(c))
    if (idx < length - 1) result.push(<span key={"joinString-" + idx}>{joinString}</span>)
  })
  return result;
}
