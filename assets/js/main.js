/**
 * ALLERGIQ - Allergy Testing & Immunotherapy Clinic Template
 * Main JavaScript Controller
 * Includes: Theme Toggle (Dark/Light), RTL Switcher, Symptom Checker,
 * Pollen Meter, Appointment Booking, Charts, Filters, Modals & Toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. THEME MANAGEMENT (DARK / LIGHT MODE)
  // =========================================================================
  const themeToggleBtns = document.querySelectorAll('.btn-theme-toggle');
  const storedTheme = localStorage.getItem('allergiq_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('allergiq_theme', theme);
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'fas fa-moon';
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });
  };

  applyTheme(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // Disable browser zoom shortcuts (Ctrl + wheel, Ctrl + +/-/0)
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
  }, { passive: false });

  // =========================================================================
  // 2. RTL / LTR SWITCHER
  // =========================================================================
  const rtlToggleBtns = document.querySelectorAll('.btn-rtl-toggle');
  const storedDir = localStorage.getItem('allergiq_dir') || 'ltr';

  const applyDirection = (dir, isUserTriggered = false) => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('allergiq_dir', dir);
    rtlToggleBtns.forEach(btn => {
      const label = btn.querySelector('.rtl-label');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR text direction' : 'Switch to RTL text direction');
    });
  };

  applyDirection(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir, true);
    });
  });

  // =========================================================================
  // 2B. CUSTOM SELECT DROPDOWNS (100% FIELD BOUNDARY CONTAINMENT)
  // =========================================================================
  const initCustomSelects = () => {
    document.querySelectorAll('.custom-select-dropdown').forEach(dropdown => {
      const button = dropdown.querySelector('.form-select');
      const selectedText = button ? button.querySelector('.selected-text') : null;
      const hiddenSelect = dropdown.querySelector('select');
      const items = dropdown.querySelectorAll('.dropdown-item');

      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const value = item.getAttribute('data-value') || '';
          const text = item.textContent.trim();

          if (selectedText) {
            selectedText.textContent = text;
          }

          if (hiddenSelect) {
            hiddenSelect.value = value;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }

          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        });
      });
    });
  };

  initCustomSelects();

  // =========================================================================
  // 3. STICKY NAVBAR SCROLL EFFECT
  // =========================================================================
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 15) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial scroll position on load
  }

  // =========================================================================
  // 4. INTERACTIVE SYMPTOM CHECKER & RECOMMENDATION ENGINE
  // =========================================================================
  const symptomBtns = document.querySelectorAll('.symptom-tag-btn');
  const checkResultsBtn = document.getElementById('btnCalculateSymptoms');
  const resultCard = document.getElementById('symptomResultBox');

  if (symptomBtns.length > 0) {
    symptomBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
      });
    });
  }

  if (checkResultsBtn && resultCard) {
    checkResultsBtn.addEventListener('click', () => {
      const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-tag-btn.active'))
        .map(el => el.getAttribute('data-symptom'));

      const resultTitle = document.getElementById('resultRecommendedTest');
      const resultDesc = document.getElementById('resultTestDescription');
      const resultBadge = document.getElementById('resultSeverityBadge');

      if (selectedSymptoms.length === 0) {
        showToast('Please select at least one symptom to evaluate.', 'warning');
        return;
      }

      let recommendation = {
        test: 'Skin Prick Allergen Panel (40+ Environmental & Food)',
        desc: 'Based on your nasal, skin, and ocular symptoms, our comprehensive Skin Prick Test is recommended to pinpoint specific IgE triggers in under 20 minutes.',
        severity: 'Moderate - High Clinical Correlation',
        badgeClass: 'bg-primary',
        url: 'service-skin-prick.html'
      };

      if (selectedSymptoms.includes('wheezing') || selectedSymptoms.includes('cough')) {
        recommendation.test = 'Spirometry + Environmental Aeroallergen Testing';
        recommendation.desc = 'Respiratory symptoms indicate potential allergic asthma. We recommend combined pulmonary spirometry and intradermal allergen testing.';
        recommendation.severity = 'Priority - Respiratory Protocol';
        recommendation.badgeClass = 'bg-danger';
        recommendation.url = 'service-spirometry.html';
      } else if (selectedSymptoms.includes('food') || selectedSymptoms.includes('stomach')) {
        recommendation.test = 'Component-Resolved Diagnostics (CRD) & Food IgE Testing';
        recommendation.desc = 'Gastrointestinal and systemic reactions require specific protein-level food allergen screening and oral challenge evaluation.';
        recommendation.severity = 'Specific Food Panel';
        recommendation.badgeClass = 'bg-warning text-dark';
        recommendation.url = 'service-food-panels.html';
      } else if (selectedSymptoms.length >= 4) {
        recommendation.test = 'Comprehensive Immunotherapy Evaluation (SCIT / SLIT)';
        recommendation.desc = 'Multi-symptom chronic allergies are prime candidates for long-term desensitization via allergy shots or sublingual drops.';
        recommendation.severity = 'Candidate for Immunotherapy';
        recommendation.badgeClass = 'bg-success';
        recommendation.url = 'service-scit.html';
      }

      if (resultTitle) resultTitle.textContent = recommendation.test;
      if (resultDesc) resultDesc.textContent = recommendation.desc;
      if (resultBadge) {
        resultBadge.textContent = recommendation.severity;
        resultBadge.className = `badge ${recommendation.badgeClass} px-3 py-2`;
      }
      const testDetailsLink = document.getElementById('resultTestDetailsLink');
      if (testDetailsLink && recommendation.url) {
        testDetailsLink.href = recommendation.url;
      }

      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast('Allergy evaluation analysis generated successfully!', 'success');
    });
  }

  // =========================================================================
  // 5. POLLEN & AIR QUALITY TRACKER SIMULATOR
  // =========================================================================
  const citySelect = document.getElementById('pollenCitySelect');
  if (citySelect) {
    const pollenData = {
      'new-york': { level: 'Moderate', value: 65, color: '#f59e0b', tree: 'High (Birch/Oak)', grass: 'Low', weed: 'Moderate', advice: 'Keep windows closed during early morning peak hours.' },
      'london': { level: 'Low', value: 28, color: '#10b981', tree: 'Low (Alder)', grass: 'Low', weed: 'Very Low', advice: 'Great conditions for outdoor exercise today.' },
      'tokyo': { level: 'High', value: 88, color: '#ef4444', tree: 'Very High (Cedar/Cypress)', grass: 'Moderate', weed: 'Low', advice: 'High cedar pollen count. Wear protective eyewear outdoors.' },
      'dubai': { level: 'Moderate', value: 54, color: '#f59e0b', tree: 'Low', grass: 'Low', weed: 'Moderate (Desert Chenopods)', advice: 'Dust and dry particulate allergens elevated.' },
      'sydney': { level: 'Very High', value: 92, color: '#dc2626', tree: 'Moderate', grass: 'Extreme (Ryegrass)', weed: 'High', advice: 'High thunderstorm asthma risk. Carry rescue inhaler.' }
    };

    citySelect.addEventListener('change', (e) => {
      const city = e.target.value;
      const data = pollenData[city] || pollenData['new-york'];

      const badge = document.getElementById('pollenBadge');
      const bar = document.getElementById('pollenBar');
      const treeVal = document.getElementById('pollenTree');
      const grassVal = document.getElementById('pollenGrass');
      const weedVal = document.getElementById('pollenWeed');
      const adviceVal = document.getElementById('pollenAdvice');

      if (badge) {
        badge.textContent = `${data.level} (${data.value}/100)`;
        badge.style.backgroundColor = data.color;
      }
      if (bar) {
        bar.style.width = `${data.value}%`;
        bar.style.backgroundColor = data.color;
      }
      if (treeVal) treeVal.textContent = data.tree;
      if (grassVal) grassVal.textContent = data.grass;
      if (weedVal) weedVal.textContent = data.weed;
      if (adviceVal) adviceVal.textContent = data.advice;
    });
  }

  // =========================================================================
  // 6. FILTERABLE SERVICES & BLOG ARTICLES (INTEGRATED SEARCH & CATEGORIES)
  // =========================================================================
  const filterPills = document.querySelectorAll('.filter-pill-btn');
  const filterItems = document.querySelectorAll('.filterable-item');
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogSearchClearBtn = document.getElementById('blogSearchClearBtn');
  const blogGridContainer = document.getElementById('blogGridContainer');

  // Unified function to filter blog items based on active category AND search query
  const applyBlogFilter = () => {
    if (!blogGridContainer) return;

    const activePill = document.querySelector('.filter-pill-btn.active');
    const activeCategory = activePill ? (activePill.getAttribute('data-filter') || 'all') : 'all';
    const query = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : '';

    // Toggle clear button visibility
    if (blogSearchClearBtn) {
      if (query.length > 0) {
        blogSearchClearBtn.classList.remove('d-none');
      } else {
        blogSearchClearBtn.classList.add('d-none');
      }
    }

    const blogCards = blogGridContainer.querySelectorAll('.blog-card-item');
    let visibleCount = 0;

    blogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
      const meta = card.querySelector('.blog-meta')?.textContent.toLowerCase() || '';
      const badge = card.querySelector('.blog-category-badge')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory || cardCategory.includes(activeCategory));
      const matchesSearch = !query || 
        title.includes(query) || 
        excerpt.includes(query) || 
        meta.includes(query) || 
        badge.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        card.classList.add('fadeIn');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle "No Articles Found" empty state
    let noResultsEl = document.getElementById('noBlogResults');
    if (visibleCount === 0) {
      if (!noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'noBlogResults';
        noResultsEl.className = 'col-12 text-center py-5';
        blogGridContainer.appendChild(noResultsEl);
      }
      noResultsEl.innerHTML = `
        <div class="p-5 rounded-4 border bg-surface-subtle mx-auto text-center" style="max-width: 520px; background-color: var(--bg-surface-subtle);">
          <div class="feature-card-icon mx-auto mb-3" style="width: 54px; height: 54px; border-radius: 50%; background: var(--bg-card); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); font-size: 1.3rem;">
            <i class="fas fa-search text-primary"></i>
          </div>
          <h4 class="mb-2">No Articles Found</h4>
          <p class="text-muted small mb-4">
            We couldn't find any articles matching "<strong>${query ? query.replace(/</g, '&lt;') : activeCategory}</strong>". Try searching for topics like <em>"IgE"</em>, <em>"pollen"</em>, <em>"pediatric"</em>, or <em>"drops"</em>.
          </p>
          <button id="btnResetBlogFilter" class="btn btn-primary btn-sm px-4">
            <i class="fas fa-rotate-left me-1"></i> Clear Search & View All
          </button>
        </div>
      `;
      noResultsEl.style.display = '';

      const resetBtn = document.getElementById('btnResetBlogFilter');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (blogSearchInput) blogSearchInput.value = '';
          filterPills.forEach(p => p.classList.remove('active'));
          const allPill = document.querySelector('.filter-pill-btn[data-filter="all"]');
          if (allPill) allPill.classList.add('active');
          applyBlogFilter();
        });
      }
    } else if (noResultsEl) {
      noResultsEl.style.display = 'none';
    }
  };

  // Wire up filter pills
  if (filterPills.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        if (blogGridContainer) {
          applyBlogFilter();
        } else if (filterItems.length > 0) {
          // Standard services/doctors page filtering
          const category = pill.getAttribute('data-filter');
          filterItems.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (category === 'all' || itemCat === category || (itemCat && itemCat.includes(category))) {
              item.style.display = '';
              item.classList.add('fadeIn');
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  }

  // Wire up live search and URL parameter handling on blog page
  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', applyBlogFilter);

    // Escape key clears search
    blogSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        blogSearchInput.value = '';
        applyBlogFilter();
      }
    });

    if (blogSearchClearBtn) {
      blogSearchClearBtn.addEventListener('click', () => {
        blogSearchInput.value = '';
        blogSearchInput.focus();
        applyBlogFilter();
      });
    }

    // Auto-populate & trigger search if URL has ?search=... (e.g. from blog-single.html "Search Articles" form)
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      blogSearchInput.value = searchParam;
      applyBlogFilter();
    }
  }

  // =========================================================================
  // 7. APPOINTMENT BOOKING & CONTACT FORM SUBMISSIONS + 10-DIGIT PHONE VALIDATION
  // =========================================================================
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.setAttribute('required', 'required');
    input.setAttribute('pattern', '[0-9]{10}');
    input.setAttribute('minlength', '10');
    input.setAttribute('maxlength', '10');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('title', 'Please enter a valid 10-digit phone number');

    // Real-time digit filtering and constraint validation
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (e.target.value.length === 10) {
        e.target.setCustomValidity('');
        e.target.classList.remove('is-invalid');
        e.target.classList.add('is-valid');
      } else {
        e.target.setCustomValidity('Phone number must be exactly 10 digits.');
        e.target.classList.remove('is-valid');
      }
    });

    input.addEventListener('blur', (e) => {
      if (e.target.value.length > 0 && e.target.value.length < 10) {
        e.target.classList.add('is-invalid');
      }
    });
  });

  // =========================================================================
  // 7.2. EMAIL ADDRESS MANDATORY @GMAIL.COM VALIDATION
  // =========================================================================
  const emailInputs = Array.from(document.querySelectorAll('input[type="email"]'))
      .filter(input => input.id !== 'forgotEmail');
  emailInputs.forEach(input => {
    input.setAttribute('required', 'required');
    input.setAttribute('pattern', '[a-zA-Z0-9._%+\\-]+@[gG][mM][aA][iI][lL]\\.[cC][oO][mM]');
    input.setAttribute('title', 'Please enter a valid Gmail address ending with @gmail.com');

    const validateGmail = () => {
      const val = input.value.trim().toLowerCase();
      if (!val) {
        input.setCustomValidity('Email address is required.');
        input.classList.remove('is-valid', 'is-invalid');
        return false;
      }
      if (!val.endsWith('@gmail.com') || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(val)) {
        input.setCustomValidity('Email address must be a valid account ending with @gmail.com');
        if (val.length > 3) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        return false;
      }
      input.setCustomValidity('');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    };

    input.addEventListener('input', validateGmail);
    input.addEventListener('blur', validateGmail);
  });

  // =========================================================================
  // 7.3. FULL NAME / PATIENT NAME MANDATORY VALIDATION (MINIMUM 2 LETTERS)
  // =========================================================================
  const isNameField = (input) => {
    if (!input || input.type !== 'text' || input.readOnly) return false;
    const nameAttr = (input.name || '').toLowerCase();
    const idAttr = (input.id || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const label = input.closest('div')?.querySelector('label')?.textContent.toLowerCase() || '';

    // Emails / patient IDs / provider NPIs are not personal-name fields
    if (nameAttr.includes('email') || idAttr.includes('email') ||
        nameAttr.includes('npi') || idAttr.includes('npi') ||
        idAttr.includes('patientid')) {
      return false;
    }

    return nameAttr.includes('name') ||
           idAttr.includes('name') ||
           placeholder.includes('name') ||
           placeholder.includes('doe') ||
           placeholder.includes('jenkins') ||
           placeholder.includes('chang') ||
           label.includes('name');
  };

  const nameInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(isNameField);
  nameInputs.forEach(input => {
    input.setAttribute('required', 'required');
    input.setAttribute('minlength', '2');
    input.setAttribute('pattern', '(?=.*[a-zA-Z].*[a-zA-Z])[a-zA-Z\\s\'.-]{2,}');
    input.setAttribute('title', 'Please enter at least 2 letters for the name');

    const validateName = (showInvalid = false) => {
      const val = input.value.trim();
      if (!val) {
        input.setCustomValidity('Patient name is required.');
        if (showInvalid) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        } else {
          input.classList.remove('is-valid', 'is-invalid');
        }
        return false;
      }

      const letterMatches = val.match(/[a-zA-Z\u00C0-\u024F]/g);
      const letterCount = letterMatches ? letterMatches.length : 0;
      const isValidFormat = /^[a-zA-Z\u00C0-\u024F\s'.-]+$/.test(val);

      if (!isValidFormat) {
        input.setCustomValidity('Name can only contain letters, spaces, hyphens, and apostrophes.');
        if (showInvalid || val.length > 0) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        return false;
      }

      if (letterCount < 2) {
        input.setCustomValidity('Please enter at least 2 letters for the name.');
        if (showInvalid || val.length > 0) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        return false;
      }

      input.setCustomValidity('');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    };

    input.addEventListener('input', () => {
      const val = input.value.trim();
      if (val.length === 0) {
        input.classList.remove('is-valid', 'is-invalid');
        input.setCustomValidity('Patient name is required.');
      } else {
        validateName(false);
      }
    });

    input.addEventListener('blur', () => {
      if (input.value.trim().length > 0) {
        validateName(true);
      }
    });
  });

  const appointmentForms = document.querySelectorAll('.appointment-booking-form');
  appointmentForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate Patient Full Name / Name (at least 2 letters)
      const nameInput = Array.from(form.querySelectorAll('input[type="text"]')).find(isNameField);
      if (nameInput) {
        const nameVal = nameInput.value.trim();
        const letterMatches = nameVal.match(/[a-zA-Z\u00C0-\u024F]/g);
        const letterCount = letterMatches ? letterMatches.length : 0;
        const isValidFormat = /^[a-zA-Z\u00C0-\u024F\s'.-]+$/.test(nameVal);

        if (!nameVal || letterCount < 2 || !isValidFormat) {
          nameInput.focus();
          nameInput.classList.add('is-invalid');
          nameInput.classList.remove('is-valid');
          if (!nameVal) {
            showToast('Please enter the patient full name.', 'warning');
          } else if (!isValidFormat) {
            showToast('Name can only contain letters, spaces, hyphens, and apostrophes.', 'warning');
          } else {
            showToast('Please enter at least 2 letters for the patient name.', 'warning');
          }
          return;
        }
      }

      // Validate 10-digit phone number
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        const phoneVal = phoneInput.value.replace(/\D/g, '');
        if (phoneVal.length !== 10) {
          phoneInput.focus();
          phoneInput.classList.add('is-invalid');
          showToast('Please enter a valid 10-digit phone number.', 'warning');
          return;
        }
      }

      // Validate Gmail address
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        const emailVal = emailInput.value.trim().toLowerCase();
        if (!emailVal.endsWith('@gmail.com') || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(emailVal)) {
          emailInput.focus();
          emailInput.classList.add('is-invalid');
          showToast('Please enter a valid Gmail address ending with @gmail.com', 'warning');
          return;
        }
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Scheduling Appointment...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));

        // Close modal if inside one
        const modalEl = form.closest('.modal');
        if (modalEl && window.bootstrap) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }

        showToast('Your appointment has been successfully scheduled! A confirmation email and SMS reminder have been sent.', 'success');
      }, 1200);
    });
  });

  const contactForms = document.querySelectorAll('.contact-message-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate Full Name (at least 2 letters)
      const nameInput = Array.from(form.querySelectorAll('input[type="text"]')).find(isNameField);
      if (nameInput) {
        const nameVal = nameInput.value.trim();
        const letterMatches = nameVal.match(/[a-zA-Z\u00C0-\u024F]/g);
        const letterCount = letterMatches ? letterMatches.length : 0;
        const isValidFormat = /^[a-zA-Z\u00C0-\u024F\s'.-]+$/.test(nameVal);

        if (!nameVal || letterCount < 2 || !isValidFormat) {
          nameInput.focus();
          nameInput.classList.add('is-invalid');
          nameInput.classList.remove('is-valid');
          if (!nameVal) {
            showToast('Please enter your full name.', 'warning');
          } else if (!isValidFormat) {
            showToast('Name can only contain letters, spaces, hyphens, and apostrophes.', 'warning');
          } else {
            showToast('Please enter at least 2 letters for your name.', 'warning');
          }
          return;
        }
      }

      // Validate 10-digit phone number
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        const phoneVal = phoneInput.value.replace(/\D/g, '');
        if (phoneVal.length !== 10) {
          phoneInput.focus();
          phoneInput.classList.add('is-invalid');
          showToast('Please enter a valid 10-digit phone number.', 'warning');
          return;
        }
      }

      // Validate Gmail address
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        const emailVal = emailInput.value.trim().toLowerCase();
        if (!emailVal.endsWith('@gmail.com') || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(emailVal)) {
          emailInput.focus();
          emailInput.classList.add('is-invalid');
          showToast('Please enter a valid Gmail address ending with @gmail.com', 'warning');
          return;
        }
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        showToast('Thank you! Your message has been received by our clinical coordination team.', 'success');
      }, 1000);
    });
  });

  // =========================================================================
  // 8. TOAST NOTIFICATION UTILITY
  // =========================================================================
  window.showToast = function(message, type = 'info') {
    let toastContainer = document.getElementById('allergiqToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'allergiqToastContainer';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    const toastId = 'toast-' + Date.now();
    const iconMap = {
      success: 'fas fa-check-circle text-success',
      danger: 'fas fa-exclamation-circle text-danger',
      warning: 'fas fa-exclamation-triangle text-warning',
      info: 'fas fa-info-circle text-primary'
    };

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" style="background-color: var(--bg-surface); color: var(--text-main); border-radius: var(--radius-md);">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="${iconMap[type] || iconMap.info} fa-lg"></i>
            <div>${message}</div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    if (window.bootstrap) {
      const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
      bsToast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    } else {
      toastEl.classList.add('show');
      setTimeout(() => toastEl.remove(), 4500);
    }
  };

  // =========================================================================
  // 9. DASHBOARD INITIALIZATION (CHARTS & TAB ACTIONS)
  // =========================================================================
  if (typeof Chart !== 'undefined') {
    // 1. IgE Antibody Desensitization Curve Chart
    const igeChartCtx = document.getElementById('igeChart');
    if (igeChartCtx) {
      new Chart(igeChartCtx, {
        type: 'line',
        data: {
          labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 6', 'Month 9', 'Month 12 (Current)'],
          datasets: [
            {
              label: 'IgE Allergen Reactivity (kU/L)',
              data: [84, 76, 62, 45, 28, 16, 9],
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.12)',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#0284c7',
              pointRadius: 5
            },
            {
              label: 'IgG4 Protective Antibodies (mg/L)',
              data: [2, 5, 14, 30, 58, 85, 112],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#10b981',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 14,
                font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
                color: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#94a3b8' : '#64748b'
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { family: "'Outfit', sans-serif" },
              padding: 12,
              cornerRadius: 8
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            },
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.2)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // 2. Allergen Sensitivity Radar / Bar Chart
    const allergenChartCtx = document.getElementById('allergenProfileChart');
    if (allergenChartCtx) {
      new Chart(allergenChartCtx, {
        type: 'bar',
        data: {
          labels: ['Timothy Grass', 'Dust Mites (Der p 1)', 'Birch Pollen', 'Cat Dander (Fel d 1)', 'Peanut (Ara h 2)', 'Alternaria Mold'],
          datasets: [{
            label: 'Initial Wheal Size (mm)',
            data: [14, 18, 12, 16, 4, 8],
            backgroundColor: 'rgba(239, 68, 68, 0.4)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: 'Current Wheal Size (mm)',
            data: [3, 4, 2, 5, 1, 2],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, max: 20 }
          }
        }
      });
    }
  }

  // Dashboard Action buttons
  const downloadPdfBtns = document.querySelectorAll('.btn-download-report');
  downloadPdfBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const testName = btn.getAttribute('data-test') || 'Allergy Test Report';
      showToast(`Generating secure PDF for "${testName}"... Download started.`, 'info');
    });
  });

  const shotLogBtns = document.querySelectorAll('.btn-log-shot');
  shotLogBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Immunotherapy dose recorded in clinical EHR system!', 'success');
    });
  });

  // =========================================================================
  // 13. GLOBAL LEGAL & EHR POPUP MODALS (PRIVACY, HIPAA, EHR PORTAL)
  // =========================================================================
  const initGlobalFooterModals = () => {
    // If modals aren't in DOM, inject them dynamically into document.body
    if (!document.getElementById('privacyPolicyModal')) {
      const modalsContainer = document.createElement('div');
      modalsContainer.id = 'allergiqGlobalModals';
      modalsContainer.innerHTML = `
        <!-- Privacy Policy Modal -->
        <div class="modal fade" id="privacyPolicyModal" tabindex="-1" aria-labelledby="privacyPolicyModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <div class="p-2 rounded-3 bg-primary-subtle text-primary" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-shield-alt fa-lg"></i>
                  </div>
                  <div>
                    <h5 class="modal-title fw-bold mb-0" id="privacyPolicyModalLabel">AllergiQ Privacy Policy & Clinical Data Notice</h5>
                    <small class="text-muted">Effective: 2026 • Patient Confidentiality Standard</small>
                  </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <div class="alert alert-info d-flex align-items-center gap-3 mb-4" role="alert">
                  <i class="fas fa-info-circle fa-lg flex-shrink-0"></i>
                  <div class="small">
                    Your clinical privacy is our highest priority. All allergy skin-prick results, serum IgE panels, and medical histories are encrypted under federal healthcare standards.
                  </div>
                </div>

                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-database me-2"></i>1. Information We Collect</h6>
                <p class="small text-muted mb-3">
                  We collect diagnostic information including environmental allergy profiles, food challenge histories, respiratory metrics (spirometry), health insurance credentials, and contact details necessary for safe immunotherapy administration.
                </p>

                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-user-md me-2"></i>2. Clinical Utilization of Records</h6>
                <p class="small text-muted mb-3">
                  Your records are used strictly by our board-certified allergists and immunologists to customize sublingual (SLIT) or subcutaneous (SCIT) therapy doses, monitor anaphylaxis risks, and coordinate with your primary care provider.
                </p>

                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-lock me-2"></i>3. Zero Commercial Disclosure Policy</h6>
                <p class="small text-muted mb-3">
                  AllergiQ Clinic does <strong>not</strong> sell, rent, or trade patient personal health data, genetic markers, or contact info to pharmaceutical advertisers or third-party marketers under any circumstance.
                </p>

                <h6 class="fw-bold text-primary mb-2"><i class="fas fa-file-contract me-2"></i>4. Patient EHR Rights</h6>
                <p class="small text-muted mb-0">
                  You have the legal right to inspect your electronic records, request corrections, obtain an export of your allergy panel in standardized CCDA/FHIR format, or revoke data-sharing authorizations at any time.
                </p>
              </div>
              <div class="modal-footer border-top d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="if(window.showToast) window.showToast('Privacy Policy documentation sent to your registered email.', 'info')">
                  <i class="fas fa-envelope me-1"></i> Email Me Copy
                </button>
                <button type="button" class="btn btn-primary btn-sm px-4 fw-semibold" data-bs-dismiss="modal">
                  I Understand & Agree
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- HIPAA Compliance Modal -->
        <div class="modal fade" id="hipaaModal" tabindex="-1" aria-labelledby="hipaaModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <div class="p-2 rounded-3 bg-success-subtle text-success" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-file-medical-alt fa-lg"></i>
                  </div>
                  <div>
                    <h5 class="modal-title fw-bold mb-0" id="hipaaModalLabel">HIPAA Compliance & Notice of Privacy Practices</h5>
                    <small class="text-muted">45 CFR Parts 160 & 164 • Protected Health Information (PHI)</small>
                  </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <div class="alert alert-success d-flex align-items-center gap-3 mb-4" role="alert">
                  <i class="fas fa-shield-alt fa-lg flex-shrink-0"></i>
                  <div class="small">
                    AllergiQ Clinic maintains certified compliance with the Health Insurance Portability and Accountability Act (HIPAA) Security and Privacy Rules.
                  </div>
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-sm-6">
                    <div class="p-3 rounded border bg-body-tertiary h-100">
                      <h6 class="fw-bold mb-1"><i class="fas fa-key text-primary me-2"></i>256-Bit ePHI Encryption</h6>
                      <p class="small text-muted mb-0">All patient diagnostic data is encrypted at rest (AES-256) and in transit (TLS 1.3) across all clinical workstations.</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 rounded border bg-body-tertiary h-100">
                      <h6 class="fw-bold mb-1"><i class="fas fa-user-lock text-success me-2"></i>Role-Based Access Control</h6>
                      <p class="small text-muted mb-0">Only credentialed clinical personnel directly treating your case have authorized access to your allergy charts.</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 rounded border bg-body-tertiary h-100">
                      <h6 class="fw-bold mb-1"><i class="fas fa-history text-info me-2"></i>Immutable Audit Logs</h6>
                      <p class="small text-muted mb-0">Every chart viewing, allergen order, and lab download is timestamped and logged in tamper-evident audit trails.</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 rounded border bg-body-tertiary h-100">
                      <h6 class="fw-bold mb-1"><i class="fas fa-handshake text-warning me-2"></i>Signed BAAs in Place</h6>
                      <p class="small text-muted mb-0">All reference laboratories and telehealth cloud providers hold signed Business Associate Agreements.</p>
                    </div>
                  </div>
                </div>

                <h6 class="fw-bold mb-2">Office of Clinical Compliance</h6>
                <p class="small text-muted mb-0">
                  For official HIPAA inquiries, records requests, or verification:
                  <br>Email: <a href="mailto:compliance@allergiq-clinic.com" class="text-primary">compliance@allergiq-clinic.com</a> • Phone: <a href="tel:8004562553" class="text-primary">(800) 456-ALLERGY</a>
                </p>
              </div>
              <div class="modal-footer border-top">
                <button type="button" class="btn btn-success btn-sm px-4 fw-semibold" data-bs-dismiss="modal">
                  <i class="fas fa-check me-1"></i> Acknowledge HIPAA Practices
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Patient EHR Portal Modal -->
        <div class="modal fade" id="ehrPortalModal" tabindex="-1" aria-labelledby="ehrPortalModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <div class="p-2 rounded-3 bg-info-subtle text-info" style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-hospital-user fa-lg"></i>
                  </div>
                  <div>
                    <h5 class="modal-title fw-bold mb-0" id="ehrPortalModalLabel">AllergiQ Patient EHR Portal</h5>
                    <small class="text-muted">Secure Electronic Health Records & Telehealth Gateway</small>
                  </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <div class="row g-4 align-items-center">
                  <div class="col-md-7">
                    <h6 class="fw-bold text-primary mb-3">24/7 Digital Health Access</h6>
                    <ul class="list-unstyled d-flex flex-column gap-2 mb-4">
                      <li class="d-flex align-items-center gap-2 small">
                        <i class="fas fa-check-circle text-success"></i>
                        <span><strong>Instant Lab Results:</strong> View IgE Component panels & wheal sizes</span>
                      </li>
                      <li class="d-flex align-items-center gap-2 small">
                        <i class="fas fa-check-circle text-success"></i>
                        <span><strong>Immunotherapy Tracker:</strong> Monitor allergy shot buildup & sublingual doses</span>
                      </li>
                      <li class="d-flex align-items-center gap-2 small">
                        <i class="fas fa-check-circle text-success"></i>
                        <span><strong>Direct Provider Messaging:</strong> Encrypted chats with your clinical care team</span>
                      </li>
                      <li class="d-flex align-items-center gap-2 small">
                        <i class="fas fa-check-circle text-success"></i>
                        <span><strong>Prescription Refills:</strong> Auto-renew epinephrine autoinjectors & drops</span>
                      </li>
                    </ul>

                    <div class="d-flex flex-wrap gap-2">
                      <a href="login.html" class="btn btn-primary btn-sm px-3 fw-bold">
                        <i class="fas fa-sign-in-alt me-1"></i> Patient Portal Sign In
                      </a>
                      <a href="dashboard.html" class="btn btn-outline-primary btn-sm px-3 fw-bold">
                        <i class="fas fa-chart-line me-1"></i> View Live Demo EHR
                      </a>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="p-3 rounded-3 border bg-body-tertiary text-center">
                      <div class="mb-2">
                        <i class="fas fa-user-lock text-primary" style="font-size: 2.2rem;"></i>
                      </div>
                      <h6 class="fw-bold mb-1">Need Portal Assistance?</h6>
                      <p class="text-muted small mb-3">First time patient or need login support? Our navigators are available.</p>
                      <div class="d-grid gap-2">
                        <a href="tel:8004562553" class="btn btn-sm btn-outline-secondary">
                          <i class="fas fa-phone-alt me-1"></i> (800) 456-ALLERGY
                        </a>
                        <a href="mailto:care@allergiq-clinic.com" class="btn btn-sm btn-outline-secondary">
                          <i class="fas fa-envelope me-1"></i> care@allergiq-clinic.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer border-top justify-content-between">
                <small class="text-muted"><i class="fas fa-shield-alt text-success me-1"></i> 256-Bit SSL Encrypted Healthcare Portal</small>
                <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalsContainer);
    }

    // Attach click interceptors for any link that might point to privacy, hipaa, or ehr portal
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const text = (link.textContent || '').trim().toLowerCase();
      const target = link.getAttribute('data-bs-target') || '';

      if (target === '#privacyPolicyModal' || href === 'privacy.html' || href === '#privacyPolicyModal' || text === 'privacy policy') {
        e.preventDefault();
        const modalEl = document.getElementById('privacyPolicyModal');
        if (modalEl && window.bootstrap && window.bootstrap.Modal) {
          bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
      } else if (target === '#hipaaModal' || href === 'terms.html' || href === '#hipaaModal' || text === 'hipaa compliance') {
        e.preventDefault();
        const modalEl = document.getElementById('hipaaModal');
        if (modalEl && window.bootstrap && window.bootstrap.Modal) {
          bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
      } else if (target === '#ehrPortalModal' || href === '#ehrPortalModal' || (link.closest('.footer-bottom') && text === 'patient ehr portal')) {
        e.preventDefault();
        const modalEl = document.getElementById('ehrPortalModal');
        if (modalEl && window.bootstrap && window.bootstrap.Modal) {
          bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
      }
    });
  };

  initGlobalFooterModals();

  // =========================================================================
  // 14. ANIMATED STATS COUNTERS (GRADUAL COUNT-UP ANIMATION)
  // =========================================================================
  const initStatsCounters = () => {
    const counterElements = document.querySelectorAll('.counter-num, [data-counter]');
    if (!counterElements.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target') || el.textContent.replace(/[^0-9.]/g, ''));
      if (isNaN(target)) return;

      const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
      const decimals = parseInt(el.getAttribute('data-decimals') || (String(target).includes('.') ? '1' : '0'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';

      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic curve: fast initial climb, gentle deceleration to the final number
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        const formattedVal = decimals > 0 
          ? currentVal.toFixed(decimals) 
          : Math.floor(currentVal).toLocaleString();

        el.textContent = `${prefix}${formattedVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          const finalVal = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
          el.textContent = `${prefix}${finalVal}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            animateCounter(el);
            observer.unobserve(el);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      });

      counterElements.forEach(el => {
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const initialNum = decimals > 0 ? (0).toFixed(decimals) : '0';
        el.textContent = `${prefix}${initialNum}${suffix}`;
        statsObserver.observe(el);
      });
    } else {
      // Fallback
      counterElements.forEach(el => animateCounter(el));
    }
  };

  initStatsCounters();
});
