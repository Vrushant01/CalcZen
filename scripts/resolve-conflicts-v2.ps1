# resolve-conflicts-v2.ps1
# Resolves all git conflict markers by keeping the V2 side (529569b).
# V2 is everything between ======= and >>>>>>> 529569b

param(
    [string]$Root = (Get-Location).Path
)

$files = Get-ChildItem -Path $Root -Recurse -File -Include "*.ts","*.tsx","*.js","*.json","*.html","*.css","*.yaml","*.yml" |
    Where-Object { $_.FullName -notmatch "node_modules|\\\.git|\\dist\\|admin\\dist|public\\admin|resolve-conflicts" } |
    Where-Object { (Select-String -Path $_.FullName -Pattern "^<<<<<<< " -Quiet) }

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Pattern: keep V2 side (between ======= and >>>>>>>)
    # Conflict block: <<<<<<< HEAD\n<HEAD content>\n=======\n<V2 content>\n>>>>>>> 529569b
    # We want to remove HEAD side + markers, keep V2 side
    
    $resolved = $content
    
    # Use regex to match conflict blocks and keep only V2 portion
    # The regex captures: <<<<<<< HEAD ... ======= ... >>>>>>> 529569b (with any branch name after >>>>>>>)
    $pattern = "(?m)^<<<<<<< .+?\r?\n(.*?)^=======\r?\n(.*?)^>>>>>>> .+?$\r?\n?"
    
    $resolved = [regex]::Replace($resolved, $pattern, {
        param($match)
        # Group 2 is the V2 side (between ======= and >>>>>>>)
        return $match.Groups[2].Value
    }, [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::Multiline)
    
    Set-Content -Path $file.FullName -Value $resolved -Encoding UTF8 -NoNewline
    Write-Host "Resolved: $($file.FullName.Replace($Root, '.'))"
    $count++
}

Write-Host ""
Write-Host "Done. Resolved $count files."

