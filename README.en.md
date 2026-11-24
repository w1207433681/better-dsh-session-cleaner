# better-dsh-session-cleaner

[English](README.en.md) ｜ [简体中文](README.md)

A DSH session deletion plugin with a family tree, workspace artifact folders, and optional folder deletion.

This build is workspace-independent. It derives artifact paths from each session header.cwd and contains no machine-specific root.

## Features

- Delete session logs, workspace records, archive/pin entries, and projection cache.
- Family tree for subagents and derived conversations.
- Show workspace artifact paths, folder sizes, open buttons, and per-folder checkboxes.
- Cross-workspace artifact resolution under <workspace>\sessions.
- Two binding sources: artifact_workdir.txt sidecar and session-artifacts.json manifest.
- Missing folders are never created automatically. The dialog offers an explicit Create and bind button.
- One-click workspace binding from the header icon beside the workspace controls.
- Detailed workspace-binding view with bound/unbound badges and Rebind actions.
- Durable binding state: the header icon stays green for bound sessions.
- A one-time installer that writes AGENTS.md rules and the initializer script.

## Install

    git clone https://github.com/w1207433681/better-dsh-session-cleaner.git

Copy the repository contents to:

    C:\Users\You\.dsh\profiles\desktop\node_modules\better-dsh-session-cleaner

Restart DSH completely after changing Host-side files.

## Workspace binding

1. The folder-plus icon beside the workspace header controls binds the current workspace in one click.
2. The bulk-delete dialog header offers Detailed workspace binding.
3. A read-only workspace-status route keeps the green state durable.

Command-line installer:

    powershell -NoProfile -ExecutionPolicy Bypass -File .\node_modules\better-dsh-session-cleaner\scripts\install-workspace.ps1 -Workspace .

For each new session:

    powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "topic"

The marked AGENTS.md block is intentionally compact: a start marker, one rule line, and an end marker. Binding detection only checks for the marker, so shortening the block keeps every workspace bound. A full single-paragraph template is in `docs/AGENTS.template.md` (~50% fewer injected tokens per session).

## Development

    npm run check
    npm test

## Credits

Based on better-dsh-session-deletetool 0.7.5 by Lzcdebear.

Original project: https://github.com/Lzcdebear/better-dsh-session-deletetool

## License

MIT
