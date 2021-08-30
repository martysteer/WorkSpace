import { WebGLRenderer } from './three/build/three.module.js';

function createRenderer() {
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true, // transparent background
  });
  
  renderer.setPixelRatio(window.devicePixelRatio);

  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;
  
  return renderer;
}

export { createRenderer };

