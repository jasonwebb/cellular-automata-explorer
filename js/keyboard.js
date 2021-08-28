//==============================================================
//  KEYBOARD CONTROLS
//==============================================================

import { drawPattern } from './patterns';
import { setupRenderTargets } from './renderTargets';
import { toggleUI } from './ui';
import globals from './globals';

export function setupKeyboard() {
  window.addEventListener('keydown', function(e) {
    switch(e.key) {
      case ' ':
        e.preventDefault();
        globals.isPaused = !globals.isPaused;
        break;

      case 'r':
        setupRenderTargets();
        drawPattern();
        break;

      case 'u':
        toggleUI();
        break;
    }
  });
}