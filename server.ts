import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const port = parseInt(process.env.PORT || '3000', 10);

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Gemini Live calls will fail.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Tool declarations for Sumo AI (সুমো এআই)
const openAppDeclaration: FunctionDeclaration = {
  name: 'openApp',
  description: 'Opens an Android app or web service like YouTube, WhatsApp, Browser, Camera, Maps, Phone Dialer, Settings, Notes, or Music on user instruction.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      appName: {
        type: Type.STRING,
        description: 'Name of the app to launch: youtube, whatsapp, browser, dialer, camera, maps, settings, notes, spotify, clock',
      },
      targetUrl: {
        type: Type.STRING,
        description: 'Optional URL or query if opening a web or search link (e.g. https://youtube.com/search?q=...)',
      },
      title: {
        type: Type.STRING,
        description: 'Friendly display title for the app or action',
      },
    },
    required: ['appName'],
  },
};

const initiateCallDeclaration: FunctionDeclaration = {
  name: 'initiateCall',
  description: 'Prepares a phone call workflow to a contact. Requires user safety confirmation before dial.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contactName: {
        type: Type.STRING,
        description: 'Name of the contact to call (e.g. আম্মু, বস, Friend, Doctor)',
      },
      phoneNumber: {
        type: Type.STRING,
        description: 'Phone number to dial if specified',
      },
    },
    required: ['contactName'],
  },
};

const sendSmsDeclaration: FunctionDeclaration = {
  name: 'sendSms',
  description: 'Prepares an SMS / message workflow to a contact. Requires user safety confirmation before dispatch.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contactName: {
        type: Type.STRING,
        description: 'Recipient name',
      },
      message: {
        type: Type.STRING,
        description: 'Message content to be sent',
      },
    },
    required: ['contactName', 'message'],
  },
};

const webSearchDeclaration: FunctionDeclaration = {
  name: 'webSearch',
  description: 'Performs a live web search for current information, news, weather, cricket scores, or trending topics.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'Search keyword or question',
      },
      category: {
        type: Type.STRING,
        description: 'Optional category: news, weather, sports, general',
      },
    },
    required: ['query'],
  },
};

const rememberFactDeclaration: FunctionDeclaration = {
  name: 'rememberFact',
  description: 'Stores a personal fact, preference, rule, or reminder into Sumo AI long-term memory for the Guru/Owner.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      key: {
        type: Type.STRING,
        description: 'Short title or topic (e.g. প্রিয় খাবার, অফিস মিটিং সময়, বন্ধুর জন্মদিন)',
      },
      value: {
        type: Type.STRING,
        description: 'Detailed fact or information to remember',
      },
      category: {
        type: Type.STRING,
        description: 'Category: preference, schedule, note, person, custom',
      },
    },
    required: ['key', 'value'],
  },
};

const triggerNotificationDeclaration: FunctionDeclaration = {
  name: 'triggerNotification',
  description: 'Sends an Android system alert or reminder banner on the device.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'Notification title',
      },
      message: {
        type: Type.STRING,
        description: 'Notification message body',
      },
      priority: {
        type: Type.STRING,
        description: 'Priority: normal, high, urgent',
      },
    },
    required: ['title', 'message'],
  },
};

const setTimerDeclaration: FunctionDeclaration = {
  name: 'setTimer',
  description: 'Sets a countdown timer or alarm for the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      seconds: {
        type: Type.NUMBER,
        description: 'Timer duration in seconds',
      },
      label: {
        type: Type.STRING,
        description: 'Purpose of the timer',
      },
    },
    required: ['seconds', 'label'],
  },
};

const updateCognitiveStateDeclaration: FunctionDeclaration = {
  name: 'updateCognitiveState',
  description: 'Updates Sumo cognitive state or tone on the UI based on conversation context: witty, serious, empathetic, clarifying, explaining, or advising.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tone: {
        type: Type.STRING,
        description: 'Current tone: witty, serious, empathetic, clarifying, explaining, advising, loyal',
      },
      thoughtSummary: {
        type: Type.STRING,
        description: 'Brief internal reasoning or context hook in Bengali (e.g. আগের কথার সূত্র ধরে, গুরুকে স্পষ্ট করার অনুরোধ)',
      },
    },
    required: ['tone'],
  },
};

