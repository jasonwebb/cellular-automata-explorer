import variables from "./variables";

let warningDialog, okayButton,
    keyboardListener;

export function setupSeizureWarningDialog() {
  warningDialog = document.getElementById('seizure-warning-dialog');
  okayButton = warningDialog.querySelector('button');

  okayButton.addEventListener('click', () => {
    hideSeizureWarningDialog();
  });
}

export function showSeizureWarningDialog() {
  variables.isPaused = true;
  warningDialog.classList.add('is-visible');
  okayButton.focus();

  keyboardListener = warningDialog.addEventListener('keydown', (e) => {
    if(e.key == 'Tab') {
      e.preventDefault();
    }
  });
}

export function hideSeizureWarningDialog() {
  variables.isPaused = false;
  warningDialog.classList.remove('is-visible');
  document.body.focus();
}