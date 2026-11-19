# PostToolUse hook (Edit|Write): re-checks the CLAUDE.md hard constraints on index.html.
# Exit 2 + stderr feeds the violations back to Claude so it fixes them.
$raw = [Console]::In.ReadToEnd()
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$path = $data.tool_input.file_path
if (-not $path) { exit 0 }

$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { $data.cwd }
$target = Join-Path $root 'index.html'
try { $resolved = (Resolve-Path -LiteralPath $path -ErrorAction Stop).Path } catch { exit 0 }
if ($resolved -ne (Resolve-Path -LiteralPath $target).Path) { exit 0 }

$forbidden = 'localStorage|sessionStorage|indexedDB|cookie|!important|alert\(|confirm\('
$violations = @()
$n = 0
foreach ($line in Get-Content -LiteralPath $target) {
  $n++
  if ($line -match $forbidden) { $violations += "line ${n}: forbidden API/CSS -> $($line.Trim())"; continue }
  if ($line -match 'http' -and $line -notmatch 'formsubmit\.co') { $violations += "line ${n}: URL other than formsubmit.co -> $($line.Trim())"; continue }
  if ($line -match '[\w.+-]+@[\w-]+\.[\w.]+' -and $line -notmatch 'YOUR_EMAIL@example\.com') { $violations += "line ${n}: email address other than the placeholder -> $($line.Trim())" }
}

if ($violations.Count -gt 0) {
  [Console]::Error.WriteLine("index.html breaks CLAUDE.md hard constraints:`n" + ($violations -join "`n"))
  exit 2
}
exit 0
