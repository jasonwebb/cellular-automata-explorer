
let helpDialogTriggerButton,
    helpDialog, closeButton, dialogContent,
    firstFocusableElement, lastFocusableElement,
    keyboardListener;

export function setupHelpDialog() {
  helpDialogTriggerButton = document.querySelector('.help-button');
  helpDialog = document.getElementById('help-dialog');
  closeButton = helpDialog.querySelector('.close-button');
  dialogContent = helpDialog.querySelector('.content');
  firstFocusableElement = closeButton;
  lastFocusableElement = closeButton;

  closeButton.addEventListener('click', hideHelpDialog);

  helpDialog.addEventListener('click', (e) => {
    if(!dialogContent.contains(e.target)) {
      hideHelpDialog();
    }
  });
}

export function showHelpDialog() {
  helpDialog.classList.add('is-visible');
  closeButton.focus();

  keyboardListener = dialogContent.addEventListener('keydown', (e) => {
    if(e.key == 'Escape') {
      hideHelpDialog();
    } else if(e.key == 'Tab') {
      if(document.activeElement == lastFocusableElement && !e.shiftKey) {
        firstFocusableElement.focus();
      } else if(document.activeElement == firstFocusableElement && e.shiftKey) {
        lastFocusableElement.focus();
      }
    }
  });
}

export function hideHelpDialog() {
  dialogContent.removeEventListener('keydown', keyboardListener);
  helpDialog.classList.remove('is-visible');
  helpDialogTriggerButton.focus();
}