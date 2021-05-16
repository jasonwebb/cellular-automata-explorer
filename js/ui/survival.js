import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupSurvivalPanel() {
  let panel = createPanel('Survival');
  panelsWrapper.appendChild(panel);
}