import { Vec3 } from "@/interfaces";

export function moonSphericalFromSun(
  sunDist: number,
  sunElevDeg: number,
  sunAzimDeg: number,
  phaseOffsetDeg = 180,
  elevOffsetDeg = 5
): Vec3 {
  const moonDist = sunDist * 0.99;
  const moonAzim = (sunAzimDeg + phaseOffsetDeg) % 360;
  const moonElev = sunElevDeg + elevOffsetDeg;
  return [moonDist, moonElev, moonAzim];
}
