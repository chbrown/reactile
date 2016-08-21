export type Point2D = [number, number];

/** The number of radians in a degree (~.0174533) */
const RAD_PER_DEG = Math.PI / 180.0;
/** The number of degrees in a radian (~57.29578) */
const DEG_PER_RAD = 180.0 / Math.PI;

/**
@param {Number} east Degrees easting (longitude)
@param {Number} north Degrees northing (latitude)
@param {Number} zoom Zoom level (integer between 0 and 19)
@returns {Point2D} Tuple of floating point numbers, which should be truncated
(floored) to get the tile indices of the tile that contains the desired location.

Based on code from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
*/
export function coordinatesToTile([east, north]: Point2D, zoom: number): Point2D {
  const zoom_factor = Math.pow(2, zoom);
  const north_rad = north * RAD_PER_DEG;
  const x = zoom_factor * (east + 180.0) / 360.0;
  const y = (1 - Math.log(Math.tan(north_rad) + 1.0 / Math.cos(north_rad)) / Math.PI) / 2.0 * zoom_factor;
  return [x, y];
}

/**
@param {Number} x Tile x-index (longitude)
@param {Number} y Tile y-index (latitude)
@param {Number} zoom Zoom level (integer between 0 and 19)
@returns {Point2D} Tuple of [easting, northing] coordinates.

The given x and y don't have to be integers, but if they are, the returned
location will be the north-west (top-left) corner of the specified tile.

Based on code from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
*/
export function tileToCoordinates([x, y]: Point2D, zoom: number): Point2D {
  const zoom_factor = Math.pow(2, zoom);
  const east = (360.0 * x / zoom_factor) - 180.0;
  const north = Math.atan(Math.sinh(Math.PI - 2.0 * Math.PI * y / zoom_factor)) * DEG_PER_RAD;
  return [east, north];
}
