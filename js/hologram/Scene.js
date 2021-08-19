// ----------------------------------------------------------
// Scene.js
// ----------------------------------------------------------
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;
const lightColor = 0x0099ff;
const renderScale = .25;
const clock = new THREE.Clock();


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

    // console.log(this.container, this.canvas, this.img);

    this.initScene(); // 1
    this.initLights(); // 2
    this.initCamera(); // 3
    this.setupScene(); // 4
    this.update(); // 5
  }


  // ----------------------------------------------------------
  // Initialise scene objects
  initScene() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // alpha: true,
      antialias: false,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }


  // ----------------------------------------------------------
  // Initialise scene lighting
  initLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientlight);

    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    this.scene.add(pointLight);


    this.lightSource = new THREE.Object3D();
    this.lightSource.position.x = 0;
    this.lightSource.position.y = -15;
    this.lightSource.position.z = -15;

  }


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
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial( { color: 0xff0051 })
    var material = new THREE.MeshStandardMaterial({
      color: 0xff0051
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.renderer.render(this.scene, this.camera);
    this.camera.position.z = 4.5;


    // ===
    const itemGeo = new THREE.PlaneGeometry(9, 2.1);
    const itemMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.7
    });


    // Create new canvas from hologram's <img>
    const density = 1
    var canvas = document.createElement("canvas");
    canvas.width = this.img.width * density;
    canvas.height = this.img.height * density;
    const ctx = canvas.getContext("2d")
    ctx.drawImage(this.img, 0, 0);

    // Make local reference to parent property for use in onload closure.
    var parent = this;

    // Create new image and canvas for the Scene
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
      parent.scene.add(parent.itemMesh);

      // Setup occlusion materials/mesh and add to parent.scene
      const occItemMaterial = new THREE.MeshBasicMaterial({
        color: lightColor
      });
      occItemMaterial.map = itemTexture;
      
      parent.occMesh = new THREE.Mesh(itemGeo, occItemMaterial); // class field
      parent.occMesh.layers.set(OCCLUSION_LAYER);
      parent.scene.add(parent.occMesh);
    } // end newimg.onload function

  }  // end setupScene()


  // ----------------------------------------------------------
  // Update scene
  // TO MERGE: onFrame()
  update() {
    requestAnimationFrame(this.update.bind(this));
    this.cube.rotation.x += 0.04;
    this.cube.rotation.y += 0.04;
    this.renderer.render(this.scene, this.camera);
    this.renderer.setSize(this.img.width, this.img.height * 4);
    // this.renderer.setSize(this.container.offsetWidth, this.container.offsetWidth);
  }


  // ----------------------------------------------------------
  // Add shaders and distortion effects to hologram canvas
  // TODO: make variables class properties
  // TODO: import shaders properly
  setupPostprocessing() {
    occRenderTarget = new THREE.WebGLRenderTarget(width * renderScale, height * renderScale);

    // Blur passes
    const hBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    const vBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    const bluriness = 7;
    hBlur.uniforms.h.value = bluriness / width;
    vBlur.uniforms.v.value = bluriness / height;

    // Bad TV Pass
    badTVPass = new THREE.ShaderPass(THREE.BadTVShader);
    badTVPass.uniforms.distortion.value = 1.9;
    badTVPass.uniforms.distortion2.value = 1.2;
    badTVPass.uniforms.speed.value = 0.1;
    badTVPass.uniforms.rollSpeed.value = 0;

    // Volumetric Light Pass
    const vlPass = new THREE.ShaderPass(THREE.VolumetericLightShader);
    vlShaderUniforms = vlPass.uniforms;
    vlPass.needsSwap = false;

    // Occlusion Composer
    occlusionComposer = new THREE.EffectComposer(renderer, occRenderTarget);
    occlusionComposer.addPass(new THREE.RenderPass(scene, camera));
    occlusionComposer.addPass(hBlur);
    occlusionComposer.addPass(vBlur);
    occlusionComposer.addPass(hBlur);
    occlusionComposer.addPass(vBlur);
    occlusionComposer.addPass(hBlur);
    occlusionComposer.addPass(badTVPass);
    occlusionComposer.addPass(vlPass);

    // Bloom pass
    bloomPass = new THREE.UnrealBloomPass(width / height, 0.5, .8, .3);

    // Film pass
    filmPass = new THREE.ShaderPass(THREE.FilmShader);
    filmPass.uniforms.sCount.value = 1200;
    filmPass.uniforms.grayscale.value = false;
    filmPass.uniforms.sIntensity.value = 1.5;
    filmPass.uniforms.nIntensity.value = 0.2;

    // Blend occRenderTarget into main render target 
    const blendPass = new THREE.ShaderPass(THREE.AdditiveBlendingShader);
    blendPass.uniforms.tAdd.value = occRenderTarget.texture;
    blendPass.renderToScreen = true;

    // Main Composer
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    composer.addPass(bloomPass);
    composer.addPass(badTVPass);
    composer.addPass(filmPass);
    composer.addPass(blendPass);
  }






} // end class HoloScene