

const getImageTexture = (image, density = 1) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const {
    width,
    height
  } = image;

  console.log('getImageTexture(image, w,h)', image, width, height);

  canvas.setAttribute('width', width * density);
  canvas.setAttribute('height', height * density);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, width * density, height * density);
  ctx.drawImage(image, 0, 0, width * density, height * density);

  return canvas;
};



/* Setup the canvas/camera scene */
function setupScene() {
  lightSource = new THREE.Object3D();
  lightSource.position.x = 0;
  lightSource.position.y = -15;
  lightSource.position.z = -15;

  const itemGeo = new THREE.PlaneGeometry(9, 2.1);
  const itemMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.7
  });

  // const img = new Image();
  img = document.getElementById("hologram").firstElementChild;
  console.log(img.src);

  // img.src = '../images/exoskel.png';
  // img.crossOrigin = 'Anonymous';

  img.onload = function() {
    const itemTexture = new THREE.Texture(
      getImageTexture(img),
      null,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      null,
      THREE.LinearFilter);


    itemTexture.needsUpdate = true;
    itemMaterial.map = itemTexture;

    itemMesh = new THREE.Mesh(itemGeo, itemMaterial);
    scene.add(itemMesh);

    const occItemMaterial = new THREE.MeshBasicMaterial({
      color: lightColor
    });
    occItemMaterial.map = itemTexture;
    occMesh = new THREE.Mesh(itemGeo, occItemMaterial);
    occMesh.layers.set(OCCLUSION_LAYER);
    scene.add(occMesh);
  };

  camera.position.z = 4.5;
}


/* Add shaders and distortion effects to hologram canvas */
function setupPostprocessing() {
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


/* Setup animation render loop */
function onFrame() {
  requestAnimationFrame(onFrame);
  update();
  render();
}


function update() {
  const timeDelta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  filmPass.uniforms.time.value += timeDelta;
  badTVPass.uniforms.time.value += 0.01;

  if (itemMesh) {
    itemMesh.rotation.y = Math.sin(elapsed / 2) / 15;
    itemMesh.rotation.z = Math.cos(elapsed / 2) / 50;
    occMesh.rotation.copy(itemMesh.rotation);
  }
}


function render() {
  camera.layers.set(OCCLUSION_LAYER);
  // renderer.setClearColor(0x000000);
  occlusionComposer.render();

  camera.layers.set(DEFAULT_LAYER);
  //renderer.setClearColor(0x000000);
  composer.render();
}


/* Set up the parameter configuration GUI (from codepen.io) */
function setupGUI(aGUI) {
  let folder,
    min,
    max,
    step,
    updateShaderLight = function() {
      const p = lightSource.position.clone(),
        vector = p.project(camera),
        x = (vector.x + 1) / 2,
        y = (vector.y + 1) / 2;
      vlShaderUniforms.lightPosition.value.set(x, y);
    };

  updateShaderLight();

  // Bloom Controls
  folder = aGUI.addFolder('Bloom');
  folder.add(bloomPass, 'radius').
  min(0).
  max(10).
  name('Radius');
  folder.add(bloomPass, 'threshold').
  min(0).
  max(1).
  name('Threshold');
  folder.add(bloomPass, 'strength').
  min(0).
  max(10).
  name('Strength');
  folder.open();

  // Bad TV Controls
  folder = aGUI.addFolder('TV');
  folder.add(badTVPass.uniforms.distortion, 'value').
  min(0).
  max(10).
  name('Distortion 1');
  folder.add(badTVPass.uniforms.distortion2, 'value').
  min(0).
  max(10).
  name('Distortion 2');
  folder.add(badTVPass.uniforms.speed, 'value').
  min(0).
  max(1).
  name('Speed');
  folder.add(badTVPass.uniforms.rollSpeed, 'value').
  min(0).
  max(10).
  name('Roll Speed');
  folder.open();

  // Light Controls
  folder = aGUI.addFolder('Light Position');
  folder.add(lightSource.position, 'x').
  min(-50).
  max(50).
  onChange(updateShaderLight);
  folder.add(lightSource.position, 'y').
  min(-50).
  max(50).
  onChange(updateShaderLight);
  folder.add(lightSource.position, 'z').
  min(-50).
  max(50).
  onChange(updateShaderLight);
  folder.open();

  // Volumetric Light Controls
  folder = aGUI.addFolder('Volumeteric Light Shader');
  folder.add(vlShaderUniforms.exposure, 'value').
  min(0).
  max(1).
  name('Exposure');
  folder.add(vlShaderUniforms.decay, 'value').
  min(0).
  max(1).
  name('Decay');
  folder.add(vlShaderUniforms.density, 'value').
  min(0).
  max(10).
  name('Density');
  folder.add(vlShaderUniforms.weight, 'value').
  min(0).
  max(1).
  name('Weight');
  folder.add(vlShaderUniforms.samples, 'value').
  min(1).
  max(100).
  name('Samples');

  folder.open();
}


// function addRenderTargetImage() {
//   const material = new THREE.ShaderMaterial(THREE.PassThroughShader);
//   material.uniforms.tDiffuse.value = occRenderTarget.texture;

//   const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
//   composer.passes[1].scene.add(mesh);
//   mesh.visible = false;

//   const folder = gui.addFolder('Light Pass Render Image');
//   folder.add(mesh, 'visible');
//   folder.open();
// }



const width = 1280;
const height = 720;
const lightColor = 0x0099ff;
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;
const renderScale = .25;
const clock = new THREE.Clock();


let composer,
  filmPass,
  badTVPass,
  bloomPass,
  occlusionComposer,
  itemMesh,
  occMesh,
  occRenderTarget,
  lightSource,
  vlShaderUniforms;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: false
});
renderer.setSize(width, height);


document.body.appendChild(renderer.domElement);

console.log(renderer);
//.appendChild(renderer.domElement);


/* Initialise the holigraphic canvas for the image */
window.onload = function() {
  let img = document.getElementById("hologram");


  setupScene();
  setupPostprocessing();
  onFrame();

  const theGUI = new dat.GUI();
  setupGUI(theGUI);

  // addRenderTargetImage();
}