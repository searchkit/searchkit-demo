import * as React from "react"
const {GoogleMapLoader, GoogleMap, Marker} = require("react-google-maps");

import {
  Accessor,
  AggsContainer,
  SearchkitComponent,
  FilterBucket,
  Utils

} from "searchkit"

export function GeohashBucket(key, field, options, ...childAggs){
  return AggsContainer(key, {geohash_grid:_.extend({field}, options)}, childAggs)
}
export function GeoBoundsMetric(key, field){
  return AggsContainer(key, {geo_bounds:{field}})
}
export function SignificantTermsBucket(key, field, options, ...childAggs){
  return AggsContainer(key, {significant_terms:_.extend({field}, options)}, childAggs)
}


export class CrimeAccessor extends Accessor{

  buildOwnQuery(query){
    return query.setAggs(FilterBucket(
      "geo", query.getFilters(),
      GeohashBucket(
        "areas", "location",
        {precision:6, size:100},
        GeoBoundsMetric("cell", "location"),
        SignificantTermsBucket("significant","crime_type.raw", {size:2})
      ),
      GeoBoundsMetric("bounds", "location")
    ))
  }
}

declare var google:any


export class GeoMap extends SearchkitComponent<any, any> {
  map:any

  defineAccessor(){
    return new CrimeAccessor()
  }

  geoPointToLatLng(point){
    return new google.maps.LatLng(point.lat, point.lon)
  }
  getBounds(){
    let bounds = new google.maps.LatLngBounds()
    let data = (this.accessor.getAggregations(["geo", "bounds", "bounds"], null))
    if(data){
      bounds.extend(this.geoPointToLatLng(data.top_left))
      bounds.extend(this.geoPointToLatLng(data.bottom_right))
    }
    this.map.fitBounds(bounds)
    return bounds
  }
  centerFromBound(bound){
    return {
      lat:(bound.top_left.lat + bound.bottom_right.lat)/2,
      lng:(bound.top_left.lon + bound.bottom_right.lon)/2
    }
  }
  getMarkers(){
    let areas = this.accessor.getAggregations(["geo", "areas", "buckets"], [])
    let markers =  _.map(areas, (area)=> {
      return {
        position:this.centerFromBound(area["cell"].bounds),
        key:area["key"],
        title:area["doc_count"] +""
      }
    })
    console.log(markers)
    return markers
  }

  render(){
    setTimeout(()=> {
      this.getBounds()
    })
    return (
      <section style={{height: "100%"}}>
       <GoogleMapLoader
         containerElement={
           <div
             {...this.props}
             style={{
               height: "100%",
             }}
           />
         }
         googleMapElement={
           <GoogleMap
             ref={(map) => this.map = map}>
             {
               _.map(this.getMarkers(), (marker)=>{
                 return <Marker {...marker}/>
               })
             }
           </GoogleMap>
         }
       />
      </section>
    )
  }

}
