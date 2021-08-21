//==============================================================
//  KEYBOARD CONTROLS
//==============================================================

import globals from './globals';
import { drawPattern } from './patterns';
import { setupRenderTargets } from './renderTargets';

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
    }
  });
}