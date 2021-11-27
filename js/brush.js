//==============================================================
//  BRUSH CONTROLS
//==============================================================

import { simulationUniforms } from './uniforms';
import { canvas } from './entry';
import variables from './variables';

export let mouseIsMoving;

let canvasWrapper,
    canvasIsFocused,
    reticleCircle,
    xAxisCrosshair,
    yAxisCrosshair,
    mouseDown,
    mouseMovementTimer,
    lastMousePosition = {},
    paintKeyDown,
    shiftKeyDown,
    ctrlKeyDown,
    arrowKeysDown = {},
    stepSize = 1,
    brushStepSize = 5,
    stepSizeMultiplier = 5;

export function setupBrush() {
  canvasWrapper = document.querySelector('.canvas-wrapper');
  canvasIsFocused = false;

  lastMousePosition.x = window.innerWidth/2;
  lastMousePosition.y = window.innerHeight/2;
  mouseDown = false;
  mouseIsMoving = false;

  paintKeyDown = false;
  shiftKeyDown = false;
  ctrlKeyDown = false;
  arrowKeysDown = {
    left: false,
    right: false,
    up: false,
    down: false
  };

  //===================================
  //  Setup the reticle circle
  //===================================
  // Create a floating circle that follows the mouse cursor to indicate the current size of the brush
  reticleCircle = document.createElement('div');
  reticleCircle.classList.add('brush-indicator');
  reticleCircle.style = `
    display: block;
    content: '';
    width: ${simulationUniforms.brushRadius.value * 2}px;
    height: ${simulationUniforms.brushRadius.value * 2}px;
    position: absolute;
    border: 1px solid white;
    border-radius: 500px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.4);
    pointer-events: none;
  `;
  canvasWrapper.append(reticleCircle);

  //===================================
  //  Setup the crosshairs
  //===================================
  // Create the X axis crosshair
  xAxisCrosshair = document.createElement('div');
  xAxisCrosshair.classList.add('x-axis-crosshair');
  xAxisCrosshair.setAttribute('aria-hidden', true);
  xAxisCrosshair.style = `
    display: none;
    content: '';

    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    z-index: 1;

    border-bottom: 2px dashed white;
    box-shadow: 0 1px 1px 0 black;
    opacity: .7;
  `;
  canvasWrapper.appendChild(xAxisCrosshair);

  // Create the Y axis crosshair
  yAxisCrosshair = document.createElement('div');
  yAxisCrosshair.classList.add('y-axis-crosshair');
  yAxisCrosshair.setAttribute('aria-hidden', true);
  yAxisCrosshair.style = `
    display: none;
    content: '';

    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    z-index: 1;

    border-right: 2px dashed white;
    box-shadow: 1px 0 1px 0 black;
    opacity: .7;
  `;
  canvasWrapper.appendChild(yAxisCrosshair);

  //===================================
  //  Setup the mouse controls
  //===================================
  // Begin mouse drag, fill indicator circle white
  canvas.addEventListener('mousedown', (e) => {
    if(e.button == 0) {
      e.preventDefault();
      mouseDown = true;
      reticleCircle.style.backgroundColor = 'rgba(255,255,255,.2)';
      lastMousePosition.x = e.offsetX;
      lastMousePosition.y = e.offsetY;
      simulationUniforms.brushPosition.value.x = lastMousePosition.x / variables.canvas.width.value * window.devicePixelRatio;
      simulationUniforms.brushPosition.value.y = 1 - lastMousePosition.y / variables.canvas.height.value * window.devicePixelRatio;
    }
  });

  // End mouse drag, make indicator circle transparent
  canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    reticleCircle.style.backgroundColor = 'rgba(255,255,255,0)';

    simulationUniforms.brushPosition.value.x = -1;
    simulationUniforms.brushPosition.value.y = -1;
  });

  // Adjust brush radius using the mouse wheel
  window.addEventListener('wheel', (e) => {
    if(e.deltaY > 0) {
      increaseBrushRadius();
    } else {
      decreaseBrushRadius();
    }
  });

  // Keep the indicator circle aligned with the mouse as it moves.
  canvas.addEventListener('mousemove', (e) => {
    mouseIsMoving = true;

    clearTimeout(mouseMovementTimer);

    mouseMovementTimer = setTimeout(() => {
      mouseIsMoving = false;
    }, 100);

    // Align the reticle and crosshairs with the mouse position.
    lastMousePosition.x = e.offsetX;
    lastMousePosition.y = e.offsetY;
    alignReticle();
    alignCrosshairs();

    // Hide the crosshairs, since those are meant for keyboard users.
    hideCrosshairs();

    // If the left mouse button is down, pass the mouse's X/Y position to the frag shader
    if(mouseDown) {
      simulationUniforms.brushPosition.value.x = lastMousePosition.x / variables.canvas.width.value * window.devicePixelRatio;
      simulationUniforms.brushPosition.value.y = 1 - lastMousePosition.y / variables.canvas.height.value * window.devicePixelRatio;
    } else {
      simulationUniforms.brushPosition.value.x = -1;
      simulationUniforms.brushPosition.value.y = -1;
    }
  });

  // Show the circle indicator when the mouse enters the canvas bounds.
  canvas.addEventListener('mouseenter', () => {
    showReticle();
  });

  // Hide the circle indicator when the mouse leaves the canvas bounds.
  canvas.addEventListener('mouseleave', () => {
    hideReticle();

    // Disable the brush in the simulation shader so it doesn't get stuck in an "active" state on mouseleave
    simulationUniforms.brushPosition.value.x = -1;
    simulationUniforms.brushPosition.value.y = -1;
  });

  //===================================
  //  Setup keyboard controls
  //===================================
  canvas.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowUp':
        arrowKeysDown.up = true;
        break;

      case 'ArrowDown':
        arrowKeysDown.down = true;
        break;

      case 'ArrowLeft':
        arrowKeysDown.left = true;
        break;

      case 'ArrowRight':
        arrowKeysDown.right = true;
        break;

      case 'Shift':
        shiftKeyDown = true;
        break;

      case 'Control':
        ctrlKeyDown = true;
        break;

      case 'b':
      case 'B':
        paintKeyDown = true;
        reticleCircle.style.backgroundColor = 'rgba(255,255,255,.2)';
        break;
    }
  });

  canvas.addEventListener('keyup', (e) => {
    switch(e.key) {
      case 'ArrowUp':
        arrowKeysDown.up = false;
        break;

      case 'ArrowDown':
        arrowKeysDown.down = false;
        break;

      case 'ArrowLeft':
        arrowKeysDown.left = false;
        break;

      case 'ArrowRight':
        arrowKeysDown.right = false;
        break;

      case 'Shift':
        shiftKeyDown = false;
        break;

      case 'Control':
        ctrlKeyDown = false;
        break;

      case 'b':
      case 'B':
        paintKeyDown = false;
        reticleCircle.style.backgroundColor = 'rgba(255,255,255,0)';
        simulationUniforms.brushPosition.value.x = -1;
        simulationUniforms.brushPosition.value.y = -1;
        break;
    }
  });

  //===================================
  //  Show/hide the crosshairs when
  //  the canvas gets or loses focus
  //===================================
  canvas.addEventListener('focus', () => {
    canvasIsFocused = true;
    showCrosshairs();
  });

  canvas.addEventListener('blur',  () => {
    canvasIsFocused = false;
    hideCrosshairs();

    // Unset all pressed keys so they don't get "stuck"
    paintKeyDown = false;
    shiftKeyDown = false;
    ctrlKeyDown = false;
    arrowKeysDown.left = false;
    arrowKeysDown.right = false;
    arrowKeysDown.up = false;
    arrowKeysDown.down = false;
  });
}

