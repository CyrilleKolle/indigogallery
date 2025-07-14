"use client";

import * as THREE from "three";
import React, { useMemo, useTransition, useRef, useCallback } from "react";
import { useLoader, useFrame, ThreeEvent } from "@react-three/fiber";
import { Plane, Text } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { colors, YEARS } from "@/constants";
import { useGlobeStore } from "@/store/useGlobeStore";
import { useAuth } from "./AuthProvider";
import { getTangentQuaternion } from "@/helpers";

const BELT_LATS = [-30, 0, 30];
const SPRITE_SIZE = 0.8;
const ROTATION_SPEED = 0.0009;

export function LabeledGlobe({ radius = 4 }: { radius?: number }) {
  const router = useRouter();
  const globeRef = useRef<THREE.Group>(null!);
  const globeGroup = useRef<THREE.Group>(null!);

  const focusYear = useGlobeStore((s) => s.focusYear);
  const [isPending, startTransition] = useTransition();
  const { user, ready } = useAuth();

  const globeLocked = !ready || !user;
  const bumpMap = useLoader(THREE.TextureLoader, "/rainbow.jpg");
  const normalMap = useLoader(THREE.TextureLoader, "/rainbow.jpg");
  const emissiveMap = useLoader(THREE.TextureLoader, "/rainbow.jpg");

  const textures = useLoader(
    THREE.TextureLoader,
    YEARS.map((y) => `/${y}.jpeg`)
  );

  const handleClick = useCallback(
    (year: number, dir: THREE.Vector3) => {
      if (isPending || globeLocked) return;
      focusYear(year, dir, radius, () =>
        startTransition(() => router.push(`/year/${year}`))
      );
    },
    [focusYear, globeLocked, isPending, radius, router]
  );

  const mesh = useMemo<THREE.Mesh>(() => {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: bumpMap,
      bumpMap: bumpMap,
      normalMap: normalMap,
      emissiveMap: emissiveMap,
      emissive: new THREE.Color(colors.brightPink),
      emissiveIntensity: 0.01,
      roughness: 0.7,
      metalness: 0.9,
      toneMapped: true,
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = sphere.receiveShadow = false;
    sphere.name = "Globe";
    sphere.renderOrder = 0;
    return sphere;
  }, [radius, bumpMap, normalMap, emissiveMap]);

  useFrame((_state, delta) => {
    globeGroup.current.rotation.y += -ROTATION_SPEED * delta * 100;
  });

  mesh.geometry.computeVertexNormals();
  mesh.geometry.normalizeNormals();
  mesh.geometry.computeTangents();
  mesh.geometry.computeBoundingSphere();
  mesh.geometry.boundingSphere!.radius = radius;
  mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv.clone();
  mesh.geometry.attributes.uv2.needsUpdate = true;

  const billboards = useMemo(() => {
    return YEARS.map((year, idx) => {
      const latDeg =
        BELT_LATS[Math.floor(idx / (YEARS.length / BELT_LATS.length))];
      const lonDeg =
        (360 / (YEARS.length / BELT_LATS.length)) *
          (idx % (YEARS.length / BELT_LATS.length)) -
        180;
      const lat = THREE.MathUtils.degToRad(latDeg);
      const lon = THREE.MathUtils.degToRad(lonDeg);
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);
      const position = new THREE.Vector3(x, y, z);
      const dir = position.clone().normalize();
      const inward = -0.00001 * radius;
      const quat = getTangentQuaternion(dir);
      const texture = textures[idx];

      return (
        <group
          key={year}
          position={position.addScaledVector(dir, inward)}
          quaternion={quat}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            handleClick(year, dir);
          }}
          ref={globeRef}
        >
          <Plane args={[SPRITE_SIZE * 2, SPRITE_SIZE, 3]}>
            <meshBasicMaterial map={texture} toneMapped={false} />
          </Plane>

          <Text
            position={[0, 0.6, 0.0001]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="black"
            outlineOpacity={0.8}
            font="/bytebounce/ByteBounce.ttf"
            /* @ts-expect-error: Troika Text supports curveRadius even though it is not in the type definitions */
            curveRadius={radius * -1.11}
          >
            {year}
          </Text>
        </group>
      );
    });
  }, [textures, radius, handleClick]);

  return (
    <group ref={globeRef} onPointerMissed={() => router.push("/")}>
      <group ref={globeGroup}>
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.01}
          castShadow
          shadow-mapSize={{ width: 1024, height: 1024 }}
          shadow-camera-near={0.1}
          shadow-camera-far={radius * 2}
          shadow-camera-fov={50}
        />
        <ambientLight intensity={0.01} />
        <hemisphereLight groundColor={colors.gray[100]} intensity={0.1} />
        {billboards}
        <pointLight
          position={[0, 0, 0]}
          color={colors.gray[50]}
          intensity={0.1}
          decay={0.2}
          distance={radius * 2}
          castShadow
          shadow-mapSize={{ width: 1024, height: 1024 }}
          shadow-camera-near={0.1}
          shadow-camera-far={radius * 2}
          shadow-camera-fov={50}
        />
      </group>
      <primitive object={mesh} />
    </group>
  );
}
