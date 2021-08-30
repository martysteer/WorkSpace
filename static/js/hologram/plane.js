import { Mesh,
         MeshBasicMaterial,
         PlaneGeometry,
         TextureLoader,
         DoubleSide
} from './three/build/three.module.js';


// Solution to dynamically rezise the plane according to
// the image aspect ratio and the asyn loading of images
// was very difficult! Solution found on stack overflow!
// @see https://stackoverflow.com/a/51722953
function createPlane(imgSrc) {
    var planeGeom = new PlaneGeometry(5, 5);
    var plane;

    var tex = new TextureLoader().load(imgSrc, (tex) => {
      tex.needsUpdate = true;
      plane.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
    });

    var material = new MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.7,
      side: DoubleSide,
    });
    plane = new Mesh(planeGeom, material);

    // The plane swings back and forth slowly
    plane.tick = (delta, elapsed) => {
      plane.rotation.y = Math.sin(elapsed / 2) / 15;
      plane.rotation.x = Math.cos(elapsed / 2) / 50;
    }

    return plane;
}

export { createPlane };