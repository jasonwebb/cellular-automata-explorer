import { createPanel } from './ui/components';

import { createHistoryGroup } from './ui/history';
import { createBirthGroup } from './ui/birth';
import { createControlsGroup } from './ui/controls';
import { createRulesGroup } from './ui/rules';
import { createNeighborhoodGroup } from './ui/neighborhood';
import { createColorsGroup } from './ui/colors';
import { createSurvivalGroup } from './ui/survival';
import { createPatternGroup } from './ui/pattern';
import { createCanvasGroup } from './ui/canvas';
import { showHelpDialog } from './helpDialog';
import { createAnalysisGroup } from './ui/analysis';

let mainWrapper,
    leftPanel, rightPanel, centerControlsWrapper,
    toggleUIButton;
export let isUIVisible = true;

export function setupUI() {
  mainWrapper = document.querySelector('main');

  setupLeftPanel();
  setupCenterControls();
  setupRightPanel();
}

  function setupLeftPanel() {
    leftPanel = createPanel();
    leftPanel.classList.add('is-docked-left');

    leftPanel.appendChild(createRulesGroup());
    leftPanel.appendChild(createBirthGroup());
    leftPanel.appendChild(createSurvivalGroup());
    leftPanel.appendChild(createNeighborhoodGroup());
    leftPanel.appendChild(createHistoryGroup());
    leftPanel.appendChild(createAnalysisGroup());

    mainWrapper.appendChild(leftPanel);
  }

  function setupRightPanel() {
    rightPanel = createPanel();
    rightPanel.classList.add('is-docked-right');

    rightPanel.appendChild(createColorsGroup());
    rightPanel.appendChild(createPatternGroup());
    rightPanel.appendChild(createCanvasGroup());
    rightPanel.appendChild(createControlsGroup());

    mainWrapper.appendChild(rightPanel);
  }

  function setupCenterControls() {
    centerControlsWrapper = document.createElement('div');
    centerControlsWrapper.classList.add('center-controls', 'has-left-indent');

    // Show/hide UI button
    toggleUIButton = document.createElement('button');
    toggleUIButton.setAttribute('aria-label', 'Hide UI');
    toggleUIButton.setAttribute('aria-pressed', false);
    toggleUIButton.classList.add('toggle-ui-button');
    toggleUIButton.innerHTML = `
      <span class="fas fa-eye" aria-hidden="true"></span>
      <span class="fas fa-eye-slash" aria-hidden="true"></span>
      <span class="hide">Hide UI</span>
      <span class="show">Show UI</span>
    `;

    toggleUIButton.addEventListener('click', () => {
      toggleUI();
    });

    // About button
    let aboutButton = document.createElement('button');
    aboutButton.classList.add('help-button');
    aboutButton.setAttribute('title', 'Learn more about this app');
    aboutButton.innerHTML = '<span class="fas fa-question" aria-hidden="true"></span><span class="sr-only">Learn more about this app</span>';

    aboutButton.addEventListener('click', showHelpDialog);

    // Github link
    let githubLink = document.createElement('a');
    githubLink.setAttribute('href', 'https://github.com/jasonwebb/cellular-automata-explorer');
    githubLink.setAttribute('target', '_blank');
    githubLink.setAttribute('title', 'See the source code on Github');
    githubLink.classList.add('github-link');
    githubLink.innerHTML = '<span class="fab fa-github" aria-hidden="true"></span><span class="sr-only">See the source code on Github</span>';

    centerControlsWrapper.appendChild(toggleUIButton);
    centerControlsWrapper.appendChild(aboutButton);
    centerControlsWrapper.appendChild(githubLink);

    mainWrapper.appendChild(centerControlsWrapper);
  }

export function toggleUI() {
  if(isUIVisible) {
    hideUI();
  } else {
    showUI();
  }
}

  export function hideUI() {
    leftPanel.classList.add('is-offscreen');
    rightPanel.classList.add('is-offscreen');

    setTimeout(() => {
      leftPanel.classList.add('is-hidden');
      rightPanel.classList.add('is-hidden');
      isUIVisible = false;
    }, 200);

    centerControlsWrapper.classList.remove('has-left-indent');
    toggleUIButton.setAttribute('aria-pressed', true);
  }

  export function showUI() {
    leftPanel.classList.remove('is-hidden');
    rightPanel.classList.remove('is-hidden');

    setTimeout(() => {
      leftPanel.classList.remove('is-offscreen');
      rightPanel.classList.remove('is-offscreen');
      isUIVisible = true;
    }, 1);

    centerControlsWrapper.classList.add('has-left-indent');
    toggleUIButton.setAttribute('aria-pressed', false);
  }