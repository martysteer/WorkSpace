import { Clock } from './three/build/three.module.js';

const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = []; // list of opdatable objects
  }


  // Start the animation by settings a loop function
  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick(); // progress a single frame
      this.renderer.render(this.scene, this.camera);
    });    
  }


  // Stop the animation by removing the loop function
  stop() {
    this.renderer.setAnimationLoop(null);
  }

  // Update a single animation frame for each updatable object
  tick() {
    const delta = clock.getDelta(); // get miliseconds since last frame

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop }