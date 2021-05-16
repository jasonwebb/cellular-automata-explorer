import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupStatesPanel() {
  let panel = createPanel('States');
  panelsWrapper.appendChild(panel);

  // Number of states
  panel.appendChild(
    createSlider('Number of states', 2, 500, 1, () => {
      console.log('state number changed');
    })
  );

  // Cyclic (checkbox)
  panel.appendChild(
    createCheckbox('Cyclic', false, () => {
      console.log('cyclic changed');
    })
  );
}