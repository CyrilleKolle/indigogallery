export function sphericalToCartesian(
  radius: number,
  // elevation = 0 is the equator, +90° is “north pole”
  elevationDeg: number,
  // azimuth = 0° points at +X, 90° at +Z, 180° at –X, etc.
  azimuthDeg: number
): [number, number, number] {
  const φ = (elevationDeg * Math.PI) / 180;
  const θ = (azimuthDeg * Math.PI) / 180;
  const y = Math.sin(φ) * radius;
  const cosφ = Math.cos(φ);
  const x = Math.cos(θ) * cosφ * radius;
  const z = Math.sin(θ) * cosφ * radius;
  return [x, y, z];
}
