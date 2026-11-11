# HANDS JARVIS Silver · v0.2 usability upgrade

This companion is a modified [Roamies](https://github.com/KenKaiii/Roamies) desktop application distributed with the matching AGPL-3.0 source and a HANDS Tool Store instruction package. It is **not** a replacement for HANDS' own permission engine.

## Working in source

- Silver/platinum JARVIS orb with bright animated specular highlights; JARVIS is the default for new companion profiles.
- Double-click the desktop orb to launch the existing HANDS application. Dragging, one-click reactions, native voice shortcuts, screen explanation and on-screen guidance retain their upstream behavior.
- HANDS tab in the companion panel with a metal-and-graphite visual design.
- Discover installed HANDS Tool Store module names from the authenticated Mac's local install directory, without exposing account folders or secrets.
- A searchable/typed prompt field and quick presets for Visual Studio, Video Analyzer, True Voice and Live Mission Control.
- **Review-first command handoff:** copies the bounded user-authored prompt to macOS clipboard and opens HANDS, where the user pastes and submits it. This is **not** autonomous HANDS command execution.
- Read-only live render queue/status from the locally running HANDS Visual Studio service on loopback port 5127: project names, progress, stages, export presence and QA counts. No made-up or cached percentages.
- The HANDS tab refreshes every six seconds only while visible. No network-facing listener, credentials, remote command endpoint or unrestricted file APIs.
- Quick controls for existing microphone, desktop action and Stop operations; pause requests do not falsely claim they stopped independently running external jobs.
- Optional manual edge docking, optional low-power panel animation and reduced-motion styling.
- Recent prompt handoffs during the current panel session.

## Limitations and safety boundaries

This beta does not yet route JARVIS speech directly to HANDS' privileged tools, connect Fish Audio to HANDS True Voice, inherit HANDS Brain memory, or automatically detect full-screen games to hide itself. Those need a reviewed authenticated HANDS-side bridge and native QA. Native Roamies speech and screen features remain available with their own explicit permissions.

The icon in macOS menu bar opens the existing Roamies panel. Select **HANDS** from the sidebar for these controls. Double-click the orb to open HANDS. All desktop actions inside HANDS continue through HANDS' own approval and usage model.

The macOS installer workflow publishes an **unsigned** Apple Silicon application ZIP as a GitHub Actions artifact if the build succeeds; it does not self-publish a trusted release, sign or notarize the app. The original upstream updater is disabled for this custom build to avoid replacing the silver derivative with the unmodified release.

## Build and installation

### Quick inspection

```bash
git clone https://github.com/HANDSforGPT/hands-tools.git
cd hands-tools
bash runtime/hands-jarvis-silver/launcher.sh --doctor
```

### Install source and compile

Requires Git, Node.js 22+, Rust/Cargo, Tauri CLI v2, macOS 13.5+ and macOS development prerequisites. Build downloads can be large. Install on an external SSD by setting `HANDS_JARVIS_HOME` to an **empty** source destination.

```bash
export HANDS_JARVIS_HOME="/Volumes/EMTEC X200E/HANDS Projects/JARVIS Silver/Source"
bash runtime/hands-jarvis-silver/launcher.sh --install
(cd "$HANDS_JARVIS_HOME/showcase/tauri/sidecar" && npm ci)
bash runtime/hands-jarvis-silver/launcher.sh --build
bash runtime/hands-jarvis-silver/launcher.sh --launch
```

Do **not** run `--install` if that source directory already exists. The install script refuses overwriting a source directory. For the existing source on this Mac, set `HANDS_JARVIS_HOME` and run `--doctor`, followed by `--build` when build tools are available.

### GitHub download path

The HANDS tool manifest is at `packages/hands-jarvis-silver/package.json`. This manifest is declarative and never installs a separate executable. The GitHub Actions workflow `.github/workflows/hands-jarvis-silver.yml` builds a separately downloadable macOS Apple Silicon ZIP when successful.

### Validation

- `node --check` for the desktop, panel, renderer, and Node sidecar scripts
- Apply `silver.patch` to an unmodified Roamies commit `bd1e411f9cf9c9f54aaa3e98d265d4c33b38ccc5`
- `node scripts/build-registry.mjs && node scripts/validate.mjs` validates the HANDS Tool Store entry
- Source tests for HANDS status filtering and no external shell execution are in `showcase/tauri/src-tauri/src/hands.rs`.
- Test display interactions and privacy in an actual compiled macOS app before claiming runtime completion.

See [NOTICE.md](NOTICE.md) for Roamies attribution and AGPL-3.0 obligations.
