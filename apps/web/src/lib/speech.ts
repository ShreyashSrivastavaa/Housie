import { VoiceMode, getEnglishWord, getHindiWord } from '@housie/shared';

export interface SpeechSettings {
  soundEnabled: boolean;
  voiceMode: VoiceMode;
  volume: number; // 0 to 100
  rate?: number; // 0.8 to 1.2
}

class SpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.isLoaded = this.voices.length > 0;
  }

  public getHindiVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.loadVoices();
    // Search for Hindi voice
    return (
      this.voices.find(
        (v) =>
          v.lang.toLowerCase().includes('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.lang.toLowerCase() === 'hi-in'
      ) || null
    );
  }

  public getEnglishVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.loadVoices();
    return (
      this.voices.find(
        (v) =>
          v.lang.toLowerCase().includes('en-in') ||
          v.lang.toLowerCase().includes('en-gb') ||
          v.lang.toLowerCase().includes('en-us') ||
          v.lang.toLowerCase().startsWith('en')
      ) || null
    );
  }

  public announceNumber(num: number, settings: SpeechSettings) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!settings.soundEnabled || settings.volume <= 0) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const vol = Math.min(1, Math.max(0, settings.volume / 100));
    const rate = settings.rate || 0.95;

    const enWord = getEnglishWord(num);
    const hiWord = getHindiWord(num);

    const hiVoice = this.getHindiVoice();
    const enVoice = this.getEnglishVoice();

    if (settings.voiceMode === VoiceMode.EN) {
      const utterance = new SpeechSynthesisUtterance(`Number ${num}. ${enWord}.`);
      if (enVoice) utterance.voice = enVoice;
      utterance.volume = vol;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } else if (settings.voiceMode === VoiceMode.HI) {
      if (hiVoice) {
        const utterance = new SpeechSynthesisUtterance(`नंबर ${num}. ${hiWord.devanagari}.`);
        utterance.voice = hiVoice;
        utterance.lang = 'hi-IN';
        utterance.volume = vol;
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback to English phonetic
        const utterance = new SpeechSynthesisUtterance(`Number ${num}. ${hiWord.transliteration}.`);
        if (enVoice) utterance.voice = enVoice;
        utterance.volume = vol;
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // HI_EN Bilingual mode
      if (hiVoice) {
        const hiUtterance = new SpeechSynthesisUtterance(`नंबर ${num}. ${hiWord.devanagari}.`);
        hiUtterance.voice = hiVoice;
        hiUtterance.lang = 'hi-IN';
        hiUtterance.volume = vol;
        hiUtterance.rate = rate;

        const enUtterance = new SpeechSynthesisUtterance(`${enWord}.`);
        if (enVoice) enUtterance.voice = enVoice;
        enUtterance.volume = vol;
        enUtterance.rate = rate;

        window.speechSynthesis.speak(hiUtterance);
        window.speechSynthesis.speak(enUtterance);
      } else {
        const utterance = new SpeechSynthesisUtterance(
          `Number ${num}. ${hiWord.transliteration}. ${enWord}.`
        );
        if (enVoice) utterance.voice = enVoice;
        utterance.volume = vol;
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
      }
    }
  }
}

export const speechEngine = new SpeechEngine();
