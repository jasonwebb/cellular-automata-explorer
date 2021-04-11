import { createPanel, createDropdown } from './ui/components';

let drawerWrapper, drawer, panelsWrapper;

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
  setupStates();
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

  function setupControlsPanel() {
    let panel = createPanel('Controls');
    panelsWrapper.appendChild(panel);

    // Play/pause button
    // Speed slider
    // Restart button
  }

  function setupRulesPanel() {
    let panel = createPanel('Rules');
    panelsWrapper.appendChild(panel);

    // Dropdown for presets
    panel.appendChild( createDropdown('Preset', ['hello'], () => {
      console.log('changed');
    }));

    // If custom, show text input
  }

  function setupSurvivalPanel() {
    let panel = createPanel('Survival');
    panelsWrapper.appendChild(panel);
  }

  function setupBirthPanel() {
    let panel = createPanel('Birth');
    panelsWrapper.appendChild(panel);
  }

  function setupStates() {
    let panel = createPanel('States');
    panelsWrapper.appendChild(panel);

    // Number of states
    // Cyclic (checkbox)
  }

  function setupNeighborhoodPanel() {
    let panel = createPanel('Neighborhood');
    panelsWrapper.appendChild(panel);

    // Type (Moore or von Neumann)
    // Range (number)
    // Edge wrapping (checkbox)
  }

  function setupPatternPanel() {
    let panel = createPanel('Starting pattern');
    panelsWrapper.appendChild(panel);

    // Dropdown for patterns
  }

  function setupColorsPanel() {
    let panel = createPanel('Colors');
    panelsWrapper.appendChild(panel);
  }