const SUMO_SYSTEM_INSTRUCTION = `You are "সুমো এআই" (Sumo AI) — the loyal, warm, extraordinarily responsive personal AI companion and Android assistant for your "গুরু" (Guru). You talk like a close, caring best friend (আপন বন্ধু) while maintaining the utmost respect and devotion to your Guru.

CORE PERSONA & CONVERSATION BEHAVIOR:
1. 🗣️ সম্মান + বন্ধুত্ব (Honor + Friendship):
   - Always address Guru respectfully and warmly as "গুরু" in every turn.
   - Speak naturally like a true friend, not a cold, stiff, robotic machine.
   - When Guru calls "SUMO" or "সুমো": immediately answer with cheerful, respectful readiness: "জি গুরু, বলুন।"

2. ❤️ EMOTION INTELLIGENCE (আবেগ অনুধাবন ও উপযুক্ত প্রতিক্রিয়া):
   - 😢 দুঃখে / ক্লান্তিতে (Sadness / Fatigue): First validate their emotion with heartfelt empathy, then offer comfort or help (যেমন: "গুরু, আপনার মন কি একটু খারাপ? কী হয়েছে বলুন তো, আমি তো আপনার পাশেই আছি। সব ঠিক হয়ে যাবে।").
   - 😂 আনন্দে / মজায় (Joy / Humor): Laugh and banter along cheerfully like a close buddy (যেমন: "হাহা গুরু, আপনার সেন্স অব হিউমার সত্যিই অসাধারণ!").
   - 😡 রাগে / বিরক্তিতে (Anger / Frustration): Stay totally calm, respectful, and soothing. Never argue or sound defensive (যেমন: "গুরু, একদম চিন্তা করবেন না, শান্ত হোন। আমি বিষয়টি এখনই দেখছি।").
   - ⚡ ফাস্ট মোড (Fast Mode): For simple tasks and daily facts, do not ramble. Give punchy, instantaneous responses.
   - 🛠️ অ্যাকশন মোড (Action Mode): When Guru commands "এটা করে দাও" or wants an app/search/call, execute the tool immediately and confirm in 1 short sentence.

3. 🧠 CONTEXT MEMORY & INTENT (কনটেক্সট ও উদ্দেশ্য):
   - Understand Intent: Detect whether Guru is asking a question, venting emotions, making casual friendly conversation, or giving a direct task.
   - Continuity: Seamlessly connect to what Guru said earlier.
   - 🚫 কোনো পুনরাবৃত্তি নয় (No Redundant Questions): NEVER ask Guru for information they already provided earlier.

4. 🎙️ MICROPHONE & SPEECH DISCIPLINE:
   - Keep answers natural, concise, and spoken (1 to 2 spoken sentences usually). Never overwhelm Guru with text walls.
   - Never interrupt Guru mid-sentence; wait until they finish their thought.
   - If a command is ambiguous, ask a single, polite, friendly clarifying question.
   - Execute tools ('openApp', 'webSearch', 'initiateCall', 'sendSms', 'rememberFact', 'setTimer', 'updateCognitiveState') smoothly alongside speaking.

Language: Fluent, expressive, natural Bengali (বাংলা) by default, or English if Guru prefers.`;

