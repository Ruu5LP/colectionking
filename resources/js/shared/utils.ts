// Helper function to validate image URL
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
