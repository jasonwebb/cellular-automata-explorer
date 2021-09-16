import { createGroup, createRow, createButton, createToggleButton, createSlider, createCheckbox, createSeperator, createTextInput } from './components';
import { drawPattern } from '../patterns';
import { setupRenderTargets } from '../renderTargets';
import variables from '../variables';
import { iterate } from '../entry';

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

    // Row for laying out Pause and Restart buttons horizontally
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


    // Row for laying out step controls horizontally
    let stepButtonsRow = createRow();
    stepButtonsRow.classList.add('step-controls-row');

      // Set of 1/10/100 buttons on the left
      let stepNumbersWrapper = document.createElement('div');
      stepNumbersWrapper.classList.add('step-numbers');

        let stepOneButton = createButton('+1', false, () => {
          iterate(1);
        });
        stepOneButton.querySelector('button').setAttribute('aria-label', 'Step 1 generation');
        stepOneButton.querySelector('button').setAttribute('title', 'Step 1 generation');

        let stepTenButton = createButton('+10', false, () => {
          iterate(10);
        });
        stepTenButton.querySelector('button').setAttribute('aria-label', 'Step 10 generations');
        stepTenButton.querySelector('button').setAttribute('title', 'Step 10 generations');

        let stepHundredButton = createButton('+100', false, () => {
          iterate(100);
        });
        stepHundredButton.querySelector('button').setAttribute('aria-label', 'Step 100 generations');
        stepHundredButton.querySelector('button').setAttribute('title', 'Step 100 generations');

        stepNumbersWrapper.appendChild(stepOneButton);
        stepNumbersWrapper.appendChild(stepTenButton);
        stepNumbersWrapper.appendChild(stepHundredButton);

      // Text input and Run button on the right
      let customStepsWrapper = document.createElement('div');
      customStepsWrapper.classList.add('custom-steps');

        let customStepTextInput = createTextInput('Steps', '1000', () => {});
        customStepTextInput.querySelector('label').classList.add('sr-only');

        let customStepButton = createButton('Run', false, () => {
          const steps = customStepTextInput.querySelector('input').value;
          iterate(steps);
        });

        customStepsWrapper.appendChild(customStepTextInput);
        customStepsWrapper.appendChild(customStepButton);

      stepButtonsRow.appendChild(stepNumbersWrapper);
      stepButtonsRow.appendChild(customStepsWrapper);
      group.appendChild(stepButtonsRow);
  });

  return group;
}