export type LiveState = 'disconnected' | 'connecting' | 'listening' | 'speaking' | 'thinking';

export type SumoEmotion = 
  | 'confident'
  | 'loyal'
  | 'smart'
  | 'witty'
  | 'focused'
  | 'alert'
  | 'thinking'
  | 'serious'
  | 'empathetic'
  | 'clarifying'
  | 'explaining'
  | 'advising';

export interface CognitiveInsight {
  tone: SumoEmotion;
  summary: string;
  pillar: string;
  timestamp: number;
}

export interface ToolCallAction {
  id: string;
  name: string;
  args: Record<string, any>;
  timestamp: number;
}

export interface ActiveTimer {
  id: string;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  endTime: number;
}

export interface WebActionCard {
  id: string;
  title: string;
  url: string;
  category?: string;
  reason?: string;
  timestamp: number;
}

export type VoiceOption = 'Aoede' | 'Kore' | 'Zephyr' | 'Puck';

// Sumo AI Memory Item (V4)
export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'schedule' | 'note' | 'person' | 'rule';
  timestamp: number;
}

// Android App Definition (V5)
export interface AndroidAppItem {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  category: 'social' | 'media' | 'system' | 'utility';
  urlScheme?: string;
  defaultUrl?: string;
}

// Security & Safety Confirmation Prompt (V9)
export interface SafetyConfirmationPrompt {
  id: string;
  type: 'call' | 'sms' | 'delete_memory' | 'system';
  title: string;
  description: string;
  contactName?: string;
  phoneNumber?: string;
  messageContent?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Custom Command / Routine (V8)
export interface CustomCommand {
  id: string;
  triggerPhrase: string; // e.g. "সকালের রুটিন" or "Work Mode"
  title: string;
  description: string;
  actions: {
    type: 'openApp' | 'speak' | 'webSearch' | 'timer';
    payload: Record<string, any>;
  }[];
}

// Android Simulated Notification (V5)
export interface AndroidNotification {
  id: string;
  appName: string;
  title: string;
  message: string;
  timestamp: number;
  priority: 'normal' | 'high' | 'urgent';
  read: boolean;
}

// App Navigation Tabs
export type SumoAppTab = 'voice' | 'brain' | 'android' | 'memory' | 'commands' | 'roadmap';
