
let aboutDialogTriggerButton,
    aboutDialog, closeButton, dialogContent,
    firstFocusableElement, lastFocusableElement,
    keyboardListener;

export function setupAboutDialog() {
  aboutDialogTriggerButton = document.querySelector('.about-button');
  aboutDialog = document.getElementById('about-dialog');
  closeButton = aboutDialog.querySelector('.close-button');
  dialogContent = aboutDialog.querySelector('.content');
  firstFocusableElement = closeButton;
  lastFocusableElement = closeButton;

  closeButton.addEventListener('click', hideAboutDialog);

  aboutDialog.addEventListener('click', (e) => {
    if(!dialogContent.contains(e.target)) {
      hideAboutDialog();
    }
  });
}

export function showAboutDialog() {
  aboutDialog.classList.add('is-visible');
  closeButton.focus();

  keyboardListener = dialogContent.addEventListener('keydown', (e) => {
    // Escape to close
    if(e.key == 'Escape') {
      hideAboutDialog();

    // Trap keyboard focus when Tab or Shift+Tab is used
    } else if(e.key == 'Tab') {
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

export function hideAboutDialog() {
  dialogContent.removeEventListener('keydown', keyboardListener);
  aboutDialog.classList.remove('is-visible');
  aboutDialogTriggerButton.focus();
}