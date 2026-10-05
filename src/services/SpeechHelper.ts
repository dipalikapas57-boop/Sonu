/**
 * SpeechHelper
 * Provides instantaneous spoken audio for "জি গুরু, বলুন।"
 * using Web Speech API SpeechSynthesis with Bengali voice.
 */

export class SpeechHelper {
  public static speakJiGuru(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance('জি গুরু, বলুন।');
      utterance.lang = 'bn-BD';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Find Bengali voice if available
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  public static speakDenied(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('অপরিচিত কণ্ঠ শনাক্ত হয়েছে। আমি শুধুমাত্র আমার গুরুর আদেশে সাড়া দিই।');
      utterance.lang = 'bn-BD';
      utterance.rate = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }
}
