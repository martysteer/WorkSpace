/**
 * Hologram Scene class for Holographic Projection of an image into a conatiner element
 * 
 * A Pen created on CodePen.io.
 * Original URL: [https://codepen.io/peterhry/pen/egzjGR](https://codepen.io/peterhry/pen/egzjGR).
 * 
 * Modified, commented and adapted by Marty Steer, MythAxis Magazine, 2021
 **/
import * as THREE from './three/build/three.module.js';

import { createCamera } from './camera.js';
import { createCube } from './cube.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';

import { createControls } from './controls.js';
import { createRenderer } from './renderer.js';
import { Resizer } from './Resizer.js';
import { Loop } from './Loop.js';


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

    // const controls = createControls(); // orbital controller (TODO: dat.gui)

    const cube = createCube();
    const light = createLights();

    // Keep track of the objects to animate
    loop.updatables.push(cube);

    scene.add(cube, light);

    const resizer = new Resizer(container, camera, renderer);
  }

  // Render the scene
  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }

} // end class HoloScene

export { Hologram };