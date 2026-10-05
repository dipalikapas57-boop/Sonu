/**
 * AudioRecorder for Sumo AI (সুমো এআই)
 * Ultra-stable, zero-sound, low-latency 16kHz PCM audio capture.
 * Features:
 * - Persistent, stable audio context (no needless start/stop cycling)
 * - Anti-flicker: never restarts whole system on small glitches; uses gentle resume
 * - Single-instance listener lock (no duplicate getUserMedia streams)
 * - Zero beep / zero notification tones on start/stop
 * - Fast PCM16 chunk delivery with minimal latency
 * - Real-time Voice Activity Detection (VAD) tracking
 */

export class AudioRecorder {
  private mediaStream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private silentGain: GainNode | null = null;
  private isRecording: boolean = false;
  private isStarting: boolean = false;
  private isMuted: boolean = false;
  private speechActive: boolean = false;
  private speechEndTimer: any = null;

  public onAudioData?: (base64PCM: string) => void;
  public onVolumeChange?: (rms: number) => void;
  public onSpeechStateChange?: (isSpeaking: boolean) => void;

  /**
   * Start recording with singleton guard & low latency
   */
  public async start(): Promise<void> {
    if (this.isRecording || this.isStarting) {
      // If already active, verify audio context is running smoothly
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume().catch(() => {});
      }
      return;
    }

    this.isStarting = true;

    try {
      // Re-use active mediaStream if valid and tracks are live
      if (!this.mediaStream || !this.mediaStream.active || this.mediaStream.getAudioTracks().every(t => t.readyState === 'ended')) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
            sampleRate: 16000,
          },
        });
      }

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass({ sampleRate: 16000 });
      }

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Clean up previous processor nodes if hanging
      if (this.processorNode) {
        try {
          this.processorNode.disconnect();
        } catch {}
        this.processorNode = null;
      }
      if (this.sourceNode) {
        try {
          this.sourceNode.disconnect();
        } catch {}
        this.sourceNode = null;
      }

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      // 1024 or 2048 buffer: 2048 gives stable ~128ms packets at 16kHz
      this.processorNode = this.audioCtx.createScriptProcessor(2048, 1, 1);

      this.processorNode.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!this.isRecording || this.isMuted) {
          this.onVolumeChange?.(0);
          return;
        }

        const inputBuffer = e.inputBuffer.getChannelData(0);
        const len = inputBuffer.length;

        // Calculate RMS volume for speech activity detection
        let sumSquares = 0;
        for (let i = 0; i < len; i++) {
          sumSquares += inputBuffer[i] * inputBuffer[i];
        }
        const rms = Math.sqrt(sumSquares / len);
        this.onVolumeChange?.(rms);

        // Track voice activity state
        if (rms > 0.04) {
          if (!this.speechActive) {
            this.speechActive = true;
            this.onSpeechStateChange?.(true);
          }
          if (this.speechEndTimer) {
            clearTimeout(this.speechEndTimer);
            this.speechEndTimer = null;
          }
        } else if (this.speechActive && !this.speechEndTimer) {
          this.speechEndTimer = setTimeout(() => {
            this.speechActive = false;
            this.onSpeechStateChange?.(false);
            this.speechEndTimer = null;
          }, 800);
        }

        // Convert Float32 to Int16 PCM Little-Endian
        const int16Array = new Int16Array(len);
        for (let i = 0; i < len; i++) {
          const s = Math.max(-1, Math.min(1, inputBuffer[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Fast base64 conversion without huge string concatenation spikes
        const uint8 = new Uint8Array(int16Array.buffer);
        let binary = '';
        const chunkLen = uint8.byteLength;
        for (let i = 0; i < chunkLen; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binary);

        this.onAudioData?.(base64);
      };

      this.sourceNode.connect(this.processorNode);

      // Connect processor to silent gain to keep it alive in Chrome/Safari
      if (!this.silentGain) {
        this.silentGain = this.audioCtx.createGain();
        this.silentGain.gain.value = 0;
      }
      this.processorNode.connect(this.silentGain);
      this.silentGain.connect(this.audioCtx.destination);

      this.isRecording = true;
    } catch (err) {
      console.warn('[AudioRecorder] Failed to start cleanly, recovering quietly:', err);
      throw err;
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * Quiet session recovery on minor audio context freeze/interruption
   */
  public async recover(): Promise<void> {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (e) {
        console.warn('[AudioRecorder] Context resume error:', e);
      }
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getIsSpeechActive(): boolean {
    return this.speechActive;
  }

  /**
   * Stop cleanly without audible clicks or restart thrashes
   */
  public stop(): void {
    this.isRecording = false;
    this.speechActive = false;
    if (this.speechEndTimer) {
      clearTimeout(this.speechEndTimer);
      this.speechEndTimer = null;
    }

    if (this.processorNode) {
      try {
        this.processorNode.onaudioprocess = null;
        this.processorNode.disconnect();
      } catch {}
      this.processorNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch {}
      this.mediaStream = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }

    this.silentGain = null;
    this.onVolumeChange?.(0);
    this.onSpeechStateChange?.(false);
  }
}
