# Chinese Character Film

## Run with Xiaomi MiMo-V2.5-TTS

1. Copy `.env.example` to `.env`.
2. Put your Xiaomi MiMo API key in `MIMO_API_KEY`.
3. Run `npm start`.
4. Open <http://127.0.0.1:4399>.

The browser calls the local `/api/tts` endpoint. The server keeps the API key private, requests `mimo-v2.5-tts`, and returns WAV audio using the Chinese male preset voice `白桦`. Generated narration is cached in memory for replay.

Optional `.env` settings:

```dotenv
MIMO_TTS_VOICE=白桦
MIMO_BASE_URL=https://api.xiaomimimo.com/v1
PORT=4399
```

Do not open `index.html` through `file://` when TTS is enabled; the API proxy only exists on the local server.
