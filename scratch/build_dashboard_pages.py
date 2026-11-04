"""Split the single long-scrolling dashboard into one page per sidebar item.

Run from the Clinic root:
    python scratch/build_dashboard_pages.py

The script reads the original dashboard.html (the long-scrolling version),
extracts the content blocks, and writes seven standalone pages that share the
same sidebar, topbar, modal and scripts.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "dashboard.html"

with SRC.open(encoding="utf-8") as fh:
    src = fh.read()

# The script replaces dashboard.html with the split overview page, so on a
# second run the original long-scrolling markup is no longer on disk. Fall
# back to the last committed version (the original dashboard) in that case.
if "<!-- Immunotherapy Progress Tracker Widget -->" not in src:
    import subprocess

    src = subprocess.run(
        ["git", "show", "HEAD:dashboard.html"],
        cwd=ROOT,
        capture_output=True,
        check=True,
    ).stdout.decode("utf-8")

# The original file contains literal U+FFFD replacement characters where an
# em dash, degree sign or registered mark was lost during an earlier edit.
# Restore them so the generated pages render correctly.
fixes = [
    ("10:30 AM \ufffd Suite 400", "10:30 AM &mdash; Suite 400"),
    ("1:100 Dilution \ufffd Dose 14/16", "1:100 Dilution &mdash; Dose 14/16"),
    ("Sarah Jenkins \ufffd Prescribed", "Sarah Jenkins &mdash; Prescribed"),
    ("Oct 08, 2026 \ufffd 10:45 AM", "Oct 08, 2026 &mdash; 10:45 AM"),
    ("Oct 01, 2026 \ufffd 11:15 AM", "Oct 01, 2026 &mdash; 11:15 AM"),
    ("Sep 24, 2026 \ufffd 09:30 AM", "Sep 24, 2026 &mdash; 09:30 AM"),
    ("Vial 3 (Yellow) \ufffd 0.50 mL", "Vial 3 (Yellow) &mdash; 0.50 mL"),
    ("Vial 3 (Yellow) \ufffd 0.40 mL", "Vial 3 (Yellow) &mdash; 0.40 mL"),
    ("Vial 3 (Yellow) \ufffd 0.30 mL", "Vial 3 (Yellow) &mdash; 0.30 mL"),
    ("EpiPen\ufffd 0.3 mg", "EpiPen&reg; 0.3 mg"),
    ("71.4\ufffdF (Safe Range 68\ufffd-77\ufffdF)", "71.4&deg;F (Safe Range 68&deg;-77&deg;F)"),
    ("Sterile Lab \ufffd Insulated", "Sterile Lab &mdash; Insulated"),
    ("Active Now \ufffd Immunotherapy Director", "Active Now &bull; Immunotherapy Director"),
]
for old, new in fixes:
    src = src.replace(old, new)

# ---------------------------------------------------------------------------
# Content blocks (identified by their section comments)
# ---------------------------------------------------------------------------
A = "        <!-- Patient Banner Alert -->"
B = "        <!-- Immunotherapy Progress Tracker Widget -->"
C = "        <!-- 2 Interactive Charts Row -->"
D = "        <!-- Lab Test Results History Table -->"
E = "        <!-- NEW SECTION 1: EpiPen & Rescue Device Expiration & Safety Tracker -->"
F = "        <!-- NEW SECTION 2: Pre-Testing Antihistamine Restriction Timer & Medication Matrix -->"
G = "        <!-- NEW SECTION 3: Practice Admin & Clinical Adherence Telemetry (For Clinic Administrators) -->"
H = "        <!-- Admin: Orders & Insurance Claims -->"
I = "        <!-- Admin: Patient Directory -->"
J = "        <!-- Doctor Messaging Interface Section -->"
K = "      </div>\n    </main>"


def between(start: str, end: str) -> str:
    i = src.index(start)
    j = src.index(end, i)
    return src[i:j]


overview = between(A, B)
schedules = between(B, C) + between(E, F)
results = between(C, E) + between(F, G)
analytics = between(G, H)
orders = between(H, I)
users = between(I, J)
messages = between(J, K)

# ---------------------------------------------------------------------------
# Overview quick-access shortcuts (new)
# ---------------------------------------------------------------------------
shortcuts = [
    ("dashboard-schedules.html", "fa-syringe", "primary", "Shot Schedules", "Vial 3 &middot; Dose 14 of 16"),
    ("dashboard-results.html", "fa-file-medical-alt", "accent", "Test Results &amp; IgE", "50+ allergens &middot; 3 reports"),
    ("dashboard-messages.html", "fa-comments", "success", "Doctor Messages", "2 unread &middot; Dr. Julian Reed"),
    ("dashboard-analytics.html", "fa-chart-line", "warning", "Clinic Analytics", "1,482 patients &middot; 96.4% adherence"),
    ("dashboard-orders.html", "fa-receipt", "primary", "Orders &amp; Insurance", "3 claims &middot; 2 reimbursed"),
    ("dashboard-users.html", "fa-users-cog", "accent", "Patient Directory", "1,482 active patients"),
]

shortcut_cards = []
for href, icon, tone, title, desc in shortcuts:
    shortcut_cards.append(
        f"""            <div class="col-sm-6 col-xl-4 d-flex">
              <a href="{href}" class="dashboard-shortcut">
                <div class="kpi-icon {tone}"><i class="fas {icon}"></i></div>
                <div class="min-w-0">
                  <div class="shortcut-title">{title}</div>
                  <p class="shortcut-desc mb-0">{desc}</p>
                </div>
                <i class="fas fa-arrow-right ms-auto align-self-center text-muted small"></i>
              </a>
            </div>"""
    )

quick_access = f"""        <!-- Quick Access Shortcuts -->
        <div class="card-custom p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <div class="badge-tag mb-1"><i class="fas fa-bolt"></i> Quick Access</div>
              <h5 class="mb-1">Patient Record Shortcuts</h5>
              <small class="text-muted">Jump straight to any part of Sarah Jenkins&rsquo; immunotherapy record</small>
            </div>
            <span class="badge bg-primary-subtle text-primary">6 Modules</span>
          </div>
          <div class="row g-3">
{chr(10).join(shortcut_cards)}
          </div>
        </div>

