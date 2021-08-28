// @src: https://discoverthreejs.com/book/first-steps/world-app/

const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};


class Resizer {
  constructor(container, camera, renderer) {
    setSize(container, camera, renderer);

    // set the size again if a resize occurs
    window.addEventListener('resize', () => {
      setSize(container, camera, renderer);

      // perform any custom actions - eg. rerender parent
      this.onResize();
    });
  }

  onResize() {}  // this function is overwritten by encapsulating class

}

export { Resizer };