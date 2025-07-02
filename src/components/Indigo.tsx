"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { YEARS } from "@/constants";

import { ThreeEvent, useLoader } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useThree } from "@react-three/fiber";
import { useGlobeStore } from "@/store/useGlobeStore";

const LATS = YEARS.map((_, i) => 30 * Math.sin(i));
const LONS = YEARS.map((_, i) => (360 / YEARS.length) * i);
type LabeledGlobeProps = {
  radius?: number;
};
export function LabeledGlobe({ radius = 4 }: LabeledGlobeProps) {
  const router = useRouter();
  const focusYear = useGlobeStore((s) => s.focusYear);

  const imageUrls = YEARS.map((year) => `/${year}.jpeg`);
  const textures = useLoader(THREE.TextureLoader, imageUrls);
  const { camera, gl, scene } = useThree();

  const labelTexture = useMemo(() => {
    const W = 2048,
      H = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    ctx.fillRect(0, 0, W, H);

    const imgSize = 178;
    const textFont = "bold 64px roboto, sans-serif";
    const textMargin = 16;

    YEARS.forEach((year, i) => {
      const lat = LATS[i],
        lon = LONS[i];

      const wrapped = (((lon + 180) % 360) + 360) % 360;
      const x = (wrapped / 360) * W;
      const y = ((90 - lat) / 180) * H;

      const tex = textures[i];
      if (tex.image) {
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(
          tex.image,
          -imgSize / 2,
          -imgSize - textMargin - 15,
          imgSize,
          imgSize
        );
        ctx.restore();
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.font = textFont;
      const text = String(year);
      const m = ctx.measureText(text);
      const tw = m.width + 6,
        th = 58;
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(-tw / 2 - textMargin, -th / 2, tw + 2 * textMargin, th + 2);

      ctx.fillStyle = "gold";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = textFont;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.letterSpacing = "4px";
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 4;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [textures]);

  const labelBump = useMemo(() => {
    const W = 2048,
      H = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // ctx.fillStyle = "#6e4c85";
    ctx.fillRect(0, 0, W, H);

    YEARS.forEach((_, i) => {
      const lat = LATS[i],
        lon = LONS[i];
      const wrapped = (((lon + 180) % 360) + 360) % 360;
      const x = (wrapped / 360) * W;
      const y = ((90 - lat) / 180) * H;
      ctx.fillStyle = "rgba(255,255,255,0.01)";
      ctx.fillRect(x - 12, y - 12, 24, 24);
    });

    const sparkCount = 20000;
    for (let i = 0; i < sparkCount; i++) {
      const sx = Math.random() * W;
      const sy = Math.random() * H;
      const r = 1 + Math.random() * 2;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      grad.addColorStop(0, "rgba(255,255,255,0.6)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.2)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    tex.needsUpdate = true;
    return tex;
  }, [LATS, LONS]);

  const yearVectors = useMemo(() => {
    return YEARS.map((year, i) => {
      const lat = LATS[i],
        lon = LONS[i];
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);
      const v = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize();
      return { year, vec: v };
    });
  }, []);

  function onClickGlobe(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const clickVec = e.point.clone().normalize();

    let best = yearVectors[0];
    let bestAng = Infinity;
    yearVectors.forEach((yv) => {
      const ang = clickVec.angleTo(yv.vec);
      if (ang < bestAng) {
        bestAng = ang;
        best = yv;
      }
    });

    focusYear(best.year, best.vec, radius, () => {
      router.push(`/year/${best.year}`); 
    });
  }

  return (
    <mesh onClick={onClickGlobe} position={[0, 0, 0]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshPhysicalMaterial
        map={labelTexture}
        bumpMap={labelBump}
        bumpScale={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.2}
        sheen={1.0}
        roughness={0.5}
        metalness={0.2}
        side={THREE.DoubleSide}
        toneMapped={false}
        transparent={true}
        opacity={1}
        depthWrite={false}
        depthTest={true}
        polygonOffset
        polygonOffsetFactor={-0.1}
      />
    </mesh>
  );
}
