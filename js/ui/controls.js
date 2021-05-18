import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { drawPattern } from '../patterns';
import { setupRenderTargets } from '../renderTargets';
import globals from '../globals';

export function createControlsGroup() {
  let group = createGroup('Controls');

  // Play/pause button
  group.appendChild(
    createCheckbox('Paused', globals.isPaused, () => {
      globals.isPaused = !globals.isPaused;
    })
  );

  // Speed slider
  group.appendChild(
    createSlider('Speed', 0.1, 2.0, .1, 1.0, () => {
      console.log('speed changed');
    })
  );

  // Restart button
  group.appendChild(
    createButton('Restart', () => {
      console.log('restart');
      setupRenderTargets();
      drawPattern();
    })
  );

  return group;
}