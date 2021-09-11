let warningDialog, okayButton, dontAskCheckbox,
    keyboardListener, firstFocusableElement, lastFocusableElement

export function setupSeizureWarningDialog() {
  warningDialog = document.getElementById('seizure-warning-dialog');
  okayButton = warningDialog.querySelector('button');
  dontAskCheckbox = warningDialog.querySelector('label input[type="checkbox"]');

  firstFocusableElement = okayButton;
  lastFocusableElement = dontAskCheckbox

  okayButton.addEventListener('click', () => {
    if(dontAskCheckbox.checked) {
      window.localStorage.setItem('skipWarning', true);
    }

    hideSeizureWarningDialog();
  });
}

export function showSeizureWarningDialog() {
  warningDialog.classList.add('is-visible');
  okayButton.focus();

  keyboardListener = warningDialog.addEventListener('keydown', (e) => {
    if(e.key == 'Tab') {
      if(document.activeElement == lastFocusableElement && !e.shiftKey) {
        e.preventDefault();
        firstFocusableElement.focus();
      } else if(document.activeElement == firstFocusableElement && e.shiftKey) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    }
  });
}

export function hideSeizureWarningDialog() {
  warningDialog.classList.remove('is-visible');
  document.body.focus();

  warningDialog.removeEventListener('keydown', keyboardListener);
}