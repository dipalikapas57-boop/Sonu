import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LiveSession } from './services/LiveSession';
import { WakeWordService } from './services/WakeWordService';
import { VisualizerCore } from './components/VisualizerCore';
import { WaveformCanvas } from './components/WaveformCanvas';
import { SumoHeader } from './components/SumoHeader';
import { ActionHUDCard } from './components/ActionHUDCard';
import { InAppBrowserModal } from './components/InAppBrowserModal';
import { InspirationChips } from './components/InspirationChips';
import { AndroidControlHub } from './components/AndroidControlHub';
import { MemoryBankModal } from './components/MemoryBankModal';
import { CustomCommandsModal } from './components/CustomCommandsModal';
import { RoadmapTracker } from './components/RoadmapTracker';
import { SafetyConfirmModal } from './components/SafetyConfirmModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { GuruSettingsModal } from './components/GuruSettingsModal';
import { BottomNavBar } from './components/BottomNavBar';
import { GuruVoiceprintGuard } from './components/GuruVoiceprintGuard';
import { IntelligentCognitiveLab } from './components/IntelligentCognitiveLab';
import { MatrixRainCanvas } from './components/MatrixRainCanvas';
import { SpeechHelper } from './services/SpeechHelper';
import { 
  LiveState, 
  SumoEmotion, 
  ToolCallAction, 
  WebActionCard, 
  ActiveTimer, 
  VoiceOption, 
  MemoryItem, 
  AndroidAppItem, 
  SafetyConfirmationPrompt, 
  CustomCommand, 
  AndroidNotification, 
  SumoAppTab,
  CognitiveInsight 
} from './types';
import { AlertCircle, Sparkles, Volume2, Shield, Crown, Flame } from 'lucide-react';

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: '1',
    key: 'গুরুর পরিচয়',
    value: 'সুমো এআই-এর সম্মানিত গুরু ও প্রধান নিয়ন্ত্রক।',
    category: 'person',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    key: 'পছন্দের মিউজিক',
    value: 'লো-ফাই (Lofi) ও বাংলা শান্ত মেলোডি গান পছন্দ করেন।',
    category: 'preference',
    timestamp: Date.now() - 7200000,
  },
  {
    id: '3',
    key: 'প্রধান নিয়ম',
    value: 'সব সময় দ্রুত, বুদ্ধিদীপ্ত এবং বাংলায় সাবলীলভাবে উত্তর দিতে হবে।',
    category: 'rule',
    timestamp: Date.now() - 10800000,
  },
];

