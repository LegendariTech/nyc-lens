import synonymsData from './synonyms.json';

// Build synonym map for quick lookup
const synonymMap = new Map<string, string[]>();

// Initialize the synonym map
synonymsData.forEach((synonymGroup) => {
  const synonyms = synonymGroup.split(',').map(s => s.toLowerCase().trim());
  synonyms.forEach((synonym) => {
    synonymMap.set(synonym, synonyms);
  });
});

export interface TextMatch {
  start: number;
  length: number;
}

/**
 * Check if a text word matches a query word (including synonyms and partial matches)
 */
function wordMatches(textWord: string, queryWord: string, isLastQueryWord: boolean): boolean {
  const normalizedTextWord = textWord.toLowerCase();
  const normalizedQueryWord = queryWord.toLowerCase();

  // Exact match
  if (normalizedTextWord === normalizedQueryWord) {
    return true;
  }

  // Partial match (only for last query word - for progressive typing)
  if (isLastQueryWord && normalizedTextWord.startsWith(normalizedQueryWord)) {
    return true;
  }

  // Check synonyms
  const synonyms = synonymMap.get(normalizedQueryWord) || [];
  if (synonyms.includes(normalizedTextWord)) {
    return true;
  }

  // Check if text word is a synonym and partially matches (for last word)
  if (isLastQueryWord) {
    for (const synonym of synonyms) {
      if (synonym.startsWith(normalizedQueryWord)) {
        // The query matches the beginning of a synonym, check if text word is that synonym
        if (normalizedTextWord === synonym) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Find a match in text, considering synonyms
 * @param text - The text to search in
 * @param query - The query to search for
 * @returns Match position and length, or null if no match found
 */
export function findMatchInText(text: string, query: string): TextMatch | null {
  if (!text || !query) {
    return null;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();

  // First, try direct match (substring)
  const directMatch = normalizedText.indexOf(normalizedQuery);
  if (directMatch !== -1) {
    return { start: directMatch, length: normalizedQuery.length };
  }

  // Split into words for synonym matching
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);

  if (queryWords.length === 0) {
    return null;
  }

  // Split text into words, keeping track of positions
  const words: Array<{ text: string; start: number; length: number }> = [];
  let currentWord = '';
  let wordStart = 0;

  for (let i = 0; i <= text.length; i++) {
    const char = text[i];
    const isWordChar = char && /\S/.test(char);

    if (isWordChar) {
      if (currentWord.length === 0) {
        wordStart = i;
      }
      currentWord += char;
    } else if (currentWord.length > 0) {
      words.push({
        text: currentWord,
        start: wordStart,
        length: currentWord.length
      });
      currentWord = '';
    }
  }

  // Try to match the query words sequence in the text
  for (let startIdx = 0; startIdx < words.length; startIdx++) {
    let matchedWords = 0;
    let matchEnd = startIdx;
    let isLastWordPartial = false;
    let partialMatchLength = 0;

    // Try to match all query words starting from this position
    for (let qi = 0; qi < queryWords.length && matchEnd < words.length; qi++) {
      const queryWord = queryWords[qi];
      const isLastQueryWord = qi === queryWords.length - 1;
      const textWord = words[matchEnd].text;

      if (wordMatches(textWord, queryWord, isLastQueryWord)) {
        matchedWords++;

        // Check if this is a partial match on the last query word
        if (isLastQueryWord && textWord.toLowerCase().startsWith(queryWord) &&
          textWord.toLowerCase() !== queryWord) {
          isLastWordPartial = true;
          partialMatchLength = queryWord.length;
        }

        matchEnd++;
      } else {
        break;
      }
    }

    // If we matched all query words, return the span
    if (matchedWords === queryWords.length) {
      const firstWord = words[startIdx];
      const lastWord = words[matchEnd - 1];

      // If last word was a partial match, only include the matched portion
      if (isLastWordPartial) {
        return {
          start: firstWord.start,
          length: (lastWord.start + partialMatchLength) - firstWord.start
        };
      }

      return {
        start: firstWord.start,
        length: (lastWord.start + lastWord.length) - firstWord.start
      };
    }
  }

  return null;
}

/**
 * Get all synonyms for a given word
 * @param word - The word to find synonyms for
 * @returns Array of synonyms (including the word itself)
 */
export function getSynonyms(word: string): string[] {
  const normalized = word.toLowerCase().trim();
  return synonymMap.get(normalized) || [];
}

