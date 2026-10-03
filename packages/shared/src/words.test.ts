import { describe, it, expect } from 'vitest';
import { getEnglishWord, ENGLISH_NUMBER_WORDS } from './words/english.js';
import { getHindiWord, HINDI_NUMBER_WORDS } from './words/hindi.js';

describe('Number to Words (1 to 90)', () => {
  it('has exact mappings for all 90 numbers in English', () => {
    for (let i = 1; i <= 90; i++) {
      expect(ENGLISH_NUMBER_WORDS[i]).toBeDefined();
      expect(typeof ENGLISH_NUMBER_WORDS[i]).toBe('string');
      expect(getEnglishWord(i)).toBe(ENGLISH_NUMBER_WORDS[i]);
    }
  });

  it('has exact mappings for all 90 numbers in Hindi (Devanagari & Transliteration)', () => {
    for (let i = 1; i <= 90; i++) {
      const details = HINDI_NUMBER_WORDS[i];
      expect(details).toBeDefined();
      expect(details?.devanagari).toBeTruthy();
      expect(details?.transliteration).toBeTruthy();
      expect(getHindiWord(i)).toEqual(details);
    }
  });

  it('verifies critical milestone Hindi numbers', () => {
    expect(getHindiWord(1).devanagari).toBe('एक');
    expect(getHindiWord(19).transliteration).toBe('Unnees');
    expect(getHindiWord(47).devanagari).toBe('सैंतालीस');
    expect(getHindiWord(89).transliteration).toBe('Nawaasi');
    expect(getHindiWord(90).devanagari).toBe('नब्बे');
  });

  it('throws on numbers outside 1..90 range', () => {
    expect(() => getEnglishWord(0)).toThrow();
    expect(() => getEnglishWord(91)).toThrow();
    expect(() => getEnglishWord(45.5)).toThrow();

    expect(() => getHindiWord(0)).toThrow();
    expect(() => getHindiWord(91)).toThrow();
    expect(() => getHindiWord(-5)).toThrow();
  });
});
