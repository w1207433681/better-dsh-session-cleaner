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
  '# 工作区产物隔离规则',
  '',
  '每个新会话先运行：',
  '',
  'powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "<topic>"',
  '',
  '以输出的 SESSION_WORKDIR 作为当前会话唯一工作目录。样本、解压、脚本、报告、日志、缓存和下载物都写入该目录。',
  '',
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
