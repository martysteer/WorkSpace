import { MathUtils,
         Mesh,
         MeshBasicMaterial,
         MeshStandardMaterial,
         PlaneGeometry,
         TextureLoader,
} from './three/build/three.module.js';


function createMaterial(srcFile) {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(srcFile);

  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.7,
  });

  return material;
}


function createPlane(srcFile) {
  const material = createMaterial(srcFile);
  const geometry = new PlaneGeometry(9, 2.1); // TODO: dynamic size
  
  
  // create a Mesh containing the geometry and material
  const plane = new Mesh(geometry, material);

  // The plane swings back and forth slowly
  plane.tick = (delta, elapsed) => {
    plane.rotation.y = Math.sin(elapsed / 2) / 15;
    plane.rotation.x = Math.cos(elapsed / 2) / 50;
  }

  return plane;
}

export { createPlane };