//=====================================
//  Keyboard controls
//=====================================
export function updateBrushUsingKeyboard() {
  let xDelta = 0,
      yDelta = 0;

  // Left and right arrows have no alternative functions, so they can move the brush directly.
  if(arrowKeysDown.left)  { xDelta -= stepSize; }
  if(arrowKeysDown.right) { xDelta += stepSize; }

  // Up arrow moves brush up or increases the brush size when Ctrl is pressed.
  if(arrowKeysDown.up) {
    if(ctrlKeyDown) {
      increaseBrushRadius();
    } else {
      yDelta -= stepSize;
    }
  }

  // Down arrow moves brush down or decreases the brush size when Ctrl is pressed.
  if(arrowKeysDown.down) {
    if(ctrlKeyDown) {
      decreaseBrushRadius();
    } else {
      yDelta += stepSize;
    }
  }

  // Move faster using larger steps when Shift is pressed.
  if(shiftKeyDown) {
    xDelta *= stepSizeMultiplier;
    yDelta *= stepSizeMultiplier;
  }

  let newX = lastMousePosition.x + xDelta,
      newY = lastMousePosition.y + yDelta,
      rightSide = canvas.width / window.devicePixelRatio,
      bottomSide = canvas.height / window.devicePixelRatio;

  // Clamp crosshairs to the canvas bounds.
  if(newX > rightSide) { newX = rightSide; }
  else if(newX < 0) { newX = 0; }

  if(newY > bottomSide) { newY = bottomSide; }
  else if(newY < 0) { newY = 0; }

  if(lastMousePosition.x != newX || lastMousePosition.y != newY) {
    alignReticle();
    alignCrosshairs();

    showCrosshairs();
    showReticle();

    // Handle horizontal movement
    if(lastMousePosition.x != newX) {
      lastMousePosition.x = newX;
    }

    // Handle vertical movement.
    if(lastMousePosition.y != newY) {
      lastMousePosition.y = newY;
    }
  }

  // If the "paint" key is down, pass the tracked X/Y position to the frag shader
  if(paintKeyDown) {
    simulationUniforms.brushPosition.value.x = lastMousePosition.x / variables.canvas.width.value * (1/variables.canvas.scale.value) * window.devicePixelRatio;
    simulationUniforms.brushPosition.value.y = 1 - lastMousePosition.y / variables.canvas.height.value * window.devicePixelRatio;
  }
}

