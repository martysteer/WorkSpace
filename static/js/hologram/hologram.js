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

import { 
  createMainComposer,
  createOcclusionComposer
} from './composer.js';

import {
  MathUtils,
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
let mainComposer;
let occlusionComposer;


// ----------------------------------------------------------
// Constants
// ----------------------------------------------------------
const lightColor = 0x0099ff;
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;

// ----------------------------------------------------------
// Hologram.js
// ----------------------------------------------------------
class Hologram {

  // Pass a container element to use for the hologram.
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    // Hook up the render loop object
    loop = new Loop(camera, scene, renderer);

    // Append the canvas to the web page
    container.append(renderer.domElement);

    // Add a basic orbital controller (TODO: dat.gui)
    const controls = createControls(camera, renderer.domElement);

    // Get all the lights and add to scene
    const lights = createLights();
    Object.values(lights).forEach(l => scene.add(l));

    // Add meshes to scene
    const cube = createCube();
    // scene.add(cube);

    // Add image plane (using data-src value from container)
    const plane = createPlane(container.dataset.src);    
    scene.add(plane);

    // Clone the plane to turn it into the occlusion layer.
    const occlusionPlane = createPlane(container.dataset.src);
    occlusionPlane.material.color.setHex(lightColor);
    // occlusionPlane.layers.set(OCCLUSION_LAYER);  // used in multipass rendering
    occlusionPlane.position.z = -0.3;
    // scene.add(occlusionPlane);

    // Keep track of the objects to animate
    loop.updatables.push(controls, cube, plane, occlusionPlane);

    // Make sure the canvas resizes when the window does
    const resizer = new Resizer(container, camera, renderer);

    // Setup postprocessing - we do this down here so the scene and objects 
    // and sizes have initialised
    mainComposer = createMainComposer(container, camera, scene, renderer);
    loop.updatables.push(mainComposer);  // to tick the composer passes
    loop.composers.push(mainComposer); // to give the loop composer layers to render

  }


  // Manually render the scene
  render() {
    loop.render();
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