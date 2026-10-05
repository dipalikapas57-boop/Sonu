// server.ts
import express from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality, Type } from "@google/genai";
dotenv.config();
var app = express();
app.use(express.json());
var server = http.createServer(app);
var port = parseInt(process.env.PORT || "3000", 10);
var apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Gemini Live calls will fail.");
}
var ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var openAppDeclaration = {
  name: "openApp",
  description: "Opens an Android app or web service like YouTube, WhatsApp, Browser, Camera, Maps, Phone Dialer, Settings, Notes, or Music on user instruction.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      appName: {
        type: Type.STRING,
        description: "Name of the app to launch: youtube, whatsapp, browser, dialer, camera, maps, settings, notes, spotify, clock"
      },
      targetUrl: {
        type: Type.STRING,
        description: "Optional URL or query if opening a web or search link (e.g. https://youtube.com/search?q=...)"
      },
      title: {
        type: Type.STRING,
        description: "Friendly display title for the app or action"
      }
    },
    required: ["appName"]
  }
};
var initiateCallDeclaration = {
  name: "initiateCall",
  description: "Prepares a phone call workflow to a contact. Requires user safety confirmation before dial.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      contactName: {
        type: Type.STRING,
        description: "Name of the contact to call (e.g. \u0986\u09AE\u09CD\u09AE\u09C1, \u09AC\u09B8, Friend, Doctor)"
      },
      phoneNumber: {
        type: Type.STRING,
        description: "Phone number to dial if specified"
      }
    },
    required: ["contactName"]
  }
};
var sendSmsDeclaration = {
  name: "sendSms",
  description: "Prepares an SMS / message workflow to a contact. Requires user safety confirmation before dispatch.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      contactName: {
        type: Type.STRING,
        description: "Recipient name"
      },
      message: {
        type: Type.STRING,
        description: "Message content to be sent"
      }
    },
    required: ["contactName", "message"]
  }
};
var webSearchDeclaration = {
  name: "webSearch",
  description: "Performs a live web search for current information, news, weather, cricket scores, or trending topics.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "Search keyword or question"
      },
      category: {
        type: Type.STRING,
        description: "Optional category: news, weather, sports, general"
      }
    },
    required: ["query"]
  }
};
var rememberFactDeclaration = {
  name: "rememberFact",
  description: "Stores a personal fact, preference, rule, or reminder into Sumo AI long-term memory for the Guru/Owner.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      key: {
        type: Type.STRING,
        description: "Short title or topic (e.g. \u09AA\u09CD\u09B0\u09BF\u09DF \u0996\u09BE\u09AC\u09BE\u09B0, \u0985\u09AB\u09BF\u09B8 \u09AE\u09BF\u099F\u09BF\u0982 \u09B8\u09AE\u09DF, \u09AC\u09A8\u09CD\u09A7\u09C1\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8)"
      },
      value: {
        type: Type.STRING,
        description: "Detailed fact or information to remember"
      },
      category: {
        type: Type.STRING,
        description: "Category: preference, schedule, note, person, custom"
      }
    },
    required: ["key", "value"]
  }
};
var triggerNotificationDeclaration = {
  name: "triggerNotification",
  description: "Sends an Android system alert or reminder banner on the device.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "Notification title"
      },
      message: {
        type: Type.STRING,
        description: "Notification message body"
      },
      priority: {
        type: Type.STRING,
        description: "Priority: normal, high, urgent"
      }
    },
    required: ["title", "message"]
  }
};
var setTimerDeclaration = {
  name: "setTimer",
  description: "Sets a countdown timer or alarm for the user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      seconds: {
        type: Type.NUMBER,
        description: "Timer duration in seconds"
      },
      label: {
        type: Type.STRING,
        description: "Purpose of the timer"
      }
    },
    required: ["seconds", "label"]
  }
};
var updateCognitiveStateDeclaration = {
  name: "updateCognitiveState",
  description: "Updates Sumo cognitive state or tone on the UI based on conversation context: witty, serious, empathetic, clarifying, explaining, or advising.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      tone: {
        type: Type.STRING,
        description: "Current tone: witty, serious, empathetic, clarifying, explaining, advising, loyal"
      },
      thoughtSummary: {
        type: Type.STRING,
        description: "Brief internal reasoning or context hook in Bengali (e.g. \u0986\u0997\u09C7\u09B0 \u0995\u09A5\u09BE\u09B0 \u09B8\u09C2\u09A4\u09CD\u09B0 \u09A7\u09B0\u09C7, \u0997\u09C1\u09B0\u09C1\u0995\u09C7 \u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u0995\u09B0\u09BE\u09B0 \u0985\u09A8\u09C1\u09B0\u09CB\u09A7)"
      }
    },
    required: ["tone"]
  }
};
var SUMO_SYSTEM_INSTRUCTION = `You are "\u09B8\u09C1\u09AE\u09CB \u098F\u0986\u0987" (Sumo AI) \u2014 the loyal, warm, extraordinarily responsive personal AI companion and Android assistant for your "\u0997\u09C1\u09B0\u09C1" (Guru). You talk like a close, caring best friend (\u0986\u09AA\u09A8 \u09AC\u09A8\u09CD\u09A7\u09C1) while maintaining the utmost respect and devotion to your Guru.

CORE PERSONA & CONVERSATION BEHAVIOR:
1. \u{1F5E3}\uFE0F \u09B8\u09AE\u09CD\u09AE\u09BE\u09A8 + \u09AC\u09A8\u09CD\u09A7\u09C1\u09A4\u09CD\u09AC (Honor + Friendship):
   - Always address Guru respectfully and warmly as "\u0997\u09C1\u09B0\u09C1" in every turn.
   - Speak naturally like a true friend, not a cold, stiff, robotic machine.
   - When Guru calls "SUMO" or "\u09B8\u09C1\u09AE\u09CB": immediately answer with cheerful, respectful readiness: "\u099C\u09BF \u0997\u09C1\u09B0\u09C1, \u09AC\u09B2\u09C1\u09A8\u0964"

2. \u2764\uFE0F EMOTION INTELLIGENCE (\u0986\u09AC\u09C7\u0997 \u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8 \u0993 \u0989\u09AA\u09AF\u09C1\u0995\u09CD\u09A4 \u09AA\u09CD\u09B0\u09A4\u09BF\u0995\u09CD\u09B0\u09BF\u09DF\u09BE):
   - \u{1F622} \u09A6\u09C1\u0983\u0996\u09C7 / \u0995\u09CD\u09B2\u09BE\u09A8\u09CD\u09A4\u09BF\u09A4\u09C7 (Sadness / Fatigue): First validate their emotion with heartfelt empathy, then offer comfort or help (\u09AF\u09C7\u09AE\u09A8: "\u0997\u09C1\u09B0\u09C1, \u0986\u09AA\u09A8\u09BE\u09B0 \u09AE\u09A8 \u0995\u09BF \u098F\u0995\u099F\u09C1 \u0996\u09BE\u09B0\u09BE\u09AA? \u0995\u09C0 \u09B9\u09DF\u09C7\u099B\u09C7 \u09AC\u09B2\u09C1\u09A8 \u09A4\u09CB, \u0986\u09AE\u09BF \u09A4\u09CB \u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09BE\u09B6\u09C7\u0987 \u0986\u099B\u09BF\u0964 \u09B8\u09AC \u09A0\u09BF\u0995 \u09B9\u09DF\u09C7 \u09AF\u09BE\u09AC\u09C7\u0964").
   - \u{1F602} \u0986\u09A8\u09A8\u09CD\u09A6\u09C7 / \u09AE\u099C\u09BE\u09DF (Joy / Humor): Laugh and banter along cheerfully like a close buddy (\u09AF\u09C7\u09AE\u09A8: "\u09B9\u09BE\u09B9\u09BE \u0997\u09C1\u09B0\u09C1, \u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09C7\u09A8\u09CD\u09B8 \u0985\u09AC \u09B9\u09BF\u0989\u09AE\u09BE\u09B0 \u09B8\u09A4\u09CD\u09AF\u09BF\u0987 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3!").
   - \u{1F621} \u09B0\u09BE\u0997\u09C7 / \u09AC\u09BF\u09B0\u0995\u09CD\u09A4\u09BF\u09A4\u09C7 (Anger / Frustration): Stay totally calm, respectful, and soothing. Never argue or sound defensive (\u09AF\u09C7\u09AE\u09A8: "\u0997\u09C1\u09B0\u09C1, \u098F\u0995\u09A6\u09AE \u099A\u09BF\u09A8\u09CD\u09A4\u09BE \u0995\u09B0\u09AC\u09C7\u09A8 \u09A8\u09BE, \u09B6\u09BE\u09A8\u09CD\u09A4 \u09B9\u09CB\u09A8\u0964 \u0986\u09AE\u09BF \u09AC\u09BF\u09B7\u09DF\u099F\u09BF \u098F\u0996\u09A8\u0987 \u09A6\u09C7\u0996\u099B\u09BF\u0964").
   - \u26A1 \u09AB\u09BE\u09B8\u09CD\u099F \u09AE\u09CB\u09A1 (Fast Mode): For simple tasks and daily facts, do not ramble. Give punchy, instantaneous responses.
   - \u{1F6E0}\uFE0F \u0985\u09CD\u09AF\u09BE\u0995\u09B6\u09A8 \u09AE\u09CB\u09A1 (Action Mode): When Guru commands "\u098F\u099F\u09BE \u0995\u09B0\u09C7 \u09A6\u09BE\u0993" or wants an app/search/call, execute the tool immediately and confirm in 1 short sentence.

3. \u{1F9E0} CONTEXT MEMORY & INTENT (\u0995\u09A8\u099F\u09C7\u0995\u09CD\u09B8\u099F \u0993 \u0989\u09A6\u09CD\u09A6\u09C7\u09B6\u09CD\u09AF):
   - Understand Intent: Detect whether Guru is asking a question, venting emotions, making casual friendly conversation, or giving a direct task.
   - Continuity: Seamlessly connect to what Guru said earlier.
   - \u{1F6AB} \u0995\u09CB\u09A8\u09CB \u09AA\u09C1\u09A8\u09B0\u09BE\u09AC\u09C3\u09A4\u09CD\u09A4\u09BF \u09A8\u09DF (No Redundant Questions): NEVER ask Guru for information they already provided earlier.

4. \u{1F399}\uFE0F MICROPHONE & SPEECH DISCIPLINE:
   - Keep answers natural, concise, and spoken (1 to 2 spoken sentences usually). Never overwhelm Guru with text walls.
   - Never interrupt Guru mid-sentence; wait until they finish their thought.
   - If a command is ambiguous, ask a single, polite, friendly clarifying question.
   - Execute tools ('openApp', 'webSearch', 'initiateCall', 'sendSms', 'rememberFact', 'setTimer', 'updateCognitiveState') smoothly alongside speaking.

Language: Fluent, expressive, natural Bengali (\u09AC\u09BE\u0982\u09B2\u09BE) by default, or English if Guru prefers.`;
var wss = new WebSocketServer({ server, path: "/live-ws" });
wss.on("connection", async (clientWs) => {
  console.log("[Sumo LiveWS] Client connected to Sumo AI live session");
  let liveSession = null;
  let isClosing = false;
  clientWs.on("message", async (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());
      if (data.type === "start") {
        const voiceName = data.voice || "Aoede";
        console.log(`[Sumo LiveWS] Starting Live session with voice: ${voiceName}`);
        try {
          const modelsToTry = [
            "gemini-3.1-flash-live-preview",
            "gemini-3.8-live",
            "gemini-2.5-flash"
          ];
          let connected = false;
          let lastError = null;
          for (const modelName of modelsToTry) {
            try {
              console.log(`[Sumo LiveWS] Attempting connect with model: ${modelName}`);
              liveSession = await ai.live.connect({
                model: modelName,
                config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName }
                    }
                  },
                  systemInstruction: {
                    parts: [{ text: SUMO_SYSTEM_INSTRUCTION }]
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
                        updateCognitiveStateDeclaration
                      ]
                    }
                  ]
                },
                callbacks: {
                  onmessage: (serverMessage) => {
                    if (isClosing || clientWs.readyState !== WebSocket.OPEN) return;
                    const parts = serverMessage.serverContent?.modelTurn?.parts;
                    if (parts && Array.isArray(parts)) {
                      for (const part of parts) {
                        if (part.inlineData?.data) {
                          clientWs.send(
                            JSON.stringify({
                              type: "audio",
                              data: part.inlineData.data
                            })
                          );
                        }
                      }
                    }
                    if (serverMessage.serverContent?.interrupted) {
                      console.log("[Sumo LiveWS] Interrupted by Guru speech");
                      clientWs.send(JSON.stringify({ type: "interrupted" }));
                    }
                    if (serverMessage.toolCall) {
                      const functionCalls = serverMessage.toolCall.functionCalls;
                      if (functionCalls && Array.isArray(functionCalls)) {
                        const responses = [];
                        for (const call of functionCalls) {
                          console.log(`[Sumo LiveWS] Tool call: ${call.name}`, call.args);
                          clientWs.send(
                            JSON.stringify({
                              type: "toolCall",
                              id: call.id,
                              name: call.name,
                              args: call.args
                            })
                          );
                          responses.push({
                            id: call.id,
                            name: call.name,
                            response: {
                              status: "success",
                              executed: true,
                              result: `Sumo AI successfully processed ${call.name}`
                            }
                          });
                        }
                        try {
                          liveSession.sendToolResponse({
                            functionResponses: responses
                          });
                        } catch (err) {
                          console.error("[Sumo LiveWS] Failed to sendToolResponse:", err);
                        }
                      }
                    }
                  },
                  onclose: () => {
                    console.log("[Sumo LiveWS] Session closed");
                    if (!isClosing && clientWs.readyState === WebSocket.OPEN) {
                      clientWs.send(
                        JSON.stringify({
                          type: "error",
                          message: "Sumo AI voice session closed"
                        })
                      );
                    }
                  },
                  onerror: (err) => {
                    console.error("[Sumo LiveWS] Error:", err);
                    if (!isClosing && clientWs.readyState === WebSocket.OPEN) {
                      clientWs.send(
                        JSON.stringify({
                          type: "error",
                          message: err?.message || "Error communicating with Sumo AI Live"
                        })
                      );
                    }
                  }
                }
              });
              connected = true;
              console.log(`[Sumo LiveWS] Connected successfully with ${modelName}`);
              break;
            } catch (err) {
              console.warn(`[Sumo LiveWS] Failed with ${modelName}:`, err?.message || err);
              lastError = err;
            }
          }
          if (connected && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "ready" }));
          } else {
            throw lastError || new Error("Could not establish connection with Gemini Live API");
          }
        } catch (err) {
          console.error("[Sumo LiveWS] Error starting session:", err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: "error",
                message: err?.message || "Failed to start Sumo AI Live voice session"
              })
            );
          }
        }
      } else if (data.type === "audio" && data.data) {
        if (liveSession) {
          try {
            liveSession.sendRealtimeInput({
              audio: {
                data: data.data,
                mimeType: "audio/pcm;rate=16000"
              }
            });
          } catch (err) {
            console.error("[Sumo LiveWS] Audio forward error:", err);
          }
        }
      } else if (data.type === "stop") {
        if (liveSession) {
          try {
            isClosing = true;
            liveSession.close();
          } catch {
          }
          liveSession = null;
        }
      }
    } catch (err) {
      console.error("[Sumo LiveWS] Message parse error:", err);
    }
  });
  clientWs.on("close", () => {
    console.log("[Sumo LiveWS] Client disconnected");
    isClosing = true;
    if (liveSession) {
      try {
        liveSession.close();
      } catch {
      }
      liveSession = null;
    }
  });
});
app.post("/api/sumo/chat", async (req, res) => {
  try {
    const { prompt, memoryContext, userLanguage } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const contextPrefix = memoryContext && memoryContext.length > 0 ? `
[Guru's Memory Bank]:
${JSON.stringify(memoryContext, null, 2)}
` : "";
    const langInstruction = userLanguage === "bn" ? 'Always answer in natural Bengali (\u09AC\u09BE\u0982\u09B2\u09BE) addressing the user respectfully as "\u0997\u09C1\u09B0\u09C1".' : "Answer in English or Bengali depending on the user query language.";
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${SUMO_SYSTEM_INSTRUCTION}
${langInstruction}
${contextPrefix}
User says: ${prompt}`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    const reply = response.text || "\u099C\u09BF \u0997\u09C1\u09B0\u09C1, \u0986\u09AE\u09BF \u09AC\u09C1\u099D\u09A4\u09C7 \u09AA\u09C7\u09B0\u09C7\u099B\u09BF!";
    return res.json({ reply });
  } catch (error) {
    console.error("[Sumo API] Chat error:", error);
    return res.status(500).json({ error: error.message || "Internal AI error" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  server.listen(port, "0.0.0.0", () => {
    console.log(`[Sumo Server] \u09B8\u09C1\u09AE\u09CB \u098F\u0986\u0987 (Sumo AI) running on port ${port}`);
  });
}
startServer();