//=====================================
//  Brush radius functions
//=====================================
export function increaseBrushRadius() {
  if(simulationUniforms.brushRadius.value + brushStepSize < 100) {
    const adjustedBrushStepSize = ctrlKeyDown ? brushStepSize/10 : brushStepSize;
    simulationUniforms.brushRadius.value += adjustedBrushStepSize;
    refreshReticle();
  }
}

export function decreaseBrushRadius() {
  if(simulationUniforms.brushRadius.value - brushStepSize > brushStepSize) {
    const adjustedBrushStepSize = ctrlKeyDown ? brushStepSize/10 : brushStepSize;
    simulationUniforms.brushRadius.value -= adjustedBrushStepSize;
    refreshReticle();
  }
}

//=====================================
//  Crosshair functions
//=====================================
function alignCrosshairs() {
  xAxisCrosshair.style.top = lastMousePosition.y + 'px';
  yAxisCrosshair.style.left = lastMousePosition.x + 'px';
}

export function showCrosshairs() {
  xAxisCrosshair.style.display = 'block';
  yAxisCrosshair.style.display = 'block';
}

export function hideCrosshairs() {
  xAxisCrosshair.style.display = 'none';
  yAxisCrosshair.style.display = 'none';
}

//=====================================
//  Reticle functions
//=====================================
export function refreshReticle() {
  // Resize and reticle circle and re-align it with the mouse.
  if(reticleCircle !== undefined) {
    reticleCircle.style.width = (((simulationUniforms.brushRadius.value * 2) / window.devicePixelRatio) * (1/variables.canvas.scale.value)) + 'px';
    reticleCircle.style.height = (((simulationUniforms.brushRadius.value * 2) / window.devicePixelRatio) * (1/variables.canvas.scale.value)) + 'px';
    alignReticle();
  }

  // Align the crosshairs with the mouse
  if(xAxisCrosshair !== undefined && yAxisCrosshair !== undefined) {
    alignCrosshairs();
  }
}

function alignReticle() {
  reticleCircle.style.left = ((lastMousePosition.x - simulationUniforms.brushRadius.value / window.devicePixelRatio) * (1/variables.canvas.scale.value)) + 'px';
  reticleCircle.style.top = ((lastMousePosition.y - simulationUniforms.brushRadius.value / window.devicePixelRatio) * (1/variables.canvas.scale.value) ) + 'px';
}

function showReticle() {
  reticleCircle.style.display = 'block';
}

function hideReticle() {
  reticleCircle.style.display = 'none';
}