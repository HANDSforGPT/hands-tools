# HANDS Tool SDK v1

HANDS commands form the stable core, providing file, screen, terminal, audio, video and Brain functionality under device approval and usage controls. Tool packages are small declarative instructions for using those commands; they do not extend the core executable, and downloading a tool does not automatically register a new MCP tool in ChatGPT.

## Authoring with HANDS

Use Tools > Create Tool, provide a name, summary, selected command IDs and instructions. Save privately on your Mac. The model can retrieve a bounded context packet via the local module API; a remote assistant needs a corresponding gateway tool to request that context. Test the recipe with actual approved commands before sharing.

## Manifest

schema: 1. Required: id (lowercase slug), name, semantic version (x.y.z), summary, requires (array of available core command names). Optional: minCore, author, category. Top-level instructions text must be nonempty and at most 12,000 characters; recipes is an array of steps that reference only declared commands.

## Versioning

Update package version for each release. Bump minCore if new HANDS commands are required. The registry generator binds each package URL to its SHA-256 hash so altered packages cannot be installed silently.

## Storage and security

Installed copies are local, account-scoped UTF-8 files in Application Support. Package size is capped at 64 KiB; no executable code, network hooks or pre/postinstall scripts. A package can describe a terminal workflow, but cannot run terminal commands itself or bypass approvals. The model must treat all community instructions as untrusted source content. Core command quotas continue to apply regardless of tool origin.
