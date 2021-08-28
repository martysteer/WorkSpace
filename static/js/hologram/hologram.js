/**
 * Hologram Scene class for Holographic Projection of an image into a conatiner element
 * 
 * A Pen created on CodePen.io.
 * Original URL: [https://codepen.io/peterhry/pen/egzjGR](https://codepen.io/peterhry/pen/egzjGR).
 * 
 * Modified, commented and adapted by Marty Steer, MythAxis Magazine, 2021
 **/
import * as THREE from 'https://unpkg.com/three@0.83.0/build/three.module.js';

import { createCamera } from './camera.js';
import { createCube } from './cube.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';

import { createRenderer } from './renderer.js';
import { Resizer } from './Resizer.js';


// ----------------------------------------------------------
// Module scoped variables
// NB: can only create one instance of Hologram()
// ----------------------------------------------------------
let camera;
let renderer;
let scene;


// ----------------------------------------------------------
// Hologram.js
// ----------------------------------------------------------

class Hologram {
  // Pass a container element to use for the hologram.
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);

    const cube = createCube();
    const light = createLights();

    scene.add(cube, light);

    const resizer = new Resizer(container, camera, renderer);
    resizer.onResize = () => { // implement resizer hook
      this.render();
    };
  }

  // Render the scene
  render() {
    // draw a single frame
    renderer.render(scene, camera);
    console.log('hologram render()')
  }



} // end class HoloScene

export { Hologram };