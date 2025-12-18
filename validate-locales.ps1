# Locale Validation Script for SmartURLs
# Validates all locale files for consistency and completeness

# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SmartURLs Locale Validation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$localesDir = "_locales"
$referenceLocale = "en"
$failureCount = 0

# Get all locale directories
$locales = Get-ChildItem -Path $localesDir -Directory | Sort-Object Name

if ($locales.Count -eq 0) {
    Write-Host "ERROR: No locale directories found in $localesDir" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($locales.Count) locale(s):`n" -ForegroundColor Green
$locales | ForEach-Object { Write-Host "  - $($_.Name)" }
Write-Host ""

# Step 1: Validate JSON syntax for all locales
Write-Host "[1/4] Validating JSON syntax..." -ForegroundColor Yellow
$validLocales = @{}
$syntaxErrors = @()

foreach ($locale in $locales) {
    $localeCode = $locale.Name
    $messagesFile = Join-Path $locale.FullName "messages.json"

    if (-not (Test-Path $messagesFile)) {
        Write-Host "  ✗ $localeCode - messages.json not found" -ForegroundColor Red
        $syntaxErrors += $localeCode
        $failureCount++
        continue
    }

    try {
        $content = Get-Content -Raw -Path $messagesFile -Encoding UTF8 -ErrorAction Stop
        $json = $content | ConvertFrom-Json -ErrorAction Stop

        if (-not $json) {
            throw "Empty or null JSON"
        }

        $validLocales[$localeCode] = $json
        Write-Host "  ✓ $localeCode - Valid JSON" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ $localeCode - SYNTAX ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $syntaxErrors += $localeCode
        $failureCount++
    }
}

Write-Host ""

if ($syntaxErrors.Count -gt 0) {
    Write-Host "WARNING: $($syntaxErrors.Count) locale(s) have JSON syntax errors and will be skipped.`n" -ForegroundColor Red
}

# Step 2: Check if reference locale exists
if (-not $validLocales.ContainsKey($referenceLocale)) {
    Write-Host "ERROR: Reference locale '$referenceLocale' is missing or invalid!" -ForegroundColor Red
    exit 1
}

# Get reference keys
$referenceKeys = $validLocales[$referenceLocale].PSObject.Properties.Name | Sort-Object
Write-Host "[2/4] Reference locale: $referenceLocale ($($referenceKeys.Count) keys)`n" -ForegroundColor Yellow

# Step 3: Compare all locales against reference
Write-Host "[3/4] Checking key consistency..." -ForegroundColor Yellow
$missingKeysReport = @{}
$extraKeysReport = @{}

foreach ($localeCode in $validLocales.Keys | Sort-Object) {
    if ($localeCode -eq $referenceLocale) {
        Write-Host "  ✓ $localeCode - Reference locale (skipping comparison)" -ForegroundColor Cyan
        continue
    }

    $currentKeys = $validLocales[$localeCode].PSObject.Properties.Name | Sort-Object

    # Find missing keys (in reference but not in current)
    $missingKeys = $referenceKeys | Where-Object { $_ -notin $currentKeys }

    # Find extra keys (in current but not in reference)
    $extraKeys = $currentKeys | Where-Object { $_ -notin $referenceKeys }

    if ($missingKeys.Count -eq 0 -and $extraKeys.Count -eq 0) {
        Write-Host "  ✓ $localeCode - All keys match ($($currentKeys.Count) keys)" -ForegroundColor Green
    }
    else {
        $status = @()
        if ($missingKeys.Count -gt 0) {
            $status += "$($missingKeys.Count) missing"
            $missingKeysReport[$localeCode] = $missingKeys
        }
        if ($extraKeys.Count -gt 0) {
            $status += "$($extraKeys.Count) extra"
            $extraKeysReport[$localeCode] = $extraKeys
        }

        Write-Host "  ✗ $localeCode - $($status -join ', ')" -ForegroundColor Red
        $failureCount++
    }
}

