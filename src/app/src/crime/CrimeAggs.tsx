import * as React from "react"
const {GoogleMapLoader, GoogleMap, Marker} = require("react-google-maps");

import {
  Accessor,
  AggsContainer,
  SearchkitComponent,
  FilterBucket,
  Utils,
  GeohashBucket,
  GeoBoundsMetric,
  SignificantTermsBucket,
  FilteredQuery
} from "searchkit"



export class CrimeAccessor extends Accessor{
  area:any
  precision:number = 6
  setArea(area){
    this.area = area
  }
  setPrecision(precision){
    this.precision = precision
  }

  setResults(results){
    super.setResults(results)
     let significant = _.map(
      this.getAggregations(["geo", "significant", "buckets"], [])
    , "key")
    console.log("significant", significant)
  }

  buildSharedQuery(query){
    if(this.area){
      return query.addQuery(FilteredQuery({
        filter:{
          geo_bounding_box:{
            location:this.area
          }
        }
      }))
    }
    return query
  }

  buildOwnQuery(query){
    return query.setAggs(FilterBucket(
      "geo", query.getFilters(),
      GeohashBucket(
        "areas", "location",
        {precision:this.precision, size:100},
        GeoBoundsMetric("cell", "location")
      ),
      SignificantTermsBucket("significant","crime_type.raw", {size:2}),
      GeoBoundsMetric("bounds", "location")
    ))
  }
}

declare var google:any


export class GeoMap extends SearchkitComponent<any, any> {
  map:any
  accessor:CrimeAccessor
  constructor(){
    super()
  }
  defineAccessor(){
    return new CrimeAccessor()
  }

  geoPointToLatLng(point){
    return new google.maps.LatLng(point.lat, point.lon)
  }
  setBounds(){
    let bounds = new google.maps.LatLngBounds()
    let data = (this.accessor.getAggregations(["geo", "bounds", "bounds"], null))
    if(data){
      bounds.extend(this.geoPointToLatLng(data.top_left))
      bounds.extend(this.geoPointToLatLng(data.bottom_right))
    }
    this.map.fitBounds(bounds)
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
    return markers
  }

  onBoundsChanged(event){
    console.log("onBoundsChanged")
    let bounds = this.map.getBounds()
    let ne = bounds.getNorthEast()
    let sw = bounds.getSouthWest()
    let area = {
      top_right:{ lat:ne.lat(), lon:ne.lng() },
      bottom_left:{ lat:sw.lat(), lon:sw.lng() }
    }
    this.accessor.setPrecision(_.min([10, this.map.getZoom()-1]))
    this.accessor.setArea(area)
    this.searchkit.search()
  }
  onCenterChanged(event){
    console.log("onCenterChanged", event)
  }
  onZoomChanged(event){
    console.log("onZoomChanged", event)
  }

  render(){
    setTimeout(()=> {
      if(!this.accessor.area){
        this.setBounds()
      }
    })
    let timesCalled = 0
    let fn = _.debounce(this.onBoundsChanged.bind(this), 500)
    let onBoundsChanged = ()=> {
      if(timesCalled > 0){
        fn()
      }else {
        timesCalled++
      }
    }

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
             onBoundsChanged={onBoundsChanged}
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
