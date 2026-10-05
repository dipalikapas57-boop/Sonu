/**
 * LiveSession for Sumo AI (সুমো এআই)
 * Ultra-stable, responsive, friendly AI microphone session.
 * 
 * Strict Microphone & Voice Rules:
 * - Stable persistent session: no rapid ON/OFF flickering
 * - Steady mic stream during user speech
 * - Zero artificial beeps / notification tones on start or stop
 * - Single microphone listener guard (no duplicates)
 * - Quiet session recovery on minor pauses/glitches
 * - Non-interruptive: does not cut off user while user is speaking
 * - Command deduplication within 3s threshold
 * - Low-latency audio transmission for instant friendly responses
 */

import { AudioRecorder } from './AudioRecorder';
import { AudioStreamer } from './AudioStreamer';
import { LiveState, SumoEmotion, ToolCallAction, VoiceOption } from '../types';

export interface LiveSessionOptions {
  voice?: VoiceOption;
  onStateChange?: (state: LiveState) => void;
  onEmotionChange?: (emotion: SumoEmotion) => void;
  onToolCall?: (action: ToolCallAction) => void;
  onInputVolume?: (volume: number) => void;
  onError?: (error: string) => void;
}

export class LiveSession {
  private ws: WebSocket | null = null;
  private recorder: AudioRecorder;
  private streamer: AudioStreamer;
  private state: LiveState = 'disconnected';
  private voice: VoiceOption = 'Aoede';
  private emotion: SumoEmotion = 'confident';
  private isMuted: boolean = false;
  private isConnecting: boolean = false;
  private options: LiveSessionOptions;
  private recentActions: Map<string, number> = new Map();

  constructor(options: LiveSessionOptions = {}) {
    this.options = options;
    if (options.voice) this.voice = options.voice;

    this.recorder = new AudioRecorder();
    this.streamer = new AudioStreamer();

    // Stream recorded audio directly to backend WebSocket
    this.recorder.onAudioData = (base64PCM: string) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'audio', data: base64PCM }));
      }
    };

    // Live volume indicator
    this.recorder.onVolumeChange = (rms: number) => {
      this.options.onInputVolume?.(rms);
    };

    // Handle user speech state
    this.recorder.onSpeechStateChange = (isSpeaking: boolean) => {
      if (isSpeaking && this.state === 'speaking') {
        // Natural user interruption: stop model playback when user speaks
        this.streamer.stop();
        this.setState('listening');
      }
    };

    // Streamer playback transitions (speaking vs listening)
    this.streamer.onSpeakingChange = (isSpeaking: boolean) => {
      if (this.state === 'connecting' || this.state === 'disconnected') return;
      if (isSpeaking) {
        this.setState('speaking');
      } else {
        this.setState('listening');
      }
    };
  }

  public getState(): LiveState {
    return this.state;
  }

  public getEmotion(): SumoEmotion {
    return this.emotion;
  }

  public getStreamer(): AudioStreamer {
    return this.streamer;
  }

  public getRecorder(): AudioRecorder {
    return this.recorder;
  }

  public setVoice(voice: VoiceOption): void {
    this.voice = voice;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'config', voice }));
    }
  }

  public getVoice(): VoiceOption {
    return this.voice;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.recorder.setMuted(this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setState(newState: LiveState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.options.onStateChange?.(newState);
    }
  }

  public setEmotion(emotion: SumoEmotion): void {
    this.emotion = emotion;
    this.options.onEmotionChange?.(emotion);
  }

  /**
   * Connect to server & initialize voice session with single-lock protection
   */
  public async connect(): Promise<void> {
    if (this.isConnecting || this.state === 'listening' || this.state === 'speaking') {
      // Already running, calmly verify audio context health
      await this.recorder.recover();
      return;
    }

    this.isConnecting = true;
    this.setState('connecting');

    try {
      // Start microphone stream quietly
      await this.recorder.start();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live-ws`;

      if (this.ws) {
        try {
          this.ws.close();
        } catch {}
        this.ws = null;
      }

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.ws?.send(JSON.stringify({
          type: 'start',
          voice: this.voice,
        }));
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'ready':
              this.setState('listening');
              break;

            case 'audio':
              if (msg.data) {
                // If user is actively talking loudly into mic, don't overlap playback abruptly
                if (!this.recorder.getIsSpeechActive() || this.state === 'speaking') {
                  this.streamer.addPCM16Chunk(msg.data);
                }
              }
              break;

            case 'interrupted':
              this.streamer.stop();
              this.setState('listening');
              break;

            case 'toolCall':
              if (msg.name) {
                // Deduplicate tool calls within 3 seconds
                const actionKey = `${msg.name}:${JSON.stringify(msg.args || {})}`;
                const now = Date.now();
                const lastTime = this.recentActions.get(actionKey) || 0;

                if (now - lastTime < 3000) {
                  console.log('[LiveSession] Deduplicating action:', actionKey);
                  return;
                }
                this.recentActions.set(actionKey, now);

                const action: ToolCallAction = {
                  id: msg.id || Math.random().toString(),
                  name: msg.name,
                  args: msg.args || {},
                  timestamp: now,
                };

                this.options.onToolCall?.(action);
              }
              break;

            case 'error':
              console.warn('[LiveSession server note]', msg.message);
              // Gracefully handle without full restart
              this.recorder.recover();
              break;
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[LiveSession] Network bump, attempting calm recovery:', err);
        // Do not thrash unless critical
        this.recorder.recover();
      };

      this.ws.onclose = () => {
        if (this.state !== 'disconnected') {
          this.disconnect();
        }
      };
    } catch (err: any) {
      console.error('Failed to start LiveSession:', err);
      let errorMsg = 'মাইক্রোফোন পারমিশন প্রয়োজন।';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'মাইক্রোফোন পারমিশন বন্ধ আছে। অনুগ্রহ করে ব্রাউজার সেটিংসে অনুমতি দিন।';
      }
      this.options.onError?.(errorMsg);
      this.disconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect and clean up resources quietly without pops/beeps
   */
  public disconnect(): void {
    this.isConnecting = false;
    this.recorder.stop();
    this.streamer.stop();

    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'stop' }));
        }
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    this.setState('disconnected');
  }

  public updateOptions(options: Partial<LiveSessionOptions>): void {
    this.options = { ...this.options, ...options };
  }
}
