import { createPanel } from './ui/components';

import { createStatesGroup } from './ui/states';
import { createBirthGroup } from './ui/birth';
import { createControlsGroup } from './ui/controls';
import { createRulesGroup } from './ui/rules';
import { createNeighborhoodGroup } from './ui/neighborhood';
import { createColorsGroup } from './ui/colors';
import { createSurvivalGroup } from './ui/survival';
import { createPatternGroup } from './ui/pattern';

let leftPanel, rightPanel;

export function setupUI() {
  setupLeftPanel();
  setupRightPanel();
}

  function setupLeftPanel() {
    leftPanel = createPanel();
    leftPanel.style.left = '20px';

    leftPanel.appendChild(createBirthGroup());
    leftPanel.appendChild(createSurvivalGroup());
    leftPanel.appendChild(createNeighborhoodGroup());
    leftPanel.appendChild(createStatesGroup());

    document.body.appendChild(leftPanel);
  }

  function setupRightPanel() {
    rightPanel = createPanel();
    rightPanel.style.right = '20px';

    rightPanel.appendChild(createColorsGroup());
    rightPanel.appendChild(createPatternGroup());
    rightPanel.appendChild(createRulesGroup());
    rightPanel.appendChild(createControlsGroup());

    document.body.appendChild(rightPanel);
  }