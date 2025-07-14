import * as THREE from "three";

export function getTangentQuaternion(dir: THREE.Vector3) {
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
  return quat;
}
