import { BoxBufferGeometry,
         MathUtils,
         Mesh,
         MeshStandardMaterial,
         TextureLoader,
} from './three/build/three.module.js';



function createMaterial() {
  // create texture loader
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load('../images/blaster.png');

  // create a default (white) Basic material
  const material = new MeshStandardMaterial({
    map: texture,
    // color: 'purple'
  });

  return material;
}


function createCube() {
  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = createMaterial();
  
  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);

  cube.rotation.set(-0.5, -0.1, 0.8);

  const radiansPerSecond = MathUtils.degToRad(30); // how far to rotate per second.

  // The cube's tick/update function - rotate the cube
  cube.tick = (delta) => {
    cube.rotation.z += radiansPerSecond * delta;
    cube.rotation.x += radiansPerSecond * delta;
    cube.rotation.y += radiansPerSecond * delta;
  }

  return cube;
}

export { createCube };