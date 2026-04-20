param(
    [string]$Message,
    [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-InterestingChanges {
    $statusLines = git status --porcelain=v1 --untracked-files=all
    if (-not $statusLines) {
        return @()
    }

    return @(
        $statusLines | Where-Object {
            $_.Length -ge 4 -and
            -not $_.Substring(3).Replace("\", "/").StartsWith(".agent/") -and
            $_.Substring(3).Replace("\", "/") -ne ".env"
        }
    )
}

function Get-PathsToStage {
    param(
        [string[]]$Changes
    )

    $paths = New-Object System.Collections.Generic.HashSet[string] ([System.StringComparer]::OrdinalIgnoreCase)

    foreach ($change in $Changes) {
        $rawPath = $change.Substring(3)
        $parts = if ($rawPath -like "* -> *") {
            $rawPath -split " -> "
        } else {
            @($rawPath)
        }

        foreach ($part in $parts) {
            $normalized = $part.Replace("\", "/")
            if ($normalized.StartsWith(".agent/") -or $normalized -eq ".env") {
                continue
            }

            [void]$paths.Add($part)
        }
    }

    return @($paths)
}

$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
    throw "Not inside a git repository."
}

Set-Location $repoRoot

$interestingChanges = Get-InterestingChanges
if ($interestingChanges.Count -eq 0) {
    Write-Host "No committable changes found outside .agent and .env."
    exit 0
}

if (-not $SkipBuild -and (Test-Path "package.json")) {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $scriptNames = @($packageJson.scripts.PSObject.Properties.Name)
    if ($scriptNames -contains "build") {
        Write-Host "Running build before commit..."
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed. Commit aborted."
        }
    }
}

$pathsToStage = Get-PathsToStage -Changes $interestingChanges
foreach ($path in $pathsToStage) {
    git add -A -- $path
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to stage $path."
    }
}

$stagedFiles = @(git diff --cached --name-only)
if ($stagedFiles.Count -eq 0) {
    Write-Host "Nothing was staged after exclusions."
    exit 0
}

if (-not $Message) {
    $scopes = @(
        $stagedFiles |
            ForEach-Object { ($_ -split "[/\\]")[0] } |
            Select-Object -Unique |
            Select-Object -First 2
    )

    $scopeText = if ($scopes.Count -gt 0) {
        $scopes -join ", "
    } else {
        "repo"
    }

    $Message = "chore: daily checkpoint for $scopeText"
}

git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    throw "Commit failed."
}

Write-Host "Created commit:`n  $Message"
