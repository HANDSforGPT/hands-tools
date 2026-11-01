# HANDS Sandbox Engine

Installable HANDS Tool Store **guidance package** for an optional Linux VM backend. This package never executes code itself. See [the separate runner](../../runtime/hands-sandbox/README.md) to install the real VM CLI and review prerequisites.

## Security boundary

* No host directory mounts; no secrets automatically passed to the guest.
* **Outbound guest network remains available** (not an air-gapped sandbox).
* Terminal operations still require normal HANDS account and local approval.
* VM creation is explicitly opt-in; a 12-GiB virtual disk is a **virtual maximum**, not an absolute host-disk consumption guarantee.
* No native execution fallback for an unsafe guest command.

## Compatibility

macOS 13.5+ Apple Silicon + Lima (VZ). Windows/Linux providers are pending; the tool reports unsupported instead of pretending to isolate them.
