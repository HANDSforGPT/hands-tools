#!/usr/bin/env bash
# HANDS JARVIS Silver: explicit, non-automatic source installer / builder / launcher.
# Based on Roamies by KenKaiii, AGPL-3.0; see README.md and NOTICE.md.
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.cargo/bin:$PATH"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
UPSTREAM="https://github.com/KenKaiii/Roamies.git"
COMMIT="bd1e411f9cf9c9f54aaa3e98d265d4c33b38ccc5"
SOURCE="${HANDS_JARVIS_HOME:-$HOME/HANDS-JARVIS-SILVER/source}"
ACTION="${1:---doctor}"
APP="$SOURCE/showcase/tauri/src-tauri/target/release/bundle/macos/HANDS JARVIS Silver.app"

doctor() {
  printf 'HANDS JARVIS Silver – source: %s\n' "$SOURCE"
  for cmd in git node npm cargo rustc python3; do
    if command -v "$cmd" >/dev/null 2>&1; then
      printf '%-9s %s\n' "$cmd" "$(command -v "$cmd")"
    else printf '%-9s MISSING\n' "$cmd"; fi
  done
  if command -v cargo >/dev/null 2>&1; then
    cargo tauri --version 2>/dev/null || echo "cargo-tauri CLI: missing (required for build)"
  fi
  if [ -d "$SOURCE/.git" ]; then
    printf 'Checked-out upstream: '; git -C "$SOURCE" rev-parse --short HEAD
    if git -C "$SOURCE" apply --reverse --check "$HERE/silver.patch" >/dev/null 2>&1; then
      echo "Silver source patch: APPLIED"
    else echo "Silver source patch: NOT VERIFIED"; fi
  else echo "Silver source: not installed"; fi
  [ -d "$APP" ] && echo "App bundle: BUILT at $APP" || echo "App bundle: not built"
  [ "$(uname -s)" = Darwin ] || echo "Note: this launcher is primarily tested on macOS."
}
install_source() {
  command -v git >/dev/null || { echo "Git is required"; exit 2; }
  if [ -e "$SOURCE" ]; then
    echo "Refusing to overwrite existing location: $SOURCE"
    echo "Set HANDS_JARVIS_HOME to an empty source path, or use --doctor/--build."
    exit 2
  fi
  mkdir -p "$(dirname "$SOURCE")" "$SOURCE"
  git -C "$SOURCE" init -q
  git -C "$SOURCE" remote add origin "$UPSTREAM"
  git -C "$SOURCE" fetch --depth 1 origin "$COMMIT"
  git -C "$SOURCE" checkout -q --detach FETCH_HEAD
  if [ "$(git -C "$SOURCE" rev-parse HEAD)" != "$COMMIT" ]; then
    echo "Upstream commit mismatch; aborting"; exit 2
  fi
  git -C "$SOURCE" apply --check "$HERE/silver.patch"
  git -C "$SOURCE" apply "$HERE/silver.patch"
  node --check "$SOURCE/showcase/roamies/10-dither.js"
  echo "Silver source ready: $SOURCE"
  echo "Next: --doctor; then --build (downloads dependencies and compiles)"
}
build_app() {
  [ -d "$SOURCE/.git" ] || { echo "Run --install first, or set HANDS_JARVIS_HOME to prepared source"; exit 2; }
  for cmd in node npm cargo rustc; do
    command -v "$cmd" >/dev/null 2>&1 || { echo "Missing build prerequisite: $cmd"; exit 2; }
  done
  git -C "$SOURCE" apply --reverse --check "$HERE/silver.patch" || { echo "Source is not patched; refusing to build"; exit 2; }
  node --check "$SOURCE/showcase/roamies/10-dither.js"
  echo "Building the independent silver Roamies companion (not modifying HANDS core)..."
  (cd "$SOURCE/showcase/tauri" && ./build.sh)
  [ -d "$APP" ] || { echo "Build exited without expected app bundle: $APP"; exit 2; }
  echo "Built: $APP"
}
launch_app() {
  [ "$(uname -s)" = Darwin ] || { echo "Use your platform installer"; exit 2; }
  [ -d "$APP" ] || { echo "No compiled app at $APP; run --doctor and --build"; exit 2; }
  open "$APP"
  echo "Launched $APP"
}
case "$ACTION" in
  --doctor) doctor ;;
  --install) install_source ;;
  --build) build_app ;;
  --launch) launch_app ;;
  *) printf 'Usage: %s {--doctor|--install|--build|--launch}\n' "$0"; exit 2 ;;
esac
