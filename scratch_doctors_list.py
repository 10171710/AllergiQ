import re

with open('doctors.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find all doctor cards
pattern = r'<div class="card-custom h-100 p-3 doctor-card.*?</div>\s*</div>\s*</div>'
cards = re.findall(pattern, text, re.DOTALL)
print(f"Total doctor cards found: {len(cards)}")

for i, c in enumerate(cards):
    img = re.search(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*alt=[\'"]([^\'"]*)[\'"][^>]*>', c)
    style = re.search(r'style=[\'"]([^\'"]+)[\'"]', img.group(0)) if img else None
    name = re.search(r'<h5[^>]*>(.*?)</h5>', c)
    name_str = name.group(1).strip() if name else 'Unknown'
    img_src = img.group(1) if img else 'None'
    img_style = style.group(1) if style else 'None'
    print(f"{i+1}. {name_str}")
    print(f"   src: {img_src}")
    print(f"   style: {img_style}")
