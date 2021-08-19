// ----------------------------------------------------------
// Scene.js
// ----------------------------------------------------------


// ----------------------------------------------------------
// Sets up the scene for the hologram
// Pass a CSS ID of the DOM element to turn into hologram.
// ----------------------------------------------------------
class HoloScene {

  // ----------------------------------------------------------
  // Pass the containerID (default "id='hologram'")
  constructor(containerID = 'hologram') {
    this.container = document.getElementById(containerID);
    this.img = this.container.querySelector('img');
    this.canvas = this.container.querySelector('.scene');

    console.log(this.container, this.canvas);

    // Setup
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // alpha: true,
      antialias: false,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);


    this.initLights();
    this.initCamera();
    this.initScene();
    this.update();
  }

  // ----------------------------------------------------------
  // Initialise scene lighting
  initLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientlight);

    var pointLight = new THREE.PointLight( 0xffffff, 1 );
    pointLight.position.set( 25, 50, 25 );
    this.scene.add( pointLight );
  }


  // ----------------------------------------------------------
  // Initialise scene camera
  initCamera() {
    const perspective = 400
    const fov = (180 * (2 * Math.atan(this.img.width / 2 / perspective))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(fov, this.img.width / this.img.width, 1, 1000);
    this.camera.position.set(0, 0, perspective);
  }
  

  // ----------------------------------------------------------
  // Initialise scene elements/rendered
  initScene() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1)
    // var material = new THREE.MeshBasicMaterial( { color: 0xff0051 })
    var material = new THREE.MeshStandardMaterial( { color: 0xff0051 })
    this.cube = new THREE.Mesh ( geometry, material )
    this.scene.add( this.cube )
    this.renderer.render( this.scene, this.camera )
    this.camera.position.z = 5

  }


  // ----------------------------------------------------------
  // Update scene
  update() {
    requestAnimationFrame(this.update.bind(this));
    this.cube.rotation.x += 0.04;
    this.cube.rotation.y += 0.04;
    this.renderer.render(this.scene, this.camera);
    this.renderer.setSize(this.img.width, this.img.height*4);
    // this.renderer.setSize(this.container.offsetWidth, this.container.offsetWidth);
  }

}






// /* Setup the canvas/camera scene */
// function setupScene() {
//   lightSource = new THREE.Object3D();
//   lightSource.position.x = 0;
//   lightSource.position.y = -15;
//   lightSource.position.z = -15;

//   const itemGeo = new THREE.PlaneGeometry(9, 2.1);
//   const itemMaterial = new THREE.MeshBasicMaterial({
//     transparent: true,
//     opacity: 0.7
//   });

//   // const img = new Image();
//   img = document.getElementById("hologram").firstElementChild;
//   console.log(img.src);

//   img.src = '../images/exoskel.png';
//   // img.crossOrigin = 'Anonymous';

//   img.onload = function() {
//     const itemTexture = new THREE.Texture(
//       getImageTexture(img),
//       null,
//       THREE.ClampToEdgeWrapping,
//       THREE.ClampToEdgeWrapping,
//       null,
//       THREE.LinearFilter);


//     itemTexture.needsUpdate = true;
//     itemMaterial.map = itemTexture;

//     itemMesh = new THREE.Mesh(itemGeo, itemMaterial);
//     scene.add(itemMesh);

//     const occItemMaterial = new THREE.MeshBasicMaterial({
//       color: lightColor
//     });
//     occItemMaterial.map = itemTexture;
//     occMesh = new THREE.Mesh(itemGeo, occItemMaterial);
//     occMesh.layers.set(OCCLUSION_LAYER);
//     scene.add(occMesh);
//   };

//   camera.position.z = 4.5;
// }
