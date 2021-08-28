import { Color, Scene } from './three/build/three.module.js';

function createScene() {
  const scene = new Scene();

  // scene.background = new Color('skyblue');
  // scene.background = new Color('red');

  return scene;
}

export { createScene };