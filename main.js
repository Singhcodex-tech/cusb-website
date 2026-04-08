/* GitHub Pages: mobile body class (replaces PHP user-agent check) */
(function(){try{var u=navigator.userAgent||'';if(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS|Mobile/i.test(u))document.body.classList.add('is-mobile');}catch(e){}})();


    // Declare all functions on window so inline onclick="" attributes can always find them,
    // regardless of when the script tag is parsed relative to the DOM.
    window.openFacultyModal = function(e) {
      if (e) e.preventDefault();
      var modal = document.getElementById('facultyModal');
      var panel = document.getElementById('facultyModalPanel');
      if (!modal || !panel) return;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function() { panel.style.transform = 'translateX(0)'; });
    };

    window.closeFacultyModal = function() {
      var panel = document.getElementById('facultyModalPanel');
      var modal = document.getElementById('facultyModal');
      if (!panel || !modal) return;
      panel.style.transform = 'translateX(100%)';
      setTimeout(function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 450);
    };

    window.toggleDept = function(el) {
      el.closest('.dept-item').classList.toggle('open');
    };

    window.filterSchool = function(school, btn) {
      window._activeSchool = school;
      document.querySelectorAll('#facultyModal .filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var si = document.getElementById('searchInput');
      if (si) si.value = '';
      window.applyFilters();
    };

    window.filterAll = function() { window.applyFilters(); };

    window.applyFilters = function() {
      var activeSchool = window._activeSchool || 'all';
      var si = document.getElementById('searchInput');
      var q = si ? si.value.toLowerCase().trim() : '';
      var anyVisible = false;
      document.querySelectorAll('#facultyModal .school-block').forEach(function(block) {
        var match = activeSchool === 'all' || activeSchool === block.dataset.school;
        if (!match) { block.classList.add('hidden'); return; }
        var hasDept = false;
        block.querySelectorAll('.dept-item').forEach(function(item) {
          var dn = item.querySelector('.dept-toggle-name').textContent.toLowerCase();
          var fn = Array.from(item.querySelectorAll('.fac-name')).map(function(n) { return n.textContent.toLowerCase(); });
          var fs = Array.from(item.querySelectorAll('.fac-specialization')).map(function(s) { return s.textContent.toLowerCase(); });
          var show = !q || dn.includes(q) || fn.some(function(n) { return n.includes(q); }) || fs.some(function(s) { return s.includes(q); });
          item.classList.toggle('hidden', !show);
          if (show) {
            hasDept = true;
            if (q) item.classList.add('open');
            item.querySelectorAll('.fac-card').forEach(function(card) {
              var n = (card.querySelector('.fac-name') ? card.querySelector('.fac-name').textContent.toLowerCase() : '');
              var s = (card.querySelector('.fac-specialization') ? card.querySelector('.fac-specialization').textContent.toLowerCase() : '');
              card.classList.toggle('fac-hidden', q ? !(n.includes(q) || s.includes(q)) : false);
            });
          }
        });
        block.classList.toggle('hidden', !hasDept);
        if (hasDept) anyVisible = true;
      });
      var nr = document.getElementById('noResults');
      if (nr) nr.classList.toggle('show', !anyVisible);
    };

    // Escape key closes modal
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') window.closeFacultyModal(); });
  

/* ========== section ========== */


(function(){
  'use strict';

  /* ── 1. MEGA DROPDOWN: click/touch toggle ── */
  var dropItems = document.querySelectorAll('.nav-has-dropdown');

  function closeAllDrops(except) {
    dropItems.forEach(function(li){
      if (li !== except) {
        li.classList.remove('drop-open');
        var d = li.querySelector('.nav-mega-drop');
        if (d) {
          d.style.left      = '50%';
          d.style.right     = 'auto';
          d.style.transform = 'translateX(-50%) translateY(-10px) scale(0.98)';
          d.style.opacity   = '';
        }
      }
    });
  }

  function closeCTARibbon() {
    var w = document.querySelector('.nav-cta-wrap');
    if (w) w.classList.remove('ribbon-open');
  }

  function closeUserMenu() {
    var m = document.getElementById('userDropMenu');
    if (m) m.classList.remove('udm-open');
  }

  dropItems.forEach(function(li){
    var trigger = li.querySelector('.nav-drop-trigger');
    var drop    = li.querySelector('.nav-mega-drop');
    if (!trigger || !drop) return;

    /* clamp to viewport and make visible */
    function clampDrop(){
      /* default: centered on the trigger */
      drop.style.left      = '50%';
      drop.style.right     = 'auto';
      drop.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      drop.style.opacity   = '1';
      requestAnimationFrame(function(){
        var r = drop.getBoundingClientRect();
        if (r.right > window.innerWidth - 12) {
          drop.style.left      = 'auto';
          drop.style.right     = '0';
          drop.style.transform = 'translateY(0) scale(1)';
        }
        if (r.left < 12) {
          drop.style.left      = '0';
          drop.style.right     = 'auto';
          drop.style.transform = 'translateY(0) scale(1)';
        }
      });
    }

    trigger.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var isOpen = li.classList.contains('drop-open');
      closeAllDrops(li);
      closeCTARibbon();
      closeUserMenu();
      if (!isOpen) {
        li.classList.add('drop-open');
        clampDrop();
      } else {
        li.classList.remove('drop-open');
        /* reset inline styles so next open starts clean */
        drop.style.left      = '50%';
        drop.style.right     = 'auto';
        drop.style.transform = 'translateX(-50%) translateY(-10px) scale(0.98)';
        drop.style.opacity   = '';
      }
    });

    trigger.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
      if (e.key === 'Escape') { li.classList.remove('drop-open'); trigger.focus(); }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var first = drop.querySelector('a,button,[onclick]');
        if (first) first.focus();
      }
    });

    li.addEventListener('focusout', function(){
      setTimeout(function(){
        if (!li.contains(document.activeElement)) li.classList.remove('drop-open');
      }, 180);
    });
  });

  /* ── 2. CTA APPLY RIBBON ── */
  var ctaWrap = document.querySelector('.nav-cta-wrap');
  var ctaBtn  = ctaWrap && ctaWrap.querySelector('.nav-cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var isOpen = ctaWrap.classList.contains('ribbon-open');
      closeAllDrops();
      closeUserMenu();
      ctaWrap.classList.toggle('ribbon-open', !isOpen);
    });
    ctaWrap.addEventListener('focusout', function(){
      setTimeout(function(){
        if (!ctaWrap.contains(document.activeElement)) closeCTARibbon();
      }, 180);
    });
  }

  /* ── 3. USER PROFILE DROPDOWN (define missing functions) ── */
  window.toggleUserMenu = function(){
    var m = document.getElementById('userDropMenu');
    if (!m) return;
    closeAllDrops();
    closeCTARibbon();
    m.classList.toggle('udm-open');
  };

  window.signOutUser = function(){
    closeUserMenu();
    if (typeof cusbSignOut === 'function') cusbSignOut();
  };

  /* ── 4. GLOBAL CLOSE on outside click / Escape ── */
  document.addEventListener('click', function(e){
    if (!e.target.closest('.nav-has-dropdown')) closeAllDrops();
    if (!e.target.closest('.nav-cta-wrap'))     closeCTARibbon();
    if (!e.target.closest('#navUserPill'))       closeUserMenu();
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ closeAllDrops(); closeCTARibbon(); closeUserMenu(); }
  });

  /* ── 5. ACTIVE SECTION HIGHLIGHTING ── */
  var sectionIds = ['about','academics','programs','research','news','placements','acal-sec'];
  var sectionEls = sectionIds.map(function(id){ return document.getElementById(id); });
  var navAnchors = document.querySelectorAll('.nav-links > li > a.nav-drop-trigger');

  function updateActiveNav(){
    var scrollY = window.scrollY + 100;
    var current = '';
    sectionEls.forEach(function(el, i){
      if (el && el.offsetTop <= scrollY) current = sectionIds[i];
    });
    /* map program → academics */
    if (current === 'programs' || current === 'acal-sec') current = 'academics';
    navAnchors.forEach(function(a){
      var href = (a.getAttribute('href') || '').replace('#','');
      a.closest('li').classList.toggle('nav-active', href === current && current !== '');
    });
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function(){
    if (!scrollTicking){
      requestAnimationFrame(function(){ updateActiveNav(); scrollTicking = false; });
      scrollTicking = true;
    }
  }, { passive: true });
  updateActiveNav();

  /* ── 6. NAV SCROLL SHADOW ── */
  var navEl = document.querySelector('nav');
  window.addEventListener('scroll', function(){
    if (!navEl) return;
    if (window.scrollY > 8){
      navEl.style.boxShadow = '0 2px 0 rgba(184,134,11,0.14),0 8px 48px rgba(26,21,16,0.13)';
    } else {
      navEl.style.boxShadow = '0 1px 0 rgba(184,134,11,0.08),0 4px 32px rgba(26,21,16,0.06)';
    }
  }, { passive: true });

  /* ── 7. CLOSE ALL ON RESIZE ── */
  window.addEventListener('resize', function(){
    closeAllDrops(); closeCTARibbon(); closeUserMenu();
  });

})();


/* ========== section ========== */


