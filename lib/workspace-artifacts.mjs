import { isAbsolute, join, normalize, sep } from 'node:path'

export function workspaceGroupKey(workspacePath, cwd) {
  const raw = typeof workspacePath === 'string' && workspacePath.trim() !== ''
    ? workspacePath
    : cwd
  if (typeof raw !== 'string' || raw.trim() === '') return 'ungrouped'
  return 'p:' + normalize(raw.trim()).replace(/[\\/]+$/, '').toLowerCase()
}

export const WORKSPACE_BINDING_MARKER = '<!-- better-dsh-session-cleaner:workspace-binding -->'

export function workspaceBindingIsComplete({ initializerText, manifestText, agentsText }) {
  return initializerText !== null
    && manifestText !== null
    && agentsText !== null
    && typeof agentsText === 'string'
    && agentsText.includes(WORKSPACE_BINDING_MARKER)
}

/**
 * Resolve the per-workspace artifact root from a DSH session header.
 * DSH stores the owning workspace in header.cwd; the convention used by the
 * bundled initializer is <workspace>\sessions.
 */
export function artifactRootFor(header) {
  const cwd = typeof header?.cwd === 'string' ? header.cwd.trim() : ''
  if (cwd === '' || !isAbsolute(cwd)) return null
  return join(cwd, 'sessions')
}

export function normalizeRoot(root) {
  if (typeof root !== 'string' || root.trim() === '' || !isAbsolute(root)) return null
  return normalize(root)
}

export function isUnderRoot(root, candidate) {
  const normalizedRoot = normalizeRoot(root)
  if (normalizedRoot === null) return false
  if (typeof candidate !== 'string' || candidate.trim() === '' || !isAbsolute(candidate)) return false
  const target = normalize(candidate)
  const left = normalizedRoot.toLowerCase()
  const right = target.toLowerCase()
  if (right === left || !right.startsWith(left + sep.toLowerCase())) return false
  return true
}

export function readSidecarTarget(raw) {
  if (typeof raw !== 'string') return null
  const value = raw.replace(/^\uFEFF/, '').trim()
  return value === '' ? null : value
}

export function readManifestMap(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return new Map()
  let parsed
  try {
    parsed = JSON.parse(raw.replace(/^\uFEFF/, '').trim())
  } catch {
    return new Map()
  }
  const sessions = parsed && typeof parsed.sessions === 'object' && parsed.sessions !== null
    ? parsed.sessions
    : {}
  return new Map(Object.entries(sessions).filter(([, value]) => typeof value === 'string' && value !== ''))
}

/**
 * Resolve a session's artifact directory from the two supported bindings.
 * Sidecar wins; the manifest is the fallback for sessions created before the
 * sidecar existed or by tools that only maintain the manifest.
 */
export function resolveWorkspaceArtifactTarget({ root, sessionId, sidecarText, manifestText }) {
  const normalizedRoot = normalizeRoot(root)
  if (normalizedRoot === null || typeof sessionId !== 'string' || sessionId === '') return null

  const sidecar = readSidecarTarget(sidecarText)
  if (sidecar !== null) {
    const target = normalize(sidecar)
    if (isUnderRoot(normalizedRoot, target)) return target
  }

  const relative = readManifestMap(manifestText).get(sessionId)
  if (relative !== undefined && !isAbsolute(relative)) {
    const target = normalize(join(normalizedRoot, relative))
    if (isUnderRoot(normalizedRoot, target)) return target
  }

  return null
}

export function defaultArtifactName(sessionId, now = new Date()) {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const tail = String(sessionId).replace(/[^A-Za-z0-9_-]/g, '').slice(-6) || 'session'
  return stamp + '-' + tail
}

export function manifestWithBinding(manifestText, sessionId, relativeName) {
  const entries = [...readManifestMap(manifestText).entries()]
  const index = entries.findIndex(([id]) => id === sessionId)
  if (index >= 0) entries[index] = [sessionId, relativeName]
  else entries.push([sessionId, relativeName])
  const sessions = Object.fromEntries(entries)
  return JSON.stringify({ version: 1, sessions }, null, 2) + '\n'
}
