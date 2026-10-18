# HANDS Tool Modules

Free, modular, community-created instruction packages for HANDS for GPT.

Core HANDS stays on your Mac and supplies the protected computer commands. Downloaded tools contain only a manifest, instructions and workflow recipes. They **never execute downloaded JavaScript or arbitrary binaries**, never grant permissions, and cannot bypass account quotas. Installed packages are stored locally and can work offline.

## Create a tool for free

1. In HANDS, select Tools, then Create Tool.
2. Provide a name, purpose, existing HANDS command dependencies and model instructions.
3. Save and test privately with your connected AI through HANDS.
4. To publish, create a directory under packages using your tool slug and place your package.json there.
5. Run: node scripts/build-registry.mjs, followed by node scripts/validate.mjs.
6. Open a pull request. New public packages require human review.

## Tool package format

A package.json has a manifest with schema, id, name, version, summary, author, category, minCore and requires; an instructions string; and recipes with titles and ordered steps (instruction plus optional command). See any package in the packages folder for a working example.

## Trust

Official catalog: registry.json. Every package download is scoped to this GitHub repository, bounded in size, validated, and checked against its SHA-256 digest. GitHub hosts package instructions, while the user's Mac stores installed content. Account and local command permissions remain with HANDS.

To contribute, read CONTRIBUTING.md and docs/SDK.md. This public repository contains no private HANDS app source, passwords or customer data.
