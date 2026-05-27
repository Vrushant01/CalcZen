# PowerShell script to resize the master CalcZen logo to all required sizes
Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\HP\.gemini\antigravity\brain\8d182245-7900-4b70-b8ed-affac024b57b\calczen_logo_optimized_1779904087633.png"
$baseDir = "c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange"

$sizes = @(
    @{ Path = "public\icons\favicon-16x16.png"; Width = 16; Height = 16 },
    @{ Path = "public\icons\favicon-32x32.png"; Width = 32; Height = 32 },
    @{ Path = "public\icons\favicon-48x48.png"; Width = 48; Height = 48 },
    @{ Path = "public\icons\favicon-96x96.png"; Width = 96; Height = 96 },
    @{ Path = "public\icons\favicon-144x144.png"; Width = 144; Height = 144 },
    @{ Path = "public\icons\apple-touch-icon.png"; Width = 180; Height = 180 },
    @{ Path = "public\icons\android-chrome-192x192.png"; Width = 192; Height = 192 },
    @{ Path = "public\icons\android-chrome-512x512.png"; Width = 512; Height = 512 },
    @{ Path = "public\icons\favicon.ico"; Width = 32; Height = 32 },
    @{ Path = "public\brand\calczen-logo.png"; Width = 512; Height = 512 },
    @{ Path = "public\brand\calczen-logo-dark.png"; Width = 512; Height = 512 }
)

Write-Host "Starting high-quality icon resizing from master image..."
if (-not (Test-Path $srcPath)) {
    Write-Error "Source master image not found at $srcPath"
    exit 1
}

foreach ($item in $sizes) {
    $destPath = Join-Path $baseDir $item.Path
    $width = $item.Width
    $height = $item.Height
    
    Write-Host "Generating: $($item.Path) ($width x $height)..."
    
    # Ensure directory exists
    $dir = Split-Path $destPath
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    $srcImage = [System.Drawing.Image]::FromFile($srcPath)
    $destImage = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    
    # High-quality drawing properties
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($srcImage, 0, 0, $width, $height)
    
    # Save as PNG
    $destImage.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Dispose resources immediately to prevent file locks
    $graphics.Dispose()
    $destImage.Dispose()
    $srcImage.Dispose()
}

Write-Host "All icons generated successfully!"
