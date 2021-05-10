export const copyToClipboard = (textToCopy: string, ref?: HTMLDivElement): void => {
  const body = ref ?? document.getElementsByTagName('body')[0];
  const tempInput = document.createElement('input');
  body.appendChild(tempInput);
  tempInput.setAttribute('value', `${String(textToCopy)}`);
  tempInput.focus();
  tempInput.select();
  tempInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  body.removeChild(tempInput);
};
