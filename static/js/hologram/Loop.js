import { Clock } from './three/build/three.module.js';

const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;
const clock = new Clock();


// ----------------------------------------------------------
class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = []; // list of updatable objects

    // Custom composers to use for rendering.
    this.mainComposer = null;
    this.occlusionComposer = null;
  }


  // The Loop controls the rendering so it can implement
  // composer and layer renderpass logic.
  render() {
    // this.renderer.render(this.scene, this.camera);

    if (this.occlusionComposer) {
      this.camera.layers.set(OCCLUSION_LAYER);
      this.occlusionComposer.render(); 
    }
    if (this.mainComposer) {
      this.camera.layers.set(DEFAULT_LAYER);
      this.mainComposer.render();      
    }
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