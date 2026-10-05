/**
 * AudioStreamer
 * Handles receiving 24kHz raw 16-bit PCM audio chunks from Gemini Live,
 * precise gapless AudioContext scheduling, interruption handling,
 * and audio analysis for visualizer animations.
 */

export class AudioStreamer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private nextStartTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isPlaying: boolean = false;
  private checkPlayingTimeout: any = null;

  public onSpeakingChange?: (isSpeaking: boolean) => void;

  constructor() {
    // AudioContext will be lazily initialized on user interaction
  }

  private initAudioContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass({ sampleRate: 24000 });
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioCtx;
  }

  /**
   * Enqueue a base64-encoded 24kHz 16-bit PCM audio chunk
   */
  public addPCM16Chunk(base64Chunk: string): void {
    const ctx = this.initAudioContext();
    if (!this.analyser) return;

    try {
      // Decode base64 to binary
      const binaryString = atob(base64Chunk);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 16-bit PCM little endian to Float32
      const numSamples = Math.floor(len / 2);
      if (numSamples === 0) return;

      const int16Array = new Int16Array(bytes.buffer, bytes.byteOffset, numSamples);
      const float32Array = new Float32Array(numSamples);

      for (let i = 0; i < numSamples; i++) {
        const s = int16Array[i];
        float32Array[i] = s < 0 ? s / 0x8000 : s / 0x7FFF;
      }

      // Create AudioBuffer at 24000 Hz
      const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      // Create BufferSourceNode
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.analyser);

      const currentTime = ctx.currentTime;
      // If nextStartTime is in the past, reset to currentTime + small jitter safety buffer
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime + 0.05;
      }

      const scheduledTime = this.nextStartTime;
      source.start(scheduledTime);
      this.nextStartTime += audioBuffer.duration;

      this.activeSources.push(source);

      // Update speaking state
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.onSpeakingChange?.(true);
      }

      source.onended = () => {
        const index = this.activeSources.indexOf(source);
        if (index > -1) {
          this.activeSources.splice(index, 1);
        }
        this.checkPlaybackEnded();
      };
    } catch (err) {
      console.error('AudioStreamer error processing chunk:', err);
    }
  }

  private checkPlaybackEnded(): void {
    if (this.checkPlayingTimeout) {
      clearTimeout(this.checkPlayingTimeout);
    }

    this.checkPlayingTimeout = setTimeout(() => {
      if (this.activeSources.length === 0 && this.audioCtx) {
        if (this.audioCtx.currentTime >= this.nextStartTime - 0.05) {
          this.isPlaying = false;
          this.onSpeakingChange?.(false);
        }
      }
    }, 100);
  }

  /**
   * Stop all active sources and clear buffer queue immediately (e.g. on interruption)
   */
  public stop(): void {
    if (this.checkPlayingTimeout) {
      clearTimeout(this.checkPlayingTimeout);
    }
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // ignore already stopped
      }
    }
    this.activeSources = [];
    this.nextStartTime = 0;
    if (this.isPlaying) {
      this.isPlaying = false;
      this.onSpeakingChange?.(false);
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  public async close(): Promise<void> {
    this.stop();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      await this.audioCtx.close();
      this.audioCtx = null;
      this.analyser = null;
    }
  }
}
