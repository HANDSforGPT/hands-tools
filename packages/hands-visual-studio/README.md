# HANDS Visual Studio — Element-Level Editing (v0.2)

A video is editable only if its **source scene graph and element layers** survive rendering. For newly produced videos, write a `scenegraph.json` with stable IDs for individual actors, images, logos, backgrounds, light effects, titles, voice tracks, and sound effects. Run `hands_scenegraph.py PROJECT_FOLDER` before importing the project into HANDS. It creates `visual-studio.json`, independent `elements/*.svg` master vectors and transparent PNG raster proxies.

HANDS Visual Studio imports those as true independent timeline elements. You can move, resize, trim, rotate, change opacity, set fade-in/out, choose a different timing, or define linear end X/Y movement. Press **Sync code elements** to refresh sources while preserving manually changed layout, animation and timing by stable source ID. Sources remain untouched. Project revisions save on the external SSD when available.

For non-static Remotion/Three.js layers, use code-side object isolation (one named render pass per object) to export transparent animated ProRes 4444 with the alpha channel, or retain structured animation/3D source with editable transforms. A single flattened MP4 never contains enough information to reconstruct its separate graphics. The default compiler includes a stand-alone vector figure style, simple shapes, light bloom, grid and source-image/audio elements; complex 3D or skeletal animation remains source-dependent.

## Example scenegraph.json

```json
{
  "schema": 2, "fps": 30, "width": 1920, "height": 1080, "duration": 10,
  "elements": [
    {"id":"bg","kind":"rect","color":"#15212D","x":0,"y":0,"width":100,"height":100,"track":0},
    {"id":"hero","kind":"figure","pose":"aim","helmet":true,"x":12,"y":20,"width":32,"height":68,"motion":{"toX":28,"toY":20}},
    {"id":"logo","kind":"image","src":"assets/logo.png","x":80,"y":3,"width":14,"height":14},
    {"id":"headline","kind":"text","text":"YOU ARE INFANTRY","fontSize":7,"color":"#fff","x":8,"y":8,"width":70,"height":16},
    {"id":"voice","kind":"audio","src":"voice/voiceover.wav","start":0,"duration":10,"track":3}
  ]
}
```

## Important distinction

- Individual vector/image/text/audio elements: directly movable and exportable now.
- Precomposed clips: still trim and move as whole clips only.
- Dynamic 3D/animated objects: require an isolated alpha pass or dedicated code-level scene graph integration. Don't represent them as automatically editable until those assets are actually exported.

More information: https://www.remotion.dev/docs/transparent-videos
