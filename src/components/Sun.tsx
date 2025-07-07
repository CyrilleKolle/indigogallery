import { ReactElement } from "react";
import { CelestialBody } from "./CalestialBody";
import { CelestialBodyProps, PartialBodyProps } from "@/interfaces";

/**
 * The Sun component represents a celestial body with a fixed position and properties.
 * It uses the CelestialBody component to render itself with default values.
 */
export const Sun: React.FC<PartialBodyProps> = (props): ReactElement => {
  const merged: CelestialBodyProps = {
    distance: 500,
    elevation: 30,
    azimuth: 45,
    size: 50,
    texture: "/sun.jpeg",
    color: "#fff700",
    intensity: 1.5,
    name: "Sun",
    ...props,
  };
  return <CelestialBody {...merged} />;
};
