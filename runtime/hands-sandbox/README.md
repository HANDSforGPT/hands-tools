# HANDS Sandbox Engine v0.1

A small **opt-in VM runner** used by the [HANDS Tool Store module](../../packages/hands-sandbox). It is a separate Node.js executable and does not add a new privileged MCP command or bypass HANDS approval. It uses **Lima's Apple Virtualization (VZ)** on supported Apple Silicon Macs, with virtual-disk storage explicitly on an attached volume.

## What is implemented

- `doctor`: check CPU/OS/backend/external disk, **read-only**; no downloads.
- `status`: show VM state, **read-only**.
- `setup --approve`: create the 2 vCPU / 2 GiB RAM / **12 GiB virtual disk** Linux VM on the external SSD using Lima's `template:default`; may download a Linux cloud image. No automatic installation of Lima.
- `run --approve --network-aware --cmd '...'`: start VM, execute Linux command with guest and host timeouts, capture bounded output, stop VM afterward.
- `stop --approve`: stop the VM. No delete command, so no accidental destruction of user data.
- One operation at a time via an exclusive lock. No fallback to executing untrusted commands on the host.

## Prerequisites

1. macOS 13.5 or later on Apple Silicon, Node.js 20+, external storage volume, and `limactl` (Lima) installed separately with permission.
2. External SSD at `/Volumes/EMTEC X200E` on the development computer, or configure `HANDS_SANDBOX_HOME=/Volumes/YourDrive/HANDS/Sandbox Engine` on any other Mac. Refuses internal paths, dismounted volumes and implicit fallback to `~/Library`.
3. Lima installed by the user (see https://lima-vm.io/docs/installation/). **This repository does not install it automatically.** No VM image or Linux download is shipped.
4. At least **6 GiB available** on the chosen external drive prior to setup. The 12 GiB virtual disk is an upper virtual size, **not a strict disk-usage quota**; storage usage must be monitored.

## Commands

```bash
export HANDS_SANDBOX_HOME='/Volumes/EMTEC X200E/HANDS/Sandbox Engine'
node runtime/hands-sandbox/cli.mjs doctor
node runtime/hands-sandbox/cli.mjs status
# Only after you approve the Linux image download:
node runtime/hands-sandbox/cli.mjs setup --approve
# Guest has internet access; --network-aware is explicit acknowledgment:
node runtime/hands-sandbox/cli.mjs run --approve --network-aware --cmd 'python3 -c "print(2 + 2)"' --timeout 60
node runtime/hands-sandbox/cli.mjs stop --approve
```

On macOS, ensure the external volume remains connected throughout setup and execution. Run **only one operation at a time**. The tool itself does not trigger a VM install or run just because the Tool Store package was added.

## Security boundaries and limitations

The guest is isolated from the host filesystem by Lima's VM boundary with `--mount-none --plain`. The VM does **not** receive default host home-directory mounts, SSH credentials or API keys from this runner. Network access remains **enabled** inside the VM and the guest may still reach resources over the network; **it is not a network-isolated environment**. Running hostile malware remains risky; the tool is intended for standard code compilation/tests with extra containment, not a guarantee against VM escapes. The VM manager and Linux image must be trusted and kept updated.

A VM's configured **disk size is not a hard host quota**. The lock file protects against concurrent operations but can remain after a crash; inspect any residual process before manually removing it. If the host is killed abruptly, the guest may continue running until you issue `stop`.

Windows and Linux adapters are **not implemented** in v0.1; the tool reports unsupported instead of calling WSL or a container an equivalent sandbox. HANDS native desktop tools remain separate and should be used for macOS automation, GPU video rendering and ordinary trusted file tasks.

## Tests

```bash
node --test runtime/hands-sandbox/cli.test.mjs
node scripts/build-registry.mjs
node scripts/validate.mjs
```

**Tool Store limitation:** the JSON module is declarative guidance only, as defined by HANDS SDK v1. Installing it does not copy this runner from GitHub. Installation of Lima and checkout of this runner remain separate, explicit actions; there are no hidden hooks or privilege escalation.
