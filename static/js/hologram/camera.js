import { PerspectiveCamera } from './three/build/three.module.js';

function createCamera() {
  // const perspective = 175; //400
  // const fov = (180 * (2 * Math.atan(this.img.width / 2 / perspective))) / Math.PI;
  // this.camera = new THREE.PerspectiveCamera(fov, this.img.width / this.img.width, 0.1, 1000);
  // this.camera.position.set(0, 0, perspective);

  const camera = new PerspectiveCamera(
    35, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(0, 0, 10);

  return camera;
}

export { createCamera };