Write-Host ""

# Step 4: Check for empty messages
Write-Host "[4/4] Checking for empty messages..." -ForegroundColor Yellow
$emptyMessagesReport = @{}

foreach ($localeCode in $validLocales.Keys | Sort-Object) {
    $emptyKeys = @()

    foreach ($key in $validLocales[$localeCode].PSObject.Properties.Name) {
        $entry = $validLocales[$localeCode].$key

        # Check if entry has a message property
        if (-not $entry.PSObject.Properties.Name.Contains("message")) {
            $emptyKeys += $key
            continue
        }

        # Check if message is empty or whitespace
        $message = $entry.message
        if ([string]::IsNullOrWhiteSpace($message)) {
            $emptyKeys += $key
        }
    }

    if ($emptyKeys.Count -eq 0) {
        Write-Host "  ✓ $localeCode - No empty messages" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠ $localeCode - $($emptyKeys.Count) empty message(s)" -ForegroundColor Yellow
        $emptyMessagesReport[$localeCode] = $emptyKeys
    }
}

Write-Host ""

# Detailed Reports
if ($missingKeysReport.Count -gt 0 -or $extraKeysReport.Count -gt 0 -or $emptyMessagesReport.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "DETAILED REPORTS" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

# Report missing keys
if ($missingKeysReport.Count -gt 0) {
    Write-Host "Missing Keys (present in $referenceLocale but missing in locale):" -ForegroundColor Red
    Write-Host "-----------------------------------------------------------" -ForegroundColor Red
    foreach ($localeCode in $missingKeysReport.Keys | Sort-Object) {
        Write-Host "`n  Locale: $localeCode" -ForegroundColor Yellow
        foreach ($key in $missingKeysReport[$localeCode]) {
            Write-Host "    - $key" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# Report extra keys
if ($extraKeysReport.Count -gt 0) {
    Write-Host "Extra Keys (not in $referenceLocale but present in locale):" -ForegroundColor Red
    Write-Host "--------------------------------------------------------" -ForegroundColor Red
    foreach ($localeCode in $extraKeysReport.Keys | Sort-Object) {
        Write-Host "`n  Locale: $localeCode" -ForegroundColor Yellow
        foreach ($key in $extraKeysReport[$localeCode]) {
            Write-Host "    - $key" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# Report empty messages
if ($emptyMessagesReport.Count -gt 0) {
    Write-Host "Empty Messages:" -ForegroundColor Yellow
    Write-Host "---------------" -ForegroundColor Yellow
    foreach ($localeCode in $emptyMessagesReport.Keys | Sort-Object) {
        Write-Host "`n  Locale: $localeCode" -ForegroundColor Yellow
        foreach ($key in $emptyMessagesReport[$localeCode]) {
            Write-Host "    - $key" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Final Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total locales:        $($locales.Count)" -ForegroundColor White
Write-Host "Valid JSON:           $($validLocales.Count)" -ForegroundColor $(if ($syntaxErrors.Count -eq 0) { "Green" } else { "Yellow" })
Write-Host "Syntax errors:        $($syntaxErrors.Count)" -ForegroundColor $(if ($syntaxErrors.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Key mismatches:       $($missingKeysReport.Count + $extraKeysReport.Count)" -ForegroundColor $(if (($missingKeysReport.Count + $extraKeysReport.Count) -eq 0) { "Green" } else { "Red" })
Write-Host "Empty messages:       $($emptyMessagesReport.Count)" -ForegroundColor $(if ($emptyMessagesReport.Count -eq 0) { "Green" } else { "Yellow" })
Write-Host "Reference keys:       $($referenceKeys.Count)" -ForegroundColor White
Write-Host ""

if ($failureCount -eq 0) {
    Write-Host "✓ ALL VALIDATIONS PASSED!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "✗ VALIDATION FAILED ($failureCount issue(s) found)" -ForegroundColor Red
    exit 1
}