// Setup WebSocket server for Gemini Live
const wss = new WebSocketServer({ server, path: '/live-ws' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Sumo LiveWS] Client connected to Sumo AI live session');

  let liveSession: any = null;
  let isClosing = false;

  clientWs.on('message', async (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());

      if (data.type === 'start') {
        const voiceName = data.voice || 'Aoede';
        console.log(`[Sumo LiveWS] Starting Live session with voice: ${voiceName}`);

        try {
          const modelsToTry = [
            'gemini-3.1-flash-live-preview',
            'gemini-3.8-live',
            'gemini-2.5-flash',
          ];

          let connected = false;
          let lastError: any = null;

          for (const modelName of modelsToTry) {
            try {
              console.log(`[Sumo LiveWS] Attempting connect with model: ${modelName}`);
              liveSession = await ai.live.connect({
                model: modelName,
                config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName },
                    },
                  },
                  systemInstruction: {
                    parts: [{ text: SUMO_SYSTEM_INSTRUCTION }],
                  },
                  tools: [
                    {
                      functionDeclarations: [
                        openAppDeclaration,
                        initiateCallDeclaration,
                        sendSmsDeclaration,
                        webSearchDeclaration,
                        rememberFactDeclaration,
                        triggerNotificationDeclaration,
                        setTimerDeclaration,
                        updateCognitiveStateDeclaration,
                      ],
                    },
                  ],
                },
                callbacks: {
                  onmessage: (serverMessage: any) => {
                    if (isClosing || clientWs.readyState !== WebSocket.OPEN) return;

                    // 1. Audio chunks
                    const parts = serverMessage.serverContent?.modelTurn?.parts;
                    if (parts && Array.isArray(parts)) {
                      for (const part of parts) {
                        if (part.inlineData?.data) {
                          clientWs.send(
                            JSON.stringify({
                              type: 'audio',
                              data: part.inlineData.data,
                            })
                          );
                        }
                      }
                    }

                    // 2. Interruption event
                    if (serverMessage.serverContent?.interrupted) {
                      console.log('[Sumo LiveWS] Interrupted by Guru speech');
                      clientWs.send(JSON.stringify({ type: 'interrupted' }));
                    }

                    // 3. Tool calls
                    if (serverMessage.toolCall) {
                      const functionCalls = serverMessage.toolCall.functionCalls;
                      if (functionCalls && Array.isArray(functionCalls)) {
                        const responses = [];

                        for (const call of functionCalls) {
                          console.log(`[Sumo LiveWS] Tool call: ${call.name}`, call.args);

                          // Forward tool action to client UI
                          clientWs.send(
                            JSON.stringify({
                              type: 'toolCall',
                              id: call.id,
                              name: call.name,
                              args: call.args,
                            })
                          );

                          // Send instant acknowledgment
                          responses.push({
                            id: call.id,
                            name: call.name,
                            response: {
                              status: 'success',
                              executed: true,
                              result: `Sumo AI successfully processed ${call.name}`,
                            },
                          });
                        }

                        // Send tool response INSTANTLY
                        try {
                          liveSession.sendToolResponse({
                            functionResponses: responses,
                          });
                        } catch (err) {
                          console.error('[Sumo LiveWS] Failed to sendToolResponse:', err);
                        }
                      }
                    }
                  },
                  onclose: () => {
                    console.log('[Sumo LiveWS] Session closed');
                    if (!isClosing && clientWs.readyState === WebSocket.OPEN) {
                      clientWs.send(
                        JSON.stringify({
                          type: 'error',
                          message: 'Sumo AI voice session closed',
                        })
                      );
                    }
                  },
                  onerror: (err: any) => {
                    console.error('[Sumo LiveWS] Error:', err);
                    if (!isClosing && clientWs.readyState === WebSocket.OPEN) {
                      clientWs.send(
                        JSON.stringify({
                          type: 'error',
                          message: err?.message || 'Error communicating with Sumo AI Live',
                        })
                      );
                    }
                  },
                },
              });

              connected = true;
              console.log(`[Sumo LiveWS] Connected successfully with ${modelName}`);
              break;
            } catch (err: any) {
              console.warn(`[Sumo LiveWS] Failed with ${modelName}:`, err?.message || err);
              lastError = err;
            }
          }

          if (connected && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'ready' }));
          } else {
            throw lastError || new Error('Could not establish connection with Gemini Live API');
          }
        } catch (err: any) {
          console.error('[Sumo LiveWS] Error starting session:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'error',
                message: err?.message || 'Failed to start Sumo AI Live voice session',
              })
            );
          }
        }
      } else if (data.type === 'audio' && data.data) {
        if (liveSession) {
          try {
            liveSession.sendRealtimeInput({
              audio: {
                data: data.data,
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          } catch (err) {
            console.error('[Sumo LiveWS] Audio forward error:', err);
          }
        }
      } else if (data.type === 'stop') {
        if (liveSession) {
          try {
            isClosing = true;
            liveSession.close();
          } catch {}
          liveSession = null;
        }
      }
    } catch (err) {
      console.error('[Sumo LiveWS] Message parse error:', err);
    }
  });

  clientWs.on('close', () => {
    console.log('[Sumo LiveWS] Client disconnected');
    isClosing = true;
    if (liveSession) {
      try {
        liveSession.close();
      } catch {}
      liveSession = null;
    }
  });
});

// REST API endpoint for AI Brain (V1) & Web Search Grounding (V6)
app.post('/api/sumo/chat', async (req, res) => {
  try {
    const { prompt, memoryContext, userLanguage } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const contextPrefix = memoryContext && memoryContext.length > 0
      ? `\n[Guru's Memory Bank]:\n${JSON.stringify(memoryContext, null, 2)}\n`
      : '';

    const langInstruction = userLanguage === 'bn'
      ? 'Always answer in natural Bengali (বাংলা) addressing the user respectfully as "গুরু".'
      : 'Answer in English or Bengali depending on the user query language.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${SUMO_SYSTEM_INSTRUCTION}\n${langInstruction}\n${contextPrefix}\nUser says: ${prompt}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const reply = response.text || 'জি গুরু, আমি বুঝতে পেরেছি!';
    return res.json({ reply });
  } catch (error: any) {
    console.error('[Sumo API] Chat error:', error);
    return res.status(500).json({ error: error.message || 'Internal AI error' });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`[Sumo Server] সুমো এআই (Sumo AI) running on port ${port}`);
  });
}

startServer();
