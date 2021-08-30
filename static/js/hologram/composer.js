import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { FilmShader } from './three/examples/jsm/shaders/FilmShader.js';
import { CopyShader } from './three/examples/jsm/shaders/CopyShader.js';
import { HorizontalBlurShader } from './three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from './three/examples/jsm/shaders/VerticalBlurShader.js';
import { LuminosityHighPassShader } from './three/examples/jsm/shaders/LuminosityHighPassShader.js';


// @src https://github.com/felixturner/bad-tv-shader
// modified to a js module and to export the shader
import { BadTVShader } from './shaders/bad-tv-shader-master/BadTVShader.js';


// Create the main composer render pipeline
function createMainComposer(container, camera, scene, renderer) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Bloom pass
  const bloomPass = new UnrealBloomPass(container.clientHeight / container.clientHeight, 0.5, .8, .3);
  composer.addPass(bloomPass);

  // Bad TV Pass
  const badTVPass = new ShaderPass(BadTVShader);
  badTVPass.uniforms.distortion.value = 1.9;
  badTVPass.uniforms.distortion2.value = 1.2;
  badTVPass.uniforms.speed.value = 0.1;
  badTVPass.uniforms.rollSpeed.value = 0;
  composer.badTVPass = badTVPass; // keep reference to the tv pass for animating
  composer.addPass(badTVPass);

  // Film pass
  const filmPass = new ShaderPass(FilmShader);
  filmPass.uniforms.sCount.value = 1200;
  filmPass.uniforms.grayscale.value = false;
  filmPass.uniforms.sIntensity.value = 1.5;
  filmPass.uniforms.nIntensity.value = 0.2;
  composer.filmPass = filmPass;  // keep reference to film pass for animating
  composer.addPass(filmPass);

  // The final blend pass composes the main composer with the occlusion composer
  // composer.addPass(blendPass);


  // The composer's tick/update function - update specific shader passes
  composer.tick = (delta) => {
    badTVPass.uniforms.time.value += 0.01;
    filmPass.uniforms.time.value += delta;
  }

  return composer;
}


function createOcclusionComposer() {

}


export { createMainComposer, createOcclusionComposer };

