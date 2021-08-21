import { displayUniforms, simulationUniforms } from '../uniforms';
import variables from '../variables';
import { createGroup, createSlider, createCheckbox } from './components';

export function createHistoryGroup() {
  let group = createGroup('History');

  window.addEventListener('ruleUpdated', () => {
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

        window.dispatchEvent(new Event('ruleUpdated'));
      })
    );

    if(variables.activeRule.historyEnabled) {
      // Number of generations (history) slider
      group.appendChild(
        createSlider('Number of generations', 1, 500, 1, 1, (e) => {
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
        createCheckbox('Cyclic', true, (e) => {
          variables.activeRule.cyclicEnabled = e.target.checked;
          simulationUniforms.cyclicEnabled.value = variables.activeRule.cyclicEnabled;
        })
      );
    }
  });

  return group;
}