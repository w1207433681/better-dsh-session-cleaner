# better-dsh-session-cleaner (open-source build)

A DSH session deletion plugin with a family tree, workspace artifact folders, and optional folder deletion.

This build is workspace-independent. It derives artifact paths from each session header.cwd and contains no machine-specific root.

## Features

- Delete session logs, workspace records, archive/pin entries, and projection cache.
- Family tree for subagents and derived conversations.
- Show workspace artifact paths, folder sizes, open buttons, and per-folder checkboxes.
- Cross-workspace artifact resolution under <workspace>\sessions.
- Two binding sources: artifact_workdir.txt sidecar and session-artifacts.json manifest.
- Missing folders are never created automatically. The dialog offers an explicit Create and bind button.
- One-click workspace binding from a new folder-plus icon beside the workspace header controls; it sends only the current session id and the Host derives the workspace root from that session header.
- A detailed workspace-binding view in the bulk-delete dialog header, listing every workspace with bound/unbound badges and binding them one by one.
- Durable binding state: the header icon stays green for a bound session and re-reads state when switching sessions instead of flashing briefly.
- A one-time installer that writes AGENTS.md rules and the initializer script.

## Install

Clone the repository:

    git clone https://github.com/w1207433681/better-dsh-session-cleaner.git

Copy the repository contents to:

    C:\Users\You\.dsh\profiles\desktop\node_modules\better-dsh-session-cleaner

Restart DSH completely after changing Host-side files.

## Workspace binding

### UI entries

1. The folder-plus icon beside the workspace header controls binds the current workspace in one click. It sends only the current session id; the Host derives the workspace root from that session header, with no machine-specific path in the client.
2. The bulk-delete dialog header offers Detailed workspace binding, which lists all workspaces with bound/unbound badges, offers Rebind for bound workspaces, and shows success/error feedback.
3. The header icon green is durable: a read-only workspace-status route checks the current session so reopening a bound session keeps the green state.

### Command-line installer

From the workspace root:

    powershell -NoProfile -ExecutionPolicy Bypass -File .\node_modules\better-dsh-session-cleaner\scripts\install-workspace.ps1 -Workspace .

The installer copies the initializer to .dsh\session-workspace.ps1, creates sessions\session-artifacts.json, and appends a marked AGENTS.md block without overwriting existing rules.

For each new session:

    powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "topic"

## Manifest

    {
      "version": 1,
      "sessions": {
        "session-8686b40a-...": "20261124-workspace-isolation"
      }
    }

Values are relative folder names under <workspace>\sessions. Absolute paths, .. traversal, and the sessions root itself are rejected.

## Development

    npm run check
    npm test

## Privacy

The dialog displays local artifact folder paths and sizes. They are read from local DSH session records and the local workspace manifest only.

## Credits

This project is based on better-dsh-session-deletetool 0.7.5 by Lzcdebear. It keeps the original family tree, batch delete flow, Host/Client structure, and interaction design.

Original project: https://github.com/Lzcdebear/better-dsh-session-deletetool

Thanks to the original author for the foundation.

## License

MIT
