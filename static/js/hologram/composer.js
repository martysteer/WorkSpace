import { WebGLRenderTarget } from './three/build/three.module.js';

import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three/examples/jsm/postprocessing/ShaderPass.js';

import { FilmShader } from './three/examples/jsm/shaders/FilmShader.js';
import { CopyShader } from './three/examples/jsm/shaders/CopyShader.js';
import { SepiaShader } from './three/examples/jsm/shaders/SepiaShader.js';
import { HorizontalBlurShader } from './three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from './three/examples/jsm/shaders/VerticalBlurShader.js';
import { LuminosityHighPassShader } from './three/examples/jsm/shaders/LuminosityHighPassShader.js';

// modified UnrealBloomPass.js to add alpha
import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { TransparentUnrealBloomPass } from './shaders/TransparentUnrealBloomPass.js';

// Custom hologram shaders
// @src: https://codepen.io/peterhry/pen/egzjGR
import {
  VolumetericLightShader,
  AdditiveBlendingShader,
  PassThroughShader
} from './shaders/holoshaders.js'


// @src https://github.com/felixturner/bad-tv-shader
// modified to a js module and to export the shader
import { BadTVShader } from './shaders/bad-tv-shader-master/BadTVShader.js';



// ----------------------------------------------------------
// Module scoped variables
// ----------------------------------------------------------
let occlusionRenderTarget;  // used in both composers


// ----------------------------------------------------------
// The Occlusion composer uses the light object to blur and skew
// the image to generate the hologram illumincation effect.
// ----------------------------------------------------------
function createOcclusionComposer(container, camera, scene, renderer) {
  occlusionRenderTarget = new WebGLRenderTarget(container.clientHeight, container.clientHeight);

  // Blur passes
  const hBlur = new ShaderPass(HorizontalBlurShader);
  const vBlur = new ShaderPass(VerticalBlurShader);
  const bluriness = 7;
  hBlur.uniforms.h.value = bluriness / container.clientWidth;
  vBlur.uniforms.v.value = bluriness / container.clientHeight;

  // Bad TV Pass (TODO: this could be shared with mainComposer. It is identical)
  const badTVPass = new ShaderPass(BadTVShader);
  badTVPass.uniforms.distortion.value = 1.9;
  badTVPass.uniforms.distortion2.value = 1.2;
  badTVPass.uniforms.speed.value = 0.1;
  badTVPass.uniforms.rollSpeed.value = 0;

  // Volumetric Light Pass - custom shader
  const vlPass = new ShaderPass(VolumetericLightShader);
  const vlShaderUniforms = vlPass.uniforms;
  vlPass.needsSwap = false;

  // Occlusion Composer
  const occlusionComposer = new EffectComposer(renderer, occlusionRenderTarget);
  occlusionComposer.addPass(new RenderPass(scene, camera));
  occlusionComposer.addPass(hBlur);
  occlusionComposer.addPass(vBlur);
  occlusionComposer.addPass(hBlur);
  occlusionComposer.addPass(vBlur);
  occlusionComposer.addPass(hBlur);
  occlusionComposer.addPass(badTVPass);
  occlusionComposer.addPass(vlPass);

  // The composer's tick/update function - update specific shader passes
  occlusionComposer.tick = (delta) => {
    badTVPass.uniforms.time.value += 0.01;
  }

  occlusionComposer.updateShaderLight = (lightSource, camera) => {
    const p = lightSource.position.clone(),
    vector = p.project(camera),
    x = (vector.x + 1) / 2,
    y = (vector.y + 1) / 2;
    vlShaderUniforms.lightPosition.value.set(x, y);
  };

  return occlusionComposer;
}



// ----------------------------------------------------------
// Create the main composer render pipeline
// (NB: Assumes the local occlusionRenderTarget already exists)
// ----------------------------------------------------------
function createMainComposer(container, camera, scene, renderer) {
  // Bloom pass - using custom version of the shader with alpha
  const bloomPass = new UnrealBloomPass(container.clientHeight / container.clientHeight, 0.5, .8, .3);
  // const bloomPass = new TransparentUnrealBloomPass(container.clientHeight / container.clientHeight, 0.5, .8, .3);

  // Sepia shader
  const sepiaPass = new ShaderPass(SepiaShader);

  // Bad TV Pass
  const badTVPass = new ShaderPass(BadTVShader);
  badTVPass.uniforms.distortion.value = 1.9;
  badTVPass.uniforms.distortion2.value = 1.2;
  badTVPass.uniforms.speed.value = 0.1;
  badTVPass.uniforms.rollSpeed.value = 0;

  // Film pass
  const filmPass = new ShaderPass(FilmShader);
  filmPass.uniforms.sCount.value = 1200;
  filmPass.uniforms.grayscale.value = false;
  filmPass.uniforms.sIntensity.value = 1.5;
  filmPass.uniforms.nIntensity.value = 0.2;

  // The final blend pass
  // composes the main and occlusion composer using custom additive shader
  const blendPass = new ShaderPass(AdditiveBlendingShader);
  blendPass.uniforms.tAdd.value = occlusionRenderTarget.texture;
  blendPass.renderToScreen = true;

  // Create the main composer and setup the render pipeline
  const mainComposer = new EffectComposer(renderer);
  mainComposer.addPass(new RenderPass(scene, camera));
  mainComposer.addPass(bloomPass);
  mainComposer.badTVPass = badTVPass; // keep reference to the tv pass for animating
  // mainComposer.addPass(sepiaPass);
  mainComposer.addPass(badTVPass);
  mainComposer.filmPass = filmPass;  // keep reference to film pass for animating
  mainComposer.addPass(filmPass);
  mainComposer.addPass(blendPass);

  // mainComposer's tick/update function - update shader uniforms
  mainComposer.tick = (delta) => {
    badTVPass.uniforms.time.value += 0.01;
    filmPass.uniforms.time.value += delta;
  }

  return mainComposer;
}






export { createMainComposer, createOcclusionComposer };

