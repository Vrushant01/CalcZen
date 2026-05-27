Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\HP\.gemini\antigravity\brain\8d182245-7900-4b70-b8ed-affac024b57b\media__1779902058198.png'
$masterHCPath = 'C:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\scratch\high-contrast-master.png'

# 1. Generate High-Contrast Logo with Solid White Circular Backplate and Soft Boundary Ring
$masterWidth = 512
$masterHeight = 512
$bitmap = New-Object System.Drawing.Bitmap($masterWidth, $masterHeight)
$g = [System.Drawing.Graphics]::FromImage($bitmap)

# Enable highest quality graphics rendering
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Clear with fully transparent background
$g.Clear([System.Drawing.Color]::Transparent)

# Draw Solid White Backplate Circle
# We leave a small margin around the circle (e.g. 8 pixels)
$circleMargin = 12
$circleWidth = $masterWidth - ($circleMargin * 2)
$circleHeight = $masterHeight - ($circleMargin * 2)

# Solid White Brush
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($whiteBrush, $circleMargin, $circleMargin, $circleWidth, $circleHeight)
$whiteBrush.Dispose()

# Draw thin, elegant light slate border around the white circle for definition
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 226, 232, 240), 6) # thickness 6
$g.DrawEllipse($borderPen, $circleMargin, $circleMargin, $circleWidth, $circleHeight)
$borderPen.Dispose()

# Draw the blue "C" logo in the center (scaled down to ~72% for elegant breathing margin)
$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$logoScale = 0.72
$logoWidth = [int]($circleWidth * $logoScale)
$logoHeight = [int]($circleHeight * $logoScale)
$logoX = [int](($masterWidth - $logoWidth) / 2)
$logoY = [int](($masterHeight - $logoHeight) / 2)

$g.DrawImage($srcImg, $logoX, $logoY, $logoWidth, $logoHeight)
$srcImg.Dispose()

# Save High-Contrast Master
$bitmap.Save($masterHCPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bitmap.Dispose()
Write-Output "Successfully generated High-Contrast Master Logo."

# 2. Helper function to resize the master high-contrast image to target sizes
function Resize-HighContrastImage {
    param(
        [string]$sourceFile,
        [string]$targetFile,
        [int]$width,
        [int]$height
    )
    $srcImg = [System.Drawing.Image]::FromFile($sourceFile)
    $destImg = New-Object System.Drawing.Bitmap($width, $height)
    $graphic = [System.Drawing.Graphics]::FromImage($destImg)
    
    $graphic.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphic.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphic.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $graphic.DrawImage($srcImg, 0, 0, $width, $height)
    
    $destImg.Save($targetFile, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphic.Dispose()
    $destImg.Dispose()
    $srcImg.Dispose()
}

# 3. Overwrite the main brand logo used in the Navbars
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\brand\calczen-logo.png' -width 500 -height 500
Write-Output "Deployed high-contrast brand logo."

# 4. Deploy High-Contrast Favicons and App Icons in all standard resolutions
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\favicon-16x16.png' -width 16 -height 16
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\favicon-32x32.png' -width 32 -height 32
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\favicon-48x48.png' -width 48 -height 48
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\favicon-96x96.png' -width 96 -height 96
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\favicon-144x144.png' -width 144 -height 144
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\apple-touch-icon.png' -width 180 -height 180
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\android-chrome-192x192.png' -width 192 -height 192
Resize-HighContrastImage -sourceFile $masterHCPath -targetFile 'c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\android-chrome-512x512.png' -width 512 -height 512
Write-Output "Deployed high-contrast favicon PNGs (16x16, 32x32, 48x48, 96x96, 144x144, 180x180, 192x192, 512x512)."

# 5. Overwrite the favicon.ico container with a high-contrast 32x32 ICO
$srcImg = [System.Drawing.Image]::FromFile($masterHCPath)
$destImg = New-Object System.Drawing.Bitmap(32, 32)
$graphic = [System.Drawing.Graphics]::FromImage($destImg)
$graphic.DrawImage($srcImg, 0, 0, 32, 32)

$hIcon = $destImg.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fileStream = New-Object System.IO.FileStream('c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons\favicon.ico', [System.IO.FileMode]::Create)
$icon.Save($fileStream)
$fileStream.Close()
$icon.Dispose()

$graphic.Dispose()
$destImg.Dispose()
$srcImg.Dispose()
Write-Output "Deployed high-contrast favicon.ico."
