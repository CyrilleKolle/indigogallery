import type { PlanetSpec } from "@/interfaces/planets";

export const PLANETS: PlanetSpec[] = [
  {
    name: "Mercury",
    radius: 60,
    speed: 0.62,
    size: 7.5,
    color: "#b1b1b1",
    texture: "/mercury.png",
    bumpMap: "/mercury_bump.jpg",
  },
  {
    name: "Venus",
    radius: 95,
    speed: 0.35,
    size: 9,
    color: "#e3c16f",
    texture: "/venus.webp",
    bumpMap: "/venus_bump.jpeg",
  },
  {
    name: "Earth",
    radius: 130,
    speed: 0.5,
    size: 10,
    color: "#4a90e2",
    texture: "/earth.jpg",
    bumpMap: "/earth_bump.jpeg",
  },
  {
    name: "Mars",
    radius: 165,
    speed: 0.4,
    size: 8,
    color: "#c1440e",
    texture: "/mars.jpg",
    bumpMap: "/mars_bump.jpg",
  },

  /* ---------- gas giants ---------- */
  {
    name: "Jupiter",
    radius: 220,
    speed: 0.2,
    size: 16,
    color: "#e6c07b",
    texture: "/jupiter.jpg",
    bumpMap: "/jupiter_bump.jpg",
    ring: {
      innerScale: 1.3,
      outerScale: 2.0,
      tiltDeg: 3,
      texture: "/jupiter_ring.jpeg",
    },
  },
  {
    name: "Saturn",
    radius: 290,
    speed: 0.12,
    size: 14,
    color: "#d8c47a",
    texture: "/saturn.jpg",
    bumpMap: "/saturn_bump.jpeg",
    ring: {
      innerScale: 1.35,
      outerScale: 2.7,
      tiltDeg: 27,
      texture: "/saturn_ring.jpg",
    },
  },

  /* ---------- ice giants ---------- */
  {
    name: "Uranus",
    radius: 350,
    speed: 0.17,
    size: 12,
    color: "#94e0e9",
    texture: "/uranus.jpg",
    bumpMap: "/uranus_bump.jpg",
    ring: {
      innerScale: 1.15,
      outerScale: 1.8,
      tiltDeg: 98,
      texture: "/uranus_ring.png",
    },
  },
  {
    name: "Neptune",
    radius: 410,
    speed: 0.15,
    size: 12,
    color: "#4059ad",
    texture: "/neptune.jpg",
    bumpMap: "/neptune_bump.jpeg",
    ring: {
      innerScale: 1.2,
      outerScale: 1.8,
      tiltDeg: 27,
      texture: "/neptune_ring.webp",
    },
  },
];
