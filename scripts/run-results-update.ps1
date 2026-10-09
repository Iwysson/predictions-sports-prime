# Runs the football results automation pipeline (fixtures:sync -> results:settle ->
# results:validate) and appends timestamped output to logs/results-update.log.
# Registered as a Windows Task Scheduler job; does NOT commit — review and commit
# the updated snapshots manually (git status / git diff) when convenient.

$ErrorActionPreference = "Stop"
Set-Location "E:\site_app\predictions-sports-prime"

$logDir = "E:\site_app\predictions-sports-prime\logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = Join-Path $logDir "results-update.log"

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "`n===== $timestamp ====="

& "C:\Program Files\nodejs\npm.cmd" run results:update *>> $logFile
Add-Content -Path $logFile -Value "exit code: $LASTEXITCODE"
