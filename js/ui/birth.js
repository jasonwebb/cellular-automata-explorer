import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupBirthPanel() {
  let panel = createPanel('Birth');
  panelsWrapper.appendChild(panel);
}