/* ════════════ ALL PROGRAMME DATA ════════════ */
const SYL = {
  ug:[
    { icon:'📖', name:'B.A. B.Ed. (Integrated)', badge:'UG · 4 Yrs', dept:'School of Education', chips:['8 Sems','NCTE','CUET-UG'],
      desc:'4-year dual degree combining Arts & Education, preparing secondary school teachers with subject knowledge and pedagogy.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Child Psychology & Development',cr:'4'},{n:'Core Arts Subject – I (History/Pol.Sci.)',cr:'4'},{n:'Core Arts Subject – II (Hindi/English)',cr:'4'},{n:'Communication Skills',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Philosophy of Education',cr:'4'},{n:'Sociology of Education',cr:'4'},{n:'Core Arts Subject – III',cr:'4'},{n:'Core Arts Subject – IV',cr:'4'},{n:'Creative Arts & Craft',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Curriculum Design & Development',cr:'4'},{n:'Inclusive & Special Education',cr:'4'},{n:'Pedagogy of Language',cr:'4'},{n:'Core Arts Elective – I',cr:'4'},{n:'School Observation (Practicum)',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'ICT in Education',cr:'4'},{n:'Assessment, Measurement & Evaluation',cr:'4'},{n:'Gender & Education',cr:'4'},{n:'Core Arts Elective – II',cr:'4'},{n:'Community Service',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Educational Psychology – Advanced',cr:'4'},{n:'Pedagogy of Social Science',cr:'4'},{n:'Classroom Management',cr:'4'},{n:'Teaching Practice – I (School)',cr:'6'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Educational Research Methods',cr:'4'},{n:'Value Education & Human Rights',cr:'4'},{n:'Environment & Sustainability',cr:'4'},{n:'Teaching Practice – II',cr:'6'}]},
        {n:'Year 4 – Sem VII',c:[{n:'Education Policy & Administration',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'School Management & Leadership',cr:'4'},{n:'Project Work – I',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🔬', name:'B.Sc. B.Ed. (Integrated)', badge:'UG · 4 Yrs', dept:'School of Education', chips:['8 Sems','NCTE','Science'],
      desc:'4-year dual degree in Science & Education training future teachers for Mathematics, Physics, Chemistry and Biology.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Child Development & Psychology',cr:'4'},{n:'Physics – I',cr:'4'},{n:'Mathematics – I',cr:'4'},{n:'Communication Skills',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Philosophy & Sociology of Education',cr:'4'},{n:'Chemistry – I',cr:'4'},{n:'Biology / Mathematics – II',cr:'4'},{n:'Computer Fundamentals',cr:'4'},{n:'Lab Practice – I',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Science & Mathematics Pedagogy',cr:'4'},{n:'Physics – II',cr:'4'},{n:'Chemistry – II',cr:'4'},{n:'School Observation',cr:'4'},{n:'Lab Methods',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'ICT in Science Teaching',cr:'4'},{n:'Assessment & Evaluation',cr:'4'},{n:'Ecology & Environmental Science',cr:'4'},{n:'Biology / Statistics – II',cr:'4'},{n:'Community Practice',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Curriculum Design – Science',cr:'4'},{n:'Inclusive Education',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Physics / Chemistry – III',cr:'4'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Educational Research Methods',cr:'4'},{n:'Value & Environmental Education',cr:'4'},{n:'Teaching Practice – II',cr:'6'},{n:'Science Elective',cr:'4'}]},
        {n:'Year 4 – Sem VII',c:[{n:'School Administration & Management',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Project Work – I',cr:'4'},{n:'Applied Science Topic',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'⚖️', name:'B.A. LL.B. (Hons.)', badge:'UG · 5 Yrs', dept:'School of Law & Governance', chips:['10 Sems','BCI','CUET-UG'],
      desc:'5-year integrated programme covering constitutional, criminal, civil and international law with moot court practice.',
      meta:['5 Years · 10 Sems','BCI Approved','CUET-UG Entrance','60 Seats'],
      sems:[
        {n:'Sem I',c:[{n:'Law of Contracts – I',cr:'4'},{n:'Constitutional Law – I',cr:'4'},{n:'History of Courts & Legal Systems',cr:'4'},{n:'Political Science',cr:'4'},{n:'English Communication',cr:'2'}]},
        {n:'Sem II',c:[{n:'Law of Contracts – II',cr:'4'},{n:'Constitutional Law – II',cr:'4'},{n:'Family Law – I',cr:'4'},{n:'Sociology',cr:'4'},{n:'Legal Writing & Research',cr:'2'}]},
        {n:'Sem III',c:[{n:'Criminal Law – I (IPC)',cr:'4'},{n:'Family Law – II',cr:'4'},{n:'Administrative Law',cr:'4'},{n:'Economics',cr:'4'},{n:'Moot Court – I',cr:'2'}]},
        {n:'Sem IV',c:[{n:'Criminal Law – II (CrPC)',cr:'4'},{n:'Evidence Act',cr:'4'},{n:'Property Law (Transfer of Property)',cr:'4'},{n:'History',cr:'4'},{n:'Moot Court – II',cr:'2'}]},
        {n:'Sem V',c:[{n:'Jurisprudence & Legal Theory',cr:'4'},{n:'Company Law',cr:'4'},{n:'Environmental Law',cr:'4'},{n:'IPR & Cyber Law',cr:'4'},{n:'Summer Internship',cr:'2'}]},
        {n:'Sem VI',c:[{n:'Civil Procedure Code (CPC)',cr:'4'},{n:'Labour & Industrial Law',cr:'4'},{n:'Tax Law (Income Tax)',cr:'4'},{n:'International Law',cr:'4'},{n:'Moot Court – III',cr:'2'}]},
        {n:'Sem VII',c:[{n:'Constitutional Remedies & PIL',cr:'4'},{n:'Banking & Insurance Law',cr:'4'},{n:'Alternative Dispute Resolution',cr:'4'},{n:'Criminology & Penology',cr:'4'},{n:'Internship Report',cr:'2'}]},
        {n:'Sem VIII',c:[{n:'Human Rights Law',cr:'4'},{n:'Competition Law',cr:'4'},{n:'Media Law',cr:'4'},{n:'Elective – I',cr:'4'},{n:'Moot Court – IV',cr:'2'}]},
        {n:'Sem IX',c:[{n:'International Trade Law',cr:'4'},{n:'Legal Aid & Clinical Education',cr:'4'},{n:'Consumer Protection Law',cr:'4'},{n:'Elective – II',cr:'4'},{n:'Court Attachment',cr:'2'}]},
        {n:'Sem X',c:[{n:'Dissertation / Research Paper',cr:'8'},{n:'Elective – III',cr:'4'},{n:'Professional Ethics & Bar Bench Relations',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'💼', name:'BBA LL.B. (Hons.)', badge:'UG · 5 Yrs', dept:'School of Law & Governance', chips:['10 Sems','BCI','Corporate'],
      desc:'5-year integrated programme blending Business Administration with Law for corporate legal and management roles.',
      meta:['5 Years · 10 Sems','BCI Approved','CUET-UG Entrance','60 Seats'],
      sems:[
        {n:'Sem I',c:[{n:'Principles of Management',cr:'4'},{n:'Constitutional Law',cr:'4'},{n:'Business Economics',cr:'4'},{n:'Law of Contracts',cr:'4'},{n:'Business Communication',cr:'2'}]},
        {n:'Sem II',c:[{n:'Financial Accounting',cr:'4'},{n:'Business Law – General',cr:'4'},{n:'Criminal Law (Basics)',cr:'4'},{n:'Marketing Management',cr:'4'},{n:'Moot Court – I',cr:'2'}]},
        {n:'Sem III',c:[{n:'Company Law',cr:'4'},{n:'Corporate Governance',cr:'4'},{n:'Taxation – Direct',cr:'4'},{n:'Organisational Behaviour',cr:'4'},{n:'Moot Court – II',cr:'2'}]},
        {n:'Sem IV',c:[{n:'Mergers & Acquisitions',cr:'4'},{n:'Securities & Capital Markets Law',cr:'4'},{n:'Operations Management',cr:'4'},{n:'Financial Management',cr:'4'},{n:'Business Research Methods',cr:'2'}]},
        {n:'Sem V',c:[{n:'Intellectual Property Rights',cr:'4'},{n:'Competition Law',cr:'4'},{n:'Strategic Management',cr:'4'},{n:'Human Resource Management',cr:'4'},{n:'Summer Internship',cr:'2'}]},
        {n:'Sem VI',c:[{n:'International Trade Law',cr:'4'},{n:'Banking & Finance Law',cr:'4'},{n:'Consumer Protection',cr:'4'},{n:'Entrepreneurship',cr:'4'},{n:'Moot Court – III',cr:'2'}]},
        {n:'Sem VII',c:[{n:'Labour & Employment Law',cr:'4'},{n:'ADR & Arbitration',cr:'4'},{n:'Business Ethics & CSR',cr:'4'},{n:'Elective – I',cr:'4'}]},
        {n:'Sem VIII',c:[{n:'Project Finance & Law',cr:'4'},{n:'Environmental & Sustainability Law',cr:'4'},{n:'Media & Cyber Law',cr:'4'},{n:'Elective – II',cr:'4'}]},
        {n:'Sem IX',c:[{n:'Legal Aid & Clinical Education',cr:'4'},{n:'Startup Law & Policy',cr:'4'},{n:'International Commercial Arbitration',cr:'4'},{n:'Elective – III',cr:'4'}]},
        {n:'Sem X',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Professional Ethics',cr:'4'},{n:'Court Attachment Report',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🖥️', name:'B.Sc. B.Ed. (CS & Maths)', badge:'UG · 4 Yrs', dept:'School of Education / Comp. Sc.', chips:['8 Sems','NCTE','CUET-UG'],
      desc:'4-year integrated degree combining Computer Science & Mathematics with Education, training teachers for digital-age schools.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Introduction to Computer Science',cr:'4'},{n:'Mathematics – I (Calculus)',cr:'4'},{n:'Communication Skills',cr:'2'},{n:'Lab: Programming Basics (C/Python)',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Child Development & Psychology',cr:'4'},{n:'Data Structures',cr:'4'},{n:'Mathematics – II (Algebra)',cr:'4'},{n:'Digital Literacy & Tools',cr:'4'},{n:'Lab: DS & Algorithms',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Pedagogy of Mathematics',cr:'4'},{n:'Database Management Systems',cr:'4'},{n:'Discrete Mathematics',cr:'4'},{n:'Inclusive Education',cr:'4'},{n:'School Observation',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'Pedagogy of Computer Science',cr:'4'},{n:'Web Technologies (HTML/CSS/JS)',cr:'4'},{n:'Statistics for Education',cr:'4'},{n:'Assessment & Evaluation',cr:'4'},{n:'ICT in Teaching',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Object-Oriented Programming (Java)',cr:'4'},{n:'Curriculum Design – CS & Maths',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Operating Systems',cr:'4'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Computer Networks & Security',cr:'4'},{n:'Educational Research Methods',cr:'4'},{n:'Teaching Practice – II',cr:'6'},{n:'Mathematics Elective',cr:'4'}]},
        {n:'Year 4 – Sem VII',c:[{n:'Artificial Intelligence & ML Basics',cr:'4'},{n:'School Administration & Management',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Project Work – I',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'📊', name:'B.Sc. B.Ed. (Maths & Science)', badge:'UG · 4 Yrs', dept:'School of Education', chips:['8 Sems','NCTE','CUET-UG'],
      desc:'4-year integrated programme combining Mathematics, Physics and Chemistry with teacher education for secondary schools.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Mathematics – I',cr:'4'},{n:'Physics – I (Mechanics)',cr:'4'},{n:'Chemistry – I (Organic)',cr:'4'},{n:'Communication Skills',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Child Development & Psychology',cr:'4'},{n:'Mathematics – II',cr:'4'},{n:'Physics – II (Electromagnetism)',cr:'4'},{n:'Chemistry – II (Inorganic)',cr:'4'},{n:'Lab Practice – I',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Pedagogy of Mathematics',cr:'4'},{n:'Pedagogy of Science',cr:'4'},{n:'Mathematics – III',cr:'4'},{n:'Physics – III',cr:'4'},{n:'School Observation',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'Assessment & Evaluation',cr:'4'},{n:'ICT in Science & Maths Teaching',cr:'4'},{n:'Chemistry – III',cr:'4'},{n:'Inclusive Education',cr:'4'},{n:'Lab Practice – II',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Curriculum Design',cr:'4'},{n:'Environmental Science',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Mathematics Elective',cr:'4'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Educational Research Methods',cr:'4'},{n:'Value Education',cr:'4'},{n:'Teaching Practice – II',cr:'6'},{n:'Physics / Chemistry Elective',cr:'4'}]},
        {n:'Year 4 – Sem VII',c:[{n:'School Management',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Project Work – I',cr:'4'},{n:'Applied Science Elective',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🌐', name:'B.A. B.Ed. (Social Sciences)', badge:'UG · 4 Yrs', dept:'School of Education / Social Sc.', chips:['8 Sems','NCTE','CUET-UG'],
      desc:'4-year integrated programme combining Economics, History & Political Science with Education for social science teachers.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Indian History – I (Ancient)',cr:'4'},{n:'Introduction to Economics',cr:'4'},{n:'Political Science – I',cr:'4'},{n:'Communication Skills',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Child Psychology',cr:'4'},{n:'Indian History – II (Medieval)',cr:'4'},{n:'Microeconomics',cr:'4'},{n:'Indian Constitution',cr:'4'},{n:'Social Science Lab',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Pedagogy of Social Sciences',cr:'4'},{n:'Modern Indian History',cr:'4'},{n:'Macroeconomics',cr:'4'},{n:'Comparative Politics',cr:'4'},{n:'School Observation',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'Assessment & Evaluation',cr:'4'},{n:'World History',cr:'4'},{n:'Indian Economy',cr:'4'},{n:'Public Administration',cr:'4'},{n:'ICT in Education',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Curriculum Design – Social Sc.',cr:'4'},{n:'Sociology',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Geography Elective',cr:'4'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Educational Research Methods',cr:'4'},{n:'Development Economics',cr:'4'},{n:'Teaching Practice – II',cr:'6'},{n:'Social Science Elective',cr:'4'}]},
        {n:'Year 4 – Sem VII',c:[{n:'School Administration',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Project Work – I',cr:'4'},{n:'IR & Foreign Policy',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🧪', name:'B.Sc. B.Ed. (Life Sciences)', badge:'UG · 4 Yrs', dept:'School of Education / Sciences', chips:['8 Sems','NCTE','CUET-UG'],
      desc:'4-year integrated dual degree combining Botany, Zoology & Chemistry with Education for life science teachers.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Cell Biology & Biochemistry',cr:'4'},{n:'Botany – I (Plant Morphology)',cr:'4'},{n:'Zoology – I (Animal Diversity)',cr:'4'},{n:'Lab: Bio Lab – I',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Child Development',cr:'4'},{n:'Genetics & Molecular Biology',cr:'4'},{n:'Botany – II (Plant Physiology)',cr:'4'},{n:'Zoology – II (Physiology)',cr:'4'},{n:'Lab: Bio Lab – II',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Pedagogy of Life Sciences',cr:'4'},{n:'Ecology & Environment',cr:'4'},{n:'Microbiology',cr:'4'},{n:'Chemistry (Organic)',cr:'4'},{n:'School Observation',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'Biotechnology Basics',cr:'4'},{n:'Assessment & Evaluation',cr:'4'},{n:'Evolutionary Biology',cr:'4'},{n:'ICT in Science Teaching',cr:'4'},{n:'Lab: Microbiology & Biotech',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Curriculum Design – Life Sciences',cr:'4'},{n:'Physiology – Advanced',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Bioinformatics',cr:'4'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Educational Research Methods',cr:'4'},{n:'Environmental & Conservation Biology',cr:'4'},{n:'Teaching Practice – II',cr:'6'},{n:'Life Sciences Elective',cr:'4'}]},
        {n:'Year 4 – Sem VII',c:[{n:'School Management',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Project Work – I',cr:'4'},{n:'Applied Biology Elective',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'📜', name:'B.A. B.Ed. (Language & Lit.)', badge:'UG · 4 Yrs', dept:'School of Education / Humanities', chips:['8 Sems','NCTE','CUET-UG'],
      desc:'4-year integrated programme combining Hindi, English and Linguistics with Education for language teachers.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET-UG Entrance','50 Seats'],
      sems:[
        {n:'Year 1 – Sem I',c:[{n:'Foundations of Education',cr:'4'},{n:'Hindi Literature – I (Poetry)',cr:'4'},{n:'English Language & Communication',cr:'4'},{n:'Introduction to Linguistics',cr:'4'},{n:'Communication Skills',cr:'2'}]},
        {n:'Year 1 – Sem II',c:[{n:'Child Psychology',cr:'4'},{n:'Hindi Literature – II (Prose)',cr:'4'},{n:'English Literature – I',cr:'4'},{n:'Sanskrit / Urdu Elective',cr:'4'},{n:'Creative Writing',cr:'2'}]},
        {n:'Year 2 – Sem III',c:[{n:'Pedagogy of Hindi',cr:'4'},{n:'Pedagogy of English',cr:'4'},{n:'Hindi Grammar & Stylistics',cr:'4'},{n:'English Grammar & Discourse',cr:'4'},{n:'School Observation',cr:'2'}]},
        {n:'Year 2 – Sem IV',c:[{n:'Assessment & Evaluation',cr:'4'},{n:'Translation Studies',cr:'4'},{n:'Comparative Literature',cr:'4'},{n:'ICT in Language Teaching',cr:'4'},{n:'Language Lab',cr:'2'}]},
        {n:'Year 3 – Sem V',c:[{n:'Curriculum Design – Languages',cr:'4'},{n:'Modern Hindi Fiction',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'English Elective',cr:'4'}]},
        {n:'Year 3 – Sem VI',c:[{n:'Educational Research Methods',cr:'4'},{n:'Folk Literature & Oral Traditions',cr:'4'},{n:'Teaching Practice – II',cr:'6'},{n:'Language Elective',cr:'4'}]},
        {n:'Year 4 – Sem VII',c:[{n:'School Management',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Project Work – I',cr:'4'},{n:'Advanced Language Elective',cr:'4'}]},
        {n:'Year 4 – Sem VIII',c:[{n:'Dissertation / Research Project',cr:'8'},{n:'Teaching Internship (Final)',cr:'6'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  law:[
    { icon:'⚖️', name:'B.A. LL.B. (Hons.)', badge:'BCI · 5 Yrs', dept:'School of Law & Governance', chips:['10 Sems','CUET','BCI'],
      desc:'5-year integrated programme covering constitutional, criminal, civil and international law with moot court practice.',
      meta:['5 Years · 10 Sems','BCI Approved','CUET Entrance'],
      sems:[
        {n:'Sem I',c:[{n:'Law of Contracts – I',cr:'4'},{n:'Constitutional Law – I',cr:'4'},{n:'History of Courts',cr:'4'},{n:'Political Science',cr:'4'},{n:'English Communication',cr:'2'}]},
        {n:'Sem II',c:[{n:'Law of Contracts – II',cr:'4'},{n:'Constitutional Law – II',cr:'4'},{n:'Family Law – I',cr:'4'},{n:'Sociology',cr:'4'},{n:'Legal Writing',cr:'2'}]},
        {n:'Sem III',c:[{n:'Criminal Law – I (IPC)',cr:'4'},{n:'Family Law – II',cr:'4'},{n:'Administrative Law',cr:'4'},{n:'Economics',cr:'4'},{n:'Moot Court I',cr:'2'}]},
        {n:'Sem IV',c:[{n:'Criminal Law – II (CrPC)',cr:'4'},{n:'Evidence Act',cr:'4'},{n:'Property Law',cr:'4'},{n:'History',cr:'4'},{n:'Moot Court II',cr:'2'}]},
        {n:'Sem V',c:[{n:'Jurisprudence',cr:'4'},{n:'Company Law',cr:'4'},{n:'Environmental Law',cr:'4'},{n:'IPR & Cyber Law',cr:'4'},{n:'Internship',cr:'2'}]},
        {n:'Sem VI–X',c:[{n:'Civil Procedure Code',cr:'4'},{n:'Labour & Industrial Law',cr:'4'},{n:'Tax Law',cr:'4'},{n:'International Law',cr:'4'},{n:'Dissertation/Elective',cr:'4'}]},
      ]},
    { icon:'💼', name:'BBA LL.B. (Hons.)', badge:'BCI · 5 Yrs', dept:'School of Law & Governance', chips:['10 Sems','Corporate','BCI'],
      desc:'5-year integrated programme blending Business Administration with Law for corporate legal practice.',
      meta:['5 Years · 10 Sems','BCI Approved'],
      sems:[
        {n:'Sem I',c:[{n:'Principles of Management',cr:'4'},{n:'Constitutional Law',cr:'4'},{n:'Business Economics',cr:'4'},{n:'Law of Contracts',cr:'4'},{n:'Communication',cr:'2'}]},
        {n:'Sem II',c:[{n:'Financial Accounting',cr:'4'},{n:'Business Law',cr:'4'},{n:'Criminal Law',cr:'4'},{n:'Marketing Management',cr:'4'},{n:'Moot Court',cr:'2'}]},
        {n:'Sem III–V',c:[{n:'Company Law',cr:'4'},{n:'Corporate Governance',cr:'4'},{n:'Taxation',cr:'4'},{n:'Mergers & Acquisitions',cr:'4'},{n:'Securities Law',cr:'4'}]},
        {n:'Sem VI–X',c:[{n:'International Trade Law',cr:'4'},{n:'Intellectual Property',cr:'4'},{n:'Labour Law',cr:'4'},{n:'ADR & Arbitration',cr:'4'},{n:'Dissertation',cr:'4'}]},
      ]},
    { icon:'🏛️', name:'LL.M.', badge:'PG · 1 Yr', dept:'School of Law & Governance', chips:['2 Sems','BCI','Research'],
      desc:'One-year PG law programme with specialisations in Constitutional Law and Criminal Law.',
      meta:['1 Year · 2 Sems','BCI Approved','Research Focus'],
      sems:[
        {n:'Sem I',c:[{n:'Constitutional Law – Advanced',cr:'5'},{n:'Jurisprudence & Legal Theory',cr:'5'},{n:'Research Methodology in Law',cr:'4'},{n:'Human Rights Law',cr:'4'},{n:'Elective I',cr:'2'}]},
        {n:'Sem II',c:[{n:'Criminal Law – Advanced',cr:'5'},{n:'International Law',cr:'4'},{n:'Comparative Law',cr:'3'},{n:'Dissertation',cr:'8'}]},
      ]},
    { icon:'🔭', name:'Ph.D. in Law', badge:'Doctoral', dept:'School of Law & Governance', chips:['3–5 Yrs','CUSB-ET','JRF'],
      desc:'Research programme in Constitutional, Criminal, International Law and Legal Policy.',
      meta:['3–5 Years','CUSB Entrance Test','Fellowship Available'],
      sems:[
        {n:'Course Work (Year 1)',c:[{n:'Research Methodology',cr:'4'},{n:'Legal Theory & Jurisprudence',cr:'4'},{n:'Specialisation Paper',cr:'4'},{n:'Review of Literature',cr:'4'}]},
        {n:'Research Phase (Yr 2–5)',c:[{n:'Pre-Submission Seminar',cr:'-'},{n:'Thesis Writing',cr:'-'},{n:'Progress Report',cr:'-'},{n:'Open Viva Voce',cr:'-'}]},
      ]},
  ],
  science:[
    { icon:'🧬', name:'M.Sc. Biotechnology', badge:'PG · 2 Yrs', dept:'School of Earth, Bio. & Env. Sciences', chips:['4 Sems','CUET-PG','Lab'],
      desc:'Advanced programme in molecular biology, genetics, fermentation technology and bioinformatics.',
      meta:['2 Years · 4 Sems','Lab Intensive','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Cell Biology & Biochemistry',cr:'4'},{n:'Molecular Biology',cr:'4'},{n:'Genetics',cr:'4'},{n:'Bioinformatics',cr:'4'},{n:'Biotech Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Fermentation Technology',cr:'4'},{n:'Immunology',cr:'4'},{n:'Microbiology',cr:'4'},{n:'Plant Biotechnology',cr:'4'},{n:'Biotech Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Animal Biotechnology',cr:'4'},{n:'Environmental Biotechnology',cr:'4'},{n:'Industrial Biotechnology',cr:'4'},{n:'Research Methods',cr:'4'},{n:'Biotech Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Project Work',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🌿', name:'M.Sc. Environmental Science', badge:'PG · 2 Yrs', dept:'School of Earth, Bio. & Env. Sciences', chips:['4 Sems','CUET-PG','Field'],
      desc:'Ecology, climate change, environmental policy, pollution control and sustainable development.',
      meta:['2 Years · 4 Sems','Field Studies','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Ecology & Biodiversity',cr:'4'},{n:'Environmental Chemistry',cr:'4'},{n:'Climate Science',cr:'4'},{n:'Research Methods',cr:'4'},{n:'Field Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Environmental Policy & Law',cr:'4'},{n:'Pollution Control',cr:'4'},{n:'Soil & Water Science',cr:'4'},{n:'Remote Sensing & GIS',cr:'4'},{n:'Field Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Waste Management',cr:'4'},{n:'Env. Impact Assessment',cr:'4'},{n:'Sustainable Development',cr:'4'},{n:'Environmental Monitoring',cr:'4'},{n:'Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'⚗️', name:'M.Sc. Chemistry', badge:'PG · 2 Yrs', dept:'School of Physical & Chemical Sciences', chips:['4 Sems','CUET-PG','Lab'],
      desc:'Organic, inorganic, physical and analytical chemistry with advanced spectroscopy.',
      meta:['2 Years · 4 Sems','Lab Focus','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Organic Chemistry – I',cr:'4'},{n:'Inorganic Chemistry – I',cr:'4'},{n:'Physical Chemistry – I',cr:'4'},{n:'Mathematics for Chemists',cr:'4'},{n:'Chem Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Organic Chemistry – II',cr:'4'},{n:'Inorganic Chemistry – II',cr:'4'},{n:'Physical Chemistry – II',cr:'4'},{n:'Analytical Chemistry',cr:'4'},{n:'Chem Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Spectroscopy',cr:'4'},{n:'Green Chemistry',cr:'4'},{n:'Polymer Chemistry',cr:'4'},{n:'Medicinal Chemistry',cr:'4'},{n:'Chem Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Research Project',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'⚛️', name:'M.Sc. Physics', badge:'PG · 2 Yrs', dept:'School of Physical & Chemical Sciences', chips:['4 Sems','CUET-PG'],
      desc:'Classical mechanics, quantum physics, condensed matter and electronics with advanced lab work.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Classical Mechanics',cr:'4'},{n:'Quantum Mechanics – I',cr:'4'},{n:'Mathematical Physics',cr:'4'},{n:'Electrodynamics',cr:'4'},{n:'Physics Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Quantum Mechanics – II',cr:'4'},{n:'Statistical Mechanics',cr:'4'},{n:'Condensed Matter Physics',cr:'4'},{n:'Atomic & Molecular Physics',cr:'4'},{n:'Physics Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Nuclear & Particle Physics',cr:'4'},{n:'Electronics',cr:'4'},{n:'Astrophysics (Elective)',cr:'4'},{n:'Laser Physics (Elective)',cr:'4'},{n:'Physics Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Research Project',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🌍', name:'M.Sc. Earth Science', badge:'PG · 2 Yrs', dept:'School of Earth, Bio. & Env. Sciences', chips:['4 Sems','Field'],
      desc:'Geology, geomorphology, mineralogy, remote sensing and natural resource management.',
      meta:['2 Years · 4 Sems','Field Intensive'],
      sems:[
        {n:'Sem I',c:[{n:'Structural Geology',cr:'4'},{n:'Mineralogy & Petrology',cr:'4'},{n:'Geomorphology',cr:'4'},{n:'Cartography & GIS',cr:'4'},{n:'Field Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Stratigraphy & Palaeontology',cr:'4'},{n:'Hydrogeology',cr:'4'},{n:'Remote Sensing',cr:'4'},{n:'Economic Geology',cr:'4'},{n:'Field Lab II',cr:'4'}]},
        {n:'Sem III–IV',c:[{n:'Natural Hazards',cr:'4'},{n:'Environmental Geology',cr:'4'},{n:'Research Project',cr:'12'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  humanities:[
    { icon:'📖', name:'M.A. Hindi', badge:'PG · 2 Yrs', dept:'School of Humanities & Languages', chips:['4 Sems','CUET-PG'],
      desc:'Classical poetry, modern fiction, Hindi linguistics, translation studies and literary criticism.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Aadi Kaal & Bhakti Kaal Poetry',cr:'4'},{n:'Hindi Linguistics',cr:'4'},{n:'Narrative Prose',cr:'4'},{n:'Translation Studies',cr:'4'}]},
        {n:'Sem II',c:[{n:'Riti Kaal & Modern Poetry',cr:'4'},{n:'Hindi Fiction & Novel',cr:'4'},{n:'Hindi Drama',cr:'4'},{n:'Literary Criticism',cr:'4'}]},
        {n:'Sem III',c:[{n:'Dalit Literature',cr:'4'},{n:'Women Writing in Hindi',cr:'4'},{n:'Comparative Literature',cr:'4'},{n:'Folk Literature',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🏺', name:'M.A. History', badge:'PG · 2 Yrs', dept:'School of Humanities & Languages', chips:['4 Sems','CUET-PG'],
      desc:'Ancient, medieval and modern Indian history with historiography and archival research methods.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Ancient Indian History',cr:'4'},{n:'Sources & Historiography',cr:'4'},{n:'History of South Asia',cr:'4'},{n:'Economic History of India',cr:'4'}]},
        {n:'Sem II',c:[{n:'Medieval India',cr:'4'},{n:'History of Bihar',cr:'4'},{n:'Bhakti & Sufi Movements',cr:'4'},{n:'Archival Methods',cr:'4'}]},
        {n:'Sem III',c:[{n:'Modern India 1757–1857',cr:'4'},{n:'Freedom Movement',cr:'4'},{n:'Social History',cr:'4'},{n:'Contemporary India',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🗣️', name:'M.A. English', badge:'PG · 2 Yrs', dept:'School of Humanities & Languages', chips:['4 Sems','CUET-PG'],
      desc:'British, American and postcolonial literature with critical theory and research writing.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'British Literature – I',cr:'4'},{n:'Literary Theory',cr:'4'},{n:'Linguistics & Language',cr:'4'},{n:'Research Writing',cr:'4'}]},
        {n:'Sem II',c:[{n:'British Literature – II',cr:'4'},{n:'American Literature',cr:'4'},{n:'Postcolonial Studies',cr:'4'},{n:'Indian Writing in English',cr:'4'}]},
        {n:'Sem III',c:[{n:'World Literature',cr:'4'},{n:'Gender & Literature',cr:'4'},{n:'Media & Communication',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🎭', name:'M.A. Sociology', badge:'PG · 2 Yrs', dept:'School of Social Sciences & Policy', chips:['4 Sems','CUET-PG'],
      desc:'Classical and contemporary sociological theory, Indian society, research methods and social change.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Classical Sociological Theory',cr:'4'},{n:'Indian Society',cr:'4'},{n:'Research Methods – I',cr:'4'},{n:'Social Stratification',cr:'4'}]},
        {n:'Sem II',c:[{n:'Contemporary Theory',cr:'4'},{n:'Sociology of Religion',cr:'4'},{n:'Gender Studies',cr:'4'},{n:'Research Methods – II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Rural Sociology',cr:'4'},{n:'Urban Sociology',cr:'4'},{n:'Economy & Society',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🏛️', name:'M.A. Sanskrit', badge:'PG · 2 Yrs', dept:'School of Humanities & Languages', chips:['4 Sems','CUET-PG'],
      desc:'Vedic literature, classical Sanskrit grammar, philosophy, Kavya and drama.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Vedic Literature',cr:'4'},{n:'Sanskrit Grammar',cr:'4'},{n:'Epic Literature',cr:'4'},{n:'Sanskrit Prose',cr:'4'}]},
        {n:'Sem II',c:[{n:'Sanskrit Kavya',cr:'4'},{n:'Sanskrit Drama',cr:'4'},{n:'Darshana (Philosophy)',cr:'4'},{n:'Translation',cr:'4'}]},
        {n:'Sem III',c:[{n:'Vyakarana Shastra',cr:'4'},{n:'Sahitya Shastra',cr:'4'},{n:'Modern Sanskrit',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  cs:[
    { icon:'🖥️', name:'M.Sc. Computer Science', badge:'PG · 2 Yrs', dept:'School of Maths, Stats & CS', chips:['4 Sems','CUET-PG','AI/ML'],
      desc:'Machine learning, AI, software engineering, databases, networks and cloud computing.',
      meta:['2 Years · 4 Sems','CUET-PG','AI Focus'],
      sems:[
        {n:'Sem I',c:[{n:'Data Structures & Algorithms',cr:'4'},{n:'Discrete Mathematics',cr:'4'},{n:'Database Management',cr:'4'},{n:'Computer Networks',cr:'4'},{n:'Programming Lab',cr:'4'}]},
        {n:'Sem II',c:[{n:'Machine Learning',cr:'4'},{n:'Operating Systems',cr:'4'},{n:'Software Engineering',cr:'4'},{n:'Web Technologies',cr:'4'},{n:'AI Lab',cr:'4'}]},
        {n:'Sem III',c:[{n:'Deep Learning & Neural Nets',cr:'4'},{n:'Cloud Computing',cr:'4'},{n:'Cyber Security',cr:'4'},{n:'Computer Vision',cr:'4'},{n:'Project Lab',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Major Research Project',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'📐', name:'M.Sc. Mathematics', badge:'PG · 2 Yrs', dept:'School of Maths, Stats & CS', chips:['4 Sems','Pure & Applied'],
      desc:'Real analysis, abstract algebra, topology, differential equations and numerical methods.',
      meta:['2 Years · 4 Sems','Pure & Applied'],
      sems:[
        {n:'Sem I',c:[{n:'Real Analysis',cr:'4'},{n:'Abstract Algebra',cr:'4'},{n:'Ordinary Differential Equations',cr:'4'},{n:'Linear Algebra',cr:'4'}]},
        {n:'Sem II',c:[{n:'Topology',cr:'4'},{n:'Complex Analysis',cr:'4'},{n:'Partial Differential Equations',cr:'4'},{n:'Numerical Methods',cr:'4'}]},
        {n:'Sem III',c:[{n:'Functional Analysis',cr:'4'},{n:'Differential Geometry',cr:'4'},{n:'Operations Research',cr:'4'},{n:'Mathematical Statistics',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'📊', name:'M.Sc. Statistics', badge:'PG · 2 Yrs', dept:'School of Maths, Stats & CS', chips:['4 Sems','CUET-PG'],
      desc:'Probability theory, statistical inference, regression, time series and applied statistics.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Probability Theory',cr:'4'},{n:'Statistical Inference – I',cr:'4'},{n:'Regression Analysis',cr:'4'},{n:'Sampling Theory',cr:'4'},{n:'Stats Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Statistical Inference – II',cr:'4'},{n:'Multivariate Analysis',cr:'4'},{n:'Design of Experiments',cr:'4'},{n:'Operations Research',cr:'4'},{n:'Stats Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Time Series Analysis',cr:'4'},{n:'Biostatistics',cr:'4'},{n:'Data Science with R',cr:'4'},{n:'Actuarial Statistics',cr:'4'},{n:'Stats Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Research Project',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🤖', name:'M.Sc. Data Science', badge:'PG · 2 Yrs', dept:'School of Maths, Stats & CS', chips:['4 Sems','Industry'],
      desc:'Big data, machine learning, data mining, Python, R and business analytics.',
      meta:['2 Years · 4 Sems','Industry Aligned'],
      sems:[
        {n:'Sem I',c:[{n:'Python Programming',cr:'4'},{n:'Data Structures',cr:'4'},{n:'Statistics for Data Science',cr:'4'},{n:'Database Systems',cr:'4'},{n:'Data Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Machine Learning',cr:'4'},{n:'Big Data Analytics',cr:'4'},{n:'Data Visualisation',cr:'4'},{n:'Natural Language Processing',cr:'4'},{n:'Data Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Deep Learning',cr:'4'},{n:'Business Analytics',cr:'4'},{n:'Cloud & Distributed Computing',cr:'4'},{n:'Capstone Project – I',cr:'4'},{n:'Data Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Capstone Project – II',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  commerce:[
    { icon:'📊', name:'M.Com', badge:'PG · 2 Yrs', dept:'School of Commerce & Management', chips:['4 Sems','CUET-PG'],
      desc:'Advanced accounting, taxation, auditing, financial management and business economics.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Advanced Accounting',cr:'4'},{n:'Business Taxation',cr:'4'},{n:'Managerial Economics',cr:'4'},{n:'Research Methods in Commerce',cr:'4'}]},
        {n:'Sem II',c:[{n:'Financial Management',cr:'4'},{n:'Auditing & Assurance',cr:'4'},{n:'Corporate Law',cr:'4'},{n:'Cost Accounting',cr:'4'}]},
        {n:'Sem III',c:[{n:'GST & Tax Planning',cr:'4'},{n:'Security Analysis',cr:'4'},{n:'Banking & Insurance',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🏢', name:'MBA', badge:'PG · 2 Yrs', dept:'School of Commerce & Management', chips:['4 Sems','Industry'],
      desc:'Strategic management, marketing, HR, operations and entrepreneurship with industry exposure.',
      meta:['2 Years · 4 Sems','Industry Focused'],
      sems:[
        {n:'Sem I',c:[{n:'Principles of Management',cr:'4'},{n:'Marketing Management',cr:'4'},{n:'Financial Management',cr:'4'},{n:'Organisational Behaviour',cr:'4'},{n:'Business Statistics',cr:'4'}]},
        {n:'Sem II',c:[{n:'Strategic Management',cr:'4'},{n:'Human Resource Management',cr:'4'},{n:'Operations Management',cr:'4'},{n:'Business Law',cr:'4'},{n:'Research Methods',cr:'4'}]},
        {n:'Sem III',c:[{n:'Entrepreneurship & Innovation',cr:'4'},{n:'Business Analytics',cr:'4'},{n:'Elective – I',cr:'4'},{n:'Elective – II',cr:'4'},{n:'Summer Internship Report',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Project Work',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'💰', name:'M.Com (Banking & Finance)', badge:'PG · 2 Yrs', dept:'School of Commerce & Management', chips:['4 Sems','Finance'],
      desc:'Banking operations, financial markets, investment analysis and risk management.',
      meta:['2 Years · 4 Sems','Finance Specialisation'],
      sems:[
        {n:'Sem I',c:[{n:'Banking Theory & Practice',cr:'4'},{n:'Financial Markets',cr:'4'},{n:'Financial Institutions',cr:'4'},{n:'Research Methods',cr:'4'}]},
        {n:'Sem II',c:[{n:'Investment Analysis',cr:'4'},{n:'Risk Management',cr:'4'},{n:'International Finance',cr:'4'},{n:'Financial Modelling',cr:'4'}]},
        {n:'Sem III–IV',c:[{n:'Portfolio Management',cr:'4'},{n:'Derivatives & Securities',cr:'4'},{n:'Project',cr:'12'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  education:[
    { icon:'📖', name:'B.A. B.Ed. (Integrated)', badge:'UG+Ed · 4 Yrs', dept:'School of Education', chips:['8 Sems','NCTE','CUET'],
      desc:'4-year dual degree in Arts & Education preparing secondary school teachers with full pedagogy training.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET UG'],
      sems:[
        {n:'Year 1 (Sem I & II)',c:[{n:'Pedagogy Foundations',cr:'4'},{n:'Child Psychology',cr:'4'},{n:'Arts Core Subject – I',cr:'4'},{n:'Arts Core Subject – II',cr:'4'},{n:'Communication Skills',cr:'2'}]},
        {n:'Year 2 (Sem III & IV)',c:[{n:'Curriculum Design',cr:'4'},{n:'Inclusive Education',cr:'4'},{n:'Arts Core Subject – III',cr:'4'},{n:'Arts Core Subject – IV',cr:'4'},{n:'School Observation',cr:'2'}]},
        {n:'Year 3 (Sem V & VI)',c:[{n:'Assessment & Evaluation',cr:'4'},{n:'ICT in Education',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Arts Elective',cr:'4'}]},
        {n:'Year 4 (Sem VII & VIII)',c:[{n:'Teaching Practice – II',cr:'6'},{n:'Educational Management',cr:'4'},{n:'Research in Education',cr:'4'},{n:'Dissertation',cr:'6'}]},
      ]},
    { icon:'🔬', name:'B.Sc. B.Ed. (Integrated)', badge:'UG+Ed · 4 Yrs', dept:'School of Education', chips:['8 Sems','NCTE','Science'],
      desc:'4-year dual degree in Science & Education training teachers for Maths and Science subjects.',
      meta:['4 Years · 8 Sems','NCTE Approved','CUET UG'],
      sems:[
        {n:'Year 1 (Sem I & II)',c:[{n:'Foundations of Education',cr:'4'},{n:'Child Development',cr:'4'},{n:'Physics / Chemistry',cr:'4'},{n:'Maths / Biology',cr:'4'},{n:'Communication',cr:'2'}]},
        {n:'Year 2 (Sem III & IV)',c:[{n:'Science & Maths Pedagogy',cr:'4'},{n:'Lab Methods',cr:'4'},{n:'Science Subjects – II',cr:'8'},{n:'School Observation',cr:'2'}]},
        {n:'Year 3 (Sem V & VI)',c:[{n:'Assessment & Evaluation',cr:'4'},{n:'ICT in Education',cr:'4'},{n:'Teaching Practice – I',cr:'6'},{n:'Science Elective',cr:'4'}]},
        {n:'Year 4 (Sem VII & VIII)',c:[{n:'Teaching Practice – II',cr:'6'},{n:'Educational Management',cr:'4'},{n:'Research in Education',cr:'4'},{n:'Dissertation',cr:'6'}]},
      ]},
    { icon:'🎓', name:'M.Ed.', badge:'PG · 2 Yrs', dept:'School of Education', chips:['4 Sems','CUET-PG'],
      desc:'Postgraduate education programme on educational psychology, research and school administration.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Educational Psychology',cr:'4'},{n:'Philosophy of Education',cr:'4'},{n:'Curriculum Studies',cr:'4'},{n:'Research Methods',cr:'4'}]},
        {n:'Sem II',c:[{n:'School Administration',cr:'4'},{n:'Special Education',cr:'4'},{n:'Sociology of Education',cr:'4'},{n:'Education Policy',cr:'4'}]},
        {n:'Sem III',c:[{n:'Education Technology',cr:'4'},{n:'Guidance & Counselling',cr:'4'},{n:'Comparative Education',cr:'4'},{n:'Internship',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  health:[
    { icon:'💊', name:'M.Pharm (Pharmaceutics)', badge:'PCI · 2 Yrs', dept:'School of Health Sciences', chips:['4 Sems','PCI','Lab'],
      desc:'PCI-approved programme in drug formulation, drug delivery systems and pharmaceutical technology.',
      meta:['2 Years · 4 Sems','PCI Approved'],
      sems:[
        {n:'Sem I',c:[{n:'Pharmaceutical Technology – I',cr:'4'},{n:'Pharmaceutical Analysis – I',cr:'4'},{n:'Regulatory Affairs',cr:'4'},{n:'Research Methodology',cr:'4'},{n:'Pharmaceutics Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Pharmaceutical Technology – II',cr:'4'},{n:'Drug Delivery Systems',cr:'4'},{n:'Quality Assurance',cr:'4'},{n:'Novel Drug Delivery',cr:'4'},{n:'Pharmaceutics Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Biopharmaceutics & PK',cr:'4'},{n:'Industrial Pharmacy',cr:'4'},{n:'Pharmaceutical Marketing',cr:'4'},{n:'Research Project – I',cr:'4'},{n:'Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Research Project – II',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🧪', name:'M.Pharm (Pharmacology)', badge:'PCI · 2 Yrs', dept:'School of Health Sciences', chips:['4 Sems','PCI'],
      desc:'Advanced pharmacology, molecular drug action, toxicology and clinical pharmacology.',
      meta:['2 Years · 4 Sems','PCI Approved'],
      sems:[
        {n:'Sem I',c:[{n:'Molecular Pharmacology',cr:'4'},{n:'Toxicology – I',cr:'4'},{n:'Autonomic Pharmacology',cr:'4'},{n:'Research Methodology',cr:'4'},{n:'Pharmacology Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Neuropharmacology',cr:'4'},{n:'Toxicology – II',cr:'4'},{n:'Cardiovascular Pharmacology',cr:'4'},{n:'Bioassay',cr:'4'},{n:'Pharmacology Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Clinical Pharmacology',cr:'4'},{n:'Chemotherapy',cr:'4'},{n:'Pharmacovigilance',cr:'4'},{n:'Research Project – I',cr:'4'},{n:'Lab III',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Research Project – II',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🩺', name:'M.Pharm (Pharmacognosy)', badge:'PCI · 2 Yrs', dept:'School of Health Sciences', chips:['4 Sems','PCI','Herbal'],
      desc:'Natural products, herbal medicines, phytochemistry and ethnopharmacology.',
      meta:['2 Years · 4 Sems','PCI Approved','Herbal Focus'],
      sems:[
        {n:'Sem I',c:[{n:'Pharmacognosy – I',cr:'4'},{n:'Phytochemistry – I',cr:'4'},{n:'Herbal Drug Formulation',cr:'4'},{n:'Research Methodology',cr:'4'},{n:'Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Pharmacognosy – II',cr:'4'},{n:'Phytochemistry – II',cr:'4'},{n:'Traditional Medicine Systems',cr:'4'},{n:'Ethnopharmacology',cr:'4'},{n:'Lab II',cr:'4'}]},
        {n:'Sem III–IV',c:[{n:'Biosynthesis of Natural Products',cr:'4'},{n:'Nutraceuticals',cr:'4'},{n:'Research Project',cr:'12'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  media:[
    { icon:'📡', name:'M.J.M.C.', badge:'PG · 2 Yrs', dept:'School of Journalism & Mass Communication', chips:['4 Sems','Studio'],
      desc:'Journalism, digital media, broadcast journalism, media ethics and communication theory.',
      meta:['2 Years · 4 Sems','Studio Practice'],
      sems:[
        {n:'Sem I',c:[{n:'Communication Theory',cr:'4'},{n:'Reporting & Editing',cr:'4'},{n:'Media Laws & Ethics',cr:'4'},{n:'Digital Journalism',cr:'4'},{n:'Media Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Broadcast Journalism (TV/Radio)',cr:'4'},{n:'Advertising & PR',cr:'4'},{n:'Photojournalism',cr:'4'},{n:'Media Research Methods',cr:'4'},{n:'Media Lab II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Data Journalism',cr:'4'},{n:'Development Communication',cr:'4'},{n:'Media Management',cr:'4'},{n:'Elective',cr:'4'},{n:'Internship',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🎬', name:'PG Dip. Digital Media', badge:'Diploma · 1 Yr', dept:'School of Journalism & Mass Communication', chips:['2 Sems','Practical'],
      desc:'Digital content creation, video production, social media management and OTT journalism.',
      meta:['1 Year · 2 Sems','Practical Focus'],
      sems:[
        {n:'Sem I',c:[{n:'Digital Content Creation',cr:'4'},{n:'Video Production & Editing',cr:'4'},{n:'Social Media Strategy',cr:'4'},{n:'OTT & Streaming Journalism',cr:'4'},{n:'Studio Lab I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Podcast & Audio Production',cr:'4'},{n:'Data Journalism',cr:'4'},{n:'Integrated Media Campaigns',cr:'4'},{n:'Internship Project',cr:'8'}]},
      ]},
    { icon:'📻', name:'M.A. Mass Communication', badge:'PG · 2 Yrs', dept:'School of Journalism & Mass Communication', chips:['4 Sems','CUET-PG'],
      desc:'Mass communication theory, media effects, audience research and strategic communication.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Mass Communication Theory',cr:'4'},{n:'Media & Society',cr:'4'},{n:'Communication Research',cr:'4'},{n:'Writing for Media',cr:'4'}]},
        {n:'Sem II',c:[{n:'Media Effects & Audiences',cr:'4'},{n:'Public Relations',cr:'4'},{n:'International Communication',cr:'4'},{n:'Media Ethics',cr:'4'}]},
        {n:'Sem III',c:[{n:'Health Communication',cr:'4'},{n:'Media Economics',cr:'4'},{n:'Strategic Communication',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
  social:[
    { icon:'🌍', name:'M.A. Development Studies', badge:'Flagship', dept:'School of Social Sciences & Policy', chips:['4 Sems','Flagship','CUET-PG'],
      desc:"CUSB's flagship interdisciplinary programme bridging economics, sociology and political science.",
      meta:['2 Years · 4 Sems','Flagship Programme','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Political Economy of Development',cr:'4'},{n:'Sociology of Development',cr:'4'},{n:'History of Development Thought',cr:'4'},{n:'Research Methods',cr:'4'}]},
        {n:'Sem II',c:[{n:'Rural & Agrarian Development',cr:'4'},{n:'Gender & Development',cr:'4'},{n:'Public Policy & Governance',cr:'4'},{n:'Statistical Methods',cr:'4'}]},
        {n:'Sem III',c:[{n:'Climate Change & Development',cr:'4'},{n:'Social Movements',cr:'4'},{n:'Urban Development',cr:'4'},{n:'International Development',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Field Work',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'🗳️', name:'M.A. Political Science', badge:'PG · 2 Yrs', dept:'School of Social Sciences & Policy', chips:['4 Sems','CUET-PG'],
      desc:'Comparative politics, Indian governance, international relations and political thought.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Indian Political System',cr:'4'},{n:'Comparative Politics',cr:'4'},{n:'Political Theory',cr:'4'},{n:'Research Methods',cr:'4'}]},
        {n:'Sem II',c:[{n:'International Relations',cr:'4'},{n:'Public Administration',cr:'4'},{n:'Indian Foreign Policy',cr:'4'},{n:'Political Philosophy',cr:'4'}]},
        {n:'Sem III',c:[{n:'Federalism & Centre-State',cr:'4'},{n:'Election Studies',cr:'4'},{n:'Security Studies',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'💹', name:'M.A. Economics', badge:'PG · 2 Yrs', dept:'School of Social Sciences & Policy', chips:['4 Sems','CUET-PG'],
      desc:'Micro and macroeconomics, econometrics, development economics and public finance.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Microeconomics – I',cr:'4'},{n:'Macroeconomics – I',cr:'4'},{n:'Mathematics for Economics',cr:'4'},{n:'Indian Economy',cr:'4'}]},
        {n:'Sem II',c:[{n:'Microeconomics – II',cr:'4'},{n:'Macroeconomics – II',cr:'4'},{n:'Econometrics',cr:'4'},{n:'Development Economics',cr:'4'}]},
        {n:'Sem III',c:[{n:'Public Finance',cr:'4'},{n:'International Economics',cr:'4'},{n:'Agricultural Economics',cr:'4'},{n:'Elective',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
    { icon:'👤', name:'M.A. Psychology', badge:'PG · 2 Yrs', dept:'School of Social Sciences & Policy', chips:['4 Sems','CUET-PG'],
      desc:'Clinical, social, developmental and organizational psychology with research methodology.',
      meta:['2 Years · 4 Sems','CUET-PG'],
      sems:[
        {n:'Sem I',c:[{n:'Cognitive Psychology',cr:'4'},{n:'Biological Basis of Behaviour',cr:'4'},{n:'Social Psychology',cr:'4'},{n:'Research Methods – I',cr:'4'}]},
        {n:'Sem II',c:[{n:'Developmental Psychology',cr:'4'},{n:'Personality Psychology',cr:'4'},{n:'Abnormal Psychology',cr:'4'},{n:'Research Methods – II',cr:'4'}]},
        {n:'Sem III',c:[{n:'Clinical Psychology',cr:'4'},{n:'Organizational Psychology',cr:'4'},{n:'Counselling Psychology',cr:'4'},{n:'Psychological Testing',cr:'4'}]},
        {n:'Sem IV',c:[{n:'Dissertation',cr:'12'},{n:'Seminar',cr:'4'},{n:'Viva Voce',cr:'4'}]},
      ]},
  ],
};

/* ═════ State ═════ */
let currDept = 'ug';
let currPage = 0;
const PER = 6;

function sylGetFiltered(){
  const q = (document.getElementById('sylSearch')?.value || '').toLowerCase().trim();
  const progs = SYL[currDept] || [];
  if(!q) return progs;
  return progs.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.dept.toLowerCase().includes(q) ||
    (p.chips||[]).some(c=>c.toLowerCase().includes(q))
  );
}

function sylRender(){
  const progs = sylGetFiltered();
  const total = progs.length;
  const maxP = Math.max(0, Math.ceil(total / PER) - 1);
  currPage = Math.min(currPage, maxP);
  const slice = progs.slice(currPage * PER, currPage * PER + PER);

  const grid = document.getElementById('sylGrid');
  grid.style.opacity = '0';
  setTimeout(()=>{
    if(slice.length === 0){
      grid.innerHTML = `<div class="syl-empty"><div class="syl-empty-icon">🔍</div>No programmes found. Try a different filter or search term.</div>`;
    } else {
      grid.innerHTML = slice.map((p, i)=>`
        <div class="syl-tile" onclick="sylOpen('${currDept}',${currPage*PER+i})"
             style="animation:tileIn 0.26s ${i*0.04}s both;">
          <div class="syl-tile-top">
            <div class="syl-tile-icon">${p.icon}</div>
            <span class="syl-tile-badge">${p.badge}</span>
          </div>
          <div class="syl-tile-name">${p.name}</div>
          <div class="syl-tile-dept">${p.dept.replace('School of ','')}</div>
          <div class="syl-tile-desc">${p.desc.length>100?p.desc.slice(0,100)+'…':p.desc}</div>
          <div class="syl-tile-chips">${(p.chips||[]).map(c=>`<span class="syl-tile-chip">${c}</span>`).join('')}</div>
          <div class="syl-tile-footer">
            <button class="syl-tile-btn">View Syllabus <span class="syl-tile-btn-arr">→</span></button>
            <span class="syl-tile-sems">${p.sems ? p.sems.length + ' Sems' : ''}</span>
          </div>
        </div>`).join('');
    }
    grid.style.opacity = '1'; grid.style.transition = 'opacity 0.22s';

    /* dots */
    const tp = Math.ceil(total/PER);
    document.getElementById('sylDots').innerHTML = Array.from({length:tp},(_,i)=>
      `<div class="syl-dot${i===currPage?' on':''}" onclick="sylGoPage(${i})" style="cursor:pointer;"></div>`).join('');
    document.getElementById('sylPageInfo').textContent = total > PER ? `${currPage+1} / ${tp}` : '';
    document.getElementById('sylPrev').disabled = currPage===0;
    document.getElementById('sylNext').disabled = currPage>=maxP;
  }, 120);
}

function sylPage(d){ currPage+=d; sylRender(); }
function sylGoPage(p){ currPage=p; sylRender(); }
function sylDept(k, btn){
  currDept=k; currPage=0;
  const inp = document.getElementById('sylSearch');
  if(inp) inp.value='';
  document.querySelectorAll('.syl-dept-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  sylRender();
}

/* Drawer */
function sylOpen(dk, idx){
  const filtered = sylGetFiltered();
  const p = filtered[idx] || (SYL[dk]||[])[idx];
  if(!p) return;
  document.getElementById('sd-badge').textContent = p.badge;
  document.getElementById('sd-dept').textContent = p.dept;
  document.getElementById('sd-title').textContent = p.name;
  document.getElementById('sd-desc').textContent = p.desc;
  document.getElementById('sd-meta').innerHTML = (p.meta||[]).map(m=>
    `<span style="font-size:9.5px;background:rgba(201,151,43,0.10);border:1px solid rgba(201,151,43,0.22);color:var(--gold);padding:3px 11px;border-radius:50px;font-weight:700;">${m}</span>`).join('');
  document.getElementById('sd-body').innerHTML = (p.sems||[]).map(s=>{
    const totalCr = s.c.reduce((a,c)=>a+(parseInt(c.cr)||0),0);
    return `<div class="syl-sem">
      <div class="syl-sem-label">${s.n}<span class="syl-sem-total">${totalCr} Credits</span></div>
      ${s.c.map(c=>`
        <div class="syl-course-row">
          <span class="syl-course-name">${c.n}</span>
          <span class="syl-course-cr">${c.cr} Cr</span>
        </div>`).join('')}
    </div>`;
  }).join('');
  document.getElementById('syl-drawer').classList.add('open');
  document.getElementById('syl-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeSylDrawer(){
  document.getElementById('syl-drawer').classList.remove('open');
  document.getElementById('syl-overlay').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSylDrawer(); });

/* Init */
sylRender();


/* ========== section ========== */


// ── Gallery Tab Switcher ──
function switchGalleryTab(tab) {
  var imgBtn   = document.getElementById('galleryTabImages');
  var vidBtn   = document.getElementById('galleryTabVideos');
  var imgPanel = document.getElementById('galleryPanelImages');
  var vidPanel = document.getElementById('galleryPanelVideos');
  if (tab === 'videos') {
    imgBtn.classList.remove('gallery-tab-active');
    vidBtn.classList.add('gallery-tab-active');
    imgPanel.classList.remove('gallery-panel-active');
    vidPanel.classList.add('gallery-panel-active');
  } else {
    vidBtn.classList.remove('gallery-tab-active');
    imgBtn.classList.add('gallery-tab-active');
    vidPanel.classList.remove('gallery-panel-active');
    imgPanel.classList.add('gallery-panel-active');
  }
}

// ── Gallery Slideshow ──
(function() {
  var current = 0;
  var total = 6;
  var autoTimer;
  var track = document.getElementById('galleryTrackInner');
  var dots = document.querySelectorAll('#galleryDotsInner .gallery-dot-inner');

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  window.galleryGoToInner = goTo;

  document.getElementById('galleryPrevInner').addEventListener('click', function() {
    clearInterval(autoTimer);
    goTo(current - 1);
    startAuto();
  });
  document.getElementById('galleryNextInner').addEventListener('click', function() {
    clearInterval(autoTimer);
    goTo(current + 1);
    startAuto();
  });

  function startAuto() {
    autoTimer = setInterval(function() { goTo(current + 1); }, 4000);
  }
  startAuto();

  // Touch/swipe support
  var startX = 0;
  track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      clearInterval(autoTimer);
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, {passive:true});
})();


/* ========== section ========== */


(function(){
  /* ── Auto-purge: hide event cards whose date is > 1 month ago ── */
  var oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  /* Each card has a date text — parse it to decide if it's stale.
     Simpler & more reliable: attach data-date attributes to each card. */
  document.querySelectorAll('.evt-card[data-date]').forEach(function(card){
    var d = new Date(card.getAttribute('data-date'));
    if(d < oneMonthAgo) card.style.display = 'none';
  });

  /* ── Tab switcher ── */
  window.evtSwitch = function(tab){
    var panelLive = document.getElementById('evtPanelLive');
    var panelPast = document.getElementById('evtPanelPast');
    var btnLive   = document.getElementById('evtBtnLive');
    var btnPast   = document.getElementById('evtBtnPast');
    if(tab === 'live'){
      panelLive.style.display = '';
      panelPast.style.display = 'none';
      btnLive.className = 'evt-tab-btn active';
      btnPast.className = 'evt-tab-btn inactive';
    } else {
      panelLive.style.display = 'none';
      panelPast.style.display = '';
      btnLive.className = 'evt-tab-btn inactive';
      btnPast.className = 'evt-tab-btn active';
    }
  };
})();


/* ========== section ========== */


  function openFacultyModal(e) {
    if(e) e.preventDefault();
    const modal = document.getElementById('facultyModal');
    const panel = document.getElementById('facultyModalPanel');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => { panel.style.transform = 'translateX(0)'; }));
  }
  function closeFacultyModal() {
    const panel = document.getElementById('facultyModalPanel');
    panel.style.transform = 'translateX(100%)';
    setTimeout(() => { document.getElementById('facultyModal').style.display = 'none'; document.body.style.overflow = ''; }, 450);
  }
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeFacultyModal(); });

  function toggleDept(el) { el.closest('.dept-item').classList.toggle('open'); }

  let activeSchool = 'all';
  function filterSchool(school, btn) {
    activeSchool = school;
    document.querySelectorAll('#facultyModal .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('searchInput').value = '';
    applyFilters();
  }
  function filterAll() { applyFilters(); }
  function applyFilters() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    let anyVisible = false;
    document.querySelectorAll('#facultyModal .school-block').forEach(block => {
      const match = activeSchool === 'all' || activeSchool === block.dataset.school;
      if (!match) { block.classList.add('hidden'); return; }
      let hasDept = false;
      block.querySelectorAll('.dept-item').forEach(item => {
        const dn = item.querySelector('.dept-toggle-name').textContent.toLowerCase();
        const fn = [...item.querySelectorAll('.fac-name')].map(n => n.textContent.toLowerCase());
        const fs = [...item.querySelectorAll('.fac-specialization')].map(s => s.textContent.toLowerCase());
        const show = !q || dn.includes(q) || fn.some(n => n.includes(q)) || fs.some(s => s.includes(q));
        item.classList.toggle('hidden', !show);
        if (show) {
          hasDept = true;
          if (q) item.classList.add('open');
          item.querySelectorAll('.fac-card').forEach(card => {
            const n = card.querySelector('.fac-name')?.textContent.toLowerCase() || '';
            const s = card.querySelector('.fac-specialization')?.textContent.toLowerCase() || '';
            card.classList.toggle('fac-hidden', q ? !(n.includes(q) || s.includes(q)) : false);
          });
        }
      });
      block.classList.toggle('hidden', !hasDept);
      if (hasDept) anyVisible = true;
    });
    const nr = document.getElementById('noResults');
    if (nr) nr.classList.toggle('show', !anyVisible);
  }


/* ========== section ========== */


// ═══════════════ CURSOR ═══════════════
const cursorDot=document.getElementById('cursorDot'),cursorRing=document.getElementById('cursorRing'),cursorGlow=document.getElementById('cursorGlow'),cursorTrail=document.getElementById('cursorTrail');
let mx=-300,my=-300,rx=-300,ry=-300,gx=-300,gy=-300,tx=-300,ty=-300,moveTimer;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;document.body.classList.add('cursor-moving');clearTimeout(moveTimer);moveTimer=setTimeout(()=>document.body.classList.remove('cursor-moving'),140);});
(function animateCursor(){cursorDot.style.left=mx+'px';cursorDot.style.top=my+'px';rx+=(mx-rx)*.15;ry+=(my-ry)*.15;cursorRing.style.left=rx+'px';cursorRing.style.top=ry+'px';gx+=(mx-gx)*.09;gy+=(my-gy)*.09;cursorGlow.style.left=gx+'px';cursorGlow.style.top=gy+'px';tx+=(gx-tx)*.11;ty+=(gy-ty)*.11;cursorTrail.style.left=tx+'px';cursorTrail.style.top=ty+'px';requestAnimationFrame(animateCursor);})();
document.querySelectorAll('a,button,.program-card,.news-card,.planet,.mega-item,.mega-course,.mega-quick-link').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));});

// ═══════════════ PARTICLES ═══════════════
const pContainer=document.getElementById('particles');
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';p.style.left=Math.random()*100+'%';p.style.top=30+Math.random()*60+'%';p.style.setProperty('--dur',(6+Math.random()*10)+'s');p.style.setProperty('--delay',(Math.random()*8)+'s');p.style.width=p.style.height=(1+Math.random()*3)+'px';pContainer.appendChild(p);}

// ═══════════════ SOLAR STARS ═══════════════
const solarStars=document.getElementById('solarStars');
if(solarStars){for(let i=0;i<60;i++){const s=document.createElement('div');s.className='solar-star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.setProperty('--tw',(2+Math.random()*5)+'s');s.style.setProperty('--td',(Math.random()*5)+'s');s.style.width=s.style.height=(Math.random()*2)+'px';solarStars.appendChild(s);}}

// Planet hover pause
document.querySelectorAll('.planet-orbit,.planet-wrapper').forEach(el=>{el.addEventListener('mouseenter',()=>document.querySelectorAll('.planet-orbit,.planet-wrapper').forEach(e=>e.style.animationPlayState='paused'));el.addEventListener('mouseleave',()=>document.querySelectorAll('.planet-orbit,.planet-wrapper').forEach(e=>e.style.animationPlayState='running'));});

// ═══════════════ HERO SCROLL ═══════════════
const PDATA=[
  {num:'01',sub:'Administration Block',name:'Admin',glow:'#ff8a80',rgb:'255,138,128',base:40,max:160,ring:false,desc:'Heart of university operations — VC\'s office, registrar, finance department and all central student services.',feats:['VC Office','Registrar','Student Services']},
  {num:'02',sub:'Academic Block',name:'Aryabhata',glow:'#6ec6ff',rgb:'110,198,255',base:22,max:130,ring:false,desc:'Named after the great Indian mathematician & astronomer. Houses Mathematics & Computing — state-of-the-art labs and lecture halls.',feats:['Computer Labs','Lecture Halls','Research Rooms']},
  {num:'03',sub:'Arts & Culture Block',name:'Malviya',glow:'#ffe066',rgb:'255,224,102',base:38,max:150,ring:true,desc:'Fine Arts, Performing Arts, and a grand open-air amphitheatre for cultural events.',feats:['Amphitheatre','Art Studios','Music Rooms']},
  {num:'04',sub:'Policy & Law Block',name:'Chanakya',glow:'#69f0ae',rgb:'105,240,174',base:30,max:140,ring:false,desc:'Home to the School of Law & Governance — moot courts, seminar rooms, and a specialised legal library.',feats:['Moot Court','Legal Library','Seminar Halls']},
  {num:'05',sub:'Learning & Media',name:'VLC',glow:'#ce93d8',rgb:'206,147,216',base:34,max:140,ring:false,desc:'Virtual Learning Centre — e-classrooms, podcast studios and media labs enabling hybrid learning.',feats:['E-Classrooms','Podcast Studio','Media Labs']},
];
const heroWrap=document.getElementById('heroScrollWrap'),detail=document.getElementById('planetDetail'),heroIntro=document.getElementById('heroIntro'),pdDots=document.querySelectorAll('#progDots .pp-dot');
function lerp(a,b,t){return a+(b-a)*t;}
function easeOut(t){return 1-Math.pow(1-t,3);}
function onHeroScroll(){
  if(!heroWrap)return;
  const rect=heroWrap.getBoundingClientRect(),scrolled=-rect.top,total=heroWrap.offsetHeight-window.innerHeight;
  // On mobile the wrapper collapses to auto height so total ≤ 0 — hide detail & reset
  if(total<=0){detail.style.opacity='0';detail.style.transform='translateY(-50%) translateX(-20px)';detail.style.pointerEvents='none';resetAllPlanets();if(heroIntro)heroIntro.style.opacity='1';pdDots.forEach(d=>d.classList.remove('active'));return;}
  const progress=Math.max(0,Math.min(1,scrolled/total));
  const slotF=progress*6,slotIdx=Math.floor(slotF),slotT=slotF-slotIdx;
  if(heroIntro)heroIntro.style.opacity=String(Math.max(0,1-slotF*2));
  if(slotIdx===0){detail.style.opacity='0';detail.style.transform='translateY(-50%) translateX(-20px)';detail.style.pointerEvents='none';resetAllPlanets();pdDots.forEach(d=>d.classList.remove('active'));return;}
  const pi=slotIdx-1;
  if(pi>=PDATA.length){showPlanetFull(PDATA.length-1);return;}
  const p=PDATA[pi];
  if(slotT<0.5){const growT=slotT/0.5;growPlanet(pi,easeOut(growT));detail.style.opacity='0';detail.style.transform='translateY(-50%) translateX(-20px)';detail.style.pointerEvents='none';}
  else{growPlanet(pi,1);const revT=(slotT-0.5)/0.5;detail.style.opacity=String(easeOut(revT));detail.style.transform=`translateY(-50%) translateX(${lerp(-20,0,easeOut(revT))}px)`;detail.style.pointerEvents='all';populateDetail(pi);}
  for(let i=0;i<PDATA.length;i++){if(i!==pi)shrinkPlanetBack(i);}
  pdDots.forEach((d,i)=>d.classList.toggle('active',i===pi));
}
function growPlanet(i,t){const p=PDATA[i],el=document.getElementById('sp-'+i),lbl=document.getElementById('sl-'+i);if(!el)return;const size=lerp(p.base,p.max,t);el.style.width=el.style.height=size+'px';const g=`rgba(${p.rgb},${0.5*t})`,g2=`rgba(${p.rgb},${0.2*t})`;el.style.boxShadow=`0 0 ${size*.25}px ${g},0 0 ${size*.6}px ${g2},inset -5px -5px 12px rgba(0,0,0,.45),inset 4px 4px 9px rgba(255,255,255,.13)`;if(lbl)lbl.style.opacity=String(0.5+t*0.5);if(p.ring){const ring=document.getElementById('sr-2');if(ring){ring.style.width=size*1.9+'px';ring.style.height=size*.38+'px';}}}
function shrinkPlanetBack(i){const p=PDATA[i],el=document.getElementById('sp-'+i),lbl=document.getElementById('sl-'+i);if(!el)return;el.style.width=el.style.height=p.base+'px';el.style.boxShadow='';if(lbl)lbl.style.opacity='0.6';if(p.ring&&i===2){const ring=document.getElementById('sr-2');if(ring){ring.style.width=p.base*1.9+'px';ring.style.height=p.base*.38+'px';}}}
function resetAllPlanets(){PDATA.forEach((_,i)=>shrinkPlanetBack(i));}
function showPlanetFull(i){growPlanet(i,1);populateDetail(i);detail.style.opacity='1';detail.style.transform='translateY(-50%) translateX(0)';detail.style.pointerEvents='all';pdDots.forEach((d,j)=>d.classList.toggle('active',j===i));}
function populateDetail(i){const p=PDATA[i];document.getElementById('pdNum').textContent=p.num;document.getElementById('pdNum').style.color=p.glow;document.getElementById('pdSub').textContent=p.sub;document.getElementById('pdSub').style.color=p.glow;document.getElementById('pdName').textContent=p.name;document.getElementById('pdDesc').textContent=p.desc;document.getElementById('pdBtn').style.background=p.glow;const featsEl=document.getElementById('pdFeats');featsEl.innerHTML=p.feats.map(f=>`<span style="font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;padding:5px 13px;border-radius:50px;border:1px solid ${p.glow};color:${p.glow};background:rgba(255,255,255,.04);">${f}</span>`).join('');}
window.addEventListener('scroll',onHeroScroll,{passive:true});
onHeroScroll();

// ═══════════════ TABS ═══════════════
function switchTab(id,event){
  document.querySelectorAll('.ptab-content').forEach(el=>el.style.display='none');
  document.querySelectorAll('.ptab').forEach(el=>el.classList.remove('active'));
  var tab=document.getElementById('tab-'+id);
  if(tab)tab.style.display='block';
  // Find the matching ptab button by data or onclick text and activate it
  if(event){
    var btn=event.currentTarget||event.target;
    while(btn&&!btn.classList.contains('ptab'))btn=btn.parentElement;
    if(btn)btn.classList.add('active');
  } else {
    // Called without event (e.g. from mobile nav) — match by onclick content
    document.querySelectorAll('.ptab').forEach(function(b){
      if(b.getAttribute('onclick')&&b.getAttribute('onclick').indexOf("'"+id+"'")!==-1)b.classList.add('active');
    });
  }
  document.querySelectorAll('#tab-'+id+' .reveal').forEach(el=>{el.classList.remove('visible');setTimeout(()=>el.classList.add('visible'),50);});
}

// ═══════════════ SCROLL REVEAL ═══════════════
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ═══════════════ COURSE DATA ═══════════════
const COURSES={
  'ba-bed':{badge:'UG · Integrated',title:'B.A. B.Ed. (Integrated)',subtitle:'School of Education · NCTE Approved',stats:[{v:'4 Years',l:'Duration'},{v:'CUET-UG',l:'Entrance'},{v:'50 Seats',l:'Intake'}],desc:'A dual-degree integrated programme combining a Bachelor of Arts with a Bachelor of Education.',subjects:['Education Psychology','Child Development','Pedagogy of Language','ICT in Education','Curriculum Studies','Classroom Management','Assessment & Evaluation','School Internship'],eligibility:'✦ Eligibility: 10+2 in any stream with minimum 50% marks (45% for SC/ST/PwD).'},
  'bsc-bed':{badge:'UG · Integrated',title:'B.Sc. B.Ed. (Integrated)',subtitle:'School of Education · NCTE Approved',stats:[{v:'4 Years',l:'Duration'},{v:'CUET-UG',l:'Entrance'},{v:'50 Seats',l:'Intake'}],desc:'Integrated programme combining Science and Education. Trains future teachers for Mathematics, Physics, Chemistry and Biology.',subjects:['Physics','Chemistry','Mathematics','Biology','Pedagogy of Science','Lab Methodology','Assessment in Science','Research in Education'],eligibility:'✦ Eligibility: 10+2 with Science (PCM/PCB) with minimum 50% marks.'},
  'ba-llb':{badge:'UG · Law',title:'B.A. LL.B. (Hons.)',subtitle:'School of Law & Governance · BCI Approved',stats:[{v:'5 Years',l:'Duration'},{v:'CUET-UG',l:'Entrance'},{v:'60 Seats',l:'Intake'}],desc:'Five-year integrated programme combining Arts and Law.',subjects:['Constitutional Law','Law of Contracts','Criminal Law','Family Law','International Law','Legal Research','Moot Court','Environmental Law'],eligibility:'✦ Eligibility: 10+2 in any stream with minimum 50% marks.'},
  'bba-llb':{badge:'UG · Law + Management',title:'BBA LL.B. (Hons.)',subtitle:'School of Law & Governance · BCI Approved',stats:[{v:'5 Years',l:'Duration'},{v:'CUET-UG',l:'Entrance'},{v:'60 Seats',l:'Intake'}],desc:'Programme combining Business Administration and Law.',subjects:['Business Law','Corporate Law','Management Principles','Marketing','Intellectual Property','Taxation Law','Company Law','Moot Court'],eligibility:'✦ Eligibility: 10+2 in any stream with minimum 50% marks.'},
  'ma-dev':{badge:'PG · Social Sciences',title:'M.A. Development Studies',subtitle:'School of Social Sciences & Policy · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'The flagship programme that started CUSB in 2009 — interdisciplinary PG programme.',subjects:['Political Economy','Rural Development','Gender & Development','Statistics for Social Science','Development Theory','Governance & Policy','Research Methodology','Dissertation'],eligibility:'✦ Eligibility: Any Bachelor\'s degree with minimum 55% marks.'},
  'ma-hindi':{badge:'PG · Language',title:'M.A. Hindi',subtitle:'School of Humanities & Languages · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Postgraduate programme in Hindi language and literature.',subjects:['Hindi Poetry (Classical)','Modern Hindi Fiction','Hindi Linguistics','Comparative Literature','Translation Studies','Research Methodology','Hindi Grammar','Dissertation'],eligibility:'✦ Eligibility: B.A. with Hindi as a subject with minimum 55% marks.'},
  'ma-english':{badge:'PG · Language',title:'M.A. English',subtitle:'School of Humanities & Languages · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Comprehensive postgraduate programme in English literature, linguistics, and ELT.',subjects:['British Literature','American Literature','Postcolonial Studies','Critical Theory','Linguistics','ELT Methodology','Comparative Literature','Dissertation'],eligibility:'✦ Eligibility: B.A. with English as a subject with minimum 55% marks.'},
  'ma-history':{badge:'PG · Social Sciences',title:'M.A. History',subtitle:'School of Humanities & Languages · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Explores Indian history from ancient to modern times, with special emphasis on Bihar.',subjects:['Ancient India','Medieval India','Modern India','History of Bihar','World History','Historiography','Oral History','Dissertation'],eligibility:'✦ Eligibility: B.A. with History as a subject with minimum 55% marks.'},
  'ma-pol':{badge:'PG · Social Sciences',title:'M.A. Political Science',subtitle:'School of Social Sciences & Policy · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Comprehensive study of political theory, Indian politics, and comparative politics.',subjects:['Political Theory','Indian Government & Politics','Comparative Politics','Public Administration','International Relations','Political Thought','Research Methodology','Dissertation'],eligibility:'✦ Eligibility: B.A. with Political Science/any Social Science with 55% marks.'},
  'ma-eco':{badge:'PG · Economics',title:'M.A. Economics',subtitle:'School of Social Sciences & Policy · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Rigorous programme covering microeconomics, macroeconomics, econometrics, and development economics.',subjects:['Microeconomics','Macroeconomics','Econometrics','Indian Economy','Development Economics','International Trade','Public Finance','Dissertation'],eligibility:'✦ Eligibility: B.A./B.Sc./B.Com. with Economics with minimum 55% marks.'},
  'ma-ir':{badge:'PG · International Studies',title:'M.A. International Relations',subtitle:'Centre for IR & Area Studies · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'25 Seats',l:'Intake'}],desc:'International politics, strategic studies, diplomacy, and area studies.',subjects:['International Relations Theory','Indian Foreign Policy','South Asian Politics','Diplomacy & Negotiations','Strategic Studies','Global Governance','Area Studies','Dissertation'],eligibility:'✦ Eligibility: Any Bachelor\'s degree with minimum 55% marks.'},
  'mjmc':{badge:'PG · Media',title:'M.J.M.C.',subtitle:'School of Journalism & Mass Communication · CUET-PG',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Industry-oriented Mass Communication covering print journalism, broadcast, digital media, PR.',subjects:['Print Journalism','Broadcast Journalism','Digital Media','PR & Advertising','Media Law & Ethics','Documentary Filmmaking','Radio Production','Dissertation'],eligibility:'✦ Eligibility: Any Bachelor\'s degree with minimum 55% marks.'},
  'msc-biotech':{badge:'PG · Sciences',title:'M.Sc. Biotechnology',subtitle:'School of Earth, Biological & Environmental Sciences',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'20 Seats',l:'Intake'}],desc:'Advanced molecular biology, genetics, bioinformatics, and applied biotechnology.',subjects:['Molecular Biology','Genetic Engineering','Bioinformatics','Immunology','Cell Biology','Industrial Biotechnology','Research Methodology','Dissertation'],eligibility:'✦ Eligibility: B.Sc. with Biology/Chemistry/Biotechnology with minimum 55% marks.'},
  'msc-env':{badge:'PG · Sciences',title:'M.Sc. Environmental Science',subtitle:'School of Earth, Biological & Environmental Sciences',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'20 Seats',l:'Intake'}],desc:'Ecology, climate change, pollution management and conservation.',subjects:['Ecology','Climate Change Science','Environmental Policy','Pollution Management','Remote Sensing & GIS','Conservation Biology','Environmental Law','Dissertation'],eligibility:'✦ Eligibility: B.Sc. in any Science stream with minimum 55% marks.'},
  'msc-cs':{badge:'PG · Technology',title:'M.Sc. Computer Science',subtitle:'School of Mathematics, Statistics & Computer Science',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'Advanced algorithms, machine learning, and software engineering.',subjects:['Advanced Algorithms','Machine Learning','Database Management','Computer Networks','Artificial Intelligence','Cloud Computing','Software Engineering','Dissertation'],eligibility:'✦ Eligibility: B.Sc./BCA/B.Tech. in CS/IT with minimum 55% marks.'},
  'msc-math':{badge:'PG · Sciences',title:'M.Sc. Mathematics',subtitle:'School of Mathematics, Statistics & Computer Science',stats:[{v:'2 Years',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'25 Seats',l:'Intake'}],desc:'Pure and applied mathematics — analysis, algebra, topology, and numerical methods.',subjects:['Real Analysis','Abstract Algebra','Topology','Differential Equations','Numerical Methods','Functional Analysis','Operations Research','Dissertation'],eligibility:'✦ Eligibility: B.Sc./B.A. with Mathematics with minimum 55% marks.'},
  'mpharm':{badge:'PG · Health Sciences',title:'M.Pharm',subtitle:'School of Health Sciences · PCI Approved',stats:[{v:'2 Years',l:'Duration'},{v:'GPAT/CUET',l:'Entrance'},{v:'15 Seats',l:'Intake'}],desc:'Postgraduate pharmacy in Pharmaceutics and Pharmacology with strong industry exposure.',subjects:['Advanced Pharmaceutics','Pharmacokinetics','Drug Design','Pharmacology','Pharmaceutical Analysis','Regulatory Affairs','Clinical Research','Dissertation'],eligibility:'✦ Eligibility: B.Pharm with minimum 55% marks. Admission through GPAT/CUET.'},
  'llm':{badge:'PG · Law',title:'LL.M.',subtitle:'School of Law & Governance · BCI Approved',stats:[{v:'1 Year',l:'Duration'},{v:'CUET-PG',l:'Entrance'},{v:'30 Seats',l:'Intake'}],desc:'One-year postgraduate law programme as per UGC 2013 and BCI norms.',subjects:['Constitutional Law Advanced','Criminal Justice','International Law','Human Rights Law','Legal Research Methodology','Comparative Law','Dissertation','Moot Court'],eligibility:'✦ Eligibility: LL.B. (3-year or 5-year integrated) with minimum 55% marks.'},
  'phd-sci':{badge:'Research · Sciences',title:'Ph.D. Sciences',subtitle:'All Science Departments · CUSB Entrance Test',stats:[{v:'3–5 Years',l:'Duration'},{v:'CUSB-ET',l:'Entrance'},{v:'JRF/SRF',l:'Fellowship'}],desc:'Research across Biotechnology, Environmental Science, Chemistry, Physics, Mathematics, and Computer Science.',subjects:['Research Proposal','Literature Review','Lab/Field Research','Coursework','Paper Publication','Pre-submission Seminar','Viva Voce','Thesis Submission'],eligibility:'✦ Eligibility: Master\'s degree with minimum 55% marks (50% for SC/ST/PwD).'},
  'phd-hum':{badge:'Research · Humanities',title:'Ph.D. Humanities & Social Sciences',subtitle:'School of Humanities & Social Sciences',stats:[{v:'3–5 Years',l:'Duration'},{v:'CUSB-ET',l:'Entrance'},{v:'ICSSR/UGC',l:'Fellowship'}],desc:'Research in Hindi, English, History, Political Science, International Relations, Economics.',subjects:['Research Methods','Interdisciplinary Coursework','Field Research','Archival Work','Conference Presentations','Paper Publication','Pre-Ph.D Seminar','Thesis'],eligibility:'✦ Eligibility: Master\'s in relevant discipline with 55% marks (50% for SC/ST/PwD).'},
  'phd-law':{badge:'Research · Law',title:'Ph.D. Law',subtitle:'School of Law & Governance · BCI Approved',stats:[{v:'3–5 Years',l:'Duration'},{v:'CUSB-ET',l:'Entrance'},{v:'BCI Approved',l:'Status'}],desc:'Advanced law research in Constitutional Law, Criminal Law, Human Rights, International Law.',subjects:['Legal Research Methods','Comparative Constitutional Law','International Human Rights','Criminal Justice Research','Legal Policy Analysis','Paper Publication','Seminars','Thesis'],eligibility:'✦ Eligibility: LL.M. with minimum 55% marks. CUSB Entrance Test mandatory.'}
};

// ═══════════════ RESEARCH DATA ═══════════════
const RESEARCH={
  'cif':{badge:'Facility · Sciences',title:'Central Instrumental Facility',subtitle:'Advanced Research Infrastructure · CUSB',stats:[{v:'24/7',l:'Access'},{v:'Multi-Dept',l:'Usage'},{v:'DST Funded',l:'Status'}],desc:'Houses state-of-the-art scientific instruments for spectroscopy, chromatography, and microscopy.',subjects:['UV-Vis Spectrophotometer','FTIR Spectrometer','PCR Machines','Centrifuges','Lyophilizer','Gel Documentation','Microplate Reader','Autoclave Units'],eligibility:'✦ Access: Open to all CUSB research scholars, faculty, and registered students.'},
  'ucc':{badge:'Facility · Technology',title:'University Computer Centre',subtitle:'Digital Infrastructure · CUSB Campus',stats:[{v:'80+',l:'Systems'},{v:'High-Speed',l:'Internet'},{v:'All Depts',l:'Access'}],desc:'High-performance computing facilities with licensed software and high-speed internet.',subjects:['Desktop Computing','Programming Labs','Statistical Software (SPSS/R)','GIS Software','E-Library Access','Remote Access Portal','Digital Printing','Scan & Documentation'],eligibility:'✦ Access: All enrolled students and faculty with valid university ID.'},
  'media-studio':{badge:'Facility · Media',title:'Media Studio',subtitle:'VLC Block · School of Journalism & Mass Communication',stats:[{v:'Full HD',l:'Studio'},{v:'Podcast',l:'Ready'},{v:'MJMC',l:'Primary Use'}],desc:'Professional-grade media studio for podcast, broadcast, video production and documentary filmmaking.',subjects:['Podcast Recording Booths','Video Editing Suites','Green Screen Studio','Radio Broadcast Setup','Camera Equipment','Audio Mixing Console','Teleprompter','Lighting Rigs'],eligibility:'✦ Primary use for MJMC students. Other departments may book slots via coordinator.'},
  'inca':{badge:'Event · International',title:'45th INCA International Congress',subtitle:'Hosted by CUSB · International Numismatic Commission for Asia',stats:[{v:'45th Ed.',l:'Congress'},{v:'CUSB Host',l:'Venue'},{v:'International',l:'Delegates'}],desc:'CUSB proudly hosted this prestigious international gathering of numismatists, historians, and archaeologists.',subjects:['Numismatics Research','Coin History','Archaeological Studies','Paper Presentations','International Collaboration','Cultural Heritage','Keynote Lectures','Exhibition'],eligibility:'✦ Past Event: Proceedings and publications available in the university library.'},
  'iic':{badge:'Committee · Innovation',title:'IIC – Innovation Council',subtitle:'MoE Recognised · Startup & Entrepreneurship Cell',stats:[{v:'MoE',l:'Recognised'},{v:'Star Rating',l:'Ranked'},{v:'Active',l:'Status'}],desc:'Established under the Ministry of Education\'s Innovation Cell to foster entrepreneurship at CUSB.',subjects:['Innovation Bootcamps','Hackathons','Startup Mentorship','IPR Workshops','Industry Connect','Idea Competitions','Innovation Ambassador Programme','Annual Innovation Day'],eligibility:'✦ Open to all CUSB students and faculty.'},
  'ipr':{badge:'Cell · Legal',title:'IPR Cell',subtitle:'Intellectual Property Rights · CUSB',stats:[{v:'Patents',l:'Filing Support'},{v:'Copyright',l:'Registration'},{v:'Active',l:'Status'}],desc:'Assists faculty, researchers and students in protecting intellectual property.',subjects:['Patent Filing Guidance','Copyright Registration','Trademark Advisory','Technology Transfer','IP Audit','Innovation Disclosure','Licensing Support','IP Awareness Workshops'],eligibility:'✦ Available to all CUSB faculty, researchers, and students with novel research output.'},
  'rnd':{badge:'Cell · Research',title:'R&D Cell',subtitle:'Research & Development · Industry-Academia Interface',stats:[{v:'UGC/DST',l:'Funded'},{v:'Multi-Dept',l:'Projects'},{v:'Active',l:'Status'}],desc:'Coordinates research projects, industry-academia collaborations, and externally funded research.',subjects:['Project Coordination','Industry Liaison','Funded Research Monitoring','Collaboration MoUs','Research Proposals','DST/DBT Projects','SERB Grants','Annual Research Report'],eligibility:'✦ Faculty and research scholars can register projects and seek R&D Cell support.'},
  'fpac':{badge:'Cell · Ethics',title:'FPAC / IAEC / RDC Cell',subtitle:'Animal Ethics · Research Development · Faculty Appraisal',stats:[{v:'CPCSEA',l:'Compliant'},{v:'Ethical',l:'Clearance'},{v:'Mandatory',l:'For Research'}],desc:'Covers FPAC, IAEC, and RDC — ensuring ethical standards in animal-based and human subject research.',subjects:['Animal Ethics Clearance','Human Subject Research Approval','Faculty Appraisal Process','Research Protocol Review','Biosafety Compliance','Ethics Training','Annual Review','Documentation'],eligibility:'✦ Mandatory clearance required for all research involving animals or human subjects.'},
  'legal':{badge:'Cell · Administration',title:'Legal Cell',subtitle:'University Legal Affairs · CUSB',stats:[{v:'University',l:'Legal Aid'},{v:'RTI',l:'Nodal Cell'},{v:'Active',l:'Status'}],desc:'Handles all legal matters — litigation, RTI responses, legal opinions, and statutory compliance.',subjects:['University Litigation','RTI Responses','Legal Opinion','Contract Review','Compliance Advisory','Student Legal Aid','Service Matters','Statutory Compliance'],eligibility:'✦ Services available to all CUSB stakeholders for university-related legal matters.'},
  'iecbhr':{badge:'Cell · Biosafety',title:'IECBHR / IBSC Cell',subtitle:'Human Research Ethics · Institutional Biosafety Committee',stats:[{v:'ICMR',l:'Guidelines'},{v:'DBT/RCGM',l:'Compliant'},{v:'Mandatory',l:'Clearance'}],desc:'Ensures all biomedical, clinical and biosafety research meets national and international ethical standards.',subjects:['Biomedical Ethics Review','Clinical Research Approval','Biosafety Level Assessment','GMO Research Oversight','Informed Consent Review','Risk Assessment','Annual Compliance','Documentation'],eligibility:'✦ Mandatory for all biomedical, health, and biosafety research.'},
  'publications':{badge:'General · Research Output',title:'Highlights & Publications',subtitle:'Research Output · Journals · Books · Conference Papers',stats:[{v:'Indexed',l:'Journals'},{v:'Scopus/WoS',l:'Publications'},{v:'Growing',l:'Repository'}],desc:'CUSB faculty publish in nationally and internationally indexed journals across all disciplines.',subjects:['Scopus Indexed Papers','Web of Science Publications','UGC Care Journals','Book Chapters','Conference Proceedings','Monographs','Policy Briefs','Working Papers'],eligibility:'✦ All CUSB publications are accessible through the university library portal.'},
  'partnership':{badge:'General · Collaboration',title:'Partnership & MoUs',subtitle:'National & International Collaborations · CUSB',stats:[{v:'IIT Patna',l:'Key Partner'},{v:'MoU',l:'Signed'},{v:'Active',l:'Collaborations'}],desc:'CUSB has established MoUs with premier institutions including IIT Patna for joint research.',subjects:['IIT Patna Collaboration','Industry MoUs','International University Tie-ups','Joint Research Projects','Student Exchange','Faculty Exchange','Joint Publications','Workshop Collaboration'],eligibility:'✦ Faculty proposing new partnerships may submit proposals through the R&D Cell.'},
  'scholarship':{badge:'Grants · Fellowship',title:'Scholarship & Fellowship',subtitle:'UGC · ICSSR · JRF · SRF · Research Fellowships',stats:[{v:'JRF/SRF',l:'UGC Funded'},{v:'ICSSR',l:'Social Sciences'},{v:'PM Fellowship',l:'Available'}],desc:'Research scholars can avail fellowships from UGC, ICSSR, DST-INSPIRE, DBT, and PM Research Fellowship.',subjects:['UGC-NET JRF','UGC-SRF','ICSSR Fellowship','DST-INSPIRE','DBT Fellowship','PM Research Fellowship','Institutional Fellowship','Merit Scholarship'],eligibility:'✦ Eligibility varies by fellowship. Generally requires qualifying NET/GATE or equivalent exam.'},
  'grants':{badge:'Grants · Faculty',title:'Grants for Faculties',subtitle:'DST · DBT · SERB · UGC · ICSSR Funded Projects',stats:[{v:'SERB/DST',l:'Science Grants'},{v:'ICSSR',l:'Social Science'},{v:'UGC',l:'Major Projects'}],desc:'CUSB faculty actively secure research grants from major national funding bodies.',subjects:['SERB Core Research Grant','DST-FIST','DBT-BioCARe','UGC Major Projects','ICSSR Major Research Projects','CSIR Projects','Consultancy Projects','Industry Sponsored Research'],eligibility:'✦ All permanent and contractual faculty with Ph.D qualification are eligible to apply.'}
};

// ═══════════════ ABOUT / INFO DATA ═══════════════
const INFO={
  'university':{badge:'About · Overview',title:'The University',subtitle:'Central University of South Bihar · Est. 2009',desc:'The Central University of South Bihar (CUSB) is a central university established by an Act of Parliament in 2009 and located at Panchanpur, Gaya, Bihar. As a central university, CUSB is fully funded by the University Grants Commission (UGC) and the Government of India. It is committed to providing quality higher education, fostering research and innovation, and contributing to national development.',list:['Established by Central Universities Act, 2009','Located at Panchanpur, Gaya, Bihar – 824236','Fully funded by UGC / Government of India','NAAC Accredited (Grade A++)','NIRF Ranked University, Law & Pharmacy Departments','8,000+ students | 120+ faculty | 45+ programmes']},
  'cu-act':{badge:'About · Legislation',title:'Central Universities Act, 2009',subtitle:'Parliament of India · Founding Legislation',desc:'The Central University of South Bihar was established under the Central Universities Act, 2009 (Act No. 25 of 2009), passed by the Parliament of India. The Act provided for the establishment of several new central universities in underserved states, with CUSB being established to serve the educational needs of the people of South Bihar.',list:['Act No. 25 of 2009 — Parliament of India','Established 15 new Central Universities pan-India','CUSB — dedicated to South Bihar region','Fully under Ministry of Education, Govt. of India','Governed by UGC regulations and guidelines','Follows NEP 2020 framework for curricula']},
  'history':{badge:'About · History',title:'History & Development',subtitle:'From 2009 to Present · 15+ Years of Growth',desc:'CUSB began its academic journey in 2009 with the flagship M.A. Development Studies programme at a temporary campus. Over the years, the university has grown into a full-fledged institution with Schools of Sciences, Humanities, Law, Education, Health Sciences, and more. The permanent campus at Panchanpur, Gaya spans over 400 acres.',list:['2009 — Founded, first session: M.A. Development Studies','2011 — Expanded to Science and Law programmes','2014 — Shifted to permanent Panchanpur campus','2018 — New schools: Pharmacy, Journalism, Education','2022 — NAAC accreditation received','2025 — 15+ Schools, 45+ programmes, 8,000+ students']},
  'statutes':{badge:'About · Governance',title:'Statutes & Ordinances',subtitle:'Governance Framework · CUSB',desc:'The university operates under a comprehensive set of statutes and ordinances that govern academic, administrative, financial and disciplinary matters. These documents are framed in accordance with the Central Universities Act, 2009 and UGC guidelines.',list:['University Statutes framed under CU Act 2009','Ordinances governing academic programmes','Service rules for teaching and non-teaching staff','Student discipline and conduct regulations','Finance and audit regulations','Examination and assessment ordinances']},
  'vision':{badge:'About · Vision',title:'Vision & Mission',subtitle:'Our Purpose & Goals · CUSB',desc:'CUSB\'s vision is to become a world-class centre of learning that fosters academic excellence, research, innovation, and inclusive education for the social and economic development of South Bihar and India.',list:['Vision: World-class centre of learning & research','Mission: Quality education with social responsibility','Focus on inclusive education for underserved communities','Promote research, innovation and entrepreneurship','Foster national integration and constitutional values','Collaborate with national and international institutions']},
  'regulations':{badge:'About · Policy',title:'Regulation & Policy Documents',subtitle:'Compliance & Policies · CUSB',desc:'CUSB maintains a comprehensive set of regulatory and policy documents covering admissions, reservations, anti-discrimination, sexual harassment prevention, and environmental policies.',list:['Reservation Policy (SC/ST/OBC/EWS/PwD)','Anti-Sexual Harassment Policy (POSH Act)','Anti-Ragging Policy and Committee','RTI Policy and designated officer','Environmental Sustainability Policy','Grievance Redressal Policy']},
  'salient':{badge:'About · Features',title:'Salient Features & Best Practices',subtitle:'What Sets CUSB Apart',desc:'CUSB has established several distinctive features and best practices that differentiate it from other universities in terms of student support, research culture, and institutional governance.',list:['100% scholarship coverage for SC/ST students','Free hostel accommodation for girl students','Green campus initiative with solar installations','Peer mentorship programme for first-year students','SWAYAM / NPTEL course integration in curricula','Annual Foundation Day with research showcase']},
  'annual-reports':{badge:'About · Finance',title:'Annual Reports & Accounts',subtitle:'Financial Transparency · CUSB',desc:'CUSB publishes annual reports and audited accounts in accordance with UGC and Ministry of Education guidelines. These documents are available for public access as part of the university\'s commitment to transparency.',list:['Annual Report 2023–24 (available on website)','Annual Accounts audited by CAG-empanelled firm','Budget allocations published every academic year','UGC utilisation certificates submitted annually','RTI disclosures updated quarterly','Finance Committee approves all major expenditures']},
  'kulgeet':{badge:'About · Identity',title:'University Kulgeet',subtitle:'University Anthem · CUSB',desc:'The Kulgeet (University Anthem) of CUSB encapsulates the spirit, values and aspirations of the institution. It is sung at convocations, Foundation Day, and other major university events.',list:['Composed to reflect CUSB\'s founding values','Sung at convocation and major university events','Available in Hindi with English transliteration','Incorporates themes of knowledge, service and nation','Performed by the university choir ensemble','Officially adopted at the first Foundation Day']},
  'logo':{badge:'About · Branding',title:'CUSB Logo',subtitle:'Branding & Visual Identity · CUSB',desc:'The CUSB logo incorporates elements representing knowledge, the historic legacy of Bihar (including Nalanda and Bodh Gaya), and the pursuit of excellence in learning. The logo is used on all official university communications.',list:['Circular emblem representing wholeness of knowledge','Gold and blue — official university colours','Elements referencing Bihar\'s cultural heritage','Nalanda motif — ancient seat of learning','Sanskrit motto: "तमसो मा ज्योतिर्गमय"','Usage guidelines available for official use only']},
  'reach':{badge:'About · Location',title:'How to Reach CUSB',subtitle:'Directions & Map · Panchanpur, Gaya',desc:'The Central University of South Bihar is located at Panchanpur, Gaya, Bihar — approximately 5 km from Bodh Gaya and 12 km from Gaya City. Gaya is well-connected by air, rail, and road.',list:['Address: Panchanpur, Gaya – 824236, Bihar','By Air: Gaya International Airport (~15 km)','By Rail: Gaya Junction Railway Station (~12 km)','By Road: NH 22 / State Highway, well-connected','From Patna: ~120 km via NH 83 (approx. 3 hrs)','From Bodh Gaya: ~5 km, 10 minutes by auto']},
  'the-court':{badge:'Statutory · Governing Body',title:'The Court',subtitle:'Supreme Governing Body · CUSB',desc:'The Court is the supreme governing body of the Central University of South Bihar as per the Central Universities Act, 2009. It provides overall policy direction and reviews the broad framework of the university\'s academic and administrative functioning.',list:['Highest governing body of CUSB','Composed of Chancellor, VC, and nominated members','Reviews annual reports and accounts','Approves major policy changes','Meets at least once a year','Constituted under CU Act 2009, Section 15']},
  'exec-council':{badge:'Statutory · Administration',title:'Executive Council',subtitle:'Chief Administrative Body · CUSB',desc:'The Executive Council is the principal executive body of CUSB, responsible for the management and administration of the university. It exercises all powers and performs all duties assigned to it by the Act, Statutes, and Ordinances.',list:['Principal executive and administrative body','Approves appointments of teaching and non-teaching staff','Manages university properties and finances','Creates and abolishes teaching posts','Exercises disciplinary authority over employees','Meets regularly throughout the academic year']},
  'academic-council':{badge:'Statutory · Academic',title:'Academic Council',subtitle:'Academic Governance · CUSB',desc:'The Academic Council is the highest academic body of CUSB, responsible for maintaining standards of teaching, examination, and research. It approves new programmes, syllabi, and academic policies.',list:['Highest academic body of CUSB','Approves new academic programmes and courses','Reviews and approves syllabi and curricula','Sets standards for examinations and assessments','Recommends conferment of honorary degrees','Coordinates inter-departmental academic activities']},
  'finance-committee':{badge:'Statutory · Finance',title:'Finance Committee',subtitle:'Budget & Financial Oversight · CUSB',desc:'The Finance Committee examines and scrutinises the annual budget of CUSB before it is presented to the Executive Council. It advises on all financial matters related to the university.',list:['Examines annual budget estimates','Advises on financial matters to Executive Council','Reviews audit reports and utilisation certificates','Scrutinises proposals with financial implications','Meets at least twice annually (pre and post-budget)','Constituted under CU Act 2009']},
  'tenders':{badge:'Others · Procurement',title:'Tenders',subtitle:'Procurement & Bids · CUSB',desc:'All tenders and procurement notices of CUSB are published on the official website and on the Central Public Procurement Portal (CPPP) in compliance with Government of India procurement guidelines.',list:['Published on official CUSB website','Available on Central Public Procurement Portal (CPPP)','Open tenders for construction and civil works','Supply and services tenders (equipment, IT, furniture)','Annual maintenance contracts (AMC)','Limited and single-source tenders as per GFR 2017']},
  'notices':{badge:'Others · Official',title:'Notices',subtitle:'Official Notices · CUSB',desc:'Official notices from the university administration, academic departments, examination cell, and other offices are published regularly on the CUSB website.',list:['Examination schedule and date sheet notices','Fee payment and hostel allotment notices','Administrative orders from the Registrar\'s office','Notices from the Dean of Student Welfare','Scholarship and fellowship notices','Result declaration and re-evaluation notices']},
  'recruitment':{badge:'Others · Careers',title:'Recruitment',subtitle:'Faculty & Staff Openings · CUSB',desc:'CUSB regularly advertises positions for teaching faculty (Professor, Associate Professor, Assistant Professor) and non-teaching staff through its official website and national employment portals.',list:['Faculty positions: Professor, Associate, Assistant Professor','Non-teaching staff: Administrative, Technical, Library','Advertised on Employment News / Rozgar Samachar','Also available on CUSB official website','Selection through duly constituted Selection Committees','Reservations as per GoI norms (SC/ST/OBC/PwD)']},
  'download':{badge:'Others · Resources',title:'Downloads',subtitle:'Forms, Syllabus & Official Documents · CUSB',desc:'CUSB provides a comprehensive downloads section on its official website for students, faculty, and applicants to access important forms, syllabi, regulations, and other official documents.',list:['Admission application forms (UG, PG, Ph.D)','Syllabi for all programmes (PDF)','Scholarship and fellowship application forms','Anti-ragging and undertaking forms','Hostel application and allotment forms','RTI application forms and fee structure']},
  'upcoming-events':{badge:'Events · Calendar',title:'Upcoming Events',subtitle:'What\'s Coming Up · CUSB Academic Calendar',desc:'CUSB regularly organises seminars, conferences, cultural events, sports meets, and academic workshops. The events calendar is published on the official website.',list:['Annual Sports Meet (inter-departmental)','National Seminar on Development Studies','International Conference hosted by Law School','Cultural Festival — Pratibha (annual)','Foundation Day (March) — annual celebration','Student Research Symposium (every semester)']},
  'archived-events':{badge:'Events · Archive',title:'Archived Events',subtitle:'Past Events Archive · CUSB',desc:'A comprehensive archive of past events, conferences, seminars, and cultural programmes is maintained on the CUSB website for reference and institutional memory.',list:['45th INCA International Congress (hosted at CUSB)','10th Annual Convocation Ceremony (2025)','National Conference on Environmental Challenges','Annual Cultural Festival archives (2010–present)','Research Week proceedings and presentations','Visitor lectures and invited talks archive']},
  'recent-event':{badge:'Events · Latest',title:'Recent Events',subtitle:'Latest Happenings · CUSB',desc:'Recent highlights from CUSB include the 10th Annual Convocation, signing of MoU with IIT Patna, and hosting the 45th INCA International Congress.',list:['10th Annual Convocation Ceremony — Feb 2025','MoU signed with IIT Patna for joint research','NAAC team visit and accreditation review','Foundation Day celebration — March 2025','National Seminar on Digital India & Education','Placement drive — 136 students placed (2023)']},
  'foundation-day':{badge:'Events · Annual',title:'Foundation Day',subtitle:'Annual Celebration · Established March 2009',desc:'CUSB celebrates its Foundation Day every year in March, commemorating its establishment by the Parliament of India in 2009. The event includes academic addresses, cultural programmes, and recognition of outstanding achievers.',list:['Celebrated annually in March since 2009','Guest lectures by distinguished academics and policymakers','Felicitation of top students and faculty achievers','Cultural programmes by students from all departments','Research poster exhibition and paper presentations','Release of annual university magazine / newsletter']},
  'academic-highlights':{badge:'Highlights · Achievements',title:'Academic Highlights',subtitle:'Achievements & Milestones · CUSB',desc:'CUSB has achieved significant academic milestones over the years, from NAAC accreditation to NIRF rankings and international collaborations.',list:['NAAC Grade A++ Accreditation','NIRF 2025: Ranked 151–200 (University Category)','NIRF Law Rank #23 (2025)','NIRF Pharmacy Rank #63 (2025)','MoU with IIT Patna for collaborative research','136 students placed in 2023 with ₹8 LPA highest package']},
  'photo-gallery':{badge:'Gallery · Visual',title:'Photo Gallery',subtitle:'Campus & Event Photos · CUSB',desc:'The CUSB photo gallery showcases campus life, infrastructure, events, convocations, cultural programmes, and research activities.',list:['Campus infrastructure and buildings','Convocation ceremonies and academic events','Cultural festival (Pratibha) photographs','Research laboratory and facility photos','Sports and NSS/NCC activity photos','Distinguished visitor and lecture series photos']},
  'circular':{badge:'Notifications · Official',title:'Circular / Notification / Office Order',subtitle:'Official Communications · CUSB',desc:'All official circulars, notifications, and office orders from the Vice Chancellor\'s office, Registrar, Finance, Examination, and other departments are published on the university website.',list:['Academic circulars from the VC/Registrar','Examination notifications and schedule orders','Financial and fee-related office orders','Hostel and accommodation notifications','Leave rules and service-related orders','Anti-ragging committee notifications and orders']}
};

// ═══════════════ MODAL FUNCTIONS ═══════════════
function openCourseModal(id){ openModal(COURSES[id],'course'); }
function openResearchModal(id){ openModal(RESEARCH[id],'course'); }
function openModal(c,type){
  if(!c)return;
  document.getElementById('mBadge').textContent=c.badge;
  document.getElementById('mTitle').textContent=c.title;
  document.getElementById('mSubtitle').textContent=c.subtitle;
  document.getElementById('mDesc').textContent=c.desc;
  document.getElementById('mEligibility').textContent=c.eligibility;
  document.getElementById('mGrid').innerHTML=c.stats.map(s=>`<div class="modal-stat"><div class="modal-stat-val">${s.v}</div><div class="modal-stat-lbl">${s.l}</div></div>`).join('');
  document.getElementById('mSubjects').innerHTML=c.subjects.map(s=>`<span class="modal-subject">${s}</span>`).join('');
  document.getElementById('courseModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCourseModal(){document.getElementById('courseModalOverlay').classList.remove('open');document.body.style.overflow='';}
function closeModalOnOverlay(e){if(e.target===document.getElementById('courseModalOverlay'))closeCourseModal();}

function openInfoModal(id){
  const c=INFO[id];
  if(!c)return;
  document.getElementById('iMBadge').textContent=c.badge;
  document.getElementById('iMTitle').textContent=c.title;
  document.getElementById('iMSubtitle').textContent=c.subtitle;
  document.getElementById('iMDesc').textContent=c.desc;
  document.getElementById('iMList').innerHTML=c.list.map(item=>`
    <div class="info-list-item">
      <span class="info-list-icon">✦</span>
      <span>${item}</span>
    </div>
  `).join('');
  document.getElementById('infoModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  return false;
}
function closeInfoModal(){document.getElementById('infoModalOverlay').classList.remove('open');document.body.style.overflow='';}
function closeInfoOnOverlay(e){if(e.target===document.getElementById('infoModalOverlay'))closeInfoModal();}

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCourseModal();closeInfoModal();}});

// ═══════════════ ADMISSION DATA ═══════════════
const ADMISSION={
  'adm2627-ug':{badge:'2026–27 · UG Admissions',title:'UG Admissions 2026–27',subtitle:'B.Ed Integrated & Law Programmes · CUET-UG',desc:'Undergraduate admissions for 2026–27 will be conducted through CUET-UG by NTA. Notifications are expected in early 2026.',list:['B.A. B.Ed. (Integrated) — 4 Years · 50 Seats','B.Sc. B.Ed. (Integrated) — 4 Years · 50 Seats','B.A. LL.B. (Hons.) — 5 Years · 60 Seats','BBA LL.B. (Hons.) — 5 Years · 60 Seats','Admission via CUET-UG score (NTA)','Eligibility: 10+2 with min. 50% (45% SC/ST/PwD)']},
  'adm2627-pg':{badge:'2026–27 · PG Admissions',title:'PG Admissions 2026–27',subtitle:'M.A · M.Sc · M.Pharm · LL.M · CUET-PG',desc:'PG admissions for 2026–27 will be through CUET-PG. Detailed notifications will be released on the official website.',list:['M.A. (Hindi, English, History, Pol. Science, Economics, IR, Dev. Studies, MJMC)','M.Sc. (Biotechnology, Environmental Science, CS, Mathematics)','M.Pharm — PCI Approved (via GPAT/CUET)','LL.M. — 1 Year, BCI Approved','Eligibility: Bachelor\'s with min. 55% (50% SC/ST)','Admission through CUET-PG score (NTA)']},
  'adm2627-phd':{badge:'2026–27 · Ph.D Admissions',title:'Ph.D Admissions 2026–27',subtitle:'All Departments · CUSB Entrance Test',desc:'Ph.D admissions for 2026–27 will be through CUSB-ET followed by interview. UGC-NET/JRF/GATE holders may be exempted from written test.',list:['Ph.D in Sciences — Biotech, Chemistry, Physics, Maths, CS, Env. Science','Ph.D in Humanities & Social Sciences','Ph.D in Law — Constitutional, Criminal, International Law','Eligibility: Master\'s with 55% marks (50% SC/ST)','UGC-NET/JRF/GATE holders may get written test exemption','Fellowship: JRF/SRF, ICSSR, DST-INSPIRE available']},
  'adm2627-schedule':{badge:'2026–27 · Key Dates',title:'Admission Schedule 2026–27',subtitle:'Important Dates & Deadlines (Indicative)',desc:'The admission schedule for 2026–27 is subject to NTA/UGC/CUSB announcements. Dates are indicative based on previous year patterns.',list:['CUET-UG/PG Registration: Feb–March 2026 (expected)','CUET-UG Exam: May 2026 (tentative)','CUET-PG Exam: March–April 2026 (tentative)','CUSB Merit List / Allotment: June–July 2026','Document Verification & Fee Payment: July 2026','Session Commencement: August 2026']},
  'adm2627-fee':{badge:'2026–27 · Fees',title:'Fee Structure 2026–27',subtitle:'Programme-wise Fee Details (Indicative)',desc:'Fee structure for 2026–27 will be notified at admission time. Indicative fees based on 2025–26 are listed below. SC/ST/PwD may be eligible for full fee waiver.',list:['UG Law (LL.B.): ~₹15,000–18,000 per semester','M.A. / M.Sc. Programmes: ~₹8,000–12,000 per semester','M.Pharm: ~₹20,000–25,000 per semester','LL.M.: ~₹15,000 (full year)','Ph.D: ~₹10,000–15,000 per year','SC/ST/PwD: Fee waiver as per UGC norms']},
  'adm2627-prospectus':{badge:'2026–27 · Prospectus',title:'Prospectus 2026–27',subtitle:'Official Brochure — Releasing Soon',desc:'The official CUSB Prospectus for 2026–27 will be available for download from the official university website once released.',list:['Programme details for all UG, PG & Ph.D courses','Eligibility criteria and entrance test details','Fee structure and scholarship information','Hostel and campus facilities guide','Reservation and relaxation policy details','Contact details for all departments and offices']},
  'adm2526-ug':{badge:'2025–26 · UG Admissions',title:'UG Admissions 2025–26',subtitle:'B.Ed Integrated & Law Programmes · CUET-UG',desc:'UG admissions for 2025–26 are conducted through CUET-UG (NTA). Seat allotment is based on CUET score, category, and programme preference.',list:['B.A. B.Ed. (Integrated) — 50 Seats','B.Sc. B.Ed. (Integrated) — 50 Seats','B.A. LL.B. (Hons.) — 60 Seats','BBA LL.B. (Hons.) — 60 Seats','Allotment based on CUET-UG score + category','Eligibility: 10+2 with min. 50% (45% SC/ST/PwD)']},
  'adm2526-pg':{badge:'2025–26 · PG Admissions',title:'PG Admissions 2025–26',subtitle:'M.A · M.Sc · M.Pharm · LL.M · CUET-PG',desc:'PG admissions for 2025–26 are underway through CUET-PG. Students must have applied through NTA CUET-PG portal and selected CUSB as preferred university.',list:['M.A. programmes: 25–30 seats each','M.Sc. programmes: 20–30 seats each','M.Pharm: 15 seats (via GPAT/CUET)','LL.M.: 30 seats (BCI Approved)','Eligibility: Bachelor\'s with min. 55% marks','Admission via CUET-PG score and merit list']},
  'adm2526-phd':{badge:'2025–26 · Ph.D Admissions',title:'Ph.D Admissions 2025–26',subtitle:'All Departments · CUSB Entrance Test',desc:'Ph.D admissions for 2025–26 were conducted through CUSB-ET followed by a personal interview. Admitted scholars have commenced their coursework.',list:['All departments open for Ph.D research','Written test + interview based selection','UGC-NET JRF holders: direct interview eligible','Fellowship: JRF, SRF, ICSSR, DST available','Research supervisors available across all schools','Coursework commenced: August 2025']},
  'adm2526-cuet':{badge:'2025–26 · CUET',title:'CUET Information',subtitle:'Common University Entrance Test · NTA',desc:'CUSB follows CUET for UG and PG admissions as mandated by UGC. CUET is conducted by NTA and scores are valid for a single academic session.',list:['CUET-UG: For B.Ed and Law UG programmes','CUET-PG: For all M.A., M.Sc., LL.M. programmes','Conducted by NTA — National Testing Agency','Register at: cuet.nta.nic.in','CUET score used for merit-based allotment','No separate entrance test by CUSB for UG/PG']},
  'adm2526-merit':{badge:'2025–26 · Allotment',title:'Merit List & Seat Allotment',subtitle:'Allotment Rounds · 2025–26',desc:'CUSB releases merit lists based on CUET scores and category preferences. Multiple allotment rounds are conducted to fill all seats.',list:['Round 1 Merit List: Released on CUSB website','Round 2 (Spot Round): For unfilled seats','Category-wise merit lists (UR/OBC/SC/ST/EWS/PwD)','Fee payment deadline: within 72 hours of allotment','Original document verification at campus','Allotment cancelled if fee not paid in time']},
  'adm2526-result':{badge:'2025–26 · Results',title:'Admission Results 2025–26',subtitle:'Selected Candidates List',desc:'The list of selected candidates for all programmes in 2025–26 has been published on the official CUSB website.',list:['Results available at www.cusb.ac.in','Programme-wise selected candidates list published','Waiting list candidates notified separately','Document verification schedule released with results','Joining report deadline notified post verification','Contact admissions office for any discrepancies']},
  'intl-overview':{badge:'International · Admissions',title:'International Student Admissions',subtitle:'CUSB welcomes students from across the world',desc:'CUSB welcomes international students under the Ministry of Education\'s Study in India programme. Students can apply for PG and Ph.D programmes subject to qualification equivalence.',list:['Open to students from all countries','Programmes: PG (M.A., M.Sc., LL.M.) and Ph.D','Apply through Study in India portal or direct application','Admission subject to equivalence of qualifications (AIU)','Limited seats reserved for international students','On-campus hostel accommodation available']},
  'intl-eligibility':{badge:'International · Eligibility',title:'Eligibility for International Students',subtitle:'Qualifications Accepted · CUSB',desc:'International students must have qualifications equivalent to Indian degrees as certified by the Association of Indian Universities (AIU).',list:['UG equivalent to Indian 10+2 for UG admission','Bachelor\'s equivalent for PG admission (min. 55%)','AIU equivalence certificate may be required','English medium background or IELTS/TOEFL score','Valid passport and student visa','Medical fitness certificate from recognised authority']},
  'intl-visa':{badge:'International · Visa',title:'Visa & Documentation',subtitle:'Student Visa Requirements · India',desc:'International students are required to obtain a Student Visa (S-Visa) from the Indian Embassy/Consulate in their home country before commencing studies at CUSB.',list:['Obtain Student Visa (S-Visa) from Indian Embassy','Required documents: Admission letter, fee receipt, passport, photos','Apply for FRRO registration within 14 days of arrival','University will provide I-Card and bonafide certificate','Visa extension through FRRO with university support','Health insurance recommended for international students']},
  'intl-fee':{badge:'International · Fees',title:'Fee Structure for International Students',subtitle:'USD / INR Fee Details · CUSB',desc:'International students are charged fees as per CUSB norms for foreign nationals, payable in Indian Rupees (INR) or USD equivalent.',list:['PG Programmes: Approx. $500–800 per year (indicative)','Ph.D Programmes: Approx. $600–1000 per year (indicative)','Hostel charges: INR 15,000–25,000 per semester','Development fee and other charges as applicable','Scholarships available under ICCR and Study in India','Fee structure confirmed at time of admission letter']},
  'prog-overview':{badge:'Programmes · All Courses',title:'All Programmes & Courses',subtitle:'UG · PG · Ph.D · Integrated · CUSB',desc:'CUSB offers a wide range of UG, PG, and doctoral programmes across 10+ Schools of Studies. All programmes are recognised by UGC, BCI, NCTE, and PCI as applicable.',list:['UG: B.A. B.Ed., B.Sc. B.Ed., B.A. LL.B., BBA LL.B.','PG Arts: M.A. (8 programmes) · MJMC','PG Science: M.Sc. (4 programmes) · M.Pharm','PG Law: LL.M. (1 Year)','Ph.D: All departments — Sciences, Humanities, Law','Total: 45+ programmes across 10 Schools']},
  'prog-seats':{badge:'Programmes · Seats',title:'Seats & Reservations',subtitle:'Category-wise Intake · CUSB',desc:'CUSB follows Government of India reservation norms for all programmes as per UGC guidelines.',list:['General / UR: ~50% of total seats','OBC (Non-Creamy Layer): 27% reservation','SC candidates: 15% reservation','ST candidates: 7.5% reservation','EWS (Economically Weaker Section): 10%','PwD (Divyang): 5% horizontal reservation across all categories']},
  'helpdesk':{badge:'Help Desk · Support',title:'Admission Help Desk',subtitle:'Get Support & Guidance · CUSB',desc:'The CUSB Admission Help Desk provides assistance on all matters related to admissions — from eligibility and forms to document verification and fee payment.',list:['Help Desk Email: admissions@cusb.ac.in','Phone: +91-631-2229 539 (Mon–Sat, 10AM–5PM)','Walk-in: Admissions Office, Admin Block, CUSB Campus','Online query form available on official website','Separate helpline for Ph.D admissions','Dedicated support for international students']},
  'helpdesk-faq':{badge:'Help Desk · FAQs',title:'Frequently Asked Questions',subtitle:'Common Questions · CUSB Admissions',desc:'Answers to the most frequently asked questions by prospective CUSB students about the admission process.',list:['Q: How do I apply? → Through CUET portal (cuet.nta.nic.in)','Q: Is there a direct admission? → No, all admissions are through CUET/CUSB-ET','Q: Is there an age limit? → No upper age limit for most programmes','Q: Is hostel available? → Yes, separate hostels for boys and girls on campus','Q: Can I apply for multiple programmes? → Yes, select multiple at CUET stage','Q: When does the session start? → Typically August each year']},
  'helpdesk-contact':{badge:'Help Desk · Contact',title:'Contact Admissions Office',subtitle:'Phone · Email · Office Hours',desc:'The CUSB Admissions Office is in the Administrative Block on the main campus. Contact via phone/email during office hours.',list:['📍 Admissions Office, Admin Block, Panchanpur, Gaya – 824236','📞 Phone: +91-631-2229 539','✉️ Email: admissions@cusb.ac.in','🌐 Website: www.cusb.ac.in','🕐 Office Hours: Mon–Sat, 10:00 AM – 5:00 PM (except holidays)','For Ph.D queries: research@cusb.ac.in']},
};

// ═══════════════ DIGNITARY DATA ═══════════════
const DIGNITARIES={
  president:{
    photo:'https://i.postimg.cc/d3xNXGLJ/PRESIDENTIMAGE.jpg', initials:'DM', initialsColor:'linear-gradient(135deg,#b8860b,#ffd700)',
    badge:'Hon\'ble Visitor · CUSB', badgeColor:'rgba(255,215,0,0.15)', badgeBorder:'rgba(255,215,0,0.4)', badgeText:'#ffd700',
    role:'President of India · Visitor, All Central Universities',
    name:'Smt. Droupadi Murmu', titleSm:'15th President of the Republic of India',
    heading:'Smt. Droupadi Murmu', sub:'Hon\'ble President of India · Visitor, CUSB',
    stats:[{val:'15th',lbl:'President of India'},{val:'2022',lbl:'Assumed Office'},{val:'Visitor',lbl:'All Central Universities'}],
    sections:[
      {title:'About',text:'Smt. Droupadi Murmu is the 15th President of the Republic of India, assuming office on 25 July 2022. She is the first tribal woman and the second woman to hold the nation\'s highest constitutional office. Born on 20 June 1958 in Uparbeda village, Mayurbhanj district, Odisha, she has dedicated her life to public service and the empowerment of tribal communities.'},
      {title:'Early Life & Education',text:'She completed her schooling from Shri Aurobindo Integral Education Centre, Rairangpur, and graduated in Arts from Rama Devi Women\'s College, Bhubaneswar — one of the first women from her village to pursue higher education. Her journey from a remote tribal village to the Rashtrapati Bhavan is a testament to perseverance and determination.'},
      {title:'Political & Public Career',text:'Smt. Murmu served as a teacher before entering public life. She was elected to the Odisha Legislative Assembly twice (2000, 2004) from Rairangpur constituency. She served as Minister of State (Independent Charge) for Commerce, Transport and later for Fisheries & Animal Resources Development in the Odisha government. She served as Governor of Jharkhand from 2015 to 2021 with distinction.'},
      {title:'Role as Visitor of CUSB',text:'As President of India, Smt. Droupadi Murmu is the Visitor of all Central Universities including CUSB, as provided under the Central Universities Act, 2009. In this capacity, she holds the supreme oversight of the university and her guidance inspires the institution\'s commitment to inclusive, quality education for all, especially for students from underprivileged backgrounds.'},
    ],
    tags:['President of India','15th President','Tribal Leader','Odisha','Jharkhand Governor','Women Empowerment','Central Universities Visitor']
  },
  chancellor:{
    photo:'https://i.postimg.cc/x8CFt6Tk/CHANCELLORIMAGE.jpg', initials:'CT', initialsColor:'linear-gradient(135deg,#1565c0,#6ec6ff)',
    badge:'Chancellor · CUSB', badgeColor:'rgba(100,200,255,0.12)', badgeBorder:'rgba(100,200,255,0.4)', badgeText:'#6ec6ff',
    role:'Chancellor, Central University of South Bihar',
    name:'Dr. C. P. Thakur', titleSm:'Chancellor, CUSB · Former Union Minister of Health',
    heading:'Dr. Chandra Prakash Thakur', sub:'Chancellor · Central University of South Bihar',
    stats:[{val:'Chancellor',lbl:'CUSB'},{val:'Ex-Minister',lbl:'Health & Family Welfare'},{val:'Physician',lbl:'& Academician'}],
    sections:[
      {title:'About',text:'Dr. Chandra Prakash Thakur is a distinguished physician, academician, and statesman who has made remarkable contributions to Indian healthcare, politics, and education. As Chancellor of the Central University of South Bihar, he provides strategic and visionary leadership to one of India\'s premier central universities.'},
      {title:'Medical & Academic Career',text:'Dr. Thakur is a trained medical professional with decades of experience in clinical medicine and public health. He has been associated with several academic and research institutions, contributing to the advancement of medical education and healthcare policy in India. His expertise spans medicine, public administration, and institutional governance.'},
      {title:'Political & Public Service',text:'Dr. C. P. Thakur served as the Union Minister of Health and Family Welfare, Government of India, contributing significantly to national health policy, immunisation programmes, and healthcare infrastructure. He has been a Member of Parliament and has represented Bihar with distinction at the national level. His legislative experience and administrative acumen make him an ideal leader for CUSB.'},
      {title:'Role as Chancellor of CUSB',text:'As Chancellor of CUSB, Dr. Thakur presides over the Court — the supreme governing body of the university. He provides direction for academic excellence, research advancement, and institutional development. Under his chancellorship, CUSB has achieved NAAC accreditation, improved NIRF rankings, and expanded its academic and research footprint significantly.'},
    ],
    tags:['Chancellor CUSB','Physician','Union Minister','Bihar','Parliament','Health Policy','Academic Leadership']
  },
  vc:{
    photo:'https://i.postimg.cc/2y6X208k/VCIMAGE.jpg', initials:'KS', initialsColor:'linear-gradient(135deg,#00897b,#69f0ae)',
    badge:'Vice Chancellor · CUSB', badgeColor:'rgba(105,240,174,0.12)', badgeBorder:'rgba(105,240,174,0.4)', badgeText:'#69f0ae',
    role:'Vice Chancellor, Central University of South Bihar',
    name:'Prof. K. N. Singh', titleSm:'Vice Chancellor, CUSB · Professor of Economics',
    heading:'Prof. Kameshwar Nath Singh', sub:'Vice Chancellor · Central University of South Bihar',
    stats:[{val:'VC',lbl:'CUSB'},{val:'NAAC A++',lbl:'Achieved under tenure'},{val:'IIT Patna',lbl:'MoU Collaboration'}],
    sections:[
      {title:'About',text:'Prof. Kameshwar Nath Singh is a distinguished economist and academic administrator who serves as the Vice Chancellor of the Central University of South Bihar. With an illustrious academic career spanning several decades, he brings expertise in economics, development studies, and institutional management to the role.'},
      {title:'Academic & Research Background',text:'Prof. K. N. Singh holds a Ph.D. in Economics and has contributed extensively to research in development economics, rural economics, and policy studies. He has published numerous research papers in national and international journals and has guided several doctoral scholars. His academic profile reflects a deep commitment to advancing the frontiers of knowledge in social sciences.'},
      {title:'Administrative Leadership',text:'As Vice Chancellor, Prof. Singh oversees all academic, administrative, and financial operations of CUSB. Under his leadership, the university has: achieved NAAC accreditation, improved NIRF rankings (151–200 overall, #23 in Law, #63 in Pharmacy), signed an MoU with IIT Patna for joint research, expanded programmes across multiple schools, and built a culture of research and innovation on campus.'},
      {title:'Vision for CUSB',text:'Prof. Singh\'s vision for CUSB is to transform it into a world-class centre of learning and research that serves the educational aspirations of the people of Bihar and contributes to national development. He is particularly focused on inclusive education, research output, industry-academia linkages, and digital transformation of the university\'s academic ecosystem.'},
    ],
    tags:['Vice Chancellor','Economist','CUSB Leadership','Academic Administrator','Research','Development Studies','NAAC','NIRF']
  }
};

function openDignModal(id){
  const d=DIGNITARIES[id]; if(!d)return;
  // photo
  const ph=document.getElementById('dmPhoto');
  const init=document.getElementById('dmInitials');
  init.textContent=d.initials; init.style.background=d.initialsColor;
  if(d.photo){
    ph.src=d.photo; ph.alt=d.name; ph.style.display='block'; init.style.display='none';
  } else {
    ph.removeAttribute('src'); ph.style.display='none'; init.style.display='flex';
  }
  // badge
  const badge=document.getElementById('dmBadge');
  badge.textContent=d.badge; badge.style.background=d.badgeColor;
  badge.style.border=`1px solid ${d.badgeBorder}`; badge.style.color=d.badgeText;
  // meta
  document.getElementById('dmRole').textContent=d.role;
  document.getElementById('dmName').textContent=d.name;
  document.getElementById('dmTitleSm').textContent=d.titleSm;
  document.getElementById('dmHeading').textContent=d.heading;
  document.getElementById('dmSub').textContent=d.sub;
  // stats
  document.getElementById('dmStats').innerHTML=d.stats.map(s=>`
    <div class="dign-modal-stat">
      <div class="dign-modal-stat-val">${s.val}</div>
      <div class="dign-modal-stat-lbl">${s.lbl}</div>
    </div>`).join('');
  // sections + tags
  document.getElementById('dmSections').innerHTML=
    d.sections.map(sec=>`
      <div class="dign-modal-section">
        <div class="dign-modal-section-title">${sec.title}</div>
        <div class="dign-modal-text">${sec.text}</div>
      </div>`).join('')+
    `<div class="dign-modal-section">
       <div class="dign-modal-section-title">Areas & Associations</div>
       <div class="dign-modal-tags">${d.tags.map(t=>`<span class="dign-modal-tag">${t}</span>`).join('')}</div>
     </div>`;
  document.getElementById('dignModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeDignModal(){document.getElementById('dignModalOverlay').classList.remove('open');document.body.style.overflow='';}
function closeDignOnOverlay(e){if(e.target===document.getElementById('dignModalOverlay'))closeDignModal();}

// add Escape key support for dign modal
const _origKeydown=document.onkeydown;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDignModal();});

// ═══════════════ STUDENT CORNER DATA ═══════════════
const STUDENT={
  'dept-prog':{badge:'Student Corner · Academics',title:'Departments & Programmes',subtitle:'Schools of Study · All Programmes · CUSB',desc:'CUSB is organized into 10+ Schools of Study spanning Sciences, Humanities, Law, Education, Journalism, and Health Sciences. Each school houses multiple departments offering UG, PG, and Ph.D programmes.',list:['School of Humanities & Languages — Hindi, English','School of Social Sciences & Policy — Pol. Sci., Economics, Dev. Studies, IR','School of Law & Governance — B.A. LL.B., BBA LL.B., LL.M.','School of Earth, Biological & Environmental Sciences — Biotech, Env. Sci.','School of Mathematical Sciences & Computer Science','School of Journalism & Mass Communication — MJMC','School of Education — B.A. B.Ed., B.Sc. B.Ed.','School of Health Sciences — M.Pharm','School of Management Studies','Ph.D across all schools | 45+ programmes total']},
  'exam-notices':{badge:'Student Corner · Notices',title:'Academics / Examination Notices',subtitle:'Official Academic Notifications · CUSB',desc:'All academic and examination-related notices, circulars, and orders issued by the Controller of Examinations and the Academic Section of CUSB are published here. Students are advised to check regularly.',list:['Examination schedule announcements','Hall ticket / Admit card notifications','Results and re-evaluation notices','Internal assessment circulars','Academic calendar updates','Fee payment deadlines and reminders','Examination centre and rule notifications','Special / Back paper exam notifications']},
  'sem-schedule':{badge:'Student Corner · Exams',title:'Semester Exam Schedule',subtitle:'Date Sheet · Timetable · CUSB',desc:'The semester examination schedule (date sheet) for all programmes is published by the Controller of Examinations, CUSB before each examination cycle. Students must carry valid admit cards to all examinations.',list:['Odd Semester (Nov–Dec) & Even Semester (Apr–May) exams','Separate schedules for UG, PG, and Ph.D coursework','End-semester theory and practical exam timetables','Published on official website 3–4 weeks before exams','Admit cards issued online through student portal','Changes/postponements notified via official circular','Back paper / Ex-student exam schedules published separately','Contact: Controller of Examinations, CUSB']},
  'ordinance':{badge:'Student Corner · Regulations',title:'Ordinance / Manual / Regulation',subtitle:'Academic Framework & Rules · CUSB',desc:'CUSB follows a comprehensive set of Ordinances, Manuals, and Regulations that govern academic programmes, examinations, conduct, and administration. These are approved by the Academic Council and Executive Council.',list:['Academic Ordinances — Programme structure, credit system, grading','Examination Regulations — Conduct, evaluation, re-totalling','Ph.D Regulations — Admission, coursework, thesis, viva','Hostel Manual — Allotment, rules, disciplinary procedures','Anti-Ragging Policy as per UGC/Supreme Court guidelines','Service Rules and Conduct Regulations for students','Grievance Redressal Procedures and mechanisms','Available for download from CUSB official website']},
  'sem-result':{badge:'Student Corner · Results',title:'Semester Results',subtitle:'Result Portal · Marksheets · CUSB',desc:'Semester examination results for all programmes are published on the official CUSB website and student portal. Students may apply for re-evaluation or re-totalling within the stipulated time after result declaration.',list:['Results published on: www.cusb.ac.in / student portal','Programme-wise, semester-wise results available online','CGPA and SGPA calculated as per UGC CBCS norms','Provisional marksheets available after result declaration','Original marksheets issued at Examination Section','Re-evaluation / Re-totalling: Apply within 15 days of result','Back paper eligibility determined post-result publication','Contact: Controller of Examinations for discrepancies']},
  'prospectus':{badge:'Student Corner · Prospectus',title:'Prospectus',subtitle:'Official Programme Brochure · CUSB',desc:'The CUSB Prospectus is the official brochure containing comprehensive information about all programmes, admission procedures, fee structure, hostel facilities, scholarships, and campus life.',list:['Available for download from official CUSB website','Contains all UG, PG, and Ph.D programme details','Eligibility criteria and entrance test information','Fee structure and payment procedures','Scholarship and fellowship details','Campus map, hostel, and infrastructure information','Rules, regulations, and code of conduct','Contact information for all offices and departments']},
  'course-syllabus':{badge:'Student Corner · Curriculum',title:'Course Structure & Syllabus',subtitle:'Curriculum · Credit Framework · CUSB',desc:'CUSB follows the Choice Based Credit System (CBCS) as mandated by UGC. Course structures and syllabi for all programmes are approved by the Academic Council and are available for download.',list:['CBCS-based curriculum with Core, Elective & Skill courses','Syllabi available for all UG, PG, and Ph.D programmes','Credit requirements: UG (140 credits), PG (80 credits)','Semester-wise course distribution and credit load','Internal assessment + End-semester examination pattern','Programme-specific project, dissertation, and internship details','Syllabi downloadable from departmental / official pages','Revised as per NEP 2020 and UGC guidelines']},
  'download-formats':{badge:'Student Corner · Downloads',title:'Download (Format / Proforma)',subtitle:'Official Forms & Templates · CUSB',desc:'All official forms, formats, and proformas required by students for various academic and administrative purposes are available for download from the CUSB website.',list:['Leave application format','Re-evaluation / Re-totalling application form','Migration certificate application','Character / Conduct certificate request form','Ph.D thesis submission and pre-submission formats','Hostel allotment and hostel leave application','Scholarship and fellowship application formats','Anti-ragging and grievance complaint formats']},
  'scholarship':{badge:'Student Corner · Financial Aid',title:'Scholarship & Fellowship',subtitle:'Merit · SC/ST · UGC · ICSSR · DST · CUSB',desc:'CUSB students are eligible for a range of scholarships and fellowships from the Government of India, UGC, ICSSR, DST, and state governments. The university actively assists students in availing these opportunities.',list:['UGC Non-NET Fellowship for PG students (selected)','ICSSR Doctoral Fellowship for Social Sciences Ph.D scholars','DST-INSPIRE Fellowship for Science Ph.D scholars','National Fellowship for SC/ST candidates (UGC)','Prime Minister\'s Scholarship schemes (various)','State Government scholarships (Bihar government portals)','JRF/SRF via CSIR/UGC NET for eligible research scholars','CUSB Merit-based awards and book grants (internal)']},
  'hostel':{badge:'Student Corner · Accommodation',title:'Hostel',subtitle:'On-Campus Accommodation · CUSB, Gaya',desc:'CUSB provides on-campus hostel facilities for both male and female students on its Panchanpur, Gaya campus. Hostel allotment is merit-cum-distance based and is subject to seat availability.',list:['Separate Boys\' and Girls\' Hostels on campus','Allotment: Merit-cum-distance from home district basis','Rooms: Single and twin-sharing options available','Facilities: Dining hall, reading room, Wi-Fi, sports area','Hostel fee payable each semester with university fees','Hostel warden and caretaker available round the clock','Strict compliance with Hostel Manual and university rules','Anti-ragging and women safety measures in place']},
  'convocation':{badge:'Student Corner · Convocation',title:'Convocation',subtitle:'Annual Degree Ceremony · CUSB',desc:'The annual Convocation is the most prestigious academic ceremony of CUSB, where degrees are conferred on graduating students. The event is graced by the Hon\'ble Chancellor and other dignitaries.',list:['Annual Convocation ceremony held every year','Degrees conferred to UG, PG, and Ph.D graduates','Presided over by the Chancellor, CUSB','Gold medals and awards presented to toppers','Convocation registration open to eligible graduates','Provisional certificates provided before convocation','Official Convocation dress (academic regalia) required','Details and registration on CUSB official website']},
  'placement':{badge:'Student Corner · Careers',title:'Placement Cell',subtitle:'Campus Placements · Career Guidance · CUSB',desc:'The CUSB Placement Cell facilitates campus recruitment drives, career counselling, and industry-academia interaction to help students secure employment opportunities after graduation.',list:['Dedicated Placement Officer and Placement Committee','Annual campus placement drives with leading recruiters','Career counselling and resume building workshops','Internship facilitation for PG and UG students','136 students placed in 2023 — highest package ₹8 LPA','Sectors: Banking, Education, Law, Media, IT, Government','Mock interviews and aptitude training sessions','Students may register with placement cell for drives']},
  'counselling':{badge:'Student Corner · Well-being',title:'Students Counselling & Well-being Centre',subtitle:'Mental Health · Academic Guidance · CUSB',desc:'The Students Counselling and Well-being Centre at CUSB provides confidential psychological support, academic guidance, and wellness services to all enrolled students.',list:['Qualified professional counsellors on campus','Individual counselling sessions (confidential)','Group sessions on stress management, anxiety, career planning','Academic mentoring and guidance services','Referral system for specialized psychiatric support','Awareness workshops on mental health and well-being','Special support for first-generation university students','Contact: counselling@cusb.ac.in or visit Admin Block']},
  'dace':{badge:'Student Corner · Continuing Education',title:'DACE — Directorate of Adult & Continuing Education',subtitle:'Lifelong Learning · CUSB',desc:'The Directorate of Adult and Continuing Education (DACE) at CUSB promotes lifelong learning, outreach programmes, and non-formal education initiatives for working professionals and the wider community.',list:['Certificate and diploma programmes in various disciplines','Outreach programmes for rural and underprivileged communities','Bridge courses for non-traditional learners','Short-term training and professional development courses','Community engagement and extension activities','Collaboration with local bodies and NGOs','Open and distance learning coordination','Contact: DACE Office, CUSB Administrative Block']},
  'skill-dev':{badge:'Student Corner · Skills',title:'Capacity Development & Skill Enhancement Programme',subtitle:'Vocational · Professional · Soft Skills · CUSB',desc:'CUSB offers Capacity Development and Skill Enhancement Programmes (CDSEP) under UGC guidelines to equip students with vocational, professional, and soft skills alongside their academic programmes.',list:['Mandatory skill-based courses under CBCS/NEP framework','Communication and Presentation skills','Digital Literacy and Computer Applications','Entrepreneurship and Start-up orientation','Legal Literacy and Consumer Awareness','Environmental Awareness and Sustainability','Research Methodology and Statistical Tools','Language Proficiency Enhancement (Hindi/English)']},
  'alumni':{badge:'Student Corner · Alumni',title:'Alumni',subtitle:'CUSB Alumni Network & Association',desc:'CUSB has a growing and active alumni network spread across India and abroad. Alumni contribute to the university\'s growth through mentorship, industry connect, and community engagement.',list:['CUSB Alumni Association — formally registered body','Annual Alumni Meet organized on campus','Alumni mentorship programme for current students','Alumni contributions to placement and industry connect','Alumni in civil services, academia, judiciary, media & research','Stay connected: alumni@cusb.ac.in','Alumni achievements and success stories on CUSB website','Register with the Alumni Association through official portal']},
  'nss':{badge:'Student Corner · NSS',title:'National Service Scheme (NSS)',subtitle:'Service to Society · CUSB NSS Unit',desc:'The NSS Unit of CUSB organizes regular service activities, special camps, awareness programmes, and community outreach initiatives under the Ministry of Youth Affairs & Sports, Government of India.',list:['Active NSS Unit with Programme Officers on campus','Regular activities: cleanliness drives, blood donation, tree plantation','Annual Special NSS Camp (7 days, adopted village)','Awareness campaigns: voter registration, digital India, health','NSS certificate issued after completion of 240 hours','NSS volunteers eligible for special recognition in convocation','NCC/NSS achievements considered in admission processes','Contact: NSS Programme Officer, Student Welfare Office']},
  'ncc':{badge:'Student Corner · NCC',title:'National Cadet Corps (NCC)',subtitle:'Discipline · Leadership · Service · CUSB',desc:'The NCC Unit at CUSB trains students in discipline, leadership, and national service under the Directorate General NCC. Cadets participate in camps, Republic Day activities, and social initiatives.',list:['NCC Army/Naval/Air Wing units available (subject to intake)','Regular drills, parades, and physical training','Annual Training Camp (ATC) and Combined Annual Training Camp','Republic Day and Independence Day parade contingents','NCC \'B\' and \'C\' Certificate examinations','Preference in government jobs for NCC Certificate holders','Trekking, mountaineering, and adventure activities','Contact: NCC Officer, CUSB Student Welfare Office']},
  'extracurricular':{badge:'Student Corner · Activities',title:'Extracurricular Activities',subtitle:'Sports · Arts · Culture · Clubs · CUSB',desc:'CUSB encourages students to participate in extracurricular activities that foster holistic development. The university organizes Pratibha — the annual cultural festival — and inter-university sports events.',list:['Pratibha — Annual Cultural Festival (music, drama, dance, literary events)','Inter-university and intra-university sports competitions','Annual Sports Meet — athletics, cricket, football, kabaddi, volleyball','Fine arts, photography, and creative writing clubs','Literary and debate societies in departments','Yoga and meditation sessions on campus','Film screening and cultural appreciation programmes','Student council and youth leadership activities']},
  'anti-ragging':{badge:'Student Corner · Safety',title:'Anti-Ragging',subtitle:'Zero Tolerance Policy · CUSB',desc:'CUSB has a strict Zero Tolerance policy against ragging in compliance with UGC Regulations and Supreme Court directives. An Anti-Ragging Committee and Squad are functional on campus round the clock.',list:['Anti-Ragging Committee: Faculty + Administrative members','Anti-Ragging Squad: Active on campus and in hostels','All students must submit Anti-Ragging undertaking at admission','National Anti-Ragging Helpline: 1800-180-5522 (toll free)','Complaints: antiragging@cusb.ac.in','Severe penalties including expulsion for proven ragging','CCTV surveillance in hostel and campus common areas','Ragging-free declaration mandatory for hostel allotment']},
  'code-ethics':{badge:'Student Corner · Conduct',title:'Code of Ethics',subtitle:'Student Conduct & Discipline · CUSB',desc:'CUSB expects all students to adhere to a Code of Ethics that promotes academic integrity, mutual respect, inclusive behaviour, and responsible citizenship. Violations are dealt with by the Discipline Committee.',list:['Academic honesty — no plagiarism, cheating, or malpractice','Respect for diversity — caste, gender, religion, disability','Prohibition of ragging, harassment, and discrimination','Proper use of university property and resources','Adherence to examination rules and academic deadlines','Responsible use of social media and digital platforms','Dress code and conduct norms in classrooms and campus','Disciplinary action: warning → suspension → expulsion']},
  'grievance':{badge:'Student Corner · Grievance',title:'Grievance Redressal Committee for Students',subtitle:'Student Complaints & Redressal · CUSB',desc:'The Grievance Redressal Committee (GRC) for Students ensures that all student complaints and grievances are addressed fairly, transparently, and within a reasonable time frame, in accordance with UGC regulations.',list:['GRC constituted as per UGC Grievance Redressal Regulations','Grievances can be filed online or in writing at the Registrar\'s Office','Categories: Academic, Administrative, Hostel, Harassment, Financial','Response within 15 working days of complaint receipt','Internal Complaints Committee (ICC) for gender-related matters','SC/ST Cell for complaints related to caste-based discrimination','Students may appeal to UGC Grievance Portal if unresolved','Contact: grievance@cusb.ac.in | Student Welfare Office, Admin Block']},
};

function openStudentModal(id){
  const c=STUDENT[id];
  if(!c)return false;
  document.getElementById('iMBadge').textContent=c.badge;
  document.getElementById('iMTitle').textContent=c.title;
  document.getElementById('iMSubtitle').textContent=c.subtitle;
  document.getElementById('iMDesc').textContent=c.desc;
  document.getElementById('iMList').innerHTML=c.list.map(item=>`
    <div class="info-list-item">
      <span class="info-list-icon">✦</span>
      <span>${item}</span>
    </div>
  `).join('');
  document.getElementById('infoModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  return false;
}

function openAdmissionModal(id){
  const c=ADMISSION[id];
  if(!c)return false;
  document.getElementById('iMBadge').textContent=c.badge;
  document.getElementById('iMTitle').textContent=c.title;
  document.getElementById('iMSubtitle').textContent=c.subtitle;
  document.getElementById('iMDesc').textContent=c.desc;
  document.getElementById('iMList').innerHTML=c.list.map(item=>`
    <div class="info-list-item">
      <span class="info-list-icon">✦</span>
      <span>${item}</span>
    </div>
  `).join('');
  document.getElementById('infoModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  return false;
}

/* ══════════════════════════════════════════════════
   DROPDOWN GLOWING PARTICLE SYSTEM
   Canvas-based: each mega-drop gets its own canvas
══════════════════════════════════════════════════ */
(function() {
  'use strict';
  var PARTICLE_COUNT = 22;
  var COLORS = [
    {r:201,g:151,b:43},
    {r:240,g:192,b:96},
    {r:255,g:215,b:110},
    {r:180,g:120,b:30},
  ];
  function rand(a,b){return Math.random()*(b-a)+a;}
  function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}

  function makeParticle(w,h){
    var c=pick(COLORS);
    return {
      x:rand(0,w), y:rand(0,h),
      vx:rand(-0.15,0.15), vy:rand(-0.5,-0.1),
      r:rand(1.3,3.8), alpha:0,
      maxAlpha:rand(0.38,0.72),
      fi:rand(0.005,0.01), fo:rand(0.004,0.008),
      state:'in', hold:rand(60,200),
      cr:c.r, cg:c.g, cb:c.b,
      gs:rand(3,6)
    };
  }

  function initDrop(drop){
    var wrap=document.createElement('div');
    wrap.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:0;border-radius:18px;overflow:hidden;';
    var canvas=document.createElement('canvas');
    canvas.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    wrap.appendChild(canvas);
    drop.insertBefore(wrap,drop.firstChild);

    // ensure mega-inner is above
    var mi=drop.querySelector('.mega-inner');
    if(mi){mi.style.position='relative';mi.style.zIndex='2';}

    var pts=[], raf=null, on=false;

    function resize(){
      canvas.width=drop.offsetWidth||600;
      canvas.height=drop.offsetHeight||300;
    }

    function spawn(){
      pts=[];
      for(var i=0;i<PARTICLE_COUNT;i++){
        var p=makeParticle(canvas.width,canvas.height);
        p.alpha=rand(0,p.maxAlpha*0.6);
        p.state='hold'; p.hold=rand(0,180);
        pts.push(p);
      }
    }

    function frame(){
      if(!on)return;
      var ctx=canvas.getContext('2d');
      var w=canvas.width,h=canvas.height;
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<pts.length;i++){
        var p=pts[i];
        if(p.state==='in'){p.alpha+=p.fi;if(p.alpha>=p.maxAlpha){p.alpha=p.maxAlpha;p.state='hold';}}
        else if(p.state==='hold'){p.hold--;if(p.hold<=0)p.state='out';}
        else{p.alpha-=p.fo;if(p.alpha<=0){pts[i]=makeParticle(w,h);pts[i].state='in';continue;}}
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<-10)p.x=w+10;
        if(p.x>w+10)p.x=-10;
        if(p.y<-20){p.y=h+10;p.x=rand(0,w);}
        // glow halo
        var gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*p.gs);
        gr.addColorStop(0,'rgba('+p.cr+','+p.cg+','+p.cb+','+(p.alpha*0.85)+')');
        gr.addColorStop(0.45,'rgba('+p.cr+','+p.cg+','+p.cb+','+(p.alpha*0.35)+')');
        gr.addColorStop(1,'rgba('+p.cr+','+p.cg+','+p.cb+',0)');
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r*p.gs,0,Math.PI*2);
        ctx.fillStyle=gr; ctx.fill();
        // bright core
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba('+p.cr+','+p.cg+','+p.cb+','+p.alpha+')';
        ctx.fill();
      }
      raf=requestAnimationFrame(frame);
    }

    function start(){
      if(on)return; on=true;
      resize(); if(!pts.length)spawn();
      frame();
    }
    function stop(){
      on=false;
      if(raf){cancelAnimationFrame(raf);raf=null;}
      var ctx=canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    var li=drop.closest ? drop.closest('li') : drop.parentElement;
    if(li){
      li.addEventListener('mouseenter',start);
      li.addEventListener('mouseleave',stop);
    }
  }

  function init(){
    document.querySelectorAll('.nav-mega-drop').forEach(initDrop);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
  else{init();}
})();



/* ========== section ========== */


function openTourModal() {
  const modal = document.getElementById('tourModal');
  const iframe = document.getElementById('tourVideo');
  iframe.src = iframe.getAttribute('data-src'); // loads video only when clicked
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTourModal() {
  const modal = document.getElementById('tourModal');
  const iframe = document.getElementById('tourVideo');
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.4s ease';
  setTimeout(() => {
    modal.classList.remove('active');
    modal.style.opacity = '';
    modal.style.transition = '';
    iframe.src = ''; // stops video completely
    document.body.style.overflow = '';
  }, 400);
}

function toggleSound(e) {
  e.stopPropagation();
  const video = document.getElementById('tourVideo');
  const btn = document.getElementById('soundBtn');
  video.muted = !video.muted;
  btn.textContent = video.muted ? '🔇 Tap to unmute' : '🔊 Sound on';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTourModal();
});


/* ========== section ========== */



  // ═══ MOBILE MENU ═══
  function toggleMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    var btn = document.getElementById('hamburgerBtn');
    if (!menu || !btn) return;
    var isOpen = menu.classList.contains('open');
    if (isOpen) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      menu.style.overflowY = '';
      menu.style.height = '';
    } else {
      menu.classList.add('open');
      btn.classList.add('open');
      document.body.style.overflow = 'hidden';
      menu.style.overflowY = 'auto';
      menu.style.height = '100vh';
    }
  }
  function closeMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    var btn = document.getElementById('hamburgerBtn');
    if (!menu || !btn) return;
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    menu.style.overflowY = '';
    menu.style.height = '';
  }
  function toggleMobileNav(el) {
    var item = el.closest('.mobile-nav-item');
    if (!item) return;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.mobile-nav-item.open').forEach(function(i){ i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  }
  // Close menu on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeMobileMenu(); closeGlobalSearch(); }
  });
  // Close when tapping outside the inner panel
  var mobileMenuEl = document.getElementById('mobileMenu');
  if (mobileMenuEl) {
    mobileMenuEl.addEventListener('click', function(e) {
      if (e.target === this) closeMobileMenu();
    });
  }



/* ========== section ========== */


/* ══════ PRELOADER ══════ */
(function(){
  var pct=0, hidden=false;
  var plBar=document.getElementById('plBar');
  var plPct=document.getElementById('plPct');
  var intv=setInterval(function(){
    pct+=Math.random()*14+7;
    if(pct>=100){ pct=100; clearInterval(intv); setTimeout(hidePreloader,200); }
    if(plBar) plBar.style.width=pct+'%';
    if(plPct) plPct.textContent=Math.round(pct)+'%';
  },100);
  function hidePreloader(){
    if(hidden) return;
    hidden=true;
    var pl=document.getElementById('preloader');
    if(pl){ pl.classList.add('hide'); setTimeout(function(){ if(pl.parentNode) pl.parentNode.removeChild(pl); },700); }
    setTimeout(function(){ var cb=document.getElementById('cookieBanner'); if(cb) cb.classList.add('visible'); },1100);
  }
  window.addEventListener('load', function(){
    clearInterval(intv);
    if(plBar) plBar.style.width='100%';
    if(plPct) plPct.textContent='100%';
    setTimeout(hidePreloader, 120);
  }, { once: true });
})();

/* ══════ SCROLL PROGRESS + BACK TO TOP ══════ */
window.addEventListener('scroll',function(){
  var sp=document.getElementById('scroll-progress');
  var btt=document.getElementById('backToTop');
  var scrolled=window.pageYOffset||document.documentElement.scrollTop;
  var total=document.documentElement.scrollHeight-window.innerHeight;
  if(sp) sp.style.width=(total>0?scrolled/total*100:0)+'%';
  if(btt){ if(scrolled>450){btt.classList.add('visible');}else{btt.classList.remove('visible');} }
},{passive:true});

/* ══════ TYPING ANIMATION ══════ */
(function(){
  var words=['Excellence','Innovation','Leadership','Research','Your Future',"Bihar's Pride",'Discovery'];
  var wi=0,ci=0,deleting=false;
  var el=document.getElementById('heroTypingWord');
  if(!el)return;
  function type(){
    var word=words[wi];
    if(!deleting){ el.textContent=word.slice(0,++ci); if(ci===word.length){deleting=true;setTimeout(type,1900);return;} }
    else{ el.textContent=word.slice(0,--ci); if(ci===0){deleting=false;wi=(wi+1)%words.length;setTimeout(type,320);return;} }
    setTimeout(type,deleting?55:88);
  }
  setTimeout(type,1400);
})();

/* ══════ ANIMATED STAT COUNTERS ══════ */
(function(){
  var statItems=document.querySelectorAll('.stat-item');
  if(!statItems.length)return;
  var stats=[
    {target:8000,suffix:'+',label:'Students Enrolled'},
    {target:120,suffix:'+',label:'Expert Faculty'},
    {target:45,suffix:'+',label:'Academic Programs'},
    {target:15,suffix:'+',label:'Years of Excellence'}
  ];
  var animated=false;
  function animateStats(){
    if(animated)return; animated=true;
    statItems.forEach(function(item,i){
      var numEl=item.querySelector('.stat-num');
      if(!numEl||!stats[i])return;
      var s=stats[i];
      var current=0;
      var step=s.target/70;
      var intv=setInterval(function(){
        current=Math.min(current+step,s.target);
        numEl.textContent=(current>=1000?(Math.round(current/100)/10).toFixed(0)+','+String(Math.round(current)).slice(-3):Math.round(current))+s.suffix;
        if(current>=s.target)clearInterval(intv);
      },22);
    });
  }
  var bar=document.querySelector('.stats-bar');
  if(!bar){return;}
  var obs=new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){animateStats();obs.disconnect();}
  },{threshold:0.3});
  obs.observe(bar);
})();

/* ══════ TESTIMONIALS CAROUSEL ══════ */
(function(){
  var track=document.getElementById('testimonialTrack');
  var dots=document.querySelectorAll('#tnsDots .tns-dot');
  if(!track)return;
  var idx=0;
  var total=track.children.length;
  function update(){
    var cardW=380+24;
    track.style.transform='translateX(-'+idx*cardW+'px)';
    dots.forEach(function(d,i){d.classList.toggle('active',i===idx);});
  }
  window.slideTestimonials=function(dir){ idx=(idx+dir+total)%total; update(); };
  window.goToTestimonial=function(i){ idx=i; update(); };
  setInterval(function(){ idx=(idx+1)%total; update(); },4800);
})();

/* ══════ GLOBAL SEARCH — FULLY FUNCTIONAL ══════ */

/* scrollTo: smooth-scroll to a section by ID, offset for fixed nav */
function searchScrollTo(id){
  closeGlobalSearch();
  setTimeout(function(){
    var el=document.getElementById(id);
    if(!el) return;
    var navH=(document.querySelector('nav')||{offsetHeight:70}).offsetHeight||70;
    var top=el.getBoundingClientRect().top+window.pageYOffset-navH-16;
    window.scrollTo({top:top,behavior:'smooth'});
  },260);
}

var CUSB_SEARCH_DATA = [
  /* ── Programmes → scroll to #programs ── */
  {cat:'Programme', name:'M.Sc. Computer Science',       keywords:'msc computer science cs tech programming',          go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Development Studies',     keywords:'ma development studies social welfare',             go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Economics',               keywords:'ma economics finance micro macro',                  go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. English',                 keywords:'ma english literature language writing',            go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Hindi',                   keywords:'ma hindi language literature sahitya',              go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. History',                 keywords:'ma history ancient medieval modern',                go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Political Science',       keywords:'ma political science governance polity',            go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Sociology',               keywords:'ma sociology social anthropology',                  go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Geography',               keywords:'ma geography geospatial gis mapping',              go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.Sc. Environmental Science',  keywords:'msc environmental science ecology nature',          go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.Sc. Mathematics',            keywords:'msc mathematics stats statistics algebra',          go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'MBA',                          keywords:'mba business administration management',            go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'LL.M. (Law)',                  keywords:'llm law legal jurisprudence',                       go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.Ed. Education',              keywords:'med education teaching pedagogy',                   go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'Ph.D. (All Departments)',      keywords:'phd doctorate research doctoral thesis',            go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Buddhist Studies',        keywords:'ma buddhist studies religion pali',                 go:function(){searchScrollTo('programs');}},
  {cat:'Programme', name:'M.A. Maithili',                keywords:'ma maithili language dialect',                      go:function(){searchScrollTo('programs');}},
  /* ── Admissions ── */
  {cat:'Admission', name:'CUET 2025–26 Apply Now',       keywords:'cuet admission apply 2025 2026 entrance postgraduate',  go:function(){closeGlobalSearch();setTimeout(function(){openInfoModal('upcoming-events');},300);}},
  {cat:'Admission', name:'Ph.D Entrance Test 2025',      keywords:'phd entrance test admission research doctoral 2025',    go:function(){closeGlobalSearch();setTimeout(function(){openInfoModal('notices');},300);}},
  {cat:'Admission', name:'Eligibility Criteria',         keywords:'eligibility criteria requirement qualification',         go:function(){searchScrollTo('academics');}},
  {cat:'Admission', name:'Fee Structure',                keywords:'fee structure tuition cost charges',                     go:function(){searchScrollTo('academics');}},
  {cat:'Admission', name:'Scholarship & Fellowship',     keywords:'scholarship fellowship financial aid stipend merit',     go:function(){searchScrollTo('scholarships');}},
  /* ── Student Services ── */
  {cat:'Student',   name:'Semester Result Portal',       keywords:'result semester exam marks grade portal score',  go:function(){closeGlobalSearch();setTimeout(function(){openStudentModal('sem-result');},300);}},
  {cat:'Student',   name:'Scholarships',                 keywords:'scholarship fellowship financial aid stipend',    go:function(){searchScrollTo('scholarships');}},
  {cat:'Student',   name:'Hostel Facilities',            keywords:'hostel accommodation boys girls residence living dorm', go:function(){searchScrollTo('syl-sec');}},
  {cat:'Student',   name:'Placements & Career Cell',     keywords:'placement career job internship hire recruit',    go:function(){searchScrollTo('placements');}},
  {cat:'Student',   name:'Sports & Cultural',            keywords:'sports cultural activities fest events nss ncc',  go:function(){searchScrollTo('syl-sec');}},
  {cat:'Student',   name:'Library & Resources',          keywords:'library books journal digital resource e-library',go:function(){searchScrollTo('syl-sec');}},
  /* ── Academics ── */
  {cat:'Academic',  name:'Departments & Schools',        keywords:'department school centre academics curriculum',   go:function(){searchScrollTo('academics');}},
  {cat:'Academic',  name:'Faculty Members',              keywords:'faculty professor teacher staff academic',        go:function(){searchScrollTo('faculty');}},
  {cat:'Academic',  name:'Academic Calendar',            keywords:'academic calendar schedule semester dates exam important',       go:function(){closeGlobalSearch();setTimeout(function(){document.getElementById('acal-sec').scrollIntoView({behavior:'smooth'});},300);}},
  {cat:'Academic',  name:'Syllabus & Courses',           keywords:'syllabus course curriculum programme structure',  go:function(){searchScrollTo('syl-sec');}},
  /* ── Research ── */
  {cat:'Research',  name:'Research Overview',            keywords:'research innovation publication project grant',   go:function(){searchScrollTo('research');}},
  {cat:'Research',  name:'Central Instrumental Facility',keywords:'cif central instrumental facility lab equipment', go:function(){closeGlobalSearch();setTimeout(function(){openResearchModal('cif');},300);}},
  {cat:'Research',  name:'Funded Projects & Grants',     keywords:'funded project grant dbt dst icssr ug research',  go:function(){searchScrollTo('research');}},
  /* ── Info ── */
  {cat:'Notice',    name:'Notices & Circulars',          keywords:'notice circular announcement official tender',    go:function(){closeGlobalSearch();setTimeout(function(){openInfoModal('notices');},300);}},
  {cat:'Info',      name:'About CUSB',                   keywords:'about university history overview established 2009 gaya', go:function(){searchScrollTo('heroSticky');}},
  {cat:'Info',      name:'News & Events',                keywords:'news events latest update announcement',          go:function(){searchScrollTo('news')? null : searchScrollTo('testimonials');}},
  {cat:'Info',      name:'Testimonials',                 keywords:'testimonials alumni review student feedback',     go:function(){searchScrollTo('testimonials');}},
  {cat:'Info',      name:'Contact & Helpdesk',           keywords:'contact helpdesk phone email address enquiry',   go:function(){closeGlobalSearch();setTimeout(function(){openInfoModal('helpdesk-contact');},300);}},
  {cat:'Info',      name:'Upcoming Events',              keywords:'events seminar workshop conference symposium upcoming', go:function(){closeGlobalSearch();setTimeout(function(){openInfoModal('upcoming-events');},300);}},
  {cat:'Info',      name:'NIRF Rankings',                keywords:'nirf ranking national institutional ranking 2025', go:function(){searchScrollTo('heroSticky');}},
];

function escHTML(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

window.openGlobalSearch=function(){
  var ov=document.getElementById('searchOverlay');
  if(!ov) return;
  ov.classList.add('active');
  setTimeout(function(){
    var inp=document.getElementById('globalSearchInput');
    if(inp){inp.value='';inp.focus();}
    renderSearchResults('');
  },180);
};
window.closeGlobalSearch=function(){
  var ov=document.getElementById('searchOverlay');
  if(ov) ov.classList.remove('active');
};
window.fillSearch=function(term){
  var inp=document.getElementById('globalSearchInput');
  if(inp){inp.value=term;inp.focus();renderSearchResults(term);}
};

function renderSearchResults(query){
  var grid=document.getElementById('searchResultsGrid');
  var countEl=document.getElementById('searchCount');
  if(!grid) return;
  var q=(query||'').toLowerCase().trim();
  var results;
  if(!q){
    /* default: show 6 popular items */
    results=[
      CUSB_SEARCH_DATA.find(function(x){return x.name==='M.Sc. Computer Science';}),
      CUSB_SEARCH_DATA.find(function(x){return x.name==='M.A. Development Studies';}),
      CUSB_SEARCH_DATA.find(function(x){return x.name==='CUET 2025–26 Apply Now';}),
      CUSB_SEARCH_DATA.find(function(x){return x.name==='Notices & Circulars';}),
      CUSB_SEARCH_DATA.find(function(x){return x.name==='Central Instrumental Facility';}),
      CUSB_SEARCH_DATA.find(function(x){return x.name==='Semester Result Portal';})
    ].filter(Boolean);
    if(countEl) countEl.textContent='Popular searches';
  } else {
    results=CUSB_SEARCH_DATA.filter(function(item){
      return item.name.toLowerCase().indexOf(q)!==-1
          || item.keywords.indexOf(q)!==-1
          || item.cat.toLowerCase().indexOf(q)!==-1;
    });
    if(countEl) countEl.textContent=results.length
      ? results.length+' result'+(results.length===1?'':'s')
      : '';
  }
  if(!results.length){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:32px 0;color:rgba(100,80,50,0.55);font-size:14px;">No results for "<strong style=\'color:var(--gold-mid);\'>'+escHTML(query)+'</strong>"<br><span style="font-size:12px;opacity:0.7;margin-top:6px;display:block;">Try: programs, faculty, hostel, results, PhD…</span></div>';
    return;
  }
  grid.innerHTML=results.map(function(item,idx){
    /* store index so onclick can find it */
    return '<div class="search-result-item" data-sidx="'+idx+'" style="cursor:pointer;" onclick="cusbSearchGo('+CUSB_SEARCH_DATA.indexOf(item)+')">'+
      '<div class="sri-cat">'+escHTML(item.cat)+'</div>'+
      '<div class="sri-name">'+escHTML(item.name)+' <span style="font-size:10px;opacity:0.45;margin-left:3px;">↗</span></div>'+
      '</div>';
  }).join('');
}

/* called from rendered HTML — safe global */
window.cusbSearchGo=function(idx){
  var item=CUSB_SEARCH_DATA[idx];
  if(item&&item.go) item.go();
};

document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openGlobalSearch();}
  if(e.key==='Escape'){closeGlobalSearch();}
});

(function(){
  var ov=document.getElementById('searchOverlay');
  var inp=document.getElementById('globalSearchInput');
  if(ov){ov.addEventListener('click',function(e){if(e.target===ov)closeGlobalSearch();});}
  if(inp){
    inp.addEventListener('input',function(){renderSearchResults(this.value);});
    inp.addEventListener('keydown',function(e){
      if(e.key==='Enter'){
        var q=this.value.trim();
        if(!q) return;
        var first=CUSB_SEARCH_DATA.find(function(item){
          return item.name.toLowerCase().indexOf(q.toLowerCase())!==-1
              || item.keywords.indexOf(q.toLowerCase())!==-1;
        });
        if(first&&first.go) first.go();
      }
    });
  }
})();

/* ══════ QUICK ACTION PANEL ══════ */
var qpOpen=false;
window.toggleQP=function(){
  qpOpen=!qpOpen;
  var toggle=document.getElementById('qpToggle');
  var items=document.getElementById('qpItems');
  if(toggle) toggle.classList.toggle('open',qpOpen);
  if(items) items.classList.toggle('hidden',!qpOpen);
};

/* ══════ COOKIE ══════ */
function _cookieBannerHide(){
  document.documentElement.style.setProperty('--cookie-offset','0px');
}
function _cookieBannerShow(){
  var cb=document.getElementById('cookieBanner');
  if(!cb) return;
  var h=cb.offsetHeight;
  if(h>0) document.documentElement.style.setProperty('--cookie-offset', h+'px');
}
window.acceptCookies=function(){
  var cb=document.getElementById('cookieBanner');
  var panel=document.getElementById('a11y-panel');
  if(cb){ cb.style.transform='translateY(100%)'; setTimeout(function(){cb.style.display='none';},500); }
  if(panel){ panel.classList.remove('cookie-visible'); }
  _cookieBannerHide();
};
/* Also hook decline button to remove cookie-visible */
(function(){
  var declineBtn=document.querySelector('.cookie-decline');
  if(declineBtn){
    declineBtn.onclick=function(){
      document.getElementById('cookieBanner').style.display='none';
      var panel=document.getElementById('a11y-panel');
      if(panel) panel.classList.remove('cookie-visible');
      _cookieBannerHide();
    };
  }
  /* Show cookie banner → raise a11y panel + raise buttons */
  var obs=new MutationObserver(function(){
    var cb=document.getElementById('cookieBanner');
    var panel=document.getElementById('a11y-panel');
    if(!cb||!panel) return;
    var visible=cb.classList.contains('visible')&&cb.style.display!=='none';
    panel.classList.toggle('cookie-visible', visible);
    if(visible){ _cookieBannerShow(); } else { _cookieBannerHide(); }
  });
  var cb=document.getElementById('cookieBanner');
  if(cb) obs.observe(cb,{attributes:true,attributeFilter:['class','style']});
  window.addEventListener('resize',function(){
    var cb=document.getElementById('cookieBanner');
    if(cb&&cb.classList.contains('visible')&&cb.style.display!=='none') _cookieBannerShow();
  },{passive:true});
})();

/* ══════ MOON ORBIT ANIMATION ══════ */
(function(){
  /* Each moon-orbiter gets its own angle, driven by rAF.
     The planet-wrapper already counter-rotates (counterSpin) so the planet
     stays upright. We need to animate the moon-orbiter's rotation
     independently so the moon truly circles the planet regardless of where
     the planet is in its own orbit. */
  var moons = [];
  document.querySelectorAll('.moon-orbiter').forEach(function(el){
    var radius = parseFloat(el.getAttribute('data-moon-radius')) || 26;
    var speed  = parseFloat(el.getAttribute('data-moon-speed'))  || 20; // seconds per revolution
    var body   = el.querySelector('.moon-body');
    if(!body) return;
    moons.push({ el: el, body: body, radius: radius, speed: speed, angle: Math.random()*Math.PI*2 });
  });
  if(!moons.length) return;
  var last = null;
  function tick(ts){
    if(!last) last = ts;
    var dt = (ts - last) / 1000; // seconds
    last = ts;
    moons.forEach(function(m){
      m.angle += (Math.PI * 2 / m.speed) * dt;
      var x = Math.cos(m.angle) * m.radius;
      var y = Math.sin(m.angle) * m.radius;
      /* Position the moon-body relative to planet centre (which is at 0,0 of moon-system) */
      m.body.style.position  = 'absolute';
      m.body.style.top       = '0';
      m.body.style.left      = '0';
      m.body.style.transform = 'translate(calc(-50% + '+x+'px), calc(-50% + '+y+'px))';
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


/* ========== section ========== */


var AS={};try{AS=JSON.parse(localStorage.getItem('cusb_a11y')||'{}');}catch(e){}
var A11Y_MAP={contrast:'a11y-contrast',grey:'a11y-grey',dyslexia:'a11y-dyslexia',guide:'a11y-guide-on',pause:'a11y-pause',focus:'a11y-focus',cursor:'a11y-cursor'};
function a11yApply(){Object.keys(A11Y_MAP).forEach(function(k){var cb=document.getElementById('cb-'+k);if(!cb)return;AS[k]=cb.checked;document.body.classList.toggle(A11Y_MAP[k],cb.checked);});localStorage.setItem('cusb_a11y',JSON.stringify(AS));}
function setSize(s){document.body.classList.remove('a11y-text-md','a11y-text-lg');if(s!=='normal')document.body.classList.add('a11y-text-'+s);AS.textSize=s;localStorage.setItem('cusb_a11y',JSON.stringify(AS));['normal','md','lg'].forEach(function(v){var b=document.getElementById('sz-'+v);if(b)b.classList.toggle('active',v===s);});}
function toggleA11yBar(){var bar=document.getElementById('a11y-bar');var btn=document.getElementById('a11y-toggle');var open=bar.classList.toggle('open');btn.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));}
function a11yReset(){AS={};localStorage.setItem('cusb_a11y','{}');Object.keys(A11Y_MAP).forEach(function(k){document.body.classList.remove(A11Y_MAP[k]);var cb=document.getElementById('cb-'+k);if(cb)cb.checked=false;});setSize('normal');}
document.addEventListener('mousemove',function(e){if(!document.body.classList.contains('a11y-guide-on'))return;var g=document.getElementById('a11y-guide');if(g)g.style.top=(e.clientY-19)+'px';});
(function(){Object.keys(A11Y_MAP).forEach(function(k){if(AS[k]){document.body.classList.add(A11Y_MAP[k]);var cb=document.getElementById('cb-'+k);if(cb)cb.checked=true;}});if(AS.textSize)setSize(AS.textSize);})();


/* ========== section ========== */





/* ========== section ========== */


/* ── Dropdown viewport clamp ──
   Each dropdown is centered on its nav item via translateX(-50%).
   This script nudges left/right so it never overflows the screen. */
(function () {
  function clampDropdowns() {
    var vw = window.innerWidth;
    var pad = 16;
    document.querySelectorAll('.nav-mega-drop').forEach(function (drop) {
      // Reset any previous nudge
      drop.style.marginLeft = '';
      var rect = drop.getBoundingClientRect();
      if (rect.right > vw - pad) {
        drop.style.marginLeft = (vw - pad - rect.right) + 'px';
      } else if (rect.left < pad) {
        drop.style.marginLeft = (pad - rect.left) + 'px';
      }
    });
  }
  // Run on hover so the dropdown is visible when we measure
  document.querySelectorAll('.nav-has-dropdown').forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      requestAnimationFrame(clampDropdowns);
    });
  });
  window.addEventListener('resize', clampDropdowns);
})();


/* ========== section ========== */


/* ══════════════════════════════════════════
   CUSB PORTAL — Full Demo Logic
══════════════════════════════════════════ */
var _cusbUser = null;
try { var _s = sessionStorage.getItem('cusbPortalUser'); if(_s) _cusbUser = JSON.parse(_s); } catch(e){}

/* ── Open portal ── */
function cusbOpenPortal() {
  if (_cusbUser) { showDashboard(_cusbUser); return; }
  var ov = document.getElementById('cusbPortalOverlay');
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  lcReset();
}

/* ── Close overlay ── */
function cusbClosePortal() {
  document.getElementById('cusbPortalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function cusbOverlayOutside(e) {
  if (e.target === document.getElementById('cusbPortalOverlay')) cusbClosePortal();
}

/* ══════════════════════════════
   CUSB LOGIN — TABBED PORTAL
   ══════════════════════════════ */

var _cusbActiveTab = 'student';

/* ── Switch tab ── */
function lcSwitchTab(role) {
  _cusbActiveTab = role;
  ['student','faculty','admin'].forEach(function(r) {
    var tab   = document.getElementById('tab-' + r);
    var panel = document.getElementById('panel-' + r);
    if(!tab || !panel) return;
    tab.className   = 'lc-tab' + (r === role ? (r === 'faculty' ? ' active active-faculty' : r === 'admin' ? ' active active-admin' : ' active') : '');
    panel.className = 'lc-panel' + (r === role ? ' active' : '');
  });
  /* clear errors */
  ['st-err','fc-err','ad-err'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
}

/* ── Reset login card to initial state ── */
function lcReset() {
  var tabsArea = document.getElementById('lc-tabs-area');
  var loading  = document.getElementById('lc-loading');
  var success  = document.getElementById('lc-success');
  if(tabsArea) tabsArea.style.display = 'block';
  if(loading)  loading.style.display  = 'none';
  if(success)  success.style.display  = 'none';
  lcSwitchTab('student');
}

/* ── Get typed credentials for current tab ── */
function lcGetInput(role) {
  if(role === 'student') {
    return { id: (document.getElementById('st-enroll')||{}).value||'', pass: (document.getElementById('st-pass')||{}).value||'' };
  } else if(role === 'faculty') {
    return { id: (document.getElementById('fc-email')||{}).value||'', pass: (document.getElementById('fc-pass')||{}).value||'' };
  } else {
    return { id: (document.getElementById('ad-id')||{}).value||'', pass: (document.getElementById('ad-pass')||{}).value||'' };
  }
}

/* ── Main login handler ── */
function cusbDoLogin(role) {
  var errMap = { student:'st-err', faculty:'fc-err', admin:'ad-err' };

  /* Hide any old error */
  var errEl = document.getElementById(errMap[role]);
  if(errEl) errEl.style.display = 'none';

  /* If credentials were typed, do a basic validation */
  var inp = lcGetInput(role);
  var usedForm = inp.id.trim() !== '' || inp.pass.trim() !== '';
  if(usedForm && (inp.id.trim() === '' || inp.pass.trim() === '')) {
    if(errEl) errEl.style.display = 'block';
    return;
  }

  /* Show loading */
  var tabsArea = document.getElementById('lc-tabs-area');
  var loading  = document.getElementById('lc-loading');
  if(tabsArea) tabsArea.style.display = 'none';
  if(loading)  loading.style.display  = 'flex';
  var msgEl = document.getElementById('lc-loading-msg');
  if(msgEl) msgEl.textContent = 'Signing you in…';

  setTimeout(function() {
    /* Build user object — use typed name if available, else placeholder */
    var roleData = {
      student: { name: inp.id && inp.id.trim() ? inp.id.trim() : 'Student', email: inp.id && inp.id.includes('@') ? inp.id.trim() : (inp.id.trim() ? inp.id.trim() + '@cusb.ac.in' : 'student@cusb.ac.in'), initials:'ST', role:'Student', prog:'CUSB Student Portal', sem:'Student' },
      faculty: { name: inp.id && inp.id.trim() ? inp.id.split('@')[0].replace(/\./g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}) : 'Faculty Member', email: inp.id && inp.id.trim() ? inp.id.trim() : 'faculty@cusb.ac.in', initials:'FM', role:'Faculty', prog:'School · CUSB', sem:'Faculty' },
      admin:   { name: inp.id && inp.id.trim() ? inp.id.split('@')[0].replace(/\./g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}) : 'Admin Staff', email: inp.id && inp.id.trim() ? inp.id.trim() : 'admin@cusb.ac.in', initials:'AS', role:'Admin', prog:'Administrative Office, CUSB', sem:'Administrator' }
    };
    var user = roleData[role] || roleData.student;
    /* Compute initials from name */
    user.initials = user.name.split(' ').map(function(w){return w[0]||'';}).slice(0,2).join('').toUpperCase() || 'U';

    if(loading) loading.style.display = 'none';
    var suc = document.getElementById('lc-success');
    if(suc) suc.style.display = 'flex';
    var snEl = document.getElementById('lc-sname');
    var seEl = document.getElementById('lc-semail');
    if(snEl) snEl.textContent = user.name;
    if(seEl) seEl.textContent = user.email;

    _cusbUser = user;
    try { sessionStorage.setItem('cusbPortalUser', JSON.stringify(user)); } catch(e){}

    updateNavPill(user);

    setTimeout(function() {
      cusbClosePortal();
      showDashboard(user);
    }, 1400);
  }, 1400);
}

/* ── Update the main nav sign-in button ── */
function updateNavPill(user) {
  var loginBtn = document.getElementById('navLoginBtn');
  var pill = document.getElementById('navUserPill');
  if (!loginBtn) return;
  loginBtn.style.display = 'none';
  if (pill) {
    pill.style.display='flex';
    var av = document.getElementById('navUserAvatar');
    var nm = document.getElementById('navUserName');
    var dn = document.getElementById('dropUserName');
    var de = document.getElementById('dropUserEmail');
    if(av) { av.style.display='none'; }
    // inject initials
    var old = pill.querySelector('.nav-init-av');
    if(old) old.remove();
    var ini = document.createElement('div');
    ini.className='nav-init-av';
    ini.style.cssText='width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#b8860b,#d4a017);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-size:11px;font-weight:700;color:#3A2800;flex-shrink:0;';
    ini.textContent = user.initials || (user.name||'U').slice(0,2).toUpperCase();
    if(av) av.parentNode.insertBefore(ini, av);
    if(nm) nm.textContent = (user.name||'').split(' ')[0];
    if(dn) dn.textContent = user.name;
    if(de) de.textContent = user.email;
  }
  /* ── sync mobile login area ── */
  var mLogin = document.getElementById('mobileLoginBtn');
  var mCard  = document.getElementById('mobileUserCard');
  if(mLogin) mLogin.style.display = 'none';
  if(mCard) {
    mCard.style.display = 'block';
    var mav = document.getElementById('mobileUserAvatar');
    var mnm = document.getElementById('mobileUserName');
    var mem = document.getElementById('mobileUserEmail');
    if(mav) mav.style.display = 'none';
    var mold = mCard.querySelector('.mob-init-av');
    if(mold) mold.remove();
    var mini = document.createElement('div');
    mini.className = 'mob-init-av';
    mini.style.cssText = 'width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#b8860b,#d4a017);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#3A2800;flex-shrink:0;';
    mini.textContent = user.initials || (user.name||'U').slice(0,2).toUpperCase();
    if(mav) mav.parentNode.insertBefore(mini, mav);
    if(mnm) mnm.textContent = user.name || '';
    if(mem) mem.textContent = user.email || '';
  }
}

/* ── Show dashboard ── */
function showDashboard(user) {
  // Set greeting
  var h = new Date().getHours();
  var greet = h<12 ? 'Good morning ☀️' : (h<17 ? 'Good afternoon 🌞' : 'Good evening 🌙');
  var gEl = document.getElementById('dashGreeting');
  if(gEl) gEl.textContent = greet + ', ' + (user.name||'').split(' ')[0] + '!';
  var fEl = document.getElementById('facGreeting');
  if(fEl) fEl.textContent = greet + ', ' + (user.name||'').split(' ')[0] + '!';

  // Update topbar title based on role
  var titleEl = document.querySelector('.dash-topbar-title');
  var subtitleEl = document.querySelector('.dash-topbar-subtitle');
  if(user.role === 'Faculty') {
    if(titleEl) titleEl.textContent = 'CUSB Faculty Portal';
  } else if(user.role === 'Admin') {
    if(titleEl) titleEl.textContent = 'CUSB Admin Portal';
  } else {
    if(titleEl) titleEl.textContent = 'CUSB Student Portal';
  }

  // Date
  var dEl = document.getElementById('dashDate');
  if(dEl) {
    var now = new Date();
    dEl.textContent = now.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  }

  // Sidebar programme
  var ss = document.getElementById('sidebarSem'); if(ss) ss.textContent = user.sem||'Semester IV';
  var sp = document.getElementById('sidebarProg'); if(sp) sp.textContent = user.prog||'M.A. Development Studies';

  // Profile page
  var pn = document.getElementById('profileName'); if(pn) pn.textContent = user.name||'';
  var pe = document.getElementById('profileEmail'); if(pe) pe.textContent = user.email||'';
  var pei = document.getElementById('profileEmailInfo'); if(pei) pei.textContent = user.email||'';
  var prc = document.getElementById('profileRoleChip'); if(prc) prc.textContent = user.role||'Student';

  // Avatar in dash topbar
  var dav = document.getElementById('dashAvatarEl');
  if(dav) dav.textContent = user.initials||(user.name||'U').slice(0,2).toUpperCase();

  // Profile avatar large
  var pal = document.getElementById('profileAvatarLg');
  if(pal) pal.textContent = user.initials||(user.name||'U').slice(0,2).toUpperCase();

  // Top bar name
  var dun = document.getElementById('dashUserNameEl');
  if(dun) dun.textContent = (user.name||'').split(' ')[0];

  // Build attendance bars
  buildAttendance();

  // Build timetable
  buildTimetable();

  // Show dashboard
  var dash = document.getElementById('cusbDashboard');
  dash.classList.add('open');
  document.body.style.overflow='hidden';

  // Route to role-specific home page
  if(user.role === 'Faculty') {
    cusbPage('faculty-home', null);
  } else if(user.role === 'Admin') {
    cusbPage('admin-home', null);
  } else {
    cusbPage('dashboard', null);
  }

  // Show bottom nav on mobile
  var bn = document.getElementById('dashBottomNav');
  if(bn) bn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
  setBottomNav('dashboard');
}

/* ── Page navigation ── */
function cusbPage(id, navEl) {
  document.querySelectorAll('.dash-page').forEach(function(p){ p.classList.remove('active'); });
  var pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  document.querySelectorAll('.dash-nav-item').forEach(function(n){ n.classList.remove('active'); });
  if(navEl) navEl.classList.add('active');
  var main = document.getElementById('dashMain');
  if(main) main.scrollTop=0;
  // sync bottom nav
  if(typeof setBottomNav === 'function') setBottomNav(id);
}

/* ── Sign out ── */
function setBottomNav(id) {
  document.querySelectorAll('.dash-bn-item').forEach(function(b){ b.classList.remove('active'); });
  var bn = document.getElementById('bn-'+id);
  if(bn) bn.classList.add('active');
}

function cusbSignOut() {
  _cusbUser = null;
  try { sessionStorage.removeItem('cusbPortalUser'); } catch(e){}
  document.getElementById('cusbDashboard').classList.remove('open');
  var bn = document.getElementById('dashBottomNav');
  if(bn) bn.style.display = 'none';
  document.body.style.overflow='';
  // Restore desktop nav
  var loginBtn = document.getElementById('navLoginBtn');
  var pill = document.getElementById('navUserPill');
  if(loginBtn) loginBtn.style.display='flex';
  if(pill) { pill.style.display='none'; var old=pill.querySelector('.nav-init-av'); if(old)old.remove(); }
  // Restore mobile nav
  var mLogin = document.getElementById('mobileLoginBtn');
  var mCard  = document.getElementById('mobileUserCard');
  if(mLogin) mLogin.style.display = 'flex';
  if(mCard)  { mCard.style.display = 'none'; var mo=mCard.querySelector('.mob-init-av'); if(mo)mo.remove(); }
}

/* ── Build attendance bars ── */
function buildAttendance() {
  var subjects = [
    { name:'Climate Change & Development', pct:91, total:22, attended:20 },
    { name:'Social Movements & Civil Society', pct:86, total:22, attended:19 },
    { name:'Urban Development Studies', pct:82, total:22, attended:18 },
    { name:'International Development', pct:77, total:22, attended:17 },
    { name:'Dissertation Seminar', pct:73, total:15, attended:11 },
    { name:'Field Work & Practicum', pct:68, total:10, attended:7 },
  ];
  var cont = document.getElementById('attBars');
  if(!cont) return;
  cont.innerHTML = subjects.map(function(s){
    var cls = s.pct>=75?'ok': s.pct>=65?'warn':'low';
    return '<div class="att-row">'
      +'<div class="att-subject">'+s.name+'<br><span style="font-size:10px;color:rgba(44,36,24,0.4);">'+s.attended+'/'+s.total+' classes</span></div>'
      +'<div class="att-bar-wrap"><div class="att-bar '+cls+'" style="width:'+s.pct+'%"></div></div>'
      +'<div class="att-pct '+cls+'">'+s.pct+'%</div>'
      +'</div>';
  }).join('');
}

/* ── Build timetable ── */
function buildTimetable() {
  var days = ['MON','TUE','WED','THU','FRI','SAT'];
  var times = ['9–10 AM','10–11 AM','11–12 PM','2–3 PM','3–4 PM'];
  var todayCol = new Date().getDay(); // 1=Mon
  var tt = [
    // Mon, Tue, Wed, Thu, Fri, Sat
    ['c1:Climate Change &amp; Dev','c2:Social Movements','c1:Climate Change &amp; Dev','','c3:Urban Development',''],
    ['','c4:Intl. Development','c2:Social Movements','c5:Dissertation Sem','','c6:Field Work'],
    ['c3:Urban Development','','c4:Intl. Development','c1:Climate Change &amp; Dev','c2:Social Movements',''],
    ['c5:Dissertation Sem','c3:Urban Development','','c6:Field Work','c4:Intl. Development',''],
    ['c4:Intl. Development','','c5:Dissertation Sem','c2:Social Movements','','c3:Urban Development'],
  ];
  var grid = document.getElementById('ttGrid');
  if(!grid) return;
  var html = '<div class="tt-head"></div>';
  days.forEach(function(d,i){
    var td = (todayCol-1===i)?'today':'';
    html+='<div class="tt-head '+td+'" style="'+(td?'background:rgba(201,151,43,0.2);':'')+'">'+d+'</div>';
  });
  times.forEach(function(t,ri){
    html+='<div class="tt-time">'+t+'</div>';
    tt[ri].forEach(function(cell,ci){
      var td=(todayCol-1===ci)?'today':'';
      if(!cell){ html+='<div class="tt-cell empty '+td+'"></div>'; return; }
      var parts=cell.split(':');
      html+='<div class="tt-cell '+parts[0]+' '+td+'">'+parts[1]+'</div>';
    });
  });
  grid.innerHTML=html;
}

/* ── Restore session on load ── */
(function(){
  if(_cusbUser){ updateNavPill(_cusbUser); }
})();

/* ── ESC key ── */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    cusbClosePortal();
    if(document.getElementById('cusbDashboard').classList.contains('open')){
      // don't close dash on ESC — use sign out button
    }
  }
});


/* ========== section ========== */


(function(){
  var cusbOpen = false;
  var cusbGreeted = false;

  /* =========================================================
     CUSB OFFLINE KNOWLEDGE BASE
     All data sourced from: cusb.ac.in, Wikipedia, NIRF 2025,
     Careers360, CollegeDunia, official admission bulletins
     ========================================================= */
  var KB = {

    /* ── UNIVERSITY OVERVIEW ── */
    about: {
      fullName:    "Central University of South Bihar (CUSB)",
      shortName:   "CUSB",
      established: "2009, under Central Universities Act (Section 25 of 2009)",
      oldName:     "Central University of Bihar (CUB) — renamed in 2014",
      type:        "Central University, funded by Government of India / UGC",
      campus:      "300-acre permanent campus at Panchanpur, Gaya, Bihar",
      address:     "SH-7 / NH-120, Gaya Panchanpur Road, Village Karhara, Post Fatehpur, Gaya – 824236, Bihar, India",
      motto:       "Collective Reasoning (Saha Nau Vavatu)",
      naac:        "NAAC Accredited 'A++' Grade",
      ugc:         "Recognised by UGC (University Grants Commission)",
      aicte:       "Approved by AICTE",
      bci:         "Approved by Bar Council of India (BCI) for Law programmes",
      visitor:     "President of India (Smt. Droupadi Murmu) is the Visitor",
      chancellor:  "Dr. C. P. Thakur",
      vc:          "Prof. Kameshwar Nath Singh",
      registrar:   "Prof. Narendra Kumar Rana",
      system:      "Semester System with Choice Based Credit System (CBCS)",
      website:     "www.cusb.ac.in",
      admPortal:   "cusbcuet.samarth.edu.in"
    },

    /* ── RANKINGS (NIRF 2025 & others) ── */
    rankings: {
      nirf_univ:  "151–200 (University Category, NIRF 2025)",
      nirf_law:   "23rd (Law Category, NIRF 2025)",
      nirf_pharma:"63rd (Pharmacy Category, NIRF 2025)",
      ewi_bihar:  "#1 in Bihar (EWI Bihar Ranking 2024)",
      ewi_india:  "#56 (EWI India Ranking 2024)",
      iirf:       "Ranked 46 among Central Universities (IIRF 2024)",
      edurank:    "#319 in India, #5901 Globally (EduRank 2025)"
    },

    /* ── CONTACT DETAILS ── */
    contact: {
      phone:       "+91-0631-222 9530 / +91-631-2229539",
      fax:         "+91-631-2229540",
      email:       "registrar@cub.ac.in",
      admEmail:    "admission@cusb.ac.in",
      placEmail:   "placement@cusb.ac.in",
      website:     "https://www.cusb.ac.in",
      admPortal:   "https://cusbcuet.samarth.edu.in",
      mapLink:     "https://maps.google.com/?q=Central+University+of+South+Bihar+Panchanpur+Gaya"
    },

    /* ── SCHOOLS & DEPARTMENTS (verified from Wikipedia & official site) ── */
    schools: [
      {
        name: "School of Commerce & Management Studies",
        icon: "💼",
        programs: ["MBA (Master of Business Administration)", "M.Com (Master of Commerce)", "Ph.D in Commerce & Management"],
        entrance: "CUET-PG / CAT (for MBA)",
        fee: "₹15,000–20,000 per semester"
      },
      {
        name: "School of Education",
        icon: "📖",
        programs: ["B.A. B.Ed. (4-year Integrated)", "B.Sc. B.Ed. (4-year Integrated)", "M.Ed. (2-year)", "Ph.D in Education"],
        entrance: "CUET-UG (for integrated) / CUET-PG (for M.Ed.)",
        fee: "₹7,000–12,000 per semester"
      },
      {
        name: "School of Engineering & Technology",
        icon: "⚙️",
        programs: ["M.Tech (Master of Technology)", "Ph.D in Engineering"],
        entrance: "GATE (for M.Tech)",
        fee: "₹15,000–20,000 per semester"
      },
      {
        name: "School of Earth, Biological & Environmental Sciences",
        icon: "🌿",
        programs: ["M.Sc. Environmental Science", "M.Sc. Geography", "Ph.D in Environmental Sciences"],
        entrance: "CUET-PG",
        fee: "₹7,000–10,000 per semester"
      },
      {
        name: "School of Humanities & Languages",
        icon: "📚",
        programs: ["M.A. Hindi", "M.A. English", "M.A. Urdu", "M.A. Sanskrit", "M.A. Linguistics", "Ph.D in Languages"],
        entrance: "CUET-PG",
        fee: "₹5,000–8,000 per semester"
      },
      {
        name: "School of Information Science & Technology",
        icon: "💻",
        programs: ["MCA (Master of Computer Applications)", "M.Sc. Computer Science", "M.Sc. IT", "Ph.D in CS/IT"],
        entrance: "CUET-PG",
        fee: "₹10,000–15,000 per semester"
      },
      {
        name: "School of Journalism & Mass Communication",
        icon: "📰",
        programs: ["M.A. / M.J.M.C (Journalism & Mass Communication)", "PG Diploma in Journalism", "Ph.D in Mass Communication"],
        entrance: "CUET-PG",
        fee: "₹10,000–12,000 per semester"
      },
      {
        name: "School of Law",
        icon: "⚖️",
        programs: ["B.A. LL.B. (Hons.) – 5-year Integrated", "LL.M. (1-year, as per UGC 2013 Regulation)", "Ph.D in Law"],
        entrance: "CUET-UG (for BA LLB) / CUET-PG (for LLM)",
        fee: "₹7,000–12,300 per semester (1st sem fee: ₹12,300)"
      },
      {
        name: "School of Life Sciences",
        icon: "🔬",
        programs: ["M.Sc. Biotechnology", "M.Sc. Biochemistry", "M.Sc. Microbiology", "M.Sc. Botany", "M.Sc. Zoology", "Ph.D in Life Sciences"],
        entrance: "CUET-PG",
        fee: "₹7,000–10,000 per semester"
      },
      {
        name: "School of Mathematics & Computer Science",
        icon: "🔢",
        programs: ["M.Sc. Mathematics", "M.Sc. Statistics", "Ph.D in Mathematics"],
        entrance: "CUET-PG",
        fee: "₹7,000–10,000 per semester"
      },
      {
        name: "School of Physical Sciences",
        icon: "⚗️",
        programs: ["M.Sc. Physics", "M.Sc. Chemistry", "Ph.D in Physical Sciences"],
        entrance: "CUET-PG",
        fee: "₹7,000–10,000 per semester"
      },
      {
        name: "School of Social Sciences",
        icon: "🌐",
        programs: ["M.A. Economics", "M.A. Sociology", "M.A. Political Science & International Relations (2-year integrated)", "M.A. History", "M.A. Psychology", "M.A. Development Studies", "Ph.D in Social Sciences"],
        entrance: "CUET-PG",
        fee: "₹5,000–8,000 per semester"
      },
      {
        name: "School of Health Sciences",
        icon: "💊",
        programs: ["M.Pharm (Master of Pharmacy)", "M.P.Ed. (Master of Physical Education)", "Ph.D in Pharmacy"],
        entrance: "GPAT (for M.Pharm) / CUET-PG (for M.P.Ed.)",
        fee: "₹15,000–25,000 per semester"
      }
    ],

    /* ── COURSES SUMMARY ── */
    courses: {
      total:   "61 courses across UG, PG, Diploma and Ph.D levels",
      ug:      "6 undergraduate programmes (BA+BEd, BSc+BEd, BA LLB Hons., B.Sc Agriculture, etc.)",
      pg:      "31 postgraduate programmes (M.A., M.Sc., MBA, MCA, M.Tech, M.Pharm, LL.M., etc.)",
      phd:     "22+ doctoral (Ph.D.) programmes across all departments",
      diploma: "PG Diploma in Journalism",
      popular: "BA LLB, B.Sc B.Ed., B.A B.Ed., M.Sc., M.A."
    },

    /* ── ADMISSIONS (detailed, verified) ── */
    admission: {
      ugProcess:  "Step 1: Register on cuet.nta.nic.in → Step 2: Appear in CUET-UG exam (May–June) → Step 3: Visit cusbcuet.samarth.edu.in, fill application with CUET score → Step 4: Pay ₹500 registration fee → Step 5: Merit list published on cusb.ac.in → Step 6: Document verification at campus → Step 7: Pay semester fee to confirm admission",
      pgProcess:  "Step 1: Register on CUET-PG portal → Step 2: Appear in CUET-PG (March) → Step 3: Apply on SAMARTH portal with CUET-PG score → Step 4: Merit list release (June) → Step 5: Document verification → Step 6: Fee payment",
      phdProcess: "Step 1: Register on cusb.ac.in for CUSB-ET (CUSB Entrance Test) → Step 2: Appear in CUSB-ET + Interview → Step 3: Admission based on UGC NET/JRF (exempted from CUSB-ET) → Step 4: Enrolment",
      mtechProcess:"Apply via GATE score; GATE 2026 exam: Feb 7–8 & Feb 14–15, 2026",
      mpharmProcess:"Apply via GPAT score; GPAT 2026 application: April 2026",
      ugElig:     "10+2 / equivalent from recognised board with min. 45% marks (General/OBC/EWS) or 40% (SC/ST/PwD)",
      pgElig:     "Bachelor's degree in relevant subject with min. 50% marks (General) or 45% (SC/ST/PwD)",
      phdElig:    "PG degree with 55% marks (General/OBC) or 50% (SC/ST/PwD)",
      merits:     "Merit list = 30% qualifying exam marks + 70% CUET score",
      session:    "Academic session: July to June (next year)",
      regFee:     "₹500 (non-refundable registration fee on SAMARTH portal)",
      portal:     "cusbcuet.samarth.edu.in (official admission portal)",
      cuetPortal: "cuet.nta.nic.in (for CUET UG/PG registration)",
      meritsRel:  "PG Merit list: June | UG Merit list: August",
      docsNeeded: "10th & 12th marksheets, Graduation marksheets, Aadhaar Card, PAN Card, Migration Certificate, Character Certificate, Category Certificate (if applicable)"
    },

    /* ── CUTOFFS (2024 General Category – CUET score) ── */
    cutoffs: {
      baLlb:   "General: 499/650, OBC: 480/650, SC: 400/650, ST: 390/650",
      bscBed:  "General: ~82% or equivalent CUET score",
      baBed:   "General: ~80% or equivalent CUET score",
      ma:      "Varies by subject; highly competitive for Economics, English, Psychology",
      note:    "Cutoffs vary each year based on applicants. Check cusb.ac.in for official cutoffs."
    },

    /* ── FEE STRUCTURE (verified from official data) ── */
    fees: {
      baLlb:   "₹7,000/semester (Tuition ₹3,500 + other fees); 10 semesters total; approx ₹70,000 full course (excl. hostel)",
      baBed:   "₹7,000–8,000/semester; 8 semesters (4 years)",
      bscBed:  "₹7,000–8,000/semester; 8 semesters (4 years)",
      ma:      "₹5,000–8,000/semester; 4 semesters",
      msc:     "₹7,000–10,000/semester; 4 semesters",
      mca:     "₹10,000–15,000/semester; 6 semesters",
      mtech:   "₹15,000–20,000/semester; 4 semesters",
      mba:     "₹15,000–20,000/semester; 4 semesters",
      mpharm:  "₹20,000–25,000/semester; 4 semesters",
      llm:     "₹10,000–15,000 (1 year = 2 semesters)",
      phd:     "₹5,000–8,000/semester",
      hostel:  "₹9,000/semester (Hostel Fee – official confirmed rate)",
      hostTotal:"₹16,000/semester (Tuition + Hostel combined)",
      admFee:  "₹500 registration fee on SAMARTH portal",
      note:    "Fees are very affordable. No fee hike for last 5 years. SC/ST/PwD eligible for fee waiver."
    },

    /* ── HOSTEL (verified official data) ── */
    hostel: {
      boys:      "VDS — Boys Hostel on campus",
      girls:     "Gargi Sadan — Girls Hostel on campus",
      fee:       "₹9,000 per semester (official confirmed rate)",
      mess:      "Subsidised mess facility available; mess fee approx ₹1,500–2,000/month",
      allotment: "Allotted based on academic merit / performance; PG students apply via Hostel Application Google Form",
      facilities:"Furnished rooms, Wi-Fi, electricity, reading room, 24-hour security, recreational area",
      who:       "Currently available for PG/Masters students",
      note:      "Hostel seats are limited and allotted after admission confirmation"
    },

    /* ── SCHOLARSHIPS (verified) ── */
    scholarships: [
      { name: "Attendance-Based Merit Scholarship", desc: "For students with high attendance in all subjects" },
      { name: "Toppers Scholarship", desc: "Awarded to semester toppers in each department" },
      { name: "Merit-cum-Means Scholarship", desc: "For meritorious students with family income < ₹8 lakh/year" },
      { name: "Divyang (PwD) Scholarship", desc: "For differently-abled students with valid disability certificate" },
      { name: "Earn While You Learn Scheme", desc: "Part-time work opportunities within the university" },
      { name: "SC/ST Post-Matric Scholarship", desc: "Government of India scheme; full fee + stipend for SC/ST students" },
      { name: "OBC Post-Matric Scholarship", desc: "State & Central Government; fee assistance for OBC students" },
      { name: "UGC JRF/SRF Fellowship", desc: "For Ph.D scholars: JRF = ₹31,000/month, SRF = ₹35,000/month" },
      { name: "ICSSR Fellowship", desc: "For social science research students" },
      { name: "MANF (Maulana Azad National Fellowship)", desc: "For minority community students" },
      { name: "Bihar Student Credit Card", desc: "Up to ₹4 lakh loan for Bihar domicile students" },
      { name: "Bihar Post-Matric Scholarship", desc: "For Bihar domicile students in SC/ST/OBC categories" }
    ],

    /* ── FACILITIES (verified from official + student reviews) ── */
    facilities: {
      library:   "Rajarshi Janak Central Library — 49,000+ books, 6,500+ e-journals, 100+ print journals, INFLIBNET access, lifts, digital catalogue, Wi-Fi reading room",
      computers: "Computer lab with 80+ computers, high-speed internet, latest software",
      sports:    "Cricket ground, Football field, Badminton courts, Athletics track, Indoor games (TT, Chess), Gymnasium",
      hostel:    "Gargi Sadan (Girls) & VDS (Boys) with mess, Wi-Fi, security",
      medical:   "On-campus Health Centre; Vidyarthi Mediclaim Policy covering up to ₹50,000 for medical expenses",
      bank:      "SBI Bank branch and ATM on campus",
      transport: "Bus facility from Gaya city to campus",
      cafeteria: "Canteen / Madhuvan Cafeteria with affordable food",
      seminar:   "Seminar Halls, Conference Rooms, Guest House, Auditorium",
      wifi:      "Wi-Fi enabled campus throughout",
      labs:      "Well-equipped science labs, language labs, pharmacy labs",
      guesthouse:"Guest House for visiting faculty and parents"
    },

    /* ── PLACEMENT DATA (NIRF 2025 verified) ── */
    placement: {
      cell:         "Career Counselling and Placement Cell (CCPC) handles all campus placements",
      rate:         "~40% placement rate (based on NIRF data)",
      nirf2025:     "110 UG students + 101 PG students placed (NIRF 2025 report)",
      ug4yr_median: "₹7.8 LPA median package (4-year UG)",
      ug5yr_median: "₹6.8 LPA median package (5-year UG — BA LLB)",
      pg2yr_median: "₹9.6 LPA median package (2-year PG)",
      pg1yr_median: "₹7.2 LPA median package (1-year PG)",
      highest:      "₹25 LPA highest package (2023 placement drive)",
      recruiters:   "TCS, Infosys, Wipro, HDFC Bank, Times Group (Hindustan Times, ETV Bharat), Care India (NGO), Aakash Institute, top Law Firms, Government Departments",
      activities:   "Mock interviews, resume workshops, career counselling, campus recruitment drives, internship opportunities",
      contact:      "placement@cusb.ac.in"
    },

    /* ── WELFARE CELLS ── */
    cells: [
      "Anti-Ragging Cell (Zero tolerance policy)",
      "Career Counselling and Placement Cell (CCPC)",
      "Grievance Redressal Committee for Students",
      "SC/ST Cell for scheduled caste/tribe welfare",
      "Women's Cell / Task Force for Women",
      "Cultural Activities Committee",
      "Games and Sports Committee",
      "Library Committee",
      "Planning and Development Board",
      "Central Purchase Committee",
      "NSS (National Service Scheme) Unit",
      "NCC (National Cadet Corps) Unit"
    ],

    /* ── HOW TO REACH ── */
    reach: {
      train:   "Gaya Junction Railway Station (12–15 km from campus) — well connected to Delhi, Patna, Kolkata, Varanasi, Mumbai. Take auto-rickshaw or cab to campus.",
      airport: "Gaya International Airport (15 km) — flights from Delhi, Kolkata, Bangkok. Buddhist pilgrim circuit flights also available.",
      road:    "NH-120 (Gaya–Panchanpur Road) passes close to campus; BSRTC buses and private buses from Gaya city (Gaya Bus Stand)",
      local:   "Auto-rickshaws, e-rickshaws and the university bus available from Gaya town to campus",
      bodh:    "Bodh Gaya (UNESCO World Heritage Site) is just 12 km away",
      note:    "Campus is 15 km from Gaya town. Limited local transport within campus — transport between departments is an issue noted by students."
    },

    /* ── STUDENT LIFE & EVENTS ── */
    events: {
      fest:    "Annual Cultural Fest 'Pratibha' — music, dance, drama, debate, literary competitions",
      sports:  "Annual Sports Meet with inter-department cricket, football, athletics, indoor games",
      convoc:  "Convocation ceremony (7th convocation had President Droupadi Murmu as chief guest)",
      nss:     "NSS Unit — community service, blood donation camps, environment drives, village outreach",
      ncc:     "NCC Unit — Army & other wings",
      moot:    "School of Law organises Moot Courts, Model UN (MUN) and Debating Leagues",
      clubs:   "Literary Club, Photography Club, Eco Club, Film Society, Tech Club",
      intern:  "School Internship Programme for B.Ed./B.A.B.Ed./B.Sc.B.Ed. students"
    },

    /* ── INTERNATIONAL ── */
    international: {
      office:  "Office of International Affairs (OIA) handles international student applications",
      accepts: "CUSB accepts international students for various PG and Ph.D programmes",
      fees:    "PG: approx $500–800/year; Ph.D: approx $600–1000/year (indicative in USD equivalent)",
      schemes: "ICCR Scholarship, Study in India Scheme available for international students"
    }
  };

  /* =========================================================
     INTENT ENGINE — matches user query to knowledge
     ========================================================= */
  function classify(txt) {
    var t = txt.toLowerCase();
    if (/\b(hi|hello|hey|namaskar|namaste|helo|hii|good\s*(morning|afternoon|evening|day)|kaise ho|how are)\b/.test(t)) return 'greet';
    if (/\b(bye|goodbye|alvida|tata|see you|ok bye|thank|thanks|dhanyawad|shukriya|helpful)\b/.test(t)) return 'bye';
    if (/\b(help|what can|topics|menu|options|kya puch)\b/.test(t)) return 'help';
    if (/\b(rank|ranking|nirf|naac|accred|grade|iirf|ewi|best university)\b/.test(t)) return 'rank';
    if (/\b(about|what is cusb|overview|history|establishment|established|founded|founded|cusb kya|tell me about|introduce|information about)\b/.test(t)) return 'about';
    if (/\b(vc|vice chancellor|chancellor|registrar|head|director|kuladhipati|official|authority|visitor|president)\b/.test(t)) return 'officials';
    if (/\b(contact|phone|number|email|mail|helpline|call|enquiry|inquiry|office|address|location)\b/.test(t)) return 'contact';
    if (/\b(how to reach|reach|direction|distance|gaya|near|train|bus|flight|airport|transport|bodh gaya|map|navigate)\b/.test(t)) return 'reach';
    if (/\b(admission|apply|kaise apply|how to apply|process|procedure|steps|when to apply|cuet|entrance|eligibility|criteria|qualify|merit list|cutoff|cut.off|documents|docs needed)\b/.test(t)) return 'admit';
    if (/\b(fee|fees|charges|cost|tuition|kitna|how much|affordable|expensive|cheap|payment|semester fee)\b/.test(t)) return 'fee';
    if (/\b(hostel|accommodation|stay|room|dormitory|sadan|gargi|maitreyi|mess|food|dinner|breakfast|pg accommodation)\b/.test(t)) return 'hostel';
    if (/\b(scholarship|fellowship|stipend|financial aid|jrf|srf|ugc|free education|waiver|sc st|obc|minority|manf|earn while|credit card)\b/.test(t)) return 'scholar';
    if (/\b(facility|facilities|infrastructure|library|lab|sports|gym|medical|bank|atm|wifi|internet|canteen|cafeteria|seminar|computer|auditorium)\b/.test(t)) return 'facility';
    if (/\b(placement|job|career|package|salary|lpa|company|recruit|hiring|intern|career cell|highest package|median)\b/.test(t)) return 'place';
    if (/\b(school|department|dept|all course|programme list|what course|kitne course|how many course|subjects offered|discipline)\b/.test(t)) return 'schools';
    if (/\b(llb|law|ba llb|ballb|legal|advocate|moot|llm)\b/.test(t)) return 'law';
    if (/\b(mba|management|business|commerce|mcom)\b/.test(t)) return 'mba';
    if (/\b(mca|bca|computer application|it programme|information technology programme|software)\b/.test(t)) return 'mca';
    if (/\b(phd|ph\.d|doctorate|research degree|research prog|cusb.et|research admission|jrf|net)\b/.test(t)) return 'phd';
    if (/\b(bed|b\.ed|m\.ed|med|education programme|ba bed|bsc bed|itep|teacher)\b/.test(t)) return 'bed';
    if (/\b(journalism|mass comm|media|mjmc|jmc)\b/.test(t)) return 'jmc';
    if (/\b(mtech|m\.tech|gate|engineering|technology)\b/.test(t)) return 'mtech';
    if (/\b(mpharm|m\.pharm|pharmacy|gpat|drug|medicine)\b/.test(t)) return 'mpharm';
    if (/\b(msc|m\.sc|bsc|science|physics|chemistry|bio|maths|math|statistics|botany|zoology|environment)\b/.test(t)) return 'msc';
    if (/\b(ma |m\.a\.|social science|humanities|language|hindi|english|sociology|psychology|economics|history|political|geography|urdu|sanskrit)\b/.test(t)) return 'ma';
    if (/\b(nss|ncc|club|cultural|fest|festival|sports meet|extracurricular|activity|event|convocation|mun|debate)\b/.test(t)) return 'events';
    if (/\b(international|foreign student|abroad|nri|iccr|study in india)\b/.test(t)) return 'intl';
    if (/\b(cell|committee|welfare|anti.ragging|grievance|women cell|sc.st cell)\b/.test(t)) return 'cells';
    if (/\b(website|portal|online|link|url|web|samarth)\b/.test(t)) return 'web';
    if (/\b(cutoff|cut off|previous year|last year rank|score required|minimum marks|general obc sc st)\b/.test(t)) return 'cutoff';
    return 'unknown';
  }

  /* =========================================================
     RESPONSE BUILDER
     ========================================================= */
  var fallbacks = [
    'I don\'t have specific information on that. Please visit <a href="https://www.cusb.ac.in" target="_blank" style="color:#8B6010;font-weight:600;">www.cusb.ac.in ↗</a> or call <strong>+91-631-2229539</strong> for accurate details.',
    'That\'s a great question! For the most up-to-date info, contact CUSB directly:<br>📧 <strong>registrar@cub.ac.in</strong><br>📞 <strong>+91-631-2229539</strong><br>🌐 <a href="https://www.cusb.ac.in" target="_blank" style="color:#8B6010;">www.cusb.ac.in ↗</a>',
    'I\'m not sure about that specific query. Try checking the official website or the SAMARTH admission portal for precise information.'
  ];
  var fbi = 0;

  function reply(intent) {
    var a = KB.about, c = KB.contact, f = KB.fees, h = KB.hostel, ad = KB.admission;

    if (intent === 'greet') return 'Namaskar! 🙏 Welcome to <strong>CUSB AI Assistant</strong>.<br><br>I can answer questions about:<br>📚 Admissions & CUET Process<br>💰 Fee Structure<br>🏠 Hostel<br>🏆 Scholarships<br>🏛️ Courses & Schools<br>💼 Placements & Rankings<br>📞 Contact & How to Reach<br><br>What would you like to know?';

    if (intent === 'bye') return 'Goodbye! 👋 Best wishes from CUSB!<br>Feel free to come back anytime. All the best! 🌟<br><br>🌐 <a href="https://www.cusb.ac.in" target="_blank" style="color:#8B6010;">www.cusb.ac.in ↗</a>';

    if (intent === 'help') return '🤖 <strong>I can help you with:</strong><br><br>🎓 Admissions, CUET, eligibility<br>📚 All 13 Schools & 61 Courses<br>💰 Fee structure (all programmes)<br>🏠 Hostel (Gargi & Maitreyi Sadan)<br>🏆 Scholarships (JRF, SC/ST, MCM, etc.)<br>🏛️ Campus facilities & infrastructure<br>💼 Placements (NIRF 2025 data)<br>📊 Rankings (NIRF, NAAC A++)<br>📞 Contact details & address<br>📍 How to reach from Gaya/Airport<br>🌍 International admissions<br>🎭 Student life, events, clubs<br><br>Just type your question!';

    if (intent === 'about') return '🏛️ <strong>' + a.fullName + '</strong><br><br>📅 <strong>Established:</strong> ' + a.established + '<br>📝 <strong>Earlier Name:</strong> ' + a.oldName + '<br>🏛️ <strong>Type:</strong> ' + a.type + '<br>📐 <strong>Campus:</strong> ' + a.campus + '<br>🎯 <strong>Motto:</strong> ' + a.motto + '<br>✅ <strong>NAAC Grade:</strong> ' + a.naac + '<br>⚖️ <strong>BCI Approved</strong> for Law | <strong>AICTE Approved</strong> for Tech<br>👑 <strong>Visitor:</strong> President of India<br>🌐 <strong>Website:</strong> ' + a.website + '<br><br>CUSB offers <strong>61 programmes</strong> (UG, PG, Ph.D) across 13 Schools of Study.';

    if (intent === 'officials') return '👨‍🎓 <strong>CUSB Key Officials:</strong><br><br>👑 <strong>Visitor (Chancellor-equivalent):</strong> President of India, Smt. Droupadi Murmu<br>🏛️ <strong>Chancellor:</strong> Dr. C. P. Thakur<br>🎓 <strong>Vice Chancellor:</strong> Prof. Kameshwar Nath Singh<br>📋 <strong>Registrar:</strong> Prof. Narendra Kumar Rana<br><br>For official correspondence: <strong>registrar@cub.ac.in</strong>';

    if (intent === 'rank') { var r = KB.rankings; return '📊 <strong>CUSB Rankings & Accreditation</strong><br><br>✅ <strong>NAAC Grade:</strong> A++ (Highest Grade)<br>📈 <strong>NIRF 2025 – University Category:</strong> ' + r.nirf_univ + '<br>⚖️ <strong>NIRF 2025 – Law:</strong> ' + r.nirf_law + '<br>💊 <strong>NIRF 2025 – Pharmacy:</strong> ' + r.nirf_pharma + '<br>🥇 <strong>EWI Bihar Ranking:</strong> ' + r.ewi_bihar + '<br>🏅 <strong>EWI India:</strong> ' + r.ewi_india + '<br>🏆 <strong>IIRF (Central Univ.):</strong> ' + r.iirf + '<br>🌐 <strong>EduRank 2025:</strong> ' + r.edurank + '<br><br>Recognised by: <strong>UGC, AICTE, Bar Council of India</strong>'; }

    if (intent === 'contact') return '📞 <strong>CUSB Contact Details</strong><br><br>📞 <strong>Phone:</strong> ' + c.phone + '<br>📠 <strong>Fax:</strong> ' + c.fax + '<br>📧 <strong>General:</strong> ' + c.email + '<br>🎓 <strong>Admissions:</strong> ' + c.admEmail + '<br>💼 <strong>Placement:</strong> ' + c.placEmail + '<br><br>📍 <strong>Address:</strong><br>SH-7 / NH-120, Gaya Panchanpur Road,<br>Village Karhara, Post Fatehpur,<br>Gaya – 824236, Bihar, India<br><br>🌐 <a href="https://www.cusb.ac.in" target="_blank" style="color:#8B6010;">www.cusb.ac.in ↗</a><br>🗺️ <a href="' + c.mapLink + '" target="_blank" style="color:#8B6010;">View on Google Maps ↗</a>';

    if (intent === 'reach') { var rch = KB.reach; return '📍 <strong>How to Reach CUSB</strong><br><br>🚂 <strong>By Train:</strong> ' + rch.train + '<br><br>✈️ <strong>By Air:</strong> ' + rch.airport + '<br><br>🚌 <strong>By Road:</strong> ' + rch.road + '<br><br>🛺 <strong>Local Transport:</strong> ' + rch.local + '<br><br>🕌 <strong>Bonus:</strong> ' + rch.bodh + '<br><br>⚠️ <em>' + rch.note + '</em><br><br>🗺️ <a href="' + KB.contact.mapLink + '" target="_blank" style="color:#8B6010;">Open Google Maps ↗</a>'; }

    if (intent === 'admit') return '🎓 <strong>Admission Process at CUSB</strong><br><br><strong>🔵 UG / Integrated (BA LLB, BA BEd, BSc BEd):</strong><br>' + ad.ugProcess + '<br><br><strong>🟢 PG (M.A., M.Sc., MBA, MCA, LLM, etc.):</strong><br>' + ad.pgProcess + '<br><br><strong>📅 Important Dates 2026:</strong><br>• CUET-PG Exam: March 6–27, 2026<br>• CUET-UG Exam: May 11–31, 2026<br>• GATE 2026: Results Mar 19, 2026<br>• PG Merit List: June | UG Merit List: August<br><br>📋 <strong>Documents Needed:</strong> ' + ad.docsNeeded + '<br><br>🌐 Official Portal: <a href="https://cusbcuet.samarth.edu.in" target="_blank" style="color:#8B6010;">cusbcuet.samarth.edu.in ↗</a>';

    if (intent === 'cutoff') { var co = KB.cutoffs; return '📊 <strong>CUSB Cutoffs (2024 – CUET Scores)</strong><br><br>⚖️ <strong>BA LLB (Hons.):</strong> ' + co.baLlb + '<br>🧪 <strong>BSc B.Ed.:</strong> ' + co.bscBed + '<br>📖 <strong>BA B.Ed.:</strong> ' + co.baBed + '<br>📚 <strong>MA Programmes:</strong> ' + co.ma + '<br><br>⚠️ <em>' + co.note + '</em>'; }

    if (intent === 'fee') return '💰 <strong>Fee Structure at CUSB</strong> (per semester)<br><br>⚖️ <strong>BA LLB (5-yr):</strong> ' + f.baLlb + '<br>📖 <strong>BA B.Ed / BSc B.Ed:</strong> ' + f.baBed + '<br>📚 <strong>MA Programmes:</strong> ' + f.ma + '<br>🔬 <strong>M.Sc Programmes:</strong> ' + f.msc + '<br>💻 <strong>MCA:</strong> ' + f.mca + '<br>⚙️ <strong>M.Tech:</strong> ' + f.mtech + '<br>💼 <strong>MBA:</strong> ' + f.mba + '<br>💊 <strong>M.Pharm:</strong> ' + f.mpharm + '<br>⚖️ <strong>LLM:</strong> ' + f.llm + '<br>🔬 <strong>Ph.D:</strong> ' + f.phd + '<br>🏠 <strong>Hostel:</strong> ' + f.hostel + '<br><br>✅ <em>' + f.note + '</em>';

    if (intent === 'hostel') return '🏠 <strong>Hostel at CUSB</strong><br><br>👨‍🎓 <strong>Boys Hostel:</strong> ' + h.boys + '<br>👩‍🎓 <strong>Girls Hostel:</strong> ' + h.girls + '<br>💰 <strong>Fee:</strong> ' + h.fee + '<br>🍽️ <strong>Mess:</strong> ' + h.mess + '<br>🔧 <strong>Facilities:</strong> ' + h.facilities + '<br>📋 <strong>Allotment:</strong> ' + h.allotment + '<br>👥 <strong>Who gets hostel:</strong> ' + h.who + '<br><br>⚠️ <em>' + h.note + '</em>';

    if (intent === 'scholar') {
      var list = KB.scholarships.map(function(s){ return '🏅 <strong>' + s.name + '</strong> — ' + s.desc; }).join('<br>');
      return '🏆 <strong>Scholarships at CUSB</strong><br><br>' + list + '<br><br>📧 Contact: <strong>registrar@cub.ac.in</strong><br>🌐 Also check: <a href="https://scholarships.gov.in" target="_blank" style="color:#8B6010;">scholarships.gov.in ↗</a>';
    }

    if (intent === 'facility') { var fac = KB.facilities; return '🏛️ <strong>Campus Facilities at CUSB</strong><br><br>📚 <strong>Library:</strong> ' + fac.library + '<br>💻 <strong>Computer Lab:</strong> ' + fac.computers + '<br>⚽ <strong>Sports:</strong> ' + fac.sports + '<br>🏠 <strong>Hostels:</strong> ' + fac.hostel + '<br>🏥 <strong>Medical:</strong> ' + fac.medical + '<br>🏦 <strong>Bank & ATM:</strong> ' + fac.bank + '<br>🍽️ <strong>Cafeteria:</strong> ' + fac.cafeteria + '<br>📡 <strong>Wi-Fi:</strong> ' + fac.wifi + '<br>🚌 <strong>Transport:</strong> ' + fac.transport + '<br>🏨 <strong>Guest House:</strong> ' + fac.guesthouse; }

    if (intent === 'place') { var pl = KB.placement; return '💼 <strong>Placements at CUSB</strong> (NIRF 2025)<br><br>🏢 <strong>Placement Cell:</strong> ' + pl.cell + '<br>📊 <strong>Rate:</strong> ' + pl.rate + '<br>👥 <strong>Placed (2025):</strong> ' + pl.nirf2025 + '<br><br>💰 <strong>Median Packages:</strong><br>• UG (4-year): ' + pl.ug4yr_median + '<br>• UG (5-year BA LLB): ' + pl.ug5yr_median + '<br>• PG (2-year): ' + pl.pg2yr_median + '<br>• PG (1-year): ' + pl.pg1yr_median + '<br>• <strong>Highest Package:</strong> ' + pl.highest + '<br><br>🏭 <strong>Top Recruiters:</strong> ' + pl.recruiters + '<br><br>📧 Placement Cell: ' + pl.contact; }

    if (intent === 'schools') {
      var list = KB.schools.map(function(s){ return s.icon + ' <strong>' + s.name + '</strong>'; }).join('<br>');
      return '🏛️ <strong>CUSB has 13 Schools of Study</strong><br>(' + KB.courses.total + ')<br><br>' + list + '<br><br>Ask me about any specific school or programme for detailed info!';
    }

    if (intent === 'law') {
      var s = KB.schools.find(function(x){ return x.name.includes('Law'); });
      return '⚖️ <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + f.baLlb + '<br><br>📊 <strong>BA LLB Cutoff (2024):</strong> ' + KB.cutoffs.baLlb + '<br><br>CUSB is <strong>Ranked 23rd in Law (NIRF 2025)</strong> and BCI approved. Law students participate in Moot Courts, MUNs, and Debating Leagues.';
    }

    if (intent === 'mba') {
      var s = KB.schools.find(function(x){ return x.name.includes('Commerce'); });
      return '💼 <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + f.mba;
    }

    if (intent === 'mca') {
      var s = KB.schools.find(function(x){ return x.name.includes('Information Science'); });
      return '💻 <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + f.mca;
    }

    if (intent === 'phd') return '🔬 <strong>Ph.D Programmes at CUSB</strong><br><br>📚 Available in <strong>all 13 Schools</strong> (22+ programmes)<br><br>🎓 <strong>Admission:</strong> CUSB-ET (CUSB Entrance Test) + Interview<br>✅ UGC NET/JRF holders exempted from CUSB-ET<br>📋 <strong>Eligibility:</strong> ' + ad.phdElig + '<br>💰 <strong>Fee:</strong> ' + f.phd + '<br>🏆 <strong>Fellowship:</strong> UGC JRF = ₹31,000/month; SRF = ₹35,000/month<br><br>🌐 Apply at: <a href="https://www.cusb.ac.in" target="_blank" style="color:#8B6010;">www.cusb.ac.in ↗</a>';

    if (intent === 'bed') {
      var s = KB.schools.find(function(x){ return x.name.includes('Education'); });
      return '📖 <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + f.baBed + '<br><br>The integrated BA B.Ed. and BSc B.Ed. are 4-year programmes combining subject knowledge with pedagogy. School internships are included in the curriculum.';
    }

    if (intent === 'jmc') {
      var s = KB.schools.find(function(x){ return x.name.includes('Journalism'); });
      return '📰 <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + s.fee;
    }

    if (intent === 'mtech') {
      var s = KB.schools.find(function(x){ return x.name.includes('Engineering'); });
      return '⚙️ <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + f.mtech + '<br><br>📅 GATE 2026 Results: March 19, 2026';
    }

    if (intent === 'mpharm') {
      var s = KB.schools.find(function(x){ return x.name.includes('Health Sciences'); });
      return '💊 <strong>' + s.name + '</strong><br><br>📚 <strong>Programmes:</strong><br>' + s.programs.map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> ' + s.entrance + '<br>💰 <strong>Fee:</strong> ' + f.mpharm + '<br><br>CUSB is <strong>Ranked 63rd in Pharmacy (NIRF 2025)</strong>.<br>📅 GPAT 2026 application: expected April 2026.';
    }

    if (intent === 'msc') {
      var schs = KB.schools.filter(function(x){ return x.name.match(/Life Sciences|Physical Sciences|Mathematics|Environmental|Earth/); });
      var list = schs.map(function(s){ return s.icon + ' <strong>' + s.name + ':</strong> ' + s.programs.filter(function(p){ return p.startsWith('M.Sc'); }).join(', '); }).join('<br>');
      return '🔬 <strong>M.Sc / Science Programmes at CUSB</strong><br><br>' + list + '<br><br>🎓 <strong>Entrance:</strong> CUET-PG<br>💰 <strong>Fee:</strong> ' + f.msc + '<br>📋 <strong>Eligibility:</strong> B.Sc in relevant subject with 50% marks (General)';
    }

    if (intent === 'ma') {
      var s = KB.schools.find(function(x){ return x.name.includes('Social Sciences'); });
      var sh = KB.schools.find(function(x){ return x.name.includes('Humanities'); });
      return '📚 <strong>M.A. Programmes at CUSB</strong><br><br>' + s.icon + ' <strong>' + s.name + ':</strong><br>' + s.programs.filter(function(p){ return p.startsWith('M.A'); }).map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>' + sh.icon + ' <strong>' + sh.name + ':</strong><br>' + sh.programs.filter(function(p){ return p.startsWith('M.A'); }).map(function(p){ return '• ' + p; }).join('<br>') + '<br><br>🎓 <strong>Entrance:</strong> CUET-PG<br>💰 <strong>Fee:</strong> ' + f.ma + '<br>📋 <strong>Eligibility:</strong> Graduation in relevant subject with 50% marks';
    }

    if (intent === 'events') { var ev = KB.events; return '🎭 <strong>Student Life at CUSB</strong><br><br>🎪 <strong>Cultural Fest:</strong> ' + ev.fest + '<br>🏆 <strong>Sports Meet:</strong> ' + ev.sports + '<br>🎓 <strong>Convocation:</strong> ' + ev.convoc + '<br>🤝 <strong>NSS:</strong> ' + ev.nss + '<br>🎖️ <strong>NCC:</strong> ' + ev.ncc + '<br>⚖️ <strong>Law Events:</strong> ' + ev.moot + '<br>🎭 <strong>Clubs:</strong> ' + ev.clubs + '<br>🏫 <strong>Internship:</strong> ' + ev.intern; }

    if (intent === 'intl') { var intl = KB.international; return '🌍 <strong>International Students at CUSB</strong><br><br>🏢 ' + intl.office + '<br>✅ ' + intl.accepts + '<br>💰 <strong>Fees:</strong> ' + intl.fees + '<br>🎓 <strong>Scholarships:</strong> ' + intl.schemes + '<br><br>📧 Contact OIA: <strong>registrar@cub.ac.in</strong>'; }

    if (intent === 'cells') {
      var list = KB.cells.map(function(c){ return '✅ ' + c; }).join('<br>');
      return '🏛️ <strong>Student Welfare Cells at CUSB</strong><br><br>' + list;
    }

    if (intent === 'web') return '🌐 <strong>CUSB Official Links</strong><br><br>🏛️ <strong>Main Website:</strong> <a href="https://www.cusb.ac.in" target="_blank" style="color:#8B6010;">www.cusb.ac.in ↗</a><br>🎓 <strong>Admission Portal:</strong> <a href="https://cusbcuet.samarth.edu.in" target="_blank" style="color:#8B6010;">cusbcuet.samarth.edu.in ↗</a><br>📝 <strong>CUET UG/PG:</strong> <a href="https://cuet.nta.nic.in" target="_blank" style="color:#8B6010;">cuet.nta.nic.in ↗</a><br>🏆 <strong>Scholarships:</strong> <a href="https://scholarships.gov.in" target="_blank" style="color:#8B6010;">scholarships.gov.in ↗</a><br>📊 <strong>NIRF Ranking:</strong> <a href="https://www.nirfindia.org" target="_blank" style="color:#8B6010;">nirfindia.org ↗</a>';

    // unknown
    var r = fallbacks[fbi % fallbacks.length]; fbi++; return r;
  }

  /* =========================================================
     UI FUNCTIONS
     ========================================================= */
  window.cusbToggleChat = function() {
    cusbOpen = !cusbOpen;
    var win = document.getElementById('cusb-chat-window');
    var btn = document.getElementById('cusb-chat-trigger');
    win.classList.toggle('open', cusbOpen);
    btn.classList.toggle('open', cusbOpen);
    if (cusbOpen && !cusbGreeted) {
      cusbGreeted = true;
      setTimeout(function() {
        cusbAddMessage('bot', 'Namaskar! 🙏 I\'m the <strong>CUSB AI Assistant</strong>.<br><br>I\'m loaded with <strong>real official data</strong> about admissions, fees, hostels, courses, rankings, placements and more — all fetched from the official CUSB website and NIRF reports.<br><br>What would you like to know?');
      }, 300);
    }
    if (cusbOpen) setTimeout(function() { document.getElementById('cusb-input').focus(); }, 400);
  };

  function cusbAddMessage(role, html) {
    var msgs = document.getElementById('cusb-messages');
    var div = document.createElement('div');
    div.className = 'cusb-msg ' + role;
    var avatar = role === 'bot' ? '🎓' : '👤';
    div.innerHTML = '<div class="cusb-msg-avatar">' + avatar + '</div><div class="cusb-msg-bubble">' + html + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function cusbShowTyping() {
    var msgs = document.getElementById('cusb-messages');
    var div = document.createElement('div');
    div.className = 'cusb-msg bot cusb-typing'; div.id = 'cusb-typing-ind';
    div.innerHTML = '<div class="cusb-msg-avatar">🎓</div><div class="cusb-msg-bubble"><div class="cusb-typing-dot"></div><div class="cusb-typing-dot"></div><div class="cusb-typing-dot"></div></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function cusbHideTyping() {
    var el = document.getElementById('cusb-typing-ind');
    if (el) el.remove();
  }

  window.cusbSendSugg = function(btn) {
    var text = btn.textContent.replace(/^[^\w\s]+\s*/, '').trim();
    document.getElementById('cusb-input').value = text;
    cusbSendMessage();
  };

  window.cusbSendMessage = function() {
    var input = document.getElementById('cusb-input');
    var text = input.value.trim();
    if (!text) return;
    cusbAddMessage('user', text.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    input.value = ''; input.style.height = 'auto';
    document.getElementById('cusb-send').disabled = true;
    cusbShowTyping();
    var delay = 120 + Math.floor(Math.random() * 130);
    setTimeout(function() {
      cusbHideTyping();
      cusbAddMessage('bot', reply(classify(text)));
      document.getElementById('cusb-send').disabled = false;
      document.getElementById('cusb-input').focus();
    }, delay);
  };

  document.addEventListener('DOMContentLoaded', function() {
    var inp = document.getElementById('cusb-input');
    if (!inp) return;
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); cusbSendMessage(); }
    });
    inp.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
  });
})();


/* ========== section ========== */


// ── Library Portal JS ──
function openLibraryPortal() {
  var p = document.getElementById('lib-portal');
  p.classList.add('lib-open');
  document.body.style.overflow = 'hidden';
}
function closeLibraryPortal() {
  var p = document.getElementById('lib-portal');
  p.classList.remove('lib-open');
  document.body.style.overflow = '';
}
function libSwitchTab(id, el) {
  document.querySelectorAll('.lib-panel').forEach(function(t){ t.classList.remove('lib-active'); });
  document.querySelectorAll('.lib-tab').forEach(function(t){ t.classList.remove('lib-active'); });
  var panel = document.getElementById('lib-tab-' + id);
  if (panel) panel.classList.add('lib-active');
  if (el && el.classList) el.classList.add('lib-active');
}
// Close on backdrop click
document.getElementById('lib-portal').addEventListener('click', function(e){
  if (e.target === this) closeLibraryPortal();
});
// Close on Escape
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closeLibraryPortal();
});
