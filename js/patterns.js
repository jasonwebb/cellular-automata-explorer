//==============================================================
//  INITIAL TEXTURE
//  - To start (or reset) the simulation, we need to "seed"
//    the very first frame with some pattern of data.
//==============================================================

import * as THREE from 'three';

import { displayUniforms, passthroughUniforms } from './uniforms';
import { displayMaterial, passthroughMaterial } from './materials';
import { scene, camera, renderer, mesh } from './entry';
import { renderTargets } from './renderTargets';
import variables from './variables';

let bufferImage, bufferCanvas, bufferCanvasCtx;

export const InitialPatternTypes = [
  'None',
  'Circle',
  'Rectangle',
  'Text',
  'Random'
];

export function drawPattern(type = variables.activePattern) {
  // Grab the invisible canvas context that we can draw initial image data into
  bufferCanvas = document.querySelector('#buffer-canvas');
  bufferCanvasCtx = bufferCanvas.getContext('2d');

  // Grab the invisible <img> tag that we can use to draw images from the file system, then copy into the buffer canvas
  bufferImage = document.querySelector('#buffer-image');

  // Clear the invisible canvas
  bufferCanvasCtx.fillStyle = '#000';
  bufferCanvasCtx.fillRect(0, 0, variables.canvas.width.value, variables.canvas.height.value);

  // Build initial simulation texture data and pass it on to the render targets
  const centerX = variables.canvas.width.value / 2,
        centerY = variables.canvas.height.value / 2

  switch(type) {
    case 'Circle':
      bufferCanvasCtx.beginPath();
      bufferCanvasCtx.arc(centerX, centerY, variables.patterns.circle.diameter.value / 2, 0, Math.PI*2);
      bufferCanvasCtx.fillStyle = '#fff';
      bufferCanvasCtx.fill();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case 'Rectangle':
      bufferCanvasCtx.fillStyle = '#fff';

      bufferCanvasCtx.translate(centerX, centerY);
      bufferCanvasCtx.rotate(variables.patterns.rectangle.rotation.value * Math.PI / 180);
      bufferCanvasCtx.translate(-centerX, -centerY);

      bufferCanvasCtx.fillRect(
        centerX - (variables.patterns.rectangle.width.value / 2),
        centerY - (variables.patterns.rectangle.height.value / 2),
        variables.patterns.rectangle.width.value,
        variables.patterns.rectangle.height.value
      );

      bufferCanvasCtx.resetTransform();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case 'Text':
      bufferCanvasCtx.fillStyle = '#fff';
      bufferCanvasCtx.font = variables.patterns.text.fontWeight.value + ' ' +
                             variables.patterns.text.size.value + 'px ' +
                             variables.patterns.text.activeFontFace;
      bufferCanvasCtx.textAlign = 'center';

      bufferCanvasCtx.translate(centerX, centerY);
      bufferCanvasCtx.rotate(variables.patterns.text.rotation.value * Math.PI / 180);
      bufferCanvasCtx.translate(-centerY, -centerY);

      bufferCanvasCtx.fillText(
        variables.patterns.text.string,
        centerX, centerY
      );

      bufferCanvasCtx.resetTransform();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case 'Random':
      let pixels = bufferCanvasCtx.getImageData(0, 0, variables.canvas.width.value, variables.canvas.height.value);

      for(let i=0; i<pixels.data.length; i+=4) {
        pixels.data[i] = Math.random() < variables.patterns.random.density.value ? 255 : 0;
      }

      bufferCanvasCtx.putImageData(pixels, 0, 0);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case 'None':
      bufferCanvasCtx.clearRect(0, 0, variables.canvas.width.value, variables.canvas.height.value);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;
  }
}

  function renderInitialDataToRenderTargets(initialData) {
    // Put the initial data into a texture format that ThreeJS can pass into the render targets
    let texture = new THREE.DataTexture(
      initialData,
      variables.canvas.width.value,
      variables.canvas.height.value,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    texture.flipY = true;  // DataTexture coordinates are vertically inverted compared to canvas coordinates
    texture.needsUpdate = true;

    // Pass the DataTexture to the passthrough material
    passthroughUniforms.textureToDisplay.value = texture;

    // Activate the passthrough material
    mesh.material = passthroughMaterial;

    // Render the DataTexture into both of the render targets
    for(let i=0; i<2; i++) {
      renderer.setRenderTarget(renderTargets[i]);
      renderer.render(scene, camera);
    }

    // Switch back to the display material and pass along the initial rendered texture
    displayUniforms.textureToDisplay.value = renderTargets[0].texture;
    mesh.material = displayMaterial;

    // Set the render target back to the default display buffer and render the first frame
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  // Convert 8-bit color pixel data into normalized float values that the shaders can use
  function convertPixelsToTextureData() {
    let pixels = bufferCanvasCtx.getImageData(
      0, 0,
      variables.canvas.width.value,
      variables.canvas.height.value
    ).data;

    let data = new Float32Array(pixels.length);

    for(let i=0; i<data.length; i+=4) {
      data[i] = pixels[i] / 255;
      data[i+1] = 0.0;
      data[i+2] = 0.0;
      data[i+3] = 0.0;
    }

    return data;
  }