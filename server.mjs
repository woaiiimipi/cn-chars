import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4399);
const apiKey = process.env.MIMO_API_KEY || "";
const baseUrl = (process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1").replace(/\/$/, "");
const defaultVoice = process.env.MIMO_TTS_VOICE || "白桦";
const audioCache = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error("Request body is too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function synthesize(text, direction, voice) {
  const cacheKey = crypto.createHash("sha256").update(`${voice}\0${direction}\0${text}`).digest("hex");
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey);

  const pending = (async () => {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mimo-v2.5-tts",
        messages: [
          { role: "user", content: direction },
          { role: "assistant", content: text },
        ],
        audio: { format: "wav", voice },
      }),
    });
    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 800);
      throw new Error(`MiMo TTS ${upstream.status}: ${detail}`);
    }
    const data = await upstream.json();
    const encoded = data?.choices?.[0]?.message?.audio?.data;
    if (!encoded) throw new Error("MiMo TTS response did not contain audio data");
    const wav = Buffer.from(encoded, "base64");
    if (wav.length < 44 || wav.toString("ascii", 0, 4) !== "RIFF") {
      throw new Error("MiMo TTS returned invalid WAV audio");
    }
    return wav;
  })();

  audioCache.set(cacheKey, pending);
  try {
    return await pending;
  } catch (error) {
    audioCache.delete(cacheKey);
    throw error;
  }
}

async function handleTts(request, response) {
  if (!apiKey) {
    return sendJson(response, 503, { error: "MIMO_API_KEY is not configured on the server" });
  }
  try {
    const body = await readJson(request);
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const direction = typeof body.direction === "string" ? body.direction.trim() : "";
    const voice = typeof body.voice === "string" && body.voice.trim() ? body.voice.trim() : defaultVoice;
    if (!text || text.length > 1000) return sendJson(response, 400, { error: "text must contain 1-1000 characters" });
    const wav = await synthesize(text, direction, voice);
    response.writeHead(200, {
      "Content-Type": "audio/wav",
      "Content-Length": wav.length,
      "Cache-Control": "private, max-age=86400",
    });
    response.end(wav);
  } catch (error) {
    console.error(error);
    sendJson(response, 502, { error: error.message || "MiMo TTS request failed" });
  }
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  if (pathname.split("/").some((segment) => segment.startsWith("."))) {
    return sendJson(response, 404, { error: "Not found" });
  }
  const filePath = path.resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return sendJson(response, 403, { error: "Forbidden" });
  }
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) return sendJson(response, 404, { error: "Not found" });
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": stat.size,
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/tts") return void handleTts(request, response);
  if (request.method === "GET") return serveStatic(request, response);
  sendJson(response, 405, { error: "Method not allowed" });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Set another PORT in .env.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Chinese character film: http://127.0.0.1:${port}`);
  console.log(apiKey ? `MiMo TTS ready · voice ${defaultVoice}` : "MiMo TTS disabled · set MIMO_API_KEY in .env");
});
