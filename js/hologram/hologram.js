
const theGUI = new dat.GUI();
setupGUI(theGUI);

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


function addRenderTargetImage() {
  const material = new THREE.ShaderMaterial(THREE.PassThroughShader);
  material.uniforms.tDiffuse.value = occRenderTarget.texture;

  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
  composer.passes[1].scene.add(mesh);
  mesh.visible = false;

  const folder = gui.addFolder('Light Pass Render Image');
  folder.add(mesh, 'visible');
  folder.open();
}


addRenderTargetImage();