const INITIAL_COMMANDS: CustomCommand[] = [
  {
    id: 'cmd-1',
    title: 'সকালের রুটিন',
    triggerPhrase: 'সকালের রুটিন',
    description: 'শুভ সকাল অভিবাদন, আজকের তাজা খবর ও লো-ফাই মিউজিক শুরু করে।',
    actions: [
      { type: 'speak', payload: { text: 'শুভ সকাল গুরু! আপনার দিনটি সুন্দর ও সফল হোক।' } },
      { type: 'webSearch', payload: { query: 'আজকের খবর বাংলাদেশ ও বিশ্ব' } },
      { type: 'openApp', payload: { appName: 'youtube', targetUrl: 'https://www.youtube.com/results?search_query=lofi+hip+hop' } },
    ],
  },
  {
    id: 'cmd-2',
    title: 'কাজের সময় (Focus Mode)',
    triggerPhrase: 'কাজের সময়',
    description: '২৫ মিনিটের পোমোডোরো ফোকাস টাইমার চালু করে এবং নোটবুক খোলে।',
    actions: [
      { type: 'speak', payload: { text: 'জি গুরু, ফোকাস মোড সক্রিয় করা হলো। মনোযোগ দিয়ে কাজ করুন!' } },
      { type: 'timer', payload: { seconds: 1500, label: 'Focus Work Session' } },
      { type: 'openApp', payload: { appName: 'notes' } },
    ],
  },
  {
    id: 'cmd-3',
    title: 'আম্মুকে কল দাও',
    triggerPhrase: 'আম্মুকে কল দাও',
    description: 'আম্মুর নাম্বারে ডায়াল করার আগে নিরাপত্তা কনফার্মেশন চায়।',
    actions: [
      { type: 'openApp', payload: { appName: 'dialer' } },
    ],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<SumoAppTab>('voice');
  const [state, setState] = useState<LiveState>('disconnected');
  const [emotion, setEmotion] = useState<SumoEmotion>('confident');
  const [voice, setVoice] = useState<VoiceOption>('Aoede');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guru Profile (V7)
  const [guruName, setGuruName] = useState<string>('গুরু');
  const [honorificMode, setHonorificMode] = useState<'respectful' | 'casual' | 'professional'>('respectful');
  const [userLanguage, setUserLanguage] = useState<'bn' | 'en' | 'auto'>('bn');
  const [isGuruModalOpen, setIsGuruModalOpen] = useState(false);

  // Guru Voice Recognition Guard
  const [isGuruVoiceVerified, setIsGuruVoiceVerified] = useState<boolean>(true);

  // Wake Word (V3)
  const [wakeWordActive, setWakeWordActive] = useState<boolean>(true);
  const wakeWordRef = useRef<WakeWordService | null>(null);

  // Tool Call Actions (V5 & V6)
  const [webCards, setWebCards] = useState<WebActionCard[]>([]);
  const [timers, setTimers] = useState<ActiveTimer[]>([]);
  const [activePreview, setActivePreview] = useState<{ url: string; title: string } | null>(null);

  // Safety Confirmation Modal (V9)
  const [safetyPrompt, setSafetyPrompt] = useState<SafetyConfirmationPrompt | null>(null);

  // Memory System (V4)
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('sumo_memories');
      return stored ? JSON.parse(stored) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  // Custom Commands (V8)
  const [commands, setCommands] = useState<CustomCommand[]>(() => {
    try {
      const stored = localStorage.getItem('sumo_custom_commands');
      return stored ? JSON.parse(stored) : INITIAL_COMMANDS;
    } catch {
      return INITIAL_COMMANDS;
    }
  });

  // Simulated Android Notifications (V5)
  const [notifications, setNotifications] = useState<AndroidNotification[]>([
    {
      id: 'notif-1',
      appName: 'সুমো এআই ব্রেইন',
      title: 'সিস্টেম প্রস্তুত',
      message: 'সবগুলো মডুলার সিস্টেম (V1 থেকে V9) সফলভাবে সক্রিয় হয়েছে।',
      timestamp: Date.now() - 60000,
      priority: 'normal',
      read: false,
    },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Cognitive Superpower Insight State
  const [currentInsight, setCurrentInsight] = useState<CognitiveInsight | null>({
    tone: 'loyal',
    summary: 'গুরুর আদেশের অপেক্ষায় সজাগ। কনটেক্সট ও পরিস্থিতি অনুযায়ী টোন প্রস্তুত।',
    pillar: '👑 Guru Loyalty',
    timestamp: Date.now(),
  });

  // Red & Green Matrix Rain Dropping Effect
  const [matrixRainActive, setMatrixRainActive] = useState<boolean>(true);

  // Active prompt cue banner
  const [speechCue, setSpeechCue] = useState<string | null>(null);

  const sessionRef = useRef<LiveSession | null>(null);
  const lastSumoCallRef = useRef<number>(0);

  // Persist memories
  useEffect(() => {
    try {
      localStorage.setItem('sumo_memories', JSON.stringify(memories));
    } catch {}
  }, [memories]);

  // Persist commands
  useEffect(() => {
    try {
      localStorage.setItem('sumo_custom_commands', JSON.stringify(commands));
    } catch {}
  }, [commands]);

  // Handle incoming tool calls from Gemini Live
  const handleToolCall = useCallback((action: ToolCallAction) => {
    console.log('[Sumo ToolCall Execution]:', action.name, action.args);

    if (action.name === 'openApp') {
      const appName = (action.args.appName || '').toLowerCase();
      let targetUrl = action.args.targetUrl;
      const title = action.args.title || `${action.args.appName} চালু করা হচ্ছে`;

      if (!targetUrl) {
        if (appName.includes('youtube')) targetUrl = 'https://www.youtube.com';
        else if (appName.includes('whatsapp')) targetUrl = 'https://web.whatsapp.com';
        else if (appName.includes('spotify')) targetUrl = 'https://open.spotify.com';
        else if (appName.includes('maps')) targetUrl = 'https://maps.google.com';
        else targetUrl = 'https://www.google.com';
      }

      const newCard: WebActionCard = {
        id: action.id,
        url: targetUrl,
        title,
        reason: 'সুমো এআই অ্যাপ ওয়ার্কফ্লো কার্যকর করেছে',
        timestamp: Date.now(),
      };

      setWebCards((prev) => [newCard, ...prev.slice(0, 2)]);

      try {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Popup blocked, available on HUD card:', e);
      }
    } else if (action.name === 'initiateCall') {
      const contact = action.args.contactName || 'পরিচিত জন';
      const number = action.args.phoneNumber || '017XXXXXXXX';

      // Trigger Safety Confirmation (V9)
      setSafetyPrompt({
        id: action.id,
        type: 'call',
        title: `কল অনুমোদন প্রয়োজন`,
        description: `গুরু, আপনি কি "${contact}" (${number}) নাম্বারে ফোন কল দিতে নিশ্চিত?`,
        contactName: contact,
        phoneNumber: number,
        onConfirm: () => {
          setSafetyPrompt(null);
          // Add notification
          setNotifications((prev) => [
            {
              id: Math.random().toString(),
              appName: 'ফোন ডায়ালার',
              title: 'কল সম্পন্ন',
              message: `"${contact}"-এর কাছে কল সফলভাবে ডায়াল করা হয়েছে।`,
              timestamp: Date.now(),
              priority: 'high',
              read: false,
            },
            ...prev,
          ]);
        },
        onCancel: () => {
          setSafetyPrompt(null);
        },
      });
    } else if (action.name === 'sendSms') {
      const contact = action.args.contactName || 'প্রাপক';
      const text = action.args.message || 'মেসেজ কনটেন্ট';

      // Trigger Safety Confirmation (V9)
      setSafetyPrompt({
        id: action.id,
        type: 'sms',
        title: `এসএমএস সেন্ড অনুমোদন`,
        description: `গুরু, আপনি কি "${contact}"-কে নিচের মেসেজটি পাঠাতে চান?`,
        contactName: contact,
        messageContent: text,
        onConfirm: () => {
          setSafetyPrompt(null);
          setNotifications((prev) => [
            {
              id: Math.random().toString(),
              appName: 'মেসেঞ্জার',
              title: 'এসএমএস পাঠানো হয়েছে',
              message: `"${contact}": "${text}"`,
              timestamp: Date.now(),
              priority: 'high',
              read: false,
            },
            ...prev,
          ]);
        },
        onCancel: () => {
          setSafetyPrompt(null);
        },
      });
    } else if (action.name === 'webSearch') {
      const query = action.args.query || '';
      const newCard: WebActionCard = {
        id: action.id,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        title: `সার্চ: ${query}`,
        reason: 'লাইভ ওয়েব থেকে তথ্য খোঁজা হচ্ছে',
        timestamp: Date.now(),
      };
      setWebCards((prev) => [newCard, ...prev.slice(0, 2)]);
    } else if (action.name === 'rememberFact') {
      const key = action.args.key || 'গুরু তথ্য';
      const value = action.args.value || '';
      const category = (action.args.category || 'note') as MemoryItem['category'];

      const newMem: MemoryItem = {
        id: action.id,
        key,
        value,
        category,
        timestamp: Date.now(),
      };

      setMemories((prev) => [newMem, ...prev]);

      setNotifications((prev) => [
        {
          id: Math.random().toString(),
          appName: 'মেমোরি সিস্টেম',
          title: 'নতুন তথ্য সংরক্ষিত',
          message: `"${key}": ${value}`,
          timestamp: Date.now(),
          priority: 'normal',
          read: false,
        },
        ...prev,
      ]);
    } else if (action.name === 'setTimer') {
      const duration = Number(action.args.seconds) || 60;
      const label = action.args.label || 'টাইমার';

      const newTimer: ActiveTimer = {
        id: action.id,
        label,
        durationSeconds: duration,
        remainingSeconds: duration,
        endTime: Date.now() + duration * 1000,
      };

      setTimers((prev) => [newTimer, ...prev]);
    } else if (action.name === 'triggerNotification') {
      setNotifications((prev) => [
        {
          id: action.id,
          appName: 'সুমো এআই',
          title: action.args.title || 'বিজ্ঞপ্তি',
          message: action.args.message || '',
          timestamp: Date.now(),
          priority: (action.args.priority || 'normal') as any,
          read: false,
        },
        ...prev,
      ]);
    } else if (action.name === 'updateCognitiveState') {
      const tone = (action.args.tone || 'smart') as SumoEmotion;
      const summary = action.args.thoughtSummary || `টোন: ${tone}`;
      setEmotion(tone);
      setCurrentInsight({
        tone,
        summary,
        pillar: '🧠 Cognitive Update',
        timestamp: Date.now(),
      });
    }
  }, []);

  // Handle "SUMO" wake call
  const handleSumoCalled = useCallback(() => {
    const now = Date.now();
    if (now - lastSumoCallRef.current < 2500) {
      return; // prevent duplicate response
    }
    lastSumoCallRef.current = now;

    if (isGuruVoiceVerified) {
      SpeechHelper.speakJiGuru();
      setEmotion('loyal');
      setSpeechCue('জি গুরু, বলুন।');
      setTimeout(() => {
        setSpeechCue(null);
      }, 4000);

      if (sessionRef.current?.getState() === 'disconnected') {
        sessionRef.current.connect();
      }
    } else {
      SpeechHelper.speakDenied();
      setErrorMessage('⚠️ অপরিচিত কণ্ঠ শনাক্ত! এক্সেস ডিনাইড। সুমো শুধুমাত্র গুরুর আদেশে সাড়া দেয়।');
      setTimeout(() => setErrorMessage(null), 5000);
      if (sessionRef.current?.getState() !== 'disconnected') {
        sessionRef.current?.disconnect();
      }
    }
  }, [isGuruVoiceVerified]);

  // Sync verification with WakeWord service
  useEffect(() => {
    wakeWordRef.current?.setGuruVerification(isGuruVoiceVerified);
  }, [isGuruVoiceVerified]);

  // Initialize LiveSession
  useEffect(() => {
    const session = new LiveSession({
      voice,
      onStateChange: (newState) => {
        setState(newState);
        if (newState === 'listening' || newState === 'speaking') {
          setErrorMessage(null);
        }
      },
      onEmotionChange: (newEmotion) => {
        setEmotion(newEmotion);
      },
      onInputVolume: (volume) => {
        setMicVolume(volume);
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onToolCall: (action: ToolCallAction) => {
        handleToolCall(action);
      },
    });

    sessionRef.current = session;

    // Wake Word Setup (V3)
    const wakeService = new WakeWordService();
    wakeService.setGuruVerification(isGuruVoiceVerified);
    wakeService.onSumoWake = (isAuth) => {
      console.log('[App] SUMO wake word fired, authorized:', isAuth);
      handleSumoCalled();
    };
    if (wakeWordActive) {
      wakeService.start();
    }
    wakeWordRef.current = wakeService;

    return () => {
      session.disconnect();
      wakeService.stop();
    };
  }, [voice, handleToolCall, handleSumoCalled, isGuruVoiceVerified]);

  // Toggle Power / Connection
  const handleTogglePower = async () => {
    if (!sessionRef.current) return;

    if (state === 'disconnected') {
      setErrorMessage(null);
      await sessionRef.current.connect();
    } else {
      sessionRef.current.disconnect();
      setMicVolume(0);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!sessionRef.current) return;
    const muted = sessionRef.current.toggleMute();
    setIsMuted(muted);
  };

  // Toggle Wake Word
  const handleToggleWakeWord = () => {
    setWakeWordActive((prev) => {
      const next = !prev;
      if (next) wakeWordRef.current?.start();
      else wakeWordRef.current?.stop();
      return next;
    });
  };

  // Toggle Language
  const handleToggleLanguage = () => {
    setUserLanguage((prev) => (prev === 'bn' ? 'en' : prev === 'en' ? 'auto' : 'bn'));
  };

  // Select Prompt Spark
  const handleSelectPrompt = (prompt: string) => {
    setSpeechCue(prompt);
    setTimeout(() => {
      setSpeechCue(null);
    }, 4500);

    if (state === 'disconnected') {
      handleTogglePower();
    }
  };

  // Execute Custom Command (V8)
  const handleExecuteCommand = (cmd: CustomCommand) => {
    console.log('[Executing Command]', cmd.title);
    for (const action of cmd.actions) {
      if (action.type === 'openApp') {
        handleToolCall({
          id: Math.random().toString(),
          name: 'openApp',
          args: action.payload,
          timestamp: Date.now(),
        });
      } else if (action.type === 'webSearch') {
        handleToolCall({
          id: Math.random().toString(),
          name: 'webSearch',
          args: action.payload,
          timestamp: Date.now(),
        });
      } else if (action.type === 'timer') {
        handleToolCall({
          id: Math.random().toString(),
          name: 'setTimer',
          args: action.payload,
          timestamp: Date.now(),
        });
      }
    }
  };

  // Add Memory (V4)
  const handleAddMemory = (key: string, value: string, category: MemoryItem['category']) => {
    const newMem: MemoryItem = {
      id: Math.random().toString(),
      key,
      value,
      category,
      timestamp: Date.now(),
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  // Delete Memory with confirmation (V9)
  const handleDeleteMemory = (id: string, key: string) => {
    setSafetyPrompt({
      id,
      type: 'delete_memory',
      title: 'মেমোরি মুছে ফেলা',
      description: `গুরু, আপনি কি "${key}" তথ্যটি সুমো মেমোরি থেকে সম্পূর্ণ মুছে ফেলতে চান?`,
      onConfirm: () => {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        setSafetyPrompt(null);
      },
      onCancel: () => {
        setSafetyPrompt(null);
      },
    });
  };

  return (
    <div className="relative w-screen h-screen bg-[#050204] text-red-50 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Cyber Hacker Grid & Scanlines */}
      <div className="absolute inset-0 hacker-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 hacker-scanlines opacity-30 pointer-events-none" />

      {/* Red & Green Matrix Hacking Line Dropping Rain */}
      {matrixRainActive && (
        <MatrixRainCanvas opacity={0.45} colorMode="dual" />
      )}

      {/* Floating Neon RGB Glow Fields (Crimson Red, Matrix Green & Cyan) */}
      <div className="absolute top-1/4 -left-20 w-88 h-88 rounded-full bg-red-600/20 blur-[130px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none animate-float [animation-delay:3s]" />
      <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none animate-float [animation-delay:1.5s]" />

      {/* Top Header */}
      <SumoHeader
        state={state}
        emotion={emotion}
        voice={voice}
        isMuted={isMuted}
        userLanguage={userLanguage}
        wakeWordActive={wakeWordActive}
        unreadNotifications={notifications.filter((n) => !n.read).length}
        matrixRainActive={matrixRainActive}
        onToggleMatrixRain={() => setMatrixRainActive((prev) => !prev)}
        onToggleMute={handleToggleMute}
        onToggleWakeWord={handleToggleWakeWord}
        onToggleLanguage={handleToggleLanguage}
        onOpenNotifications={() => {
          setIsNotificationOpen(true);
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onOpenGuruSettings={() => setIsGuruModalOpen(true)}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="z-40 px-4 max-w-md mx-auto w-full animate-in slide-in-from-top-2 duration-200">
          <div className="p-3 rounded-2xl bg-red-950/90 border border-red-500 flex items-center justify-between gap-3 text-red-100 text-xs shadow-xl shadow-red-950/50 backdrop-blur-md font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleTogglePower()}
              className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 font-cyber font-semibold text-[11px] shrink-0 transition-colors border border-red-500/50"
            >
              পুনরায় চেষ্টা
            </button>
          </div>
        </div>
      )}

      {/* Speech Prompt Suggestion Cue (when tapped) */}
      {speechCue && (
        <div className="z-40 px-4 max-w-sm mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/95 via-rose-950/95 to-black border border-red-500/80 text-center shadow-2xl shadow-red-900/50 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-widest text-red-400 font-cyber font-bold block mb-1 font-mono">
              [VOICE COMMAND DISPATCHED]
            </span>
            <p className="text-sm font-bold text-white drop-shadow">
              &quot;{speechCue}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Main View based on activeTab */}
      <main className="relative flex-1 flex flex-col justify-center overflow-y-auto z-30">
        {activeTab === 'voice' && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            {currentInsight && (
              <div className="mb-2 px-3.5 py-1 rounded-full bg-black/85 border border-emerald-500/60 text-[11px] font-cyber text-emerald-300 flex items-center gap-1.5 backdrop-blur-md animate-in fade-in shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-bold font-mono text-red-400">{currentInsight.pillar}:</span>
                <span className="text-emerald-200 truncate max-w-[220px]">{currentInsight.summary}</span>
              </div>
            )}

            <VisualizerCore
              state={state}
              emotion={emotion}
              micVolume={micVolume}
              isMuted={isMuted}
              onTogglePower={handleTogglePower}
            />

            {/* Oscilloscope Waveform under core */}
            <div className="mt-3">
              <WaveformCanvas
                state={state}
                streamer={sessionRef.current?.getStreamer() || ({} as any)}
                micVolume={micVolume}
              />
            </div>
          </div>
        )}

        {activeTab === 'brain' && (
          <IntelligentCognitiveLab
            currentInsight={currentInsight}
            onRunTestPrompt={(prompt, tone, pillar) => {
              setEmotion(tone);
              setCurrentInsight({
                tone,
                summary: prompt,
                pillar,
                timestamp: Date.now(),
              });
              handleSelectPrompt(prompt);
            }}
          />
        )}

        {activeTab === 'android' && (
          <AndroidControlHub
            onLaunchApp={(app) => {
              handleToolCall({
                id: Math.random().toString(),
                name: 'openApp',
                args: { appName: app.id, targetUrl: app.defaultUrl },
                timestamp: Date.now(),
              });
            }}
            onRequestCall={(contact, phone) => {
              handleToolCall({
                id: Math.random().toString(),
                name: 'initiateCall',
                args: { contactName: contact, phoneNumber: phone },
                timestamp: Date.now(),
              });
            }}
            onRequestSms={(contact, msg) => {
              handleToolCall({
                id: Math.random().toString(),
                name: 'sendSms',
                args: { contactName: contact, message: msg },
                timestamp: Date.now(),
              });
            }}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryBankModal
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}

        {activeTab === 'commands' && (
          <CustomCommandsModal
            commands={commands}
            onExecuteCommand={handleExecuteCommand}
            onAddCommand={(cmd) => setCommands((prev) => [cmd, ...prev])}
            onDeleteCommand={(id) => setCommands((prev) => prev.filter((c) => c.id !== id))}
          />
        )}

        {activeTab === 'roadmap' && <RoadmapTracker />}
      </main>

      {/* Action HUD Card (for openWebsite, setTimer, etc.) */}
      <ActionHUDCard
        webCards={webCards}
        timers={timers}
        onDismissWebCard={(id) => setWebCards((prev) => prev.filter((c) => c.id !== id))}
        onDismissTimer={(id) => setTimers((prev) => prev.filter((t) => t.id !== id))}
        onPreviewUrl={(url, title) => setActivePreview({ url, title })}
      />

      {/* Voice Prompt Sparks & Guru Voice Guard (only on Voice Tab) */}
      {activeTab === 'voice' && (
        <div className="z-30 space-y-1">
          <GuruVoiceprintGuard
            isGuruVoiceVerified={isGuruVoiceVerified}
            onToggleVoiceMode={setIsGuruVoiceVerified}
            onSimulateCallSumo={handleSumoCalled}
          />
          <InspirationChips
            onSelectPrompt={(prompt) => {
              if (prompt === 'SUMO') {
                handleSumoCalled();
              } else {
                handleSelectPrompt(prompt);
              }
            }}
            disabled={false}
          />
        </div>
      )}

      {/* Bottom Android Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Safety Confirmation Guardrail Modal (V9) */}
      <SafetyConfirmModal prompt={safetyPrompt} />

      {/* Simulated Android Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        notifications={notifications}
        onClose={() => setIsNotificationOpen(false)}
        onClearAll={() => setNotifications([])}
        onTriggerTest={() => {
          setNotifications((prev) => [
            {
              id: Math.random().toString(),
              appName: 'সুমো এআই',
              title: 'সিস্টেম স্বাস্থ্য পরীক্ষা',
              message: 'গুরু, আপনার ফোনের সমস্ত সার্ভিস ও এআই ব্রেইন ১০০% স্বাভাবিক রয়েছে।',
              timestamp: Date.now(),
              priority: 'normal',
              read: false,
            },
            ...prev,
          ]);
        }}
      />

      {/* Guru / Owner Settings Modal (V7) */}
      <GuruSettingsModal
        isOpen={isGuruModalOpen}
        guruName={guruName}
        honorificMode={honorificMode}
        userLanguage={userLanguage}
        voice={voice}
        wakeWordActive={wakeWordActive}
        onClose={() => setIsGuruModalOpen(false)}
        onUpdateGuruName={setGuruName}
        onUpdateHonorific={setHonorificMode}
        onUpdateLanguage={setUserLanguage}
        onUpdateVoice={(v) => {
          setVoice(v);
          sessionRef.current?.setVoice(v);
        }}
        onToggleWakeWord={handleToggleWakeWord}
      />

      {/* In-App Browser Modal */}
      <InAppBrowserModal
        url={activePreview?.url || null}
        title={activePreview?.title || null}
        onClose={() => setActivePreview(null)}
      />
    </div>
  );
}
