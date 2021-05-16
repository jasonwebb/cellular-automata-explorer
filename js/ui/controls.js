import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupControlsPanel() {
  let panel = createPanel('Controls');
  panelsWrapper.appendChild(panel);

  // Play/pause button
  panel.appendChild(
    createButton('Pause', () => {
      console.log('pressed');
    })
  );

  // Speed slider
  panel.appendChild(
    createSlider('Speed', 0.1, 2.0, .1, () => {
      console.log('speed changed');
    })
  );

  // Restart button
  panel.appendChild(
    createButton('Restart', () => {
      console.log('restart');
    })
  );
}