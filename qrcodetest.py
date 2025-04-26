import qrcode
from PIL import Image, ImageDraw, ImageFont

# Data to encode and display
data = "https://www.youtube.com/" 
title_text = "Lost Item Please Scan"

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(data)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

# Load fonts
try:
    title_font = ImageFont.truetype("arial.ttf", 50)  # Title font
    text_font = ImageFont.truetype("arial.ttf", 30)   # URL font
except IOError:
    title_font = ImageFont.load_default()
    text_font = ImageFont.load_default()

# Prepare dummy image for text measuring
dummy_img = Image.new("RGB", (1, 1))
dummy_draw = ImageDraw.Draw(dummy_img)

# --- Smart wrapping function ---
def wrap_text_smart(text, font, max_width):
    safe_chars = ['/', '-', '_', '.', '?', '=', ' ']
    lines = []
    current_line = ""

    for char in text:
        test_line = current_line + char
        bbox = dummy_draw.textbbox((0, 0), test_line, font=font)
        line_width = bbox[2] - bbox[0]

        if line_width <= max_width:
            current_line = test_line
        else:
            split_index = max([current_line.rfind(sc) for sc in safe_chars])
            if split_index != -1:
                lines.append(current_line[:split_index+1])
                current_line = current_line[split_index+1:] + char
            else:
                lines.append(current_line)
                current_line = char

    if current_line:
        lines.append(current_line)

    return lines

# --- Wrap title ---
qr_width, qr_height = qr_img.size
title_lines = wrap_text_smart(title_text, title_font, qr_width)

# Measure wrapped title height
bbox_title = dummy_draw.textbbox((0, 0), "A", font=title_font)
title_line_height = bbox_title[3] - bbox_title[1]
title_line_spacing = 5  # spacing between title lines
total_title_height = (title_line_height * len(title_lines)) + (title_line_spacing * (len(title_lines) - 1))

# --- Wrap URL/text ---
text = data
text_lines = wrap_text_smart(text, text_font, qr_width)

bbox_text = dummy_draw.textbbox((0, 0), "A", font=text_font)
text_line_height = bbox_text[3] - bbox_text[1]
text_line_spacing = 8  # spacing between URL lines
total_text_height = (text_line_height * len(text_lines)) + (text_line_spacing * (len(text_lines) - 1))

# --- Calculate final image size ---
vertical_spacing = 10  # Space between sections
new_width = qr_width
new_height = (
    total_title_height +
    vertical_spacing +
    qr_height +
    vertical_spacing +
    total_text_height +
    40  # padding
)

# Create final image
new_img = Image.new("RGB", (new_width, new_height), "white")
draw = ImageDraw.Draw(new_img)

# --- Draw everything ---
current_y = 20  # Top padding

# Draw wrapped title
for line in title_lines:
    bbox = draw.textbbox((0, 0), line, font=title_font)
    line_width = bbox[2] - bbox[0]
    x_text = (new_width - line_width) // 2
    draw.text((x_text, current_y), line, font=title_font, fill="black")
    current_y += title_line_height + title_line_spacing

current_y += vertical_spacing  # spacing after title

# Paste QR code
new_img.paste(qr_img, (0, current_y))
current_y += qr_height + vertical_spacing

# Draw wrapped URL text
for line in text_lines:
    bbox = draw.textbbox((0, 0), line, font=text_font)
    line_width = bbox[2] - bbox[0]
    x_text = (new_width - line_width) // 2
    draw.text((x_text, current_y), line, font=text_font, fill="black")
    current_y += text_line_height + text_line_spacing

# Save it
new_img.save("qr_with_wrapped_title_and_text.png")