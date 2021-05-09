export const formatTime = (time: number): string => {
  const minutes = Math.floor((time / 60) % 60);
  const seconds = time - minutes * 60;

  return `${minutes}m ${seconds < 10 ? 0 : ''}${seconds}s`;
};
