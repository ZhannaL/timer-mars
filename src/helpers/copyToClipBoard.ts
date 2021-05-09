export const copyToClipboard = (textToCopy: string): void => {
  const body = document.getElementsByTagName('body')[0];
  const tempInput = document.createElement('input');
  body.appendChild(tempInput);
  tempInput.setAttribute('value', textToCopy);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  body.removeChild(tempInput);
};
