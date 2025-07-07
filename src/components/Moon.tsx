import { moonSphericalFromSun } from "@/utilities";
import { ReactElement } from "react";
import { CelestialBody } from "./CalestialBody";
import { CelestialBodyProps, MoonProps } from "@/interfaces";

/**
 * The Moon component represents the Moon as a celestial body.
 * It derives its position based on the Sun's spherical coordinates and a given phase.
 * The phase can be adjusted to simulate different lunar phases.
 */
export const Moon: React.FC<MoonProps> = ({
  phase = 180,
  ...rest
}): ReactElement => {
  const [dist, elev, azim] = moonSphericalFromSun(500, 30, 45, phase, 5);

  const merged: CelestialBodyProps = {
    distance: dist,
    elevation: elev,
    azimuth: azim,
    size: 15,
    texture: "/moon.jpg",
    emissive: "/moon.jpg",
    color: "#FCFEDA",
    intensity: 0.2,
    name: "Moon",
    ...rest,
  };
  return <CelestialBody {...merged} />;
};
