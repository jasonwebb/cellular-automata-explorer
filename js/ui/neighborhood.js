import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupNeighborhoodPanel() {
  let panel = createPanel('Neighborhood');
  panelsWrapper.appendChild(panel);

  // Type (Moore or von Neumann)
  panel.appendChild(
    createDropdown('Type', ['von Neumann', 'Moore'], () => {
      console.log('changed neighborhood type');
    })
  );

  // Range (number)
  panel.appendChild(
    createSlider('Range', 1, 10, 1, () => {
      console.log('range changed');
    })
  );

  // Edge wrapping (checkbox)
  panel.appendChild(
    createCheckbox('Wrap edges', false, () => {
      console.log('wrap edge changed');
    })
  );
}