from pathlib import Path

files = [
    "dashboard.html",
    "dashboard-schedules.html",
    "dashboard-results.html",
    "dashboard-messages.html",
    "dashboard-analytics.html",
    "dashboard-orders.html",
    "dashboard-users.html",
]

old_sidebar = '<a class="navbar-brand mb-0" href="dashboard.html">'
new_sidebar = '<a class="navbar-brand mb-0" href="index.html">'
old_mobile = 'class="navbar-brand d-lg-none me-1 flex-shrink-0 text-decoration-none" href="dashboard.html"'
new_mobile = 'class="navbar-brand d-lg-none me-1 flex-shrink-0 text-decoration-none" href="index.html"'

for name in files:
    path = Path(name)
    text = path.read_text(encoding="utf-8")
    c1 = text.count(old_sidebar)
    c2 = text.count(old_mobile)
    text = text.replace(old_sidebar, new_sidebar).replace(old_mobile, new_mobile)
    path.write_text(text, encoding="utf-8", newline="\r\n")
    print(name, "sidebar:", c1, "mobile:", c2)
