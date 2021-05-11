import { useEffect } from 'react';

export const useScreenWakeLock = (): void => {
  useEffect(() => {
    if (!navigator.wakeLock || window.innerWidth > 768 || document.body.clientWidth > 768) return;

    const wakeLockPromise = navigator.wakeLock.request('screen');

    const unFocus = () => wakeLockPromise.then((wakeLock) => wakeLock.release());

    window.addEventListener('blur', unFocus);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('blur', unFocus);
      wakeLockPromise.then((wakeLock) => wakeLock.release());
    };
  });
};
