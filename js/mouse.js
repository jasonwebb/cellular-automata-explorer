//==============================================================
//  MOUSE CONTROLS
//==============================================================

import { simulationUniforms } from './uniforms';
import { canvas } from './entry';
import variables from './variables';

let mouseFollower, mouseDown;

export function setupMouse() {
  mouseDown = false;

  // Create a floating circle that follows the mouse cursor to indicate the current size of the brush
  mouseFollower = document.createElement('div');
  mouseFollower.classList.add('mouse-follower');
  mouseFollower.style.content = '';
  mouseFollower.style.width = (simulationUniforms.brushRadius.value * 2) + 'px';
  mouseFollower.style.height = (simulationUniforms.brushRadius.value * 2) + 'px';
  mouseFollower.style.position = 'absolute';
  mouseFollower.style.border = '1px solid white';
  mouseFollower.style.borderRadius = '1000px';
  mouseFollower.style.boxShadow = '0 0 0 2px rgba(0,0,0,.4)'
  mouseFollower.style.pointerEvents = 'none';
  document.body.append(mouseFollower);

  // Begin drag, fill indicator circle white
  canvas.addEventListener('mousedown', (e) => {
    if(e.button == 0) {
      mouseDown = true;
      mouseFollower.style.backgroundColor = 'rgba(255,255,255,.2)';

      alignMouseFollower(e);
    }
  });

  // End drag, make indicator circle transparent
  canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    mouseFollower.style.backgroundColor = 'rgba(255,255,255,0)';

    simulationUniforms.mousePosition.value.x = -1;
    simulationUniforms.mousePosition.value.y = -1;
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
  window.addEventListener('mousemove', (e) => {
    alignMouseFollower(e);
  });
}

function alignMouseFollower(e = null) {
  const newX = e.clientX,
      newY = e.clientY,
      leftSide = window.innerWidth/2 - canvas.width/2,
      rightSide = window.innerWidth/2 + canvas.width/2,
      topSide = window.innerHeight/2 - canvas.height/2,
      bottomSide = window.innerHeight/2 + canvas.height/2;

  // Only align the indicator circle with the mouse inside the <canvas> element
  if(newX > leftSide && newX < rightSide && newY > topSide && newY < bottomSide) {
    mouseFollower.style.display = 'block';
    mouseFollower.style.top = (e.clientY - simulationUniforms.brushRadius.value * (1/variables.canvas.scale.value)) + 'px';
    mouseFollower.style.left = (e.clientX - simulationUniforms.brushRadius.value * (1/variables.canvas.scale.value)) + 'px';

    // If the left mouse button is down, pass the mouse's X/Y position to the frag shader
    if(mouseDown) {
      simulationUniforms.mousePosition.value.x = e.offsetX / variables.canvas.width.value;
      simulationUniforms.mousePosition.value.y = 1 - e.offsetY / variables.canvas.height.value;
    }
  } else {
    mouseFollower.style.display = 'none';
  }
}

export function setBrushSize(e = null) {
  // Resize the brush indicator circle
  mouseFollower.style.width = (simulationUniforms.brushRadius.value * 2 * (1/variables.canvas.scale.value)) + 'px';
  mouseFollower.style.height = (simulationUniforms.brushRadius.value * 2 * (1/variables.canvas.scale.value)) + 'px';

  // Realign the brush indicator circle with the mouse cursor
  alignMouseFollower(e);
}