//==============================================================
//  INITIAL TEXTURE
//  - To start (or reset) the simulation, we need to "seed"
//    the very first frame with some pattern of data.
//==============================================================

import * as THREE from 'three';

import variables from './variables';
import { displayUniforms, passthroughUniforms } from './uniforms';
import { displayMaterial, passthroughMaterial } from './materials';
import { scene, camera, renderer, mesh } from './entry';
import { renderTargets } from './renderTargets';

let bufferImage, bufferCanvas, bufferCanvasCtx;

export const InitialPatternTypes = {
  CIRCLE: 0,
  RECTANGLE: 1,
  TEXT: 2,
  IMAGE: 3,
  RANDOM: 4,
  EMPTY: 5,
};

export function drawPattern(type = InitialPatternTypes.RECTANGLE) {
  // Grab the invisible canvas context that we can draw initial image data into
  bufferCanvas = document.querySelector('#buffer-canvas');
  bufferCanvasCtx = bufferCanvas.getContext('2d');

  // Grab the invisible <img> tag that we can use to draw images from the file system, then copy into the buffer canvas
  bufferImage = document.querySelector('#buffer-image');

  // Clear the invisible canvas
  bufferCanvasCtx.fillStyle = '#000';
  bufferCanvasCtx.fillRect(0, 0, variables.canvas.width.value * variables.scale.value, variables.canvas.height.value * variables.scale.value);

  // Build initial simulation texture data and pass it on to the render targets
  const centerX = (variables.canvas.width.value * variables.scale.value) / 2,
        centerY = (variables.canvas.height.value * variables.scale.value) / 2;

  switch(type) {
    case InitialPatternTypes.CIRCLE:
      bufferCanvasCtx.beginPath();
      bufferCanvasCtx.arc(centerX, centerY, variables.patterns.circle.radius.value * variables.scale.value, 0, Math.PI*2);
      bufferCanvasCtx.fillStyle = '#fff';
      bufferCanvasCtx.fill();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialPatternTypes.RECTANGLE:
      bufferCanvasCtx.fillStyle = '#fff';

      bufferCanvasCtx.translate(variables.canvas.width.value/2, variables.canvas.height.value/2);
      bufferCanvasCtx.rotate(variables.patterns.rectangle.rotation.value * Math.PI / 180);
      bufferCanvasCtx.translate(-variables.canvas.width.value/2, -variables.canvas.height.value/2);

      bufferCanvasCtx.fillRect(
        centerX - variables.patterns.rectangle.width.value/2,
        centerY - variables.patterns.rectangle.height.value/2,
        variables.patterns.rectangle.width.value,
        variables.patterns.rectangle.height.value
      );

      bufferCanvasCtx.resetTransform();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialPatternTypes.TEXT:
      bufferCanvasCtx.fillStyle = '#fff';
      bufferCanvasCtx.font = '900 ' + variables.patterns.text.size.value + 'px Arial';
      bufferCanvasCtx.textAlign = 'center';

      bufferCanvasCtx.translate(variables.canvas.width.value/2, variables.canvas.height.value/2);
      bufferCanvasCtx.rotate(variables.patterns.text.rotation.value * Math.PI / 180);
      bufferCanvasCtx.translate(-variables.canvas.width.value/2, -variables.canvas.height.value/2);

      bufferCanvasCtx.fillText(
        variables.patterns.text.value,
        centerX, centerY
      );

      bufferCanvasCtx.resetTransform();
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialPatternTypes.IMAGE:
      if(variables.patterns.image.image != null) {
        getImagePixels(variables.patterns.image.image, centerX, centerY)
          .then((initialData) => {
            renderInitialDataToRenderTargets(initialData);
          })
          .catch(error => console.error(error));
      } else {
        alert('Upload an image using the button first!');
      }
      break;

    case InitialPatternTypes.RANDOM:
      let pixels = bufferCanvasCtx.getImageData(0, 0, variables.canvas.width.value, variables.canvas.height.value);

      for(let i=0; i<pixels.data.length; i+=4) {
        pixels.data[i] = Math.floor(Math.random() * 256);
      }

      bufferCanvasCtx.putImageData(pixels, 0, 0);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;

    case InitialPatternTypes.EMPTY:
      bufferCanvasCtx.clearRect(0, 0, variables.canvas.width.value, variables.canvas.height.value);
      renderInitialDataToRenderTargets( convertPixelsToTextureData() );
      break;
  }
}

  function renderInitialDataToRenderTargets(initialData) {
    // Put the initial data into a texture format that ThreeJS can pass into the render targets
    let texture = new THREE.DataTexture(initialData, variables.canvas.width.value, variables.canvas.height.value, THREE.RGBAFormat, THREE.FloatType);
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

  function getImagePixels(imageData, centerX, centerY) {
    // Create an asynchronous Promise that can be used to wait for the image to load
    return new Promise((resolve) => {
      bufferImage.src = imageData;

      bufferImage.addEventListener('load', () => {
        bufferCanvasCtx.translate(variables.canvas.width/2 * variables.patterns.image.scale, variables.canvas.height/2 * variables.patterns.image.scale);
        bufferCanvasCtx.rotate(variables.patterns.image.rotation * Math.PI / 180);
        bufferCanvasCtx.translate(-variables.canvas.width/2 * variables.patterns.image.scale, -variables.canvas.height/2 * variables.patterns.image.scale);

        let startX, startY, width, height;

        switch(variables.patterns.image.fit) {
          // None - use the image's true dimensions
          case 0:
            startX = centerX - bufferImage.width/2;
            startY = centerY - bufferImage.height/2;
            width = bufferImage.width * variables.patterns.image.scale;
            height = bufferImage.height * variables.patterns.image.scale;
            break;

          // Scale - scale the image up or down to fit the canvas without stretching
          // https://stackoverflow.com/a/50165098
          case 1:
            const widthRatio = variables.canvas.width / bufferImage.width,
                  heightRatio = variables.canvas.height / bufferImage.height,
                  bestFitRatio = Math.min(widthRatio, heightRatio),
                  scaledWidth = bufferImage.width * bestFitRatio,
                  scaledHeight = bufferImage.height * bestFitRatio;

            startX = centerX - scaledWidth/2;
            startY = centerY - scaledHeight/2;
            width = scaledWidth;
            height = scaledHeight;
            break;

          // Stretch
          case 2:
            startX = 0;
            startY = 0;
            width = variables.canvas.width;
            height = variables.canvas.height;
            break;
        }

        bufferCanvasCtx.drawImage(bufferImage, startX, startY, width, height);

        bufferCanvasCtx.resetTransform();
        resolve(convertPixelsToTextureData());
      });
    });
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
      data[i] = pixels[i] > 200 ? 1.0 : 0.0;
      data[i+1] = 0.0;
      data[i+2] = 0.0;
      data[i+3] = 0.0;
    }

    return data;
  }