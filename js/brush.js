//==============================================================
//  BRUSH CONTROLS
//==============================================================

import { simulationUniforms } from './uniforms';
import { canvas } from './entry';
import variables from './variables';

export let mouseIsMoving;

let canvasWrapper,
    brushIndicator,
    xAxisCrosshair,
    yAxisCrosshair,
    position = {},
    mouseDown,
    mouseMovementTimer,
    paintKeyDown,
    shiftKeyDown,
    arrowKeysDown = {},
    stepSize = 1,
    stepSizeMultiplier = 5;

export function setupBrushIndicator() {
  canvasWrapper = document.querySelector('.canvas-wrapper');
  position.x = window.innerWidth/2;
  position.y = window.innerHeight/2;
  mouseDown = false;
  mouseIsMoving = false;
  paintKeyDown = false;
  shiftKeyDown = false;
  arrowKeysDown = {
    left: false,
    right: false,
    up: false,
    down: false
  };

  //=================================================================
  //  Brush indicator
  //=================================================================
  // Create a floating circle that follows the mouse cursor to indicate the current size of the brush
  brushIndicator = document.createElement('div');
  brushIndicator.classList.add('brush-indicator');
  brushIndicator.style = `
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
  canvasWrapper.append(brushIndicator);

  //=================================================================
  //  Crosshairs
  //=================================================================
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

  //=================================================================
  //  Mouse controls
  //=================================================================
  // Begin mouse drag, fill indicator circle white
  canvas.addEventListener('mousedown', (e) => {
    if(e.button == 0) {
      e.preventDefault();
      mouseDown = true;
      brushIndicator.style.backgroundColor = 'rgba(255,255,255,.2)';

      alignBrushWithMouse(e);
    }
  });

  // End mouse drag, make indicator circle transparent
  canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    brushIndicator.style.backgroundColor = 'rgba(255,255,255,0)';

    simulationUniforms.brushPosition.value.x = -1;
    simulationUniforms.brushPosition.value.y = -1;
  });

  // Adjust brush radius using the mouse wheel
  window.addEventListener('wheel', (e) => {
    const wheelStep = e.deltaY/100;

    // Only change the brush radius if it's within these hardcoded limits
    if(simulationUniforms.brushRadius.value + wheelStep > 5 && simulationUniforms.brushRadius.value + wheelStep < 100) {
      simulationUniforms.brushRadius.value += wheelStep;
      setBrushSize(e);
    }
  });

  // Keep the indicator circle aligned with the mouse as it moves.
  canvas.addEventListener('mousemove', (e) => {
    mouseIsMoving = true;

    clearTimeout(mouseMovementTimer);

    mouseMovementTimer = setTimeout(() => {
      mouseIsMoving = false;
    }, 100);

    alignBrushWithMouse(e);
  });

  // Show the circle indicator when the mouse enters the canvas bounds.
  canvas.addEventListener('mouseenter', () => {
    brushIndicator.style.display = 'block';
  });

  // Hide the circle indicator when the mouse leaves the canvas bounds.
  canvas.addEventListener('mouseleave', () => {
    brushIndicator.style.display = 'none';
  });

  //=================================================================
  //  Keyboard controls
  //=================================================================
  // Move the crosshairs and brush circle with arrow keys
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

      case 'b':
        paintKeyDown = true;
        brushIndicator.style.backgroundColor = 'rgba(255,255,255,.2)';
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

      case 'b':
        paintKeyDown = false;
        brushIndicator.style.backgroundColor = 'rgba(255,255,255,0)';
        simulationUniforms.brushPosition.value.x = -1;
        simulationUniforms.brushPosition.value.y = -1;
        break;
    }
  });
}

export function updateBrushPositionUsingKeyboard() {
  let xDelta = 0,
      yDelta = 0;

  if(arrowKeysDown.left)  { xDelta -= stepSize; }
  if(arrowKeysDown.right) { xDelta += stepSize; }
  if(arrowKeysDown.up)    { yDelta -= stepSize; }
  if(arrowKeysDown.down)  { yDelta += stepSize; }

  // Move faster using larger steps when Shift is pressed.
  if(shiftKeyDown) {
    xDelta *= stepSizeMultiplier;
    yDelta *= stepSizeMultiplier;
  }

  let newX = position.x + xDelta,
      newY = position.y + yDelta,
      rightSide = canvas.width / window.devicePixelRatio,
      bottomSide = canvas.height / window.devicePixelRatio;

  // Clamp crosshairs to the canvas bounds.
  if(newX > rightSide) { newX = rightSide; }
  else if(newX < 0) { newX = 0; }

  if(newY > bottomSide) { newY = bottomSide; }
  else if(newY < 0) { newY = 0; }

  // Handle horizontal movement.
  if(position.x != newX) {
    showCrosshairs();
    position.x = newX;
    yAxisCrosshair.style.left = position.x + 'px';

    brushIndicator.style.display = 'block';
    brushIndicator.style.left = ((position.x - simulationUniforms.brushRadius.value) * (1/variables.canvas.scale.value) + 1) + 'px';
  }

  // Handle vertical movement.
  if(position.y != newY) {
    showCrosshairs();
    position.y = newY;
    xAxisCrosshair.style.top = position.y + 'px';

    brushIndicator.style.display = 'block';
    brushIndicator.style.top = ((position.y - simulationUniforms.brushRadius.value) * (1/variables.canvas.scale.value) + 1) + 'px';
  }

  // If the "paint" key is down, pass the tracked X/Y position to the frag shader
  if(paintKeyDown) {
    simulationUniforms.brushPosition.value.x = position.x / variables.canvas.width.value * (1/variables.canvas.scale.value) * window.devicePixelRatio;
    simulationUniforms.brushPosition.value.y = 1 - position.y / variables.canvas.height.value * window.devicePixelRatio;
  }
}

function alignBrushWithMouse(e = null) {
  position.x = e != null ? e.offsetX : 0;
  position.y = e != null ? e.offsetY : 0;

  // Hide the crosshairs, since they are more useful to keyboard users, and this function will only be called for mouse users.
  hideCrosshairs();

  // Align the (hidden) crosshairs to the mouse position so that if the user switches to keyboard control the transition is seamless.
  xAxisCrosshair.style.top = position.y + 'px';
  yAxisCrosshair.style.left = position.x + 'px';

  // Align the circle indicator to the mouse position.
  brushIndicator.style.top = (position.y - simulationUniforms.brushRadius.value * (1/variables.canvas.scale.value)) + 'px';
  brushIndicator.style.left = (position.x - simulationUniforms.brushRadius.value * (1/variables.canvas.scale.value)) + 'px';

  // If the left mouse button is down, pass the mouse's X/Y position to the frag shader
  if(mouseDown) {
    simulationUniforms.brushPosition.value.x = position.x / variables.canvas.width.value * window.devicePixelRatio;
    simulationUniforms.brushPosition.value.y = 1 - position.y / variables.canvas.height.value * window.devicePixelRatio;
  }
}

export function setBrushSize(e = null) {
  // Resize the brush indicator circle
  brushIndicator.style.width = (simulationUniforms.brushRadius.value * 2 * (1/variables.canvas.scale.value)) + 'px';
  brushIndicator.style.height = (simulationUniforms.brushRadius.value * 2 * (1/variables.canvas.scale.value)) + 'px';

  // Realign the brush indicator circle with the mouse cursor
  alignBrushWithMouse(e);
}

export function showCrosshairs() {
  xAxisCrosshair.style.display = 'block';
  yAxisCrosshair.style.display = 'block';
}

export function hideCrosshairs() {
  xAxisCrosshair.style.display = 'none';
  yAxisCrosshair.style.display = 'none';
}

export function setBrushPosition(x, y) {
  if(!xAxisCrosshair && !yAxisCrosshair && !brushIndicator) {
    return;
  }

  position.x = x;
  position.y = y;

  xAxisCrosshair.style.top = position.y + 'px';
  yAxisCrosshair.style.left = position.x + 'px';

  brushIndicator.style.left = ((position.x - simulationUniforms.brushRadius.value) * (1/variables.canvas.scale.value) + 1) + 'px';
  brushIndicator.style.top = ((position.y - simulationUniforms.brushRadius.value) * (1/variables.canvas.scale.value) + 1) + 'px';
}