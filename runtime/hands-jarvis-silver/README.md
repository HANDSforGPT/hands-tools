# HANDS JARVIS Silver
## Roamies-derived desktop companion + HANDS tool module

A chrome/platinum JARVIS particle-sphere visual for the [Roamies](https://github.com/KenKaiii/Roamies) desktop app, plus a declarative [HANDS Tool Store](../../packages/hands-jarvis-silver/package.json) module for inspecting, installing, building, and launching it with HANDS' existing approved terminal commands.

**What is working in source:** the original JARVIS animation remains voice reactive; dot colors shift to charcoal, silver, platinum and white, with a diagonal moving specular sheen. Selecting another Roamies character restores its original colors. The modified app gets its own application name and bundle identifier; the upstream auto-update endpoints are cleared to avoid replacing this modified build with the unmodified release.

**What this is not:** it does not embed a native orb inside the HANDS window, call HANDS' MCP tools from Roamies, or automatically install executable code from the HANDS Tool Store. The companion retains its independent AI provider setup and optional Fish Audio voice. Full native HANDS/UI and permission-bridging integration is separate work.

### Files

- `silver.patch`: modifications to the upstream JavaScript renderer and Tauri app configuration.
- `launcher.sh`: an opt-in four-action helper: inspect, install pinned source, build, launch.
- `NOTICE.md`: licensing and original attribution.
- `../../packages/hands-jarvis-silver/package.json`: HANDS Store manifest (instructions only).

### Reproducible source installation (macOS, Apple Silicon or Intel)

Prerequisites: macOS **13.5+**, Git; for building, Node.js **22+**, Rust/Cargo, Tauri 2 CLI prerequisites, and Xcode Command Line Tools. The build may download additional dependencies. Allow sufficient storage.

Clone this HANDS tool repository and inspect the script and patch first:

```bash
git clone https://github.com/HANDSforGPT/hands-tools.git
cd hands-tools
bash runtime/hands-jarvis-silver/launcher.sh --doctor
bash runtime/hands-jarvis-silver/launcher.sh --install
bash runtime/hands-jarvis-silver/launcher.sh --build
bash runtime/hands-jarvis-silver/launcher.sh --launch
```

Set `HANDS_JARVIS_HOME="/path/to/empty/source-directory"` to install sources on an external SSD. The installer refuses existing folders, pins the exact upstream commit, and checks that the patch applies. It does not run `--build` or `--launch` without being asked. Do not reinstall over working files.

Already-prepared user source on this Mac (do not patch it twice): `/Users/user/IronlinkProjects/HANDS-JARVIS-SILVER/Roamies`. To use that location:

```bash
export HANDS_JARVIS_HOME="/Users/user/IronlinkProjects/HANDS-JARVIS-SILVER/Roamies"
bash runtime/hands-jarvis-silver/launcher.sh --doctor
```

Choose **JARVIS** in the companion after launch. When distributing a built app, provide the matching AGPL-3.0 source, modification patch, third-party notices and install/build scripts. If distributing a signed/notarized macOS app, arrange your own signing/notarization.

### Verification

- `node --check showcase/roamies/10-dither.js` — renderer syntax
- `git diff --check` — patch whitespace sanity
- `bash runtime/hands-jarvis-silver/launcher.sh --doctor` — local prerequisites and patch state
- In the HANDS repo, `node scripts/build-registry.mjs && node scripts/validate.mjs` — registry checks

**License:** AGPL-3.0. The original project and source are by KenKaiii and contributors, not HANDS. See [NOTICE.md](NOTICE.md).
