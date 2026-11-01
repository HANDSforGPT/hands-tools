# HANDS Visual Studio

Downloadable video tool for HANDS for GPT 1.2.57 or newer.

Features: dedicated pinned left-sidebar workspace, SSD-first persistent .hvs.json projects, interactive video/image/text/audio timeline, drag-to-reposition layers, property inspector, undo/redo, Remotion and ReelMade import, and MP4 export through local FFmpeg.

## Native requirement
The downloaded tool package describes workflows. The embedded workspace is provided by the signed HANDS app version 1.2.57 or later. Installing the package alone does not patch older app binaries.

## Save format
Project schema 1 uses id, name, revision, fps, width, height, duration, source, and layers. Each layer includes id, type, name, src when media, track, start, trim, duration, x, y, width, height, opacity, and volume. Source media stays intact, and edits save to project.hvs.json.

## Generator contract
To keep scenes editable, generate a visual-studio.json file next to the render containing separately movable media/text/audio layers. The importer accepts absolute paths under approved folders and relative media paths resolved against source folder. Video rendered into one MP4 without layer metadata can only be edited as a flattened clip. A source-side timeline.json allows scene markers but does not magically reconstruct separate objects.

## Safety and storage
Local-only 127.0.0.1 service; no cloud upload. Approved source folders only. Output saved to attached SSD by default or HANDS Projects locally if the SSD is absent. Exports are written under each project folder. The tool package cannot execute downloaded scripts or bypass core HANDS permission limits.

## Use
Install from Tools; pin HANDS Visual Studio; click the left-sidebar entry; import existing video folder or make a project; adjust layers and save; export MP4.
