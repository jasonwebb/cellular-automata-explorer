import { colors } from '../colors';
import { simulationUniforms } from '../uniforms';
import variables from '../variables';
import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';

export function createStatesGroup() {
  let group = createGroup('States');

  // Number of states
  group.appendChild(
    createSlider('Number of states', 2, 500, 1, 2, (e) => {
      variables.activeRule.stateCount = e.target.value;
      simulationUniforms.stateCount.value = variables.activeRule.stateCount;

      // Adjust the length of the colors array to match the new state count
      if(variables.activeRule.stateCount < colors.length) {
        colors.splice(variables.activeRule.stateCount, colors.length - variables.activeRule.stateCount);
      } else if(variables.activeRule.stateCount > colors.length) {
        while(colors.length < variables.activeRule.stateCount) {
          colors.push(colors[colors.length-1]);
        }
      }

      window.dispatchEvent(new Event('ruleUpdated'));
    })
  );

  // Cyclic (checkbox)
  group.appendChild(
    createCheckbox('Cyclic', false, () => {
      console.log('cyclic changed');
    })
  );

  return group;
}