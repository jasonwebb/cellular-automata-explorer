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

let leftPanel, rightPanel;

export function setupUI() {
  setupLeftPanel();
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

    document.body.appendChild(leftPanel);
  }

  function setupRightPanel() {
    rightPanel = createPanel();
    rightPanel.classList.add('is-docked-right');

    rightPanel.appendChild(createColorsGroup());
    rightPanel.appendChild(createPatternGroup());
    rightPanel.appendChild(createCanvasGroup());
    rightPanel.appendChild(createControlsGroup());

    document.body.appendChild(rightPanel);
  }