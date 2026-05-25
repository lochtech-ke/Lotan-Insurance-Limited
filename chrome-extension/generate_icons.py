import os
from PIL import Image, ImageDraw

def create_base_logo(size=512):
    # Create transparent image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    scale = size / 100.0
    
    # 1. Background: Dark Forest Green (#042F1A) rounded rectangle
    rx = 24 * scale
    draw.rounded_rectangle([0, 0, size, size], radius=rx, fill=(4, 47, 26, 255))
    
    # 2. Outer "L" shape (Accent Emerald Green: #10B981)
    # Line thickness
    w1 = int(12 * scale)
    r1 = w1 // 2
    
    p1 = (35 * scale, 25 * scale)
    p2 = (35 * scale, 75 * scale)
    p3 = (65 * scale, 75 * scale)
    
    # Draw thick lines
    draw.line([p1, p2, p3], fill=(16, 185, 129, 255), width=w1, joint='round')
    # Draw circular caps for the line ends
    draw.ellipse([p1[0]-r1, p1[1]-r1, p1[0]+r1, p1[1]+r1], fill=(16, 185, 129, 255))
    draw.ellipse([p3[0]-r1, p3[1]-r1, p3[0]+r1, p3[1]+r1], fill=(16, 185, 129, 255))

    # 3. Inner "L" shape (Platinum: #FAFAFA, 80% opacity)
    w2 = int(8 * scale)
    r2 = w2 // 2
    
    p4 = (48 * scale, 37 * scale)
    p5 = (48 * scale, 62 * scale)
    p6 = (62 * scale, 62 * scale)
    
    draw.line([p4, p5, p6], fill=(250, 250, 250, 204), width=w2, joint='round')
    draw.ellipse([p4[0]-r2, p4[1]-r2, p4[0]+r2, p4[1]+r2], fill=(250, 250, 250, 204))
    draw.ellipse([p6[0]-r2, p6[1]-r2, p6[0]+r2, p6[1]+r2], fill=(250, 250, 250, 204))
    
    return img

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(base_dir, 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    print("Generating high-resolution base logo...")
    base_logo = create_base_logo(size=512)
    
    sizes = [16, 48, 128]
    for size in sizes:
        resized_img = base_logo.resize((size, size), Image.Resampling.LANCZOS)
        out_path = os.path.join(icons_dir, f'icon{size}.png')
        resized_img.save(out_path, 'PNG')
        print(f"Saved icon: {out_path} ({size}x{size})")

if __name__ == '__main__':
    main()
