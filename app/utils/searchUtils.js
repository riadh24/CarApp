
export const extractUniqueValues = (items, field) => {
  return [...new Set(items.map(item => item[field]?.toLowerCase()).filter(Boolean))];
};


export const getProperCase = (items, field, value) => {
  return items.find(item => item[field]?.toLowerCase() === value)?.[field] || '';
};


export const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};


const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};


export const createSmartSearchFilter = (searchText, availableMakes, availableModels, allVehicles) => {
  if (!searchText?.trim()) {
    return { make: '', model: '' };
  }
  
  const lowerText = searchText.toLowerCase().trim();
  
  // 1. Exact make match
  const exactMake = availableMakes.find(make => make === lowerText);
  if (exactMake) {
    return { make: getProperCase(allVehicles, 'make', exactMake), model: '' };
  }
  
  // 2. Exact model match
  const exactModel = availableModels.find(model => model === lowerText);
  if (exactModel) {
    return { make: '', model: getProperCase(allVehicles, 'model', exactModel) };
  }
  
  // 3. Partial make match (contains)
  const partialMake = availableMakes.find(make => make.includes(lowerText) || lowerText.includes(make));
  if (partialMake) {
    return { make: getProperCase(allVehicles, 'make', partialMake), model: '' };
  }
  
  // 4. Partial model match (contains)
  const partialModel = availableModels.find(model => model.includes(lowerText) || lowerText.includes(model));
  if (partialModel) {
    return { make: '', model: getProperCase(allVehicles, 'model', partialModel) };
  }
  
  // 5. Fuzzy matching (similarity > 0.7)
  const fuzzyMake = availableMakes
    .map(make => ({ make, similarity: calculateSimilarity(make, lowerText) }))
    .filter(item => item.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity)[0];
    
  if (fuzzyMake) {
    return { make: getProperCase(allVehicles, 'make', fuzzyMake.make), model: '' };
  }
  
  const fuzzyModel = availableModels
    .map(model => ({ model, similarity: calculateSimilarity(model, lowerText) }))
    .filter(item => item.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity)[0];
    
  if (fuzzyModel) {
    return { make: '', model: getProperCase(allVehicles, 'model', fuzzyModel.model) };
  }
  
  // 6. Fallback: use as general search term (let Redux filter handle it)
  return { make: searchText.trim(), model: '' };
};


export const getSearchSuggestions = (input, availableMakes, availableModels, maxSuggestions = 5) => {
  if (!input?.trim()) return [];
  
  const lowerInput = input.toLowerCase();
  const suggestions = [];
  
  // Add matching makes
  const matchingMakes = availableMakes
    .filter(make => make.includes(lowerInput))
    .map(make => ({ type: 'make', value: make, display: `Make: ${make}` }));
  
  // Add matching models
  const matchingModels = availableModels
    .filter(model => model.includes(lowerInput))
    .map(model => ({ type: 'model', value: model, display: `Model: ${model}` }));
  
  suggestions.push(...matchingMakes, ...matchingModels);
  
  // Sort by relevance (exact match first, then by length)
  suggestions.sort((a, b) => {
    const aExact = a.value.startsWith(lowerInput) ? 0 : 1;
    const bExact = b.value.startsWith(lowerInput) ? 0 : 1;
    
    if (aExact !== bExact) return aExact - bExact;
    return a.value.length - b.value.length;
  });
  
  return suggestions.slice(0, maxSuggestions);
};
