/**
 * Hologram Scene class for Holographic Projection of an image into a conatiner element
 * 
 * A Pen created on CodePen.io.
 * Original URL: [https://codepen.io/peterhry/pen/egzjGR](https://codepen.io/peterhry/pen/egzjGR).
 * 
 * Modified, commented and adapted by Marty Steer, MythAxis Magazine, 2021
 **/
import { createCamera } from './camera.js';
import { createCube } from './cube.js';
import { createPlane } from './plane.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';

import { createControls } from './controls.js';
import { createRenderer } from './renderer.js';
import { Resizer } from './Resizer.js';
import { Loop } from './Loop.js';

import { MathUtils,
         Mesh,
         MeshBasicMaterial,
         MeshStandardMaterial,
         PlaneGeometry,
         TextureLoader,
} from './three/build/three.module.js';

// ----------------------------------------------------------
// Module scoped variables
// NB: can only create one instance of Hologram()
// ----------------------------------------------------------
let camera;
let renderer;
let scene;
let loop;


// ----------------------------------------------------------
// Hologram.js
// ----------------------------------------------------------
class Hologram {

  // Pass a container element to use for the hologram.
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const controls = createControls(camera, renderer.domElement); // orbital controller (TODO: dat.gui)

    // Get all the lights and add to scene
    const lights = createLights();
    Object.values(lights).forEach(l => scene.add(l));

    // Add meshes to scene
    const cube = createCube();
    // scene.add(cube);

    // Add image plane (using data-src value from container)
    const plane = createPlane(container.dataset.src);    
    scene.add(plane);


    // Keep track of the objects to animate
    loop.updatables.push(controls, cube, plane);

    // Make sure the canvas resizes when the window does
    const resizer = new Resizer(container, camera, renderer);
  }


  // Manually render the scene
  render() {
    renderer.render(scene, camera);
  }


  // Start the rendering animation
  start() {
    loop.start();
  }


  // Stop the rendering animation
  stop() {
    loop.stop();
  }

} // end class HoloScene


export { Hologram };