import { createGroup, createRow, createButton, createToggleButton, createSlider, createCheckbox, createSeperator } from './components';
import { drawPattern } from '../patterns';
import { setupRenderTargets } from '../renderTargets';
import variables from '../variables';

export function createControlsGroup() {
  let group = createGroup('Controls');

  window.addEventListener('rebuildUI', () => {
    // Get rid of any previously-added components
    group.querySelectorAll('.component, .row').forEach((component) => {
      component.remove();
    });

    // Speed slider
    group.appendChild(
      createSlider('Speed', variables.controls.speed.min, variables.controls.speed.max, variables.controls.speed.stepSize, variables.controls.speed.value, (e) => {
        variables.controls.speed.value = e.target.value;
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
    `, variables.isPaused, () => {
      variables.isPaused = !variables.isPaused;
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
  });

  return group;
}