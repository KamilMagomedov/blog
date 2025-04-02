export const getFullPath = (address: string): string => {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
};
