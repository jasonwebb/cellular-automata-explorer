import { createGroup, createRow, createButton, createToggleButton, createSlider, createCheckbox, createSeperator } from './components';
import { drawPattern } from '../patterns';
import { setupRenderTargets } from '../renderTargets';
import globals from '../globals';

export function createControlsGroup() {
  let group = createGroup('Controls');

  // Speed slider
  group.appendChild(
    createSlider('Speed', 0.1, 2.0, .1, 1.0, () => {
      console.log('speed changed');
    })
  );

  // Row for laying out buttons horizontally
  let buttonRow = createRow();

  // Pause button
  let pauseButton = createToggleButton(`
    <span class="fas fa-pause" aria-hidden="true"></span>
    <span class="fas fa-play" aria-hidden="true"></span>
    <span class="text pause">Pause</span>
    <span class="text play">Play</span>
  `, globals.isPaused, () => {
    globals.isPaused = !globals.isPaused;
  });

    pauseButton.querySelector('button').setAttribute('aria-label', 'Pause');

  // Restart button
  let restartButton = createButton(`
    <span class="fas fa-sync-alt" aria-hidden="true"></span>
    <span class="text">Restart</span>
  `, false, () => {
    setupRenderTargets();
    drawPattern();
  });

  pauseButton.classList.add('is-control-button');
  restartButton.classList.add('is-control-button');

  pauseButton.querySelector('button').setAttribute('id', 'pause-button');
  restartButton.querySelector('button').setAttribute('id', 'restart-button');

  buttonRow.appendChild(pauseButton);
  buttonRow.appendChild(restartButton);
  group.appendChild(buttonRow);

  return group;
}