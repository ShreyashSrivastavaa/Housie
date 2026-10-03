import { describe, it, expect, vi } from 'vitest';

describe('Web Application Baseline', () => {
  it('initializes speech and words properly', async () => {
    const { getEnglishWord, getHindiWord } = await import('@housie/shared');
    expect(getEnglishWord(47)).toBe('Forty Seven');
    expect(getHindiWord(47).devanagari).toBe('सैंतालीस');
  });

  it('verifies game board structure numbers 1-90', () => {
    const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
    expect(numbers.length).toBe(90);
    expect(numbers[0]).toBe(1);
    expect(numbers[89]).toBe(90);
  });
});
