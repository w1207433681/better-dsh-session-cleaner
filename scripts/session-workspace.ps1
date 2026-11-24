param(
  [Parameter(Mandatory = $true)][string]$Name,
  [string]$Root = (Get-Location).Path,
  [switch]$PrintPathOnly
)

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path -LiteralPath $Root).Path
$date = Get-Date -Format 'yyyyMMdd'
$slug = ($Name -replace '[^\w\u4e00-\u9fff]+', '-').Trim('-')
if ($slug -eq '') { $slug = 'session' }

$sessionDir = Join-Path $Root ("sessions\" + $date + '-' + $slug)
$subDirs = @('samples', 'work', 'exports', 'reports', 'logs', 'cache', 'evidence')
foreach ($sub in $subDirs) {
  New-Item -ItemType Directory -Force -Path (Join-Path $sessionDir $sub) | Out-Null
}

$sid = $env:DSH_SESSION_ID
$meta = [ordered]@{
  created_at = (Get-Date).ToString('o')
  name = $Name
  workdir = $sessionDir
  dsh_session_id = $sid
  subdirs = $subDirs
}
Set-Content -LiteralPath (Join-Path $sessionDir 'session.json') -Value ($meta | ConvertTo-Json -Depth 4) -Encoding UTF8

if ($sid -and $env:DSH_HOME) {
  $workspaceKey = '--' + ($Root -replace '[^A-Za-z0-9]', '-') + '--'
  $dshSessionDir = Join-Path $env:DSH_HOME ("sessions\" + $workspaceKey + "\" + $sid)
  if (Test-Path -LiteralPath $dshSessionDir) {
    Set-Content -LiteralPath (Join-Path $dshSessionDir 'artifact_workdir.txt') -Value $sessionDir -Encoding UTF8
  }
}

$manifestPath = Join-Path $Root 'sessions\session-artifacts.json'
$relative = Split-Path -Leaf $sessionDir
$sessions = @{}
if (Test-Path -LiteralPath $manifestPath) {
  try {
    $existing = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($existing.sessions) {
      foreach ($property in $existing.sessions.PSObject.Properties) {
        $sessions[$property.Name] = [string]$property.Value
      }
    }
  } catch {
    $sessions = @{}
  }
}
if ($sid) { $sessions[$sid] = $relative }
$manifest = [ordered]@{
  version = 1
  sessions = [ordered]@{}
}
foreach ($key in ($sessions.Keys | Sort-Object)) {
  $manifest.sessions[$key] = $sessions[$key]
}
Set-Content -LiteralPath $manifestPath -Value ($manifest | ConvertTo-Json -Depth 5) -Encoding UTF8

if ($PrintPathOnly) {
  Write-Output $sessionDir
} else {
  Write-Output ('SESSION_WORKDIR=' + $sessionDir)
}
