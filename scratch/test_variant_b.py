template = '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="stylesheet" href="assets/css/style.css">
<style>
/* 1. Navbar Sticky & Relative for Full-Width Absolute Overlay */
.navbar-custom {
  position: sticky !important;
  top: 0;
  z-index: 1030;
  width: 100%;
}

/* 2. Mobile & Tablet (<992px): Hamburger menu drops down as full-width OVERLAY */
@media (max-width: 991.98px) {
  .navbar-custom > .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .navbar-custom .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100vw;
    background-color: #0b1322;
    border-bottom: 1px solid #1e293b;
    box-shadow: 0 20px 40px -4px rgba(0, 0, 0, 0.8);
    padding: 1.25rem 1.5rem 1.75rem;
    max-height: calc(100vh - var(--header-height));
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 1040;
  }

  /* Remove mobile-login-btn from the collapsed top navbar row */
  .mobile-login-btn {
    display: none !important;
  }

  /* Align RTL icon, Theme icon, and Login CTA properly in the collapsed hamburger menu */
  .navbar-custom .navbar-collapse .header-actions {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 0.65rem !important;
    padding-top: 1.25rem !important;
    margin-top: 1rem !important;
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
    width: 100%;
  }

  .navbar-custom .navbar-collapse .btn-theme-toggle,
  .navbar-custom .navbar-collapse .btn-rtl-toggle {
    width: 42px;
    height: 42px;
    min-width: 42px;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #ffffff;
    border-radius: var(--radius-md);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
    transition: var(--transition-base);
  }

  .navbar-custom .navbar-collapse .btn-theme-toggle:hover,
  .navbar-custom .navbar-collapse .btn-rtl-toggle:hover {
    background-color: var(--primary);
    border-color: var(--primary);
    color: #ffffff;
  }

  .navbar-custom .navbar-collapse .header-actions .btn-light-soft {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    height: 42px;
    padding: 0 1.15rem;
    font-weight: 600;
    font-size: 0.88rem;
    border-radius: var(--radius-md);
    background-color: rgba(2, 132, 199, 0.18);
    border: 1px solid rgba(56, 189, 248, 0.35);
    color: #38bdf8 !important;
    white-space: nowrap;
    transition: var(--transition-base);
  }

  .navbar-custom .navbar-collapse .header-actions .btn-light-soft:hover {
    background-color: var(--primary);
    border-color: var(--primary);
    color: #ffffff !important;
  }
}

/* 3. Screen <= 420px (including 360px): Brand logo and subcontent visibility */
@media (max-width: 420px) {
  .navbar-custom .navbar-brand {
    font-size: 1.12rem;
    gap: 0.55rem;
    min-width: 0;
    flex-shrink: 1;
  }
  .navbar-custom .logo-icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
    font-size: 0.95rem;
  }
  .navbar-custom .brand-name {
    font-size: 1.12rem;
  }
  .navbar-custom .brand-subtitle {
    font-size: 0.52rem;
    letter-spacing: 0.03em;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  .navbar-custom .navbar-toggler {
    padding: 0.35rem;
    flex-shrink: 0;
  }
}
</style>
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-custom" data-bs-theme="dark">
    <div class="container">
      <a class="navbar-brand" href="index.html">
        <div class="logo-icon"><i class="fas fa-shield-virus"></i></div>
        <div>
          <span class="brand-name">Allergi<span class="brand-dot">Q</span></span>
          <div class="brand-subtitle">CLINIC & IMMUNOTHERAPY</div>
        </div>
      </a>

      <!-- Toggler for <992px -->
      <button class="navbar-toggler border-0 shadow-none p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navCollapse" aria-label="Toggle navigation">
        <i class="fas fa-bars fa-lg text-primary"></i>
      </button>

      <!-- Collapse Overlay Menu -->
      <div class="collapse navbar-collapse show" id="navCollapse">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Doctors</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Blog</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Dashboard</a></li>
        </ul>

        <div class="header-actions">
          <button class="btn-theme-toggle" id="themeToggle" type="button" aria-label="Toggle Theme">
            <i class="fas fa-moon"></i>
          </button>
          <button class="btn-rtl-toggle" id="rtlToggle" type="button" aria-label="Toggle RTL">
            <span class="rtl-label fw-bold">RTL</span>
          </button>
          <a href="login.html" class="btn btn-light-soft btn-sm" aria-label="Login to Patient Portal">
            <i class="fas fa-user-circle me-1"></i> Login
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="page-hero-section" style="padding: 3rem 1.5rem; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff;">
    <div class="container text-center">
      <div class="badge bg-primary text-white mb-2"><i class="fas fa-hospital-user me-1"></i> Dedicated To Allergy Freedom</div>
      <h1 class="mb-2" style="font-weight: 800;">About AllergiQ Clinic & Institute</h1>
      <p class="text-white-50 mx-auto" style="max-width: 650px;">Pioneering precision immunological diagnostics, pediatric care, and targeted desensitization since 2012.</p>
    </div>
  </section>
</body>
</html>
'''

with open('test_variant_b.html', 'w', encoding='utf-8') as f:
    f.write(template)
print('Wrote test_variant_b.html')
