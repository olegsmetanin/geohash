
import * as React from 'react'
import * as L from 'leaflet'
import { Geohash, IGeoBound } from './utils/Geohash'

import {
  // Children,
  // Circle,
  // CircleMarker,
  // FeatureGroup,
  // LayerGroup,
  // LayersControl,
  Map,
  // MapControl,
  // MapControlProps,
  // MapProps,
  Marker,
  // MarkerProps,
  // Path,
  // Pane,
  // Polygon,
  // PolygonProps,
  // Polyline,
  Popup,
  // PopupProps,
  Rectangle,
  TileLayer,
  // SVGOverlay,
  // Tooltip,
  // WMSTileLayer,
  // ZoomControl,
  // LeafletProvider,
  // withLeaflet,
  Viewport,
  // useLeaflet,
} from 'react-leaflet'

const outer: L.LatLngBoundsLiteral = [
  [50.505, -29.09],
  [52.505, 29.09],
];
const inner: L.LatLngBoundsLiteral = [
  [49.505, -2.09],
  [53.505, 2.09],
];

interface IGeoCluster {
  lat: number
  lng: number
  count: number
}

interface IGeoClusterMap {
  [geohash: string]: IGeoCluster[]
}

interface IGeoMarker {
  lat: number
  lng: number
}

interface IGeoMarkerMap {
  [geohash: string]: IGeoMarker[]
}

interface BoundsExampleState {
  bounds: L.LatLngBoundsLiteral
  rects: IGeoBound[],
  clusters: IGeoClusterMap,
  markers: IGeoMarkerMap,
  precision: number,
  current_precision: number,
}

export class BoundsExample extends React.Component<{}, BoundsExampleState> {
  state = {
    bounds: outer,
    rects: [],
    clusters: {} as IGeoClusterMap,
    markers: {} as IGeoMarkerMap,
    precision: 1,
    current_precision: 1
  }

  mapRef = React.createRef<Map>()

  onClickInner = () => {
    this.setState({ bounds: inner });
  }

  onClickOuter = () => {
    this.setState({ bounds: outer });
  }

  onPrecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ precision: +e.target.value })
  }

  onShowRectsOnPrecision = () => {
    this.drawRects(this.state.precision)
  }

  onShowBoundsClick = () => {
    const map = this?.mapRef?.current?.leafletElement
    const mapbounds = map?.getBounds()
    const mapzoom = map?.getZoom()
    console.log(mapbounds, mapzoom)
  }

  drawRects = (_precision?: number) => {
    setTimeout(() => {
      const map = this?.mapRef?.current?.leafletElement
      const mapbounds = map?.getBounds()
      const mapzoom = map?.getZoom()
      console.log(mapbounds, mapzoom)

      if (mapbounds && mapzoom) {
        const precision = _precision || Geohash.zoom2precision(mapzoom)
        const rects = Geohash.encode_bounds(
          mapbounds.getSouth(),
          mapbounds.getWest(),
          mapbounds?.getNorth(),
          mapbounds?.getEast(),
          precision)
          .map((geohash: string) => Geohash.bounds(geohash))
        console.log(rects)
        this.setState({ rects })
      }
    }, 0)
  }

  onViewportChanged = async (viewport: Viewport) => {
    const map = this?.mapRef?.current?.leafletElement
    const mapbounds = map?.getBounds()
    const mapzoom = map?.getZoom()
    console.log(mapbounds, mapzoom)

    if (mapbounds && mapzoom) {
      const precision = Geohash.zoom2precision(mapzoom)
      // if (precision !== this.state.current_precision) {
      //   this.setState({markers: })
      // }
      this.setState({ current_precision: precision })
      const rects = Geohash.encode_bounds(
        mapbounds.getSouth(),
        mapbounds.getWest(),
        mapbounds?.getNorth(),
        mapbounds?.getEast(),
        precision)

      rects.map(geohash => {
        if (!this.state.clusters[geohash]) {
        return fetch(`http://62.171.128.176:3001/api/${geohash}`)
          .then(response => response.json())
          .then(res => {
            // if (geohash.length == this.state.current_precision) {
            console.log('res.clusters', res.clusters)
            console.log('res.markers', res.markers)
            const newState = {
              clusters: { ...this.state.clusters, ...{ [geohash]: res.clusters } },
              markers: { ...this.state.markers, ...{ [geohash]: res.markers } },
            }

            this.setState(newState)
            // }
          })
        }
      })


      // .map((geohash: string) => Geohash.bounds(geohash))

      // console.log(rects)
      // this.setState({ rects })
    }



    // this.setState({ viewport });


  }


  onShowRectsClick = () => {
    this.drawRects()
  }

  render() {
    const { rects, clusters, markers, current_precision } = this.state
    return (
      <div>
        <Map
          ref={this.mapRef}
          onViewportChanged={this.onViewportChanged}
          bounds={this.state.bounds}>
          <TileLayer
            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {rects.map((rect: IGeoBound, idx) => (
            <Rectangle
              key={`rect-${idx}`}
              bounds={[
                [rect.sw.lat, rect.sw.lng],
                [rect.ne.lat, rect.ne.lng],
              ]}
              color={this.state.bounds === outer ? 'red' : 'white'}
              onclick={this.onClickOuter}
            />
          ))}

          {Object.keys(clusters).map((clusterkey: string) => {
            if (clusterkey.length === current_precision) {
              const _clusters: IGeoCluster[] = clusters[clusterkey]
              return _clusters.map((cluster, idx) => (

                <Marker
                key={`cluster-${idx}`}
                position={{ lat: cluster.lat, lng: cluster.lng }}
                icon={
                  new L.DivIcon({
                    className: 'cluster',
                    //html: `${cluster.count}`
                  })
                }
                >
                  <Popup>
                    <span>{JSON.stringify(cluster)}</span>
                  </Popup>
                </Marker>

                // <Marker
                //   key={`marker-${idx}`}
                //   position={{ lat: cluster.lat, lng: cluster.lng }}>
                //   <Popup>
                //     <span>{JSON.stringify(cluster)}</span>
                //   </Popup>
                // </Marker>
              )
              )
            } else {
              return null
            }
          })}

          {Object.keys(markers).map((clusterkey: string) => {
            if (clusterkey.length === current_precision) {
              const _markers: IGeoMarker[] = markers[clusterkey]
              return _markers.map((marker, idx) => (
                <Marker
                  key={`marker-${idx}`}
                  position={{ lat: marker.lat, lng: marker.lng }}>
                  <Popup>
                    <span>{JSON.stringify(marker)}</span>
                  </Popup>
                </Marker>
              )
              )
            } else {
              return null
            }
          })}

        </Map>
        <button onClick={this.onShowRectsClick}>show rects</button>
        <input value={this.state.precision} onChange={this.onPrecisionChange} />
        <button onClick={this.onShowRectsOnPrecision}>show rects on precision</button>
        <button onClick={this.onShowBoundsClick}>show bounds</button>

      </div>
    );
  }
}

