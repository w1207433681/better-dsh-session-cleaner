param(
  [string]$Workspace = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'
$Workspace = (Resolve-Path -LiteralPath $Workspace).Path
$lf = [Environment]::NewLine
$dshDir = Join-Path $Workspace '.dsh'
New-Item -ItemType Directory -Force -Path $dshDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Workspace 'sessions') | Out-Null

Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'session-workspace.ps1') -Destination (Join-Path $dshDir 'session-workspace.ps1') -Force

$manifestPath = Join-Path $Workspace 'sessions\session-artifacts.json'
if (-not (Test-Path -LiteralPath $manifestPath)) {
  $manifestLines = @('{', '  "version": 1,', '  "sessions": {}', '}', '')
  Set-Content -LiteralPath $manifestPath -Value ($manifestLines -join $lf) -Encoding UTF8
}

$marker = '<!-- better-dsh-session-cleaner:workspace-binding -->'
$agentsPath = Join-Path $Workspace 'AGENTS.md'
$blockLines = @(
  $marker,
  '新会话先运行 `powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "<topic>"`，以 SESSION_WORKDIR 为唯一工作目录，所有产物写入该目录。',
  '<!-- /better-dsh-session-cleaner:workspace-binding -->'
)
$block = $blockLines -join $lf

if (Test-Path -LiteralPath $agentsPath) {
  $current = Get-Content -LiteralPath $agentsPath -Raw -Encoding UTF8
  if ($current -notlike ('*' + $marker + '*')) {
    Add-Content -LiteralPath $agentsPath -Value ($lf + $block + $lf) -Encoding UTF8
  }
} else {
  Set-Content -LiteralPath $agentsPath -Value ($block + $lf) -Encoding UTF8
}

Write-Output ('WORKSPACE_BOUND=' + $Workspace)
