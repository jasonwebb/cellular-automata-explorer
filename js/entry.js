import * as THREE from 'three';

import globals from './globals';
import variables from './variables';

import { setupRenderTargets, renderTargets } from './renderTargets';
import { simulationUniforms, displayUniforms } from './uniforms';
import { simulationMaterial, displayMaterial } from './materials';
import { drawPattern } from './patterns';
import { setRuleFromString } from './rules';
import { setupKeyboard } from './keyboard';
import { setupMouse } from './mouse';
import { setColors } from './colors';
import { setupUI } from './ui';
import { setupHelpDialog } from './helpDialog';
import { setupSeizureWarningDialog, showSeizureWarningDialog } from './seizureWarningDialog';

export let scene, camera, renderer, mesh;
export let canvas;
let bufferCanvas;

//==============================================================
//  SEIZURE WARNING
//==============================================================
// Show the warning and wait for the user to hit the Okay button
const seizureWarningPromise = new Promise((resolve) => {
  setupSeizureWarningDialog();
  showSeizureWarningDialog();

  document.getElementById('seizure-warning-dialog').querySelector('button').addEventListener('click', () => {
    resolve();
  });
});

// When the Okay button is activated, start up the app
seizureWarningPromise.then((resolved) => {
  setupUI();
  setup();
  setupKeyboard();
  setupMouse();
  setupHelpDialog();
  update();
});


//==============================================================
//  SETUP (scene, camera, display mesh, etc)
//  - ThreeJS needs a few fundamental elements in order to
//    display something on the screen: a camera, a renderer,
//    and a scene containing one or more meshes.
//  - In this sketch, we're creating a flat plane and orienting
//    it perpendicular to the camera, taking up the entire
//    viewing area (the screen). The reaction-diffusion output
//    is rendered to this mesh as a texture, making it look
//    perfectly 2D.
//==============================================================
function setup() {
  // Set up the camera and scene
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new THREE.Scene();

  // Create a plane and orient it perpendicular to the camera so it seems 2D
  mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), displayMaterial);
  scene.add(mesh);

  // Set up the renderer (a WebGL context inside a <canvas>)
  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

  // Uncomment this line to see how many shader varyings your GPU supports.
  // console.log(renderer.capabilities.maxVaryings);

  // Grab the <canvas> element and inject it into the DOM
  canvas = renderer.domElement;
  document.getElementById('container').appendChild(canvas);

  // Update the renderer dimensions whenever the browser is resized
  window.addEventListener('resize', resetTextureSizes, false);
  resetTextureSizes();

  // Set the color palette
  setColors();

  // Set the rule that the shader should run

  setRuleFromString('23/3');  // Conway's Life

  // setTimeout(() => {
  //   setRuleFromString('345/2/50');  // Generations - Burst
  // }, 2000);

  // setTimeout(() => {
  //   setRuleFromString('45678/2478/250');  // Generations - Burst
  // }, 5000);

  // Set up and render the first frame
  drawPattern();
}

  export function resetTextureSizes() {
    // Only resize the canvas and textures if they haven't been set yet or the canvas needs to always been maximized
    if(
      !variables.canvas.maximized &&
      canvas.clientWidth == variables.canvas.width.value &&
      canvas.clientHeight == variables.canvas.height.value
    ) return;

    // Resize the canvas
    renderer.setSize(
      variables.canvas.maximized ? window.innerWidth : variables.canvas.width.value,
      variables.canvas.maximized ? window.innerHeight : variables.canvas.height.value
    );

    variables.canvas.width.value = canvas.clientWidth;
    variables.canvas.height.value = canvas.clientHeight;

    // Resize render targets
    setupRenderTargets();

    // Reset the resolution in the simulation code to match new container size
    simulationUniforms.resolution.value = new THREE.Vector2(
      variables.canvas.width.value * variables.canvas.scale.value,
      variables.canvas.height.value * variables.canvas.scale.value
    );

    // Resize the buffer canvas
    bufferCanvas = document.querySelector('#buffer-canvas');
    bufferCanvas.width = variables.canvas.width.value * variables.canvas.scale.value;
    bufferCanvas.height = variables.canvas.height.value * variables.canvas.scale.value;
  }


//==============================================================
//  UPDATE
//  - Main program loop, runs once per frame no matter what.
//==============================================================
function update() {
  if(!variables.isPaused) {
    // Activate the simulation shaders
    mesh.material = simulationMaterial;

    // Run the simulation multiple times by feeding the result of one iteration (a render target's texture) into the next render target
    for(let i=0; i<globals.pingPongSteps; i++) {
      let nextRenderTargetIndex = globals.currentRenderTargetIndex === 0 ? 1 : 0;

      simulationUniforms.states.value = renderTargets[globals.currentRenderTargetIndex].texture;  // grab the result of the last iteration
      renderer.setRenderTarget(renderTargets[nextRenderTargetIndex]);                             // prepare to render into the next render target
      renderer.render(scene, camera);                                                             // run the simulation shader on that texture

      globals.currentRenderTargetIndex = nextRenderTargetIndex;
    }

    // Activate the display shaders
    displayUniforms.time.value = globals.clock.getElapsedTime();
    displayUniforms.textureToDisplay.value = renderTargets[globals.currentRenderTargetIndex].texture;  // pass this result to the display material too
    mesh.material = displayMaterial;

    // Render the latest iteration to the screen
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  // Run again when the next frame starts
  setTimeout(() => {
    requestAnimationFrame(update);
  }, 100 * (1 - variables.controls.speed.value) + 0 * variables.controls.speed.value);
}