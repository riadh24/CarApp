// Date utilities
export const parseDate = (dateString) => {
  if (!dateString) return null;
  try {
    let normalizedDate = dateString;
    
    if (dateString.includes('/')) {
      normalizedDate = dateString.replace(/\//g, '-');
    }
    
    const date = new Date(normalizedDate);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to parse date:', dateString, error);
    }
    return null;
  }
};
