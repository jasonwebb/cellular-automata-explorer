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
  warningDialog.classList.add('is-visible');
  okayButton.focus();

  keyboardListener = warningDialog.addEventListener('keydown', (e) => {
    if(e.key == 'Tab') {
      e.preventDefault();
    }
  });
}

export function hideSeizureWarningDialog() {
  warningDialog.classList.remove('is-visible');
  document.body.focus();

  warningDialog.removeEventListener('keydown', keyboardListener);
}