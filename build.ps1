# Stop execution on any error
$ErrorActionPreference = "Stop"

# Paths
$root  = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$build = Join-Path $root "build"
$dist  = Join-Path $root "dist"

# Read version from manifest.json
$manifest = Get-Content -Raw -Path ".\manifest.json" | ConvertFrom-Json
$version  = $manifest.version
if (-not $version) { throw "Failed to read version from manifest.json" }

# Clean and recreate build; keep dist for history
if (Test-Path $build) { Remove-Item $build -Recurse -Force }
New-Item $build -ItemType Directory | Out-Null
if (-not (Test-Path $dist)) { New-Item $dist -ItemType Directory | Out-Null }

# Files and folders to include in the build
$includePaths = @(
  "manifest.json",
  "icons",
  "_locales",
  "popup.html",
  "popup.js",
  "styles.css",
  "sw.js",
  "LICENSE"
)

foreach ($p in $includePaths) {
  if (Test-Path $p) { Copy-Item $p -Destination $build -Recurse -Force }
}

# Exclude unnecessary items from the build
$excludes = @(".git", ".github", "node_modules", ".vscode", ".idea", "screenshots", "tests", "bin", "src")
foreach ($e in $excludes) {
  $target = Join-Path $build $e
  if (Test-Path $target) { Remove-Item $target -Recurse -Force }
}

# Create ZIP with timestamp to avoid overwrite
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName   = "smarturls-$version-$timestamp.zip"
$zipPath   = Join-Path $dist $zipName  # <- this is an absolute path now

Push-Location $build
Compress-Archive -Path * -DestinationPath $zipPath -Force
Pop-Location

Write-Host "✅ Build completed successfully: $zipPath"
