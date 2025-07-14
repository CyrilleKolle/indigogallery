import { Vector3 } from "three";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import gsap from "gsap";
import type { PerspectiveCamera } from "three";
import type { OrbitControls as ThreeOrbitControls } from "three-stdlib";

type Pose = { pos: Vector3; target: Vector3 };

interface GlobeState {
  mode: "idle" | "focusing" | "focused" | "resetting";
  camera?: PerspectiveCamera;
  controls?: ThreeOrbitControls;
  savedPose?: Pose;
  focusedYear?: number;

  /** Register live camera & controls */
  register: (cam: PerspectiveCamera, ctrls: ThreeOrbitControls) => void;

  /** This helps in zooming year */
  focusYear: (
    year: number,
    vec: Vector3,
    radius: number,

    done?: () => void
  ) => void;

  /** Return to the saved pose & hide overlay */
  reset: (done?: () => void) => void;
}

export const useGlobeStore = create<GlobeState>()(
  devtools((set, get) => ({
    mode: "idle",

    register: (cam, ctrls) => set({ camera: cam, controls: ctrls }),

    focusYear: (year, vec, radius, done) => {
      const { camera, controls, mode } = get();
      if (!camera || !controls || mode !== "idle") return;

      set({
        mode: "focusing",
        savedPose: {
          pos: camera.position.clone(),
          target: controls.target.clone(),
        },
        focusedYear: year,
      });

      const camEnd = vec.clone().multiplyScalar(radius * 1.01);
      const tgtEnd = vec.clone().multiplyScalar(radius);

      const tl = gsap.timeline({
        onComplete: () => {
          set({ mode: "focused" });
          done?.();
        },
      });

      tl.to(camera.position, {
        x: camEnd.x,
        y: camEnd.y,
        z: camEnd.z,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
      })
        .to(
          controls.target,
          {
            x: tgtEnd.x,
            y: tgtEnd.y,
            z: tgtEnd.z,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => controls.update(),
          },
          0
        )
        .to(
          "#globe-overlay",
          { opacity: 1, duration: 1.2, ease: "power2.inOut" },
          0
        )
        .to(
          camera,
          {
            fov: 130,
            x: camEnd.x * 10,
            y: camEnd.y * 10,
            z: camEnd.z * 10,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => camera.updateProjectionMatrix(),
          },
          0
        );
    },

    reset: (done) => {
      const { camera, controls, savedPose, mode } = get();
      if (!camera || !controls || !savedPose || mode !== "focused") return;

      set({ mode: "resetting" });

      const tl = gsap.timeline({
        onComplete: () => {
          set({ mode: "idle", savedPose: undefined });
          done?.(); // ← call it here
        },
      });

      tl.to("#globe-overlay", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      })
        .to(
          camera.position,
          {
            x: savedPose.pos.x,
            y: savedPose.pos.y,
            z: savedPose.pos.z,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => controls.update(),
          },
          "<"
        )
        .to(
          controls.target,
          {
            x: savedPose.target.x,
            y: savedPose.target.y,
            z: savedPose.target.z,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => controls.update(),
          },
          "<"
        )
        .to(
          camera,
          {
            fov: 50,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => camera.updateProjectionMatrix(),
          },
          "<"
        );
    },
  }))
);