"""

overview = overview + quick_access

# ---------------------------------------------------------------------------
# Page definitions
# ---------------------------------------------------------------------------
PAGES = [
    {
        "file": "dashboard.html",
        "active": "dashboard.html",
        "title": "Patient Overview - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ patient overview: immunotherapy progress, upcoming shots, protective IgG4 titers and active sensitivities.",
        "heading": "Patient Clinical EHR Dashboard",
        "subheading": "Immunotherapy Protocol &diams; Dr. Marcus Vance, MD",
        "content": overview,
    },
    {
        "file": "dashboard-schedules.html",
        "active": "dashboard-schedules.html",
        "title": "Shot Schedules - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ shot schedules: immunotherapy desensitization protocol, dose log, epinephrine tracker and cold-chain vial delivery.",
        "heading": "Shot Schedules &amp; Dose Tracking",
        "subheading": "Vial 3 (Yellow) &diams; Dose 14 of 16",
        "content": schedules,
    },
    {
        "file": "dashboard-results.html",
        "active": "dashboard-results.html",
        "title": "Test Results &amp; IgE - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ test results: IgE antibody progress, skin wheal desensitization, laboratory reports and antihistamine clearance.",
        "heading": "Test Results &amp; IgE Panels",
        "subheading": "CLIA Bio-Assays &diams; Dr. Marcus Vance, MD",
        "content": results,
    },
    {
        "file": "dashboard-messages.html",
        "active": "dashboard-messages.html",
        "title": "Doctor Messages - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ secure messaging: HIPAA-compliant telehealth chat with your allergist and immunotherapy team.",
        "heading": "Doctor Messages",
        "subheading": "HIPAA Secure Telehealth &diams; Dr. Julian Reed, FAAAI",
        "content": messages,
    },
    {
        "file": "dashboard-analytics.html",
        "active": "dashboard-analytics.html",
        "title": "Clinic Analytics - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ clinic analytics: practice-wide immunotherapy telemetry, protocol adherence and adverse event rates.",
        "heading": "Clinic Analytics",
        "subheading": "Practice Telemetry &diams; AllergiQ EHR v4.2",
        "content": analytics,
    },
    {
        "file": "dashboard-orders.html",
        "active": "dashboard-orders.html",
        "title": "Orders &amp; Insurance - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ orders and insurance: immunotherapy vial dispensations, serum refills and payer reimbursement status.",
        "heading": "Orders &amp; Insurance",
        "subheading": "Billing, Claims &amp; Reimbursement",
        "content": orders,
    },
    {
        "file": "dashboard-users.html",
        "active": "dashboard-users.html",
        "title": "Patient Directory - AllergiQ Immunotherapy EHR",
        "description": "AllergiQ patient directory: active immunotherapy patients, protocol vials and next dose schedules.",
        "heading": "Patient Directory",
        "subheading": "Active Immunotherapy Roster &diams; 1,482 Patients",
        "content": users,
    },
]


def sidebar_html(active: str) -> str:
    patient_items = [
        ("dashboard.html", "fa-columns", "Patient Overview", ""),
        ("dashboard-schedules.html", "fa-syringe", "Shot Schedules", '<span class="badge bg-primary">Vial 3</span>'),
        ("dashboard-results.html", "fa-file-medical-alt", "Test Results & IgE", '<span class="badge bg-success">Ready</span>'),
        ("dashboard-messages.html", "fa-comments", "Doctor Messages", '<span class="badge bg-danger">2 New</span>'),
    ]
    admin_items = [
        ("dashboard-analytics.html", "fa-chart-line", "Clinic Analytics", ""),
        ("dashboard-orders.html", "fa-receipt", "Orders & Insurance", ""),
        ("dashboard-users.html", "fa-users-cog", "Patient Directory", ""),
    ]

    def item(href, icon, label, badge):
        cls = "sidebar-menu-link active" if href == active else "sidebar-menu-link"
        badge_html = f"\n              {badge}" if badge else ""
        return f"""          <li class="sidebar-menu-item">
            <a href="{href}" class="{cls}">
              <i class="fas {icon}"></i>
              <span>{label}</span>{badge_html}
            </a>
          </li>"""

    patient = "\n".join(item(*row) for row in patient_items)
    admin = "\n".join(item(*row) for row in admin_items)

    return f"""      <div class="dashboard-sidebar-body">
        <div class="sidebar-menu-header">Patient Health Record</div>
        <ul class="sidebar-menu">
{patient}
        </ul>

        <div class="sidebar-menu-header mt-3">Admin &amp; Practice Management</div>
        <ul class="sidebar-menu">
{admin}
        </ul>
      </div>"""


SIDEBAR_RE = re.compile(
    r'      <div class="dashboard-sidebar-body">.*?      </div>\n\n      <!-- Sidebar Footer -->',
    re.S,
)

CONTENT_START = '      <div class="dashboard-content">\n'
CONTENT_END = '      </div>\n    </main>'


def build_page(page: dict) -> str:
    doc = src

    # Page metadata
    doc = doc.replace(
        "<title>Patient & Clinic Dashboard - AllergiQ Immunotherapy EHR</title>",
        f"<title>{page['title']}</title>",
    )
    doc = doc.replace(
        'content="AllergiQ Patient & Clinic Portal: Track immunotherapy shot schedules, view 50+ allergen IgE test results, and message your allergist."',
        f'content="{page["description"]}"',
    )

    # Sidebar navigation
    doc = SIDEBAR_RE.sub(sidebar_html(page["active"]), doc, count=1)

    # Brand links return to the public home page (the source already uses
    # index.html, so no rewrite is needed).

    # Topbar heading
    doc = doc.replace(
        '<h5 class="mb-0 text-truncate dashboard-topbar-title">Patient Clinical EHR Dashboard</h5>',
        f'<h5 class="mb-0 text-truncate dashboard-topbar-title">{page["heading"]}</h5>',
    )
    doc = doc.replace(
        '<small class="text-muted d-block text-truncate">Immunotherapy Protocol &diams; Dr. Marcus Vance, MD</small>',
        f'<small class="text-muted d-block text-truncate">{page["subheading"]}</small>',
    )

    # Remove the "Public Website" CTA from the topbar
    public_cta = """          <!-- Back to Website Link: Full label on xl (>=1200px), compact icon button on md-lg (768px-1199px) -->
          <a href="index.html" class="btn btn-outline-primary btn-sm d-none d-xl-inline-flex align-items-center" title="Public Website">
            <i class="fas fa-globe me-1"></i> Public Website
          </a>
          <a href="index.html" class="btn btn-outline-primary btn-sm d-none d-md-inline-flex d-xl-none" title="Public Website" aria-label="Public Website">
            <i class="fas fa-globe"></i>
          </a>

"""
    if public_cta not in doc:
        raise SystemExit("Public Website CTA block not found - source changed")
    doc = doc.replace(public_cta, "", 1)

    # Swap the page body
    i = doc.index(CONTENT_START) + len(CONTENT_START)
    j = doc.index(CONTENT_END, i)
    content = page["content"].rstrip("\n") + "\n\n"
    doc = doc[:i] + content + doc[j:]

    return doc


for page in PAGES:
    out = build_page(page)
    with (ROOT / page["file"]).open("w", encoding="utf-8", newline="\r\n") as fh:
        fh.write(out)
    print("wrote", page["file"], len(out), "chars")
