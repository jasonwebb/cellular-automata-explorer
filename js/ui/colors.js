import { createPanel, createDropdown, createButton, createSlider, createCheckbox } from './components';
import { panelsWrapper } from '../ui';

export function setupColorsPanel() {
  let panel = createPanel('Colors');
  panelsWrapper.appendChild(panel);
}