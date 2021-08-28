import { 
  AmbientLight,
  DirectionalLight,
  PointLight,
} from './three/build/three.module.js';

function createLights() {
  const ambientLight = new AmbientLight(0xffffff, 2);

  // Create a directional light
  // move the light right, up, and towards us
  // const mainLight = new DirectionalLight('white', 8);
  // mainLight.position.set(10, 10, 10);

  const pointLight = new PointLight(0xffffff, 1);
  pointLight.position.set(25, 50, 25);

  // The light source where the hologram beam eminates from?
  // this.lightSource = new THREE.Object3D();
  // this.lightSource.position.x = 0;
  // this.lightSource.position.y = -15;
  // this.lightSource.position.z = -15;

  return { ambientLight, pointLight };
}

export { createLights };