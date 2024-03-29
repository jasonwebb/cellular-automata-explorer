import { createGroup, createSlider, createCheckbox } from './components';
import { displayUniforms, simulationUniforms } from '../uniforms';
import variables from '../variables';

export function createHistoryGroup() {
  let group = createGroup('History');

  window.addEventListener('rebuildUI', () => {
    // Get rid of any previously-added components
    group.querySelectorAll('.component').forEach((component) => {
      component.remove();
    });

    // Enable checkbox
    group.appendChild(
      createCheckbox('Enable history', variables.activeRule.historyEnabled, (e) => {
        variables.activeRule.historyEnabled = e.target.checked;
        simulationUniforms.historyEnabled.value = variables.activeRule.historyEnabled;
        displayUniforms.historyEnabled.value = simulationUniforms.historyEnabled.value;

        window.dispatchEvent(new Event('rebuildUI'));
      })
    );

    if(variables.activeRule.historyEnabled) {
      // Number of generations (history) slider
      group.appendChild(
        createSlider('Number of generations', variables.history.numberOfGenerations.min, variables.history.numberOfGenerations.max, variables.history.numberOfGenerations.stepSize, variables.activeRule.stateCount, (e) => {
          variables.activeRule.stateCount =  2 + e.target.value;
          simulationUniforms.stateCount.value = variables.activeRule.stateCount;

          /**
          // Adjust the length of the colors array to match the new state count
          if(variables.activeRule.stateCount < colors.length) {
            colors.splice(variables.activeRule.stateCount, colors.length - variables.activeRule.stateCount);
          } else if(variables.activeRule.stateCount > colors.length) {
            while(colors.length < variables.activeRule.stateCount) {
              colors.push(colors[colors.length-1]);
            }
          }
          */
        })
      );

      // Cyclic checkbox
      group.appendChild(
        createCheckbox('Cyclic', variables.activeRule.cyclicEnabled, (e) => {
          variables.activeRule.cyclicEnabled = e.target.checked;
          simulationUniforms.cyclicEnabled.value = variables.activeRule.cyclicEnabled;
        })
      );

      // TODO: add "max cycles"
    }
  });

  return group;
}