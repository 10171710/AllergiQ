import re

with open('about.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add 'show' class to navbarMainCollapse
html = html.replace('class="collapse navbar-collapse"', 'class="collapse navbar-collapse show"')

# In about.html, add mobile-login-btn to test what user had
mod = '''
      <div class="d-flex align-items-center gap-2 d-lg-none">
        <a href="login.html" class="btn btn-light-soft btn-sm mobile-login-btn" aria-label="Login to Patient Portal">
          <i class="fas fa-user-circle me-1"></i> Login
        </a>
        <button class="navbar-toggler border-0 shadow-none p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMainCollapse">
          <i class="fas fa-bars fa-lg text-primary"></i>
        </button>
      </div>
'''
html = re.sub(r'<button class="navbar-toggler[^>]*>.*?</button>', mod, html, flags=re.DOTALL)

with open('test_about_open.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Created test_about_open.html')
