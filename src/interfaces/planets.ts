export interface RingSpec {
  innerScale: number;
  outerScale: number;
  tiltDeg: number;
  texture: string;
}

export interface PlanetSpec {
  name: string;
  radius: number;
  speed: number;
  size: number;
  color: string;
  texture: string;
  bumpMap: string;
  ring?: RingSpec;
}
