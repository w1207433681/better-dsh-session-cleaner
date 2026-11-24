import test from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import {
  artifactRootFor,
  defaultArtifactName,
  manifestWithBinding,
  resolveWorkspaceArtifactTarget,
  WORKSPACE_BINDING_MARKER,
  workspaceBindingIsComplete,
  workspaceGroupKey,
} from '../lib/workspace-artifacts.mjs'

const root = join('F:\\workspace', 'sessions')
const sid = 'session-abc123'

test('artifactRootFor derives the sessions folder from header.cwd', () => {
  assert.equal(artifactRootFor({ cwd: 'F:\\workspace' }), root)
  assert.equal(artifactRootFor({ cwd: 'relative/path' }), null)
  assert.equal(artifactRootFor(undefined), null)
})

test('sidecar target is accepted only inside the workspace sessions root', () => {
  const inside = join(root, '20261124-topic')
  assert.equal(resolveWorkspaceArtifactTarget({
    root,
    sessionId: sid,
    sidecarText: inside,
    manifestText: null,
  }), inside)

  assert.equal(resolveWorkspaceArtifactTarget({
    root,
    sessionId: sid,
    sidecarText: 'C:\\Windows\\Temp',
    manifestText: null,
  }), null)
})

test('manifest target supports relative names and rejects traversal or absolute paths', () => {
  const relative = '20261124-topic'
  const manifestText = JSON.stringify({ version: 1, sessions: { [sid]: relative } })
  assert.equal(resolveWorkspaceArtifactTarget({
    root,
    sessionId: sid,
    sidecarText: null,
    manifestText,
  }), join(root, relative))

  for (const bad of ['..\\outside', 'F:\\outside']) {
    const badManifest = JSON.stringify({ version: 1, sessions: { [sid]: bad } })
    assert.equal(resolveWorkspaceArtifactTarget({
      root,
      sessionId: sid,
      sidecarText: null,
      manifestText: badManifest,
    }), null, bad)
  }
})

test('manifestWithBinding preserves existing bindings', () => {
  const first = manifestWithBinding(null, 'session-1', 'dir-one')
  const second = manifestWithBinding(first, 'session-2', 'dir-two')
  const parsed = JSON.parse(second)
  assert.equal(parsed.version, 1)
  assert.deepEqual(parsed.sessions, { 'session-1': 'dir-one', 'session-2': 'dir-two' })
})

test('defaultArtifactName is deterministic', () => {
  const date = new Date(2026, 10, 24)
  assert.equal(defaultArtifactName('session-abcdef', date), '20261124-abcdef')
})

test('workspaceGroupKey merges workspace records with cwd aliases', () => {
  const account = workspaceGroupKey('F:\\gongzuo', 'F:\\gongzuo')
  const alias = workspaceGroupKey(undefined, 'F:\\gongzuo')
  assert.equal(account, alias)
  assert.equal(workspaceGroupKey('F:\\gongzuo\\', 'F:\\gongzuo'), account)
  assert.equal(workspaceGroupKey('F:\\gongzuo', undefined), workspaceGroupKey(undefined, 'F:\\gongzuo'))
  assert.notEqual(workspaceGroupKey('F:\\gongzuo', undefined), workspaceGroupKey('F:\\jiuguan', undefined))
  assert.equal(workspaceGroupKey(undefined, undefined), 'ungrouped')
})

test('workspaceBindingIsComplete requires all three files and the marker', () => {
  const agents = '# rules\n\n' + WORKSPACE_BINDING_MARKER + '\nbound\n\n<!-- /better-dsh-session-cleaner:workspace-binding -->\n'
  const complete = { initializerText: '# init', manifestText: '{}', agentsText: agents }
  assert.equal(workspaceBindingIsComplete(complete), true)
  assert.equal(workspaceBindingIsComplete({ ...complete, initializerText: null }), false)
  assert.equal(workspaceBindingIsComplete({ ...complete, manifestText: null }), false)
  assert.equal(workspaceBindingIsComplete({ ...complete, agentsText: '# rules only' }), false)
  assert.equal(workspaceBindingIsComplete({ ...complete, agentsText: null }), false)
})
