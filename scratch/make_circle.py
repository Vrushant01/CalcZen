import os
from PIL import Image, ImageDraw

def make_circular_favicon():
    source_path = r"C:\Users\HP\.gemini\antigravity\brain\8d182245-7900-4b70-b8ed-affac024b57b\media__1779904789843.jpg"
    output_dir = r"c:\Users\HP\Downloads\CalcVerse-pdfchange\CalcVerse-pdfchange\public\icons"

    # Open image and convert to RGBA
    img = Image.open(source_path).convert("RGBA")
    width, height = img.size

    # Create a transparent alpha mask for a perfect circle fitting the canvas
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    
    # Draw a solid white circle on the mask (255 is fully opaque, 0 is transparent)
    # We add a 2-pixel margin to prevent any anti-aliasing edges from clipping
    margin = 2
    draw.ellipse((margin, margin, width - margin, height - margin), fill=255)

    # Place the circular mask into the image's alpha channel
    img.putalpha(mask)

    # Favicon target files
    targets = [
        "favicon.ico",
        "favicon-32x32.png",
        "favicon-16x16.png",
        "favicon-48x48.png",
        "favicon-96x96.png",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png"
    ]

    # Ensure output folder exists
    os.makedirs(output_dir, exist_ok=True)

    # Save as transparent PNG to all targets
    for target in targets:
        dest_path = os.path.join(output_dir, target)
        
        # Standard icon resizes to keep assets optimized and extremely crisp
        if "16x16" in target:
            resized_img = img.resize((16, 16), Image.Resampling.LANCZOS)
        elif "32x32" in target:
            resized_img = img.resize((32, 32), Image.Resampling.LANCZOS)
        elif "48x48" in target:
            resized_img = img.resize((48, 48), Image.Resampling.LANCZOS)
        elif "96x96" in target:
            resized_img = img.resize((96, 96), Image.Resampling.LANCZOS)
        elif "192x192" in target:
            resized_img = img.resize((192, 192), Image.Resampling.LANCZOS)
        elif "512x512" in target:
            resized_img = img.resize((512, 512), Image.Resampling.LANCZOS)
        elif "apple-touch-icon" in target:
            resized_img = img.resize((180, 180), Image.Resampling.LANCZOS)
        else:
            resized_img = img.resize((32, 32), Image.Resampling.LANCZOS) # favicon.ico fallback

        # Save standard transparent PNG
        resized_img.save(dest_path, "PNG")
        print(f"Saved optimized transparent round icon: {target}")

    print("Success: All browser icons are now round and transparent!")

if __name__ == "__main__":
    make_circular_favicon()
