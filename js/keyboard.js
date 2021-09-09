//==============================================================
//  KEYBOARD CONTROLS
//==============================================================

import { showHelpDialog } from './helpDialog';
import { drawPattern } from './patterns';
import { setupRenderTargets } from './renderTargets';
import { toggleUI } from './ui';
import variables from './variables';

export function setupKeyboard() {
  window.addEventListener('keydown', function(e) {
    switch(e.key) {
      case ' ':
        e.preventDefault();
        variables.isPaused = !variables.isPaused;
        window.dispatchEvent(new Event('rebuildUI'));
        break;

      case 'r':
        setupRenderTargets();
        drawPattern();
        break;

      case 'u':
        toggleUI();
        break;

      case 'h':
        showHelpDialog();
        break;
    }
  });
}