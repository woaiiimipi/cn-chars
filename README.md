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

## Soundtrack and recording

The soundtrack is assembled live in Web Audio at 108 BPM: a chapter-aware pentatonic motif, cinematic low-frequency percussion, Morph risers, impact accents, and a public-domain guqin layer. All music, effects, and MiMo narration are routed through the same audio master, so they are included in the exported 9:16 recording. Audio attribution is documented in `assets/audio/LICENSES.md`.

The modern form uses the OFL-licensed Masa Font brush-running-script webfont, with local Xingkai/Kaiti fallbacks for offline use. The font is preloaded from jsDelivr and explicitly awaited before the modern glyph is rasterized into the origin-clean animation canvas.

The 3D atmosphere is rendered without WebGL dependencies: parallax camera drift, volumetric light planes, perspective ink-floor contours, foreground depth bokeh, beat-synchronized focus movement, multi-layer glyph extrusion, and a five-era time carousel during Morph transitions are composited directly into the world and glyph canvases so recording matches playback. On the final transition, the four ancestral forms spiral into the modern running-script form. A stereo carousel whoosh is routed into the recording mix with the rest of the soundtrack.

The director cut uses a sub-second guess hook, progressively reveals the time carousel instead of repeating it at full strength, and traces a clipped golden “surviving stroke” through every Morph. The final reveal drops the score into a brief silence before the strongest impact, limits kinetic subtitles to semantic keywords, and morphs the modern form back into the oracle form so exported videos end on a loop-compatible frame.

The visual direction is a bright, family-friendly “spring in full harmony” world rather than a dark historical chamber. Each semantic motion owns an interactive environment: the horse’s articulated lower strokes land as hooves in a flowered meadow, the fish swims through caustic underwater light with bubbles and sea grass, the cart rolls over a sunlit country road, rain creates visible garden ripples, and boats ride a moving spring sea. Petals, pollen, bubbles, grass and environmental sound cues are generated procedurally and are captured in the same MP4 render path.

Each character now has a semantic spatial pose instead of sharing one centered presentation. Oracle and bronze fish rotate continuously by 90 degrees into a horizontal swimming pose before later scripts return upright; birds settle onto a flowering branch and call, dragons travel through cloud layers with yaw-based depth compression, celestial characters become the sun or moon in the sky, and land characters make contact with their terrain. Pseudo-3D extrusion is sliced into variable-thickness bands, giving bodies, trunks and central strokes more volume while tails, legs and edges stay lighter. Pose changes are evaluated from the interpolated era value, so orientation and depth remain continuous through SDF Morph transitions.
