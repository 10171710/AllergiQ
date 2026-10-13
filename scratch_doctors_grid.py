import re

with open('doctors.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find by split or finditer
items = re.findall(r'<!-- Doctor \d+:.*?-->\s*<div class="col-md-6 col-lg-3 filterable-item".*?</div>\s*</div>\s*</div>', text, re.DOTALL)
print(f"Items found: {len(items)}")

# or find all h5 and images inside row g-4
row_match = re.search(r'<div class="row g-4">\s*(<!-- Doctor 1:.*?)\s*<!-- Bottom CTA Banner', text, re.DOTALL)
if row_match:
    doc_block = row_match.group(1)
    doctors = re.findall(r'<div class="col-md-6 col-lg-3 filterable-item".*?<button class="btn btn-outline-primary', doc_block, re.DOTALL)
    print(f"Doctors in grid: {len(doctors)}")
    for i, d in enumerate(doctors):
        name_m = re.search(r'<h5[^>]*>(.*?)</h5>', d)
        name = name_m.group(1).strip() if name_m else 'Unknown'
        img_m = re.search(r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>', d)
        img_tag = img_m.group(0) if img_m else 'No img'
        print(f"{i+1}. {name}: {img_tag}")
