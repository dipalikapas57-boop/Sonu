/**
 * WakeWordService for SUMO AI
 * Listens for "SUMO" / "সুমো".
 * Strict stability rules:
 * - Debounces rapid triggers (2500ms threshold) to prevent duplicate calls
 * - Quiet session recovery on minor pauses without thrashing SpeechRecognition
 * - Zero beep or notification sounds
 */

export class WakeWordService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSupported: boolean = false;
  private isGuruVoiceVerified: boolean = true;
  private lastTriggerTime: number = 0;

  public onSumoWake?: (isAuthorized: boolean) => void;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'bn-BD';

      this.recognition.onresult = (event: any) => {
        const now = Date.now();
        // Prevent duplicate trigger within 2.5 seconds
        if (now - this.lastTriggerTime < 2500) {
          return;
        }

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();

          // Check for "SUMO" or "সুমো"
          if (
            transcript.includes('sumo') ||
            transcript.includes('সুমো') ||
            transcript.includes('শুমো')
          ) {
            this.lastTriggerTime = now;
            console.log('[SUMO WakeWord] Wake word confirmed, triggering quietly');
            this.onSumoWake?.(this.isGuruVoiceVerified);
            break;
          }
        }
      };

      this.recognition.onerror = (e: any) => {
        // Quietly ignore normal pauses or no-speech events without crashing
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          console.warn('[WakeWord quiet error handler]', e.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Graceful delayed restart without thrashing
          setTimeout(() => {
            if (this.isListening) {
              try {
                this.recognition.start();
              } catch {}
            }
          }, 300);
        }
      };
    }
  }

  public setGuruVerification(verified: boolean): void {
    this.isGuruVoiceVerified = verified;
  }

  public getIsGuruVerified(): boolean {
    return this.isGuruVoiceVerified;
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public start(): void {
    if (!this.isSupported || this.isListening) return;
    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e) {
      console.warn('[SUMO WakeWord] Start warning:', e);
    }
  }

  public stop(): void {
    if (!this.isSupported || !this.isListening) return;
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch {}
  }
}
