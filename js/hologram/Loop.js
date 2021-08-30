/**
 * 
 **/
import { Clock } from './three/build/three.module.js';

const clock = new Clock();

// ----------------------------------------------------------
class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = []; // list of updatable objects
    this.composers = []; // list of composer layers

  }


  // The loop controls the rendering so it can
  // implement composer and layer renderpass logic
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.composers[0].render();
  }

  // Start the animation by settings a loop function
  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick(); // progress a single frame
      this.render();
    });    
  }


  // Stop the animation by removing the loop function
  stop() {
    this.renderer.setAnimationLoop(null);
  }

  // Update a single animation frame for each updatable object
  tick() {
    const delta = clock.getDelta(); // get miliseconds since last frame
    const elapsed = clock.getElapsedTime();

    for (const object of this.updatables) {
      object.tick(delta, elapsed);
    }
  }  // end tick()

}  // end class Loop

export { Loop }