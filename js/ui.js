import { setupStatesPanel } from './ui/states';
import { setupBirthPanel } from './ui/birth';
import { setupControlsPanel } from './ui/controls';
import { setupRulesPanel } from './ui/rules';
import { setupNeighborhoodPanel } from './ui/neighborhood';
import { setupColorsPanel } from './ui/colors';
import { setupSurvivalPanel } from './ui/survival';
import { setupPatternPanel } from './ui/pattern';

let drawerWrapper, drawer;
export let panelsWrapper;

export function setupUI() {
  drawerWrapper = document.createElement('div');
  drawerWrapper.classList.add('drawer');
  document.body.appendChild(drawerWrapper);

  drawer = document.createElement('div');
  drawer.classList.add('drawer-inner-wrapper');
  drawerWrapper.appendChild(drawer);

  panelsWrapper = document.createElement('div');
  panelsWrapper.classList.add('panels-wrapper');

  setupDrawerControls();

  drawer.appendChild(panelsWrapper);

  setupControlsPanel();
  setupRulesPanel();
  setupSurvivalPanel();
  setupBirthPanel();
  setupStatesPanel();
  setupNeighborhoodPanel();
  setupPatternPanel();
  setupColorsPanel();
}

  function setupDrawerControls() {
    const resizeBar = document.createElement('button');
    resizeBar.classList.add('resize-button');
    resizeBar.innerHTML = `
      <span class="fas fa-bars" aria-hidden="true"></span>
      <span class="sr-only">Resize drawer</span>
    `;
    drawer.appendChild(resizeBar);

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-button');
    toggleButton.setAttribute('aria-expanded', true);
    toggleButton.innerHTML = `
      Controls
      <span class="fas fa-caret-up" aria-hidden="true"></span>
    `;
    drawer.appendChild(toggleButton);
  }