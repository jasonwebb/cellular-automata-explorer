import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupPatternPanel() {
  let panel = createPanel('Starting pattern');
  panelsWrapper.appendChild(panel);

  // Dropdown for patterns
  panel.appendChild(
    createDropdown('Starting pattern', ['test'], () => {
      console.log('starting pattern changed');
    })
  );
}