"""Remove page-name breadcrumb labels from every page hero."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FILES = [
    "about.html",
    "blog.html",
    "contact.html",
    "doctors.html",
    "pricing.html",
    "service-biologics.html",
    "service-details.html",
    "service-food-panels.html",
    "service-patch-test.html",
    "service-pediatric.html",
    "service-scit.html",
    "service-skin-prick.html",
    "service-slit.html",
    "service-spirometry.html",
    "service-vit.html",
    "services.html",
]

pattern = re.compile(r"[ \t]*<nav aria-label=\"breadcrumb\">.*?</nav>[ \t]*\n", re.S)

for name in FILES:
    path = ROOT / name
    text = path.read_text(encoding="utf-8")
    new, count = pattern.subn("", text, count=1)
    if count != 1:
        raise SystemExit(f"{name}: expected 1 breadcrumb block, removed {count}")
    # Collapse the blank line left behind so the hero closes cleanly.
    new = new.replace("</p>\n\n    </div>\n  </section>", "</p>\n    </div>\n  </section>")
    new = new.replace("</p>\n\n      </div>\n    </section>", "</p>\n      </div>\n    </section>")
    path.write_text(new, encoding="utf-8", newline="\r\n")
    print("updated", name)
