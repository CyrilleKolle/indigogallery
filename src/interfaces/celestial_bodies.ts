export interface CelestialBodyProps {
  distance: number;
  elevation: number;
  azimuth: number;
  size: number;
  texture: string;
  emissive?: string;
  color: string;
  intensity: number;
  name: string;
  bumpMap?: string;
  normalMap?: string;
  emissiveIntensity?: number;
  enableLight?: boolean;
}
export type PartialBodyProps = Partial<
  Omit<CelestialBodyProps, "texture" | "emissive" | "name">
>;

export interface MoonProps extends PartialBodyProps {
  phase?: number;
}

export type Vec3 = [number, number, number];
