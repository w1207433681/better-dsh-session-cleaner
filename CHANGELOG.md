# Changelog

## 0.9.2

- Added a one-click workspace binding icon beside the workspace header controls, matching the surrounding header icons and using the current session from the workspace controller.
- Added a detailed workspace binding dialog opened from the bulk-delete dialog header, with per-workspace bound/unbound badges, Rebind action, and no hardcoded local paths.
- Added a read-only workspace-status route and durable green header state that persists when switching back to a bound session.
- Fixed duplicate workspace sections by grouping workspace records and cwd aliases by normalized path.
- Kept the MIT open-source build and attribution unchanged.

## 0.9.1

- Renamed the package, routes, plugin id, and docs to better-dsh-session-cleaner.
- Kept the original attribution and all workspace-artifact cleanup features unchanged.

## 0.9.0

- Renamed the package and routes to a standalone cleaner name / 会话清理器.
- Integrated workspace binding into the plugin dialog with a one-click Bind this workspace button.
- Added a Host install-workspace route that writes the initializer, manifest, and marked AGENTS.md block.
- Kept the original plugin attribution and updated docs for the new package name.

## 0.8.0

- Cross-workspace artifact resolution derived from session header.cwd.
- Added session-artifacts.json manifest support with path containment checks.
- Added explicit Create and bind action for sessions without a mapped folder.
- Added workspace-level installer that writes AGENTS.md rules and the per-session initializer.
- Kept sidecar compatibility for existing sessions.
- Added path-resolution unit tests and syntax checks.
- Added explicit attribution to the original better-dsh-session-deletetool by Lzcdebear.
