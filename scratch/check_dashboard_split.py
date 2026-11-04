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
ids = [
    "overviewSection",
    "shotScheduleSection",
    "testResultsSection",
    "messagesSection",
    "adminAnalyticsSection",
    "ordersSection",
    "usersSection",
    "igeChart",
    "allergenProfileChart",
]
texts = {f: Path(f).read_text(encoding="utf-8") for f in files}
for i in ids:
    hits = [f for f, s in texts.items() if f'id="{i}"' in s]
    print(i, len(hits), hits)
print("---")
markers = [
    "Emergency Auto-Injector",
    "Pre-Testing Antihistamine",
    "Practice-Wide Immunotherapy",
    "Immunotherapy Orders",
    "Recent Injections",
    "Antibody Titer Progress",
    "Patient Record Shortcuts",
]
for m in markers:
    hits = [f for f, s in texts.items() if m in s]
    print(m, len(hits), hits)
