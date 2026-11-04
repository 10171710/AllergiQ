import glob
import os
import re

OLD_VERSION = "3"
NEW_VERSION = "4"
old = f'assets/css/style.css?v={OLD_VERSION}'.encode("ascii")
new = f'assets/css/style.css?v={NEW_VERSION}'.encode("ascii")

changed = []
for path in sorted(glob.glob("*.html")):
    name = os.path.basename(path)
    if re.match(r"^(test_|debug_|verify_|scratch|_qa_)", name):
        continue
    with open(path, "rb") as f:
        data = f.read()
    if old not in data:
        continue
    updated = data.replace(old, new)
    with open(path, "wb") as f:
        f.write(updated)
    changed.append(name)

print(f"Updated {len(changed)} files to v{NEW_VERSION}")
for name in changed:
    print(name)
