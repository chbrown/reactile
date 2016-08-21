import * as React from 'react';

import {Point2D, coordinatesToTile, tileToCoordinates} from './math';

export class TileServer {
  constructor() { }
  /**
  presumably, zoom is always an integer
  */
  url([x, y]: Point2D, zoom: number) {
    return `/tiles/${zoom}/${x | 0}/${y | 0}.png`;
  }
}

const tileServer = new TileServer();
const tileSize: Point2D = [256, 256];
const [tileWidth, tileHeight] = tileSize;

export interface MapProps {
  coordinates: Point2D; // [east, north]
  zoom: number;
}
export class Map extends React.Component<MapProps, {}> {
  constructor(props: MapProps) {
    super(props);
    this.state = {};
  }
  render() {
    const {coordinates, zoom} = this.props;
    const [x, y] = coordinatesToTile(coordinates, zoom);
    console.log(`${coordinates[0]}°E ${coordinates[1]}°N => ${x}/${y}`);
    // tileOffset reflects the difference between the north-west (top left) corner of the tile
    // and what we requested ({coordinates}). It's always two floating point numbers in the range: [0, 1)
    const tileOffset: Point2D = [x - (x | 0), y - (y | 0)];
    console.log(`  tileOffset = ${tileOffset}`);
    // offset reflects that difference, in pixels, between the given coordinates and the center of the map
    const offset: Point2D = [(tileWidth / 2) - (tileOffset[0] * 256), (tileHeight / 2) - (tileOffset[1] * 256)];
    console.log(`  offset `, tileOffset.map(n => n * 256));

    const [tileEast, tileNorth] = tileToCoordinates([x | 0, y | 0], zoom);
    console.log(`NW corner of given tile: ${tileEast}°E ${tileNorth}°N`);

    const tileUrl = tileServer.url([x, y], zoom);
    return (
      <div style={{}}>
        <img src={tileUrl} style={{transform: `translate(${offset[0]}px, ${offset[1]}px)`}} />
      </div>
    );
  }
}
