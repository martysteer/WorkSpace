// ----------------------------------------------------------
// Scene.js
// ----------------------------------------------------------
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;
const lightColor = 0x0099ff;
const renderScale = 0.02;
const clock = new THREE.Clock();


// ----------------------------------------------------------
// Sets up the scene for the hologram
// Pass a CSS ID of the DOM element to turn into hologram.
// ----------------------------------------------------------
class HoloScene {

  // ----------------------------------------------------------
  // Pass the elementID (default "id='hologram'")
  constructor(elementID = 'hologram') {
    this.container = document.getElementById(elementID);
    this.img = this.container.querySelector('img');
    this.canvas = this.container.querySelector('canvas');

    // console.log(this.container, this.canvas, this.img);

    this.initScene(); // 1
    this.initLights(); // 2
    this.initCamera(); // 3
    this.setupScene(); // 4
    this.setupPostprocessing(); // 5
    this.update(); // 6 - start the animation loop
  }


  // ----------------------------------------------------------
  // Initialise scene objects
  initScene() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // alpha: true, // transparent background
      antialias: false,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // ??
    this.occRenderTarget = new THREE.WebGLRenderTarget(this.img.width * renderScale, this.img.height * renderScale);
    this.occlusionComposer = new THREE.EffectComposer(this.renderer, this.occRenderTarget);
    // this.composer = new THREE.EffectComposer(this.renderer);
  }


  // ----------------------------------------------------------
  // Initialise scene lighting
  initLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientlight);

    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    this.scene.add(pointLight);

    // this.lightSource = new THREE.Object3D();
    // this.lightSource.position.x = 0;
    // this.lightSource.position.y = -15;
    // this.lightSource.position.z = -15;

  }  // end initLights()


  // ----------------------------------------------------------
  // Initialise scene camera
  initCamera() {
    const perspective = 175; //400
    const fov = (180 * (2 * Math.atan(this.img.width / 2 / perspective))) / Math.PI;

    this.camera = new THREE.PerspectiveCamera(fov, this.img.width / this.img.width, 0.1, 1000);
    this.camera.position.set(0, 0, perspective);
  }


  // ----------------------------------------------------------
  // Initialise rendered elements
  setupScene() {
    // Make local reference to parent property for use in onload closure.
    var parent = this;


    // Example cube
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial( { color: 0xff0051 })
    var material = new THREE.MeshStandardMaterial({
      color: 0xff0051
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.x = -2;
    this.cube.position.y = 3;
    // this.scene.add(this.cube);


    // Hologram's image as texture on a flat mesh
    var planeGeo = new THREE.PlaneGeometry(this.img.offsetWidth * renderScale, this.img.offsetHeight * renderScale);
    const loader = new THREE.TextureLoader();
    loader.load(this.img.src, (texture) => {
      const imgMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7
      });
      this.imgPlane = new THREE.Mesh(planeGeo, imgMaterial);
      this.scene.add(this.imgPlane);
    });


    // The geometry of the holographic image is a simple plane
    const itemGeo = new THREE.PlaneGeometry(10, 2.1);
    const itemMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.7
    });


    // Create new canvas from hologram's <img>
    // and draw the image into a canvas
    const density = 1
    var canvas = document.createElement("canvas");
    // canvas.width = this.img.width * density;
    // canvas.height = this.img.height * density;
    const ctx = canvas.getContext("2d")
    ctx.drawImage(this.img, 0, 0);


    // Create new image and canvas for the Scene
    // and use the image canvas as the texture
    const newimg = new Image();
    newimg.src = this.img.src;
    newimg.onload = function() {
      const itemTexture = new THREE.Texture(
        canvas,
        null,
        THREE.ClampToEdgeWrapping,
        THREE.ClampToEdgeWrapping,
        null,
        THREE.LinearFilter
      );

      itemTexture.needsUpdate = true;
      itemMaterial.map = itemTexture;

      parent.itemMesh = new THREE.Mesh(itemGeo, itemMaterial); // class field
      // parent.scene.add(parent.itemMesh);

      // Create occlusion materials/mesh and add to parent.scene
      // (This is the holographic illumination layer on top)
      const occItemMaterial = new THREE.MeshBasicMaterial({
        color: lightColor
      });
      occItemMaterial.map = itemTexture;

      // parent.occMesh = new THREE.Mesh(itemGeo, occItemMaterial); // class field
      // parent.occMesh.layers.set(OCCLUSION_LAYER);
      // parent.scene.add(parent.occMesh);
    } // end newimg.onload function

    // Render the occlusion composition layer
    // this.camera.layers.set(OCCLUSION_LAYER);  // Layer 1
    // this.renderer.setClearColor(0x000000);
    // this.occlusionComposer.render();

    // Render the main composition later
    // this.camera.layers.set(DEFAULT_LAYER); // Layer 0
    // this.renderer.setClearColor(0x000000);
    // this.composer.render();

    // this.renderer.render(this.scene, this.camera);
    this.camera.position.z = 4.5; // Move camera back a bit

  } // end setupScene()


  // ----------------------------------------------------------
  // Update scene
  // TO MERGE: onFrame()
  update() {
    const timeDelta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Example cube
    this.cube.rotation.x = Math.sin(elapsed / 5);
    this.cube.rotation.y = Math.cos(elapsed / 5);


    // Swing rotate the hologram's image plane
    // and animate the holographic illumination/occlusion layer
    if (this.itemMesh) {
      this.itemMesh.rotation.y = Math.sin(elapsed / 2) / 15;
      this.itemMesh.rotation.z = Math.cos(elapsed / 2) / 50;

      this.imgPlane.rotation.y = Math.sin(elapsed / 2) / 15;
      this.imgPlane.rotation.z = Math.cos(elapsed / 2) / 50;


      // this.occMesh.rotation.copy(this.itemMesh.rotation);
    }

    // Update the post process shaders uniform attributes
    this.filmPass.uniforms.time.value += timeDelta;
    this.badTVPass.uniforms.time.value += 0.01;


    // These attribute updates will keep the canvas resized
    // to it's CSS container every frame
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetWidth);
    this.renderer.render(this.scene, this.camera);

    // Use this function for the animation loop
    requestAnimationFrame(this.update.bind(this));
  }


  // ----------------------------------------------------------
  // Add shaders and distortion effects to hologram canvas
  // TODO: make variables class properties
  // TODO: import shaders properly
  setupPostprocessing() {
    var width = this.img.width;
    var height = this.img.height;

    // Blur passes
    const hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    const vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    const bluriness = 7;
    hBlur.uniforms.h.value = bluriness / width;
    vBlur.uniforms.v.value = bluriness / height;


    // Bad TV Pass - VHS line effects
    this.badTVPass = new THREE.ShaderPass(THREE.BadTVShader);
    this.badTVPass.uniforms.distortion.value = 1.9;
    this.badTVPass.uniforms.distortion2.value = 1.2;
    this.badTVPass.uniforms.speed.value = 0.1;
    this.badTVPass.uniforms.rollSpeed.value = 0;
console.log(this.badTVPass);

    // Film pass - Grainy film effects
    this.filmPass = new THREE.ShaderPass(THREE.FilmShader);
    this.filmPass.uniforms.sCount.value = 1200;
    this.filmPass.uniforms.grayscale.value = false;
    this.filmPass.uniforms.sIntensity.value = 1.5;
    this.filmPass.uniforms.nIntensity.value = 0.2;
console.log(this.filmPass);    

    // Bloom pass - Neon saturation effects
    this.bloomPass = new THREE.UnrealBloomPass(width / height, 0.5, .8, .3);



    // // Volumetric Light Pass
    // const vlPass = new THREE.ShaderPass(THREE.VolumetericLightShader);
    // this.vlShaderUniforms = vlPass.uniforms;
    // vlPass.needsSwap = false;

    // // Setup the Occlusion Composer (it is initialised in initScene)   
    // this.occlusionComposer.addPass(new THREE.RenderPass(this.scene, this.camera));
    // this.occlusionComposer.addPass(hBlur);
    // this.occlusionComposer.addPass(vBlur);
    // this.occlusionComposer.addPass(hBlur);
    // this.occlusionComposer.addPass(vBlur);
    // this.occlusionComposer.addPass(hBlur);
    // this.occlusionComposer.addPass(this.badTVPass);
    // this.occlusionComposer.addPass(vlPass);

    // // Blend occRenderTarget into main render target 
    // const blendPass = new THREE.ShaderPass(THREE.AdditiveBlendingShader);
    // blendPass.uniforms.tAdd.value = this.occRenderTarget.texture;
    // blendPass.renderToScreen = true;

    // Main Effect Composer
    // This sets up postprocessing passes
    // First pass is to render the original scene.
    // Other render passes are defined above.
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    // this.composer.addPass(this.bloomPass);
    // this.composer.addPass(this.badTVPass);
    // this.composer.addPass(this.filmPass);

    // this.composer.addPass(blendPass);  // blend the occlusion holographic layer with the image layer.
  }




} // end class HoloScene
