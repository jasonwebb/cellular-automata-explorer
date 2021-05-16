import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupRulesPanel() {
  let panel = createPanel('Rules');
  panelsWrapper.appendChild(panel);

  // Dropdown for presets
  panel.appendChild(
    createDropdown('Preset', ['hello'], () => {
      console.log('changed');
    })
  );

  // If custom, show text input
}