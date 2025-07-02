import { Html } from "@react-three/drei";
import { useDeferredProgress } from "@/store/useDeferredProgress";

export function Loader() {
  const { active, progress, item, errors, loaded, total } =
    useDeferredProgress();

  if (!active) return null;
  if (errors.length) {
    return (
      <Html center className="text-red-500 text-lg">
        Error loading: {errors.join(", ")}
      </Html>
    );
  }
  if (loaded === total) {
    return (
      <Html center className="text-green-500 text-lg">
        All assets loaded!
      </Html>
    );
  }
  if (item) {
    return (
      <Html center className="text-yellow-500 text-lg">
        Loading {item}…
      </Html>
    );
  }
  return (
    <Html center className="text-white text-lg">
      Loading {progress.toFixed(0)}%
    </Html>
  );
}
