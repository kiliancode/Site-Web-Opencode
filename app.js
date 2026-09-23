(function () {
  'use strict';

  document.body.classList.add('js');

  var Toast = (function () {
    var el = document.getElementById('toast');
    var timer = null;
    function show(msg) {
      el.textContent = msg;
      el.classList.add('is-visible');
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { el.classList.remove('is-visible'); }, 3600);
    }
    return { show: show };
  })();

  /* ---------- Preloader ---------- */
  (function () {
    var pre = document.getElementById('preloader');
    var count = document.getElementById('preloaderCount');
    var start = null;
    var DURATION = 1300;

    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(eased * 100);
      count.textContent = String(val).padStart(3, '0');
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        window.setTimeout(function () {
          pre.classList.add('done');
        }, 300);
      }
    }
    requestAnimationFrame(tick);
  })();

  /* ---------- Header ---------- */
  (function () {
    var header = document.getElementById('header');
    var lastY = window.scrollY;

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      header.classList.toggle('is-solid', y > 60);

      var dir = y > lastY && y > 160;
      header.classList.toggle('is-hidden', dir && !navMenu.classList.contains('is-open'));
      lastY = y;
    }, { passive: true });

    var burger = document.getElementById('burgerBtn');
    var navMenu = document.getElementById('navMenu');

    burger.addEventListener('click', function () {
      var open = navMenu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
        header.classList.remove('is-hidden');
      });
    });
  })();

  /* ---------- Négociation de section (scrollspy) ---------- */
  (function () {
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

    function onScroll() {
      var pos = window.scrollY + 140;
      var current = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) current = s.id;
      });
      links.forEach(function (l) {
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Révélations ---------- */
  (function () {
    var targets = Array.prototype.slice.call(
      document.querySelectorAll('.table .display, .editions .display, .rituel .display, .paroles .display, .adresse .display, .footer .display')
    );
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ---------- Compteurs ---------- */
  (function () {
    var nums = Array.prototype.slice.call(document.querySelectorAll('.stat-num'));
    if (!nums.length) return;

    function count(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var t0 = null;
      var DURATION = 1500;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / DURATION, 1);
        el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) { nums.forEach(count); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { count(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- Éditions (menu) ---------- */
  (function () {
    var data = {
      automne: {
        ref: 'N° 026 — Édition Automne',
        price: '9 temps · 145 €',
        rows: [
          { i: '01', title: 'La brasée', text: 'châtaignes fumées · beurre de noisette · peau de lait', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
          { i: '02', title: 'Le marais', text: "huître d'Utah Beach · vinaigre de cidre bouché · pomme râpée", img: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80' },
          { i: '03', title: 'Le sous-bois', text: 'cèpes en trois façons · émulsion de mousseux de Bourgogne', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80' },
          { i: '04', title: "L'oie voilée", text: 'foie persillé · salsifis · coing au poivre de Kampot', img: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80' },
          { i: '05', title: "Le potager d'hiver", text: 'panais confits · chou de Bruxelles · crème de mimolette', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
          { i: '06', title: 'Le banyuls', text: 'poire rôtie · chocolat noir 88% · caramel champignon', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' }
        ]
      },
      ete: {
        ref: 'N° 025 — Édition Été',
        price: '9 temps · 135 €',
        rows: [
          { i: '01', title: 'Raisin vert', text: 'merlan de ligne · sarrasin croquant · aigre-doux de verjus', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
          { i: '02', title: 'Écrevisse', text: 'queue rôtie · bouillon de tomate cerise · huile de carotte', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80' },
          { i: '03', title: 'Coquillage', text: 'couteaux de mer · poireaux · câpres au gingembre', img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80' },
          { i: '04', title: "L'abricot", text: 'foie gras mi-cuit · abricot rôti · amande amère', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80' },
          { i: '05', title: 'Le jardin', text: 'courgette fleur · tétragone · émulsion de parmesan', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
          { i: '06', title: 'Fraise du pays', text: 'gariguette · meringue noisette · thym citron', img: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=600&q=80' }
        ]
      },
      printemps: {
        ref: 'N° 024 — Édition Printemps',
        price: '9 temps · 125 €',
        rows: [
          { i: '01', title: 'Aspérule', text: 'truite de rivière · chair crue · oxalide', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
          { i: '02', title: "L'ail des ours", text: 'rizotto au beurre de foin · ail des ours · citron confit', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
          { i: '03', title: 'La rhubarbe', text: 'saint-jacques snackée · rhubarbe fumée · câprier', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' },
          { i: '04', title: "L'asperge", text: 'asperge verte des sables · jaune d\u2019œuf coulant · sabayon au muscat', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80' },
          { i: '05', title: "L'ortie", text: 'veau de lait · ortie · avoine fermentée · jus corsé', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
          { i: '06', title: 'Muguet', text: 'sorbet muguet · pêche blanche · meringue', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' }
        ]
      }
    };

    var tabs = Array.prototype.slice.call(document.querySelectorAll('.edition-tab'));
    var list = document.getElementById('menuList');
    var refEl = document.getElementById('sheetRef');
    var priceEl = document.querySelector('.sheet-price');

    function render(rows) {
      list.innerHTML = rows.map(function (r) {
        return '<li class="menu-row" data-img="' + r.img + '">' +
          '<span class="row-index">' + r.i + '</span>' +
          '<span class="row-title">' + r.title + '</span>' +
          '<span class="row-text">' + r.text + '</span>' +
          '<span class="row-more">ouvrir</span>' +
          '</li>';
      }).join('');
      bindRows();
    }

    function bindRows() {
      Array.prototype.forEach.call(list.querySelectorAll('.menu-row'), function (row) {
        row.addEventListener('mouseenter', function () { row.classList.add('is-hot'); });
        row.addEventListener('mouseleave', function () { row.classList.remove('is-hot'); });
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        var edition = data[tab.getAttribute('data-edition')];
        refEl.textContent = edition.ref;
        priceEl.textContent = edition.price;
        render(edition.rows);
      });
    });

    bindRows();
  })();

  /* ---------- Aperçu flottant ---------- */
  (function () {
    var preview = document.getElementById('preview');
    var img = document.getElementById('previewImg');
    if (!preview) return;

    var list = document.getElementById('menuList');

    list.addEventListener('mouseover', function (e) {
      var row = e.target.closest('.menu-row');
      if (!row) { preview.classList.remove('is-visible'); return; }
      img.src = row.getAttribute('data-img');
      preview.classList.add('is-visible');
    });

    list.addEventListener('mousemove', function (e) {
      var x = e.clientX;
      var y = e.clientY;
      var pad = 20;
      var left = Math.max(pad, Math.min(x, window.innerWidth - preview.offsetWidth - pad));
      var top = Math.max(pad, y - preview.offsetHeight - 18);
      preview.style.left = left + 'px';
      preview.style.top = top + 'px';
    });

    list.addEventListener('mouseleave', function () {
      preview.classList.remove('is-visible');
    });
  })();

  /* ---------- Pellicule archives ---------- */
  (function () {
    var strip = document.getElementById('strip');
    if (!strip) return;
    var left = document.getElementById('stripLeft');
    var right = document.getElementById('stripRight');

    right.addEventListener('click', function () { strip.scrollBy({ left: 420, behavior: 'smooth' }); });
    left.addEventListener('click', function () { strip.scrollBy({ left: -420, behavior: 'smooth' }); });

    var down = false, startX = 0, base = 0;
    strip.addEventListener('mousedown', function (e) {
      down = true; startX = e.pageX; base = strip.scrollLeft;
      strip.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', function () {
      down = false; strip.style.cursor = '';
    });
    strip.addEventListener('mousemove', function (e) {
      if (!down) return;
      strip.scrollLeft = base - (e.pageX - startX);
    });
  })();

  /* ---------- Carrousel de paroles ---------- */
  (function () {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;
    var voices = Array.prototype.slice.call(carousel.querySelectorAll('.voix'));
    var dotsWrap = document.getElementById('voixDots');
    var bar = document.getElementById('voixBar');
    var index = 0;
    var timer = null;
    var INTERVAL = 6000;

    voices.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Parole ' + (i + 1));
      if (i === 0) b.classList.add('is-on');
      b.addEventListener('click', function () {
        go(i);
        carousel.classList.remove('is-playing');
        void carousel.offsetWidth;
        carousel.classList.add('is-playing');
      });
      dotsWrap.appendChild(b);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i) {
      index = (i + voices.length) % voices.length;
      voices.forEach(function (v, j) { v.classList.toggle('is-active', j === index); });
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === index); });
      carousel.setAttribute('data-index', index);
    }

    function play() {
      carousel.classList.remove('is-playing');
      void carousel.offsetWidth;
      carousel.classList.add('is-playing');
      timer = window.setTimeout(function () {
        go(index + 1);
        play();
      }, INTERVAL);
    }

    play();
  })();

  /* ---------- Formulaires ---------- */
  (function () {
    var contact = document.getElementById('contactForm');
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      contact.reset();
      Toast.show('Feuillet acheminé — réponse sous 24 h.');
    });

    var news = document.getElementById('newsForm');
    news.addEventListener('submit', function (e) {
      e.preventDefault();
      news.reset();
      Toast.show('Vous êtes au second tirage.');
    });
  })();

  /* ---------- Carnet de réservation (wizard) ---------- */
  (function () {
    var modal = document.getElementById('bookingModal');
    var closeX = document.getElementById('modalClose');
    var form = document.getElementById('bookingForm');
    var wsent = document.getElementById('wsent');
    var wsentRef = document.getElementById('wsentRef');
    var wsentClose = document.getElementById('wsentClose');
    var pips = Array.prototype.slice.call(document.querySelectorAll('.step-pip'));
    var steps = Array.prototype.slice.call(document.querySelectorAll('.wstep'));
    var current = 1;

    function showStep(n) {
      current = n;
      steps.forEach(function (s) { s.classList.toggle('is-on', parseInt(s.dataset.step, 10) === n); });
      pips.forEach(function (p) { p.classList.toggle('is-on', parseInt(p.getAttribute('data-step'), 10) <= n); });
    }

    function validStep(n) {
      var step = steps[n - 1];
      var required = step.querySelectorAll('input[required]');
      var ok = true;
      required.forEach(function (input) {
        if (!input.checkValidity()) { ok = false; input.reportValidity(); }
      });
      return ok;
    }

    document.querySelectorAll('.open-booking').forEach(function (btn) {
      btn.addEventListener('click', function () {
        form.classList.remove('hidden');
        wsent.classList.add('hidden');
        showStep(1);
        modal.showModal();
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.close();
      document.body.style.overflow = '';
      form.reset();
    }

    closeX.addEventListener('click', closeModal);
    wsentClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    Array.prototype.forEach.call(document.querySelectorAll('.wnext'), function (btn) {
      btn.addEventListener('click', function () {
        if (!validStep(current)) return;
        if (current === 2) fillReceipt();
        showStep(current + 1);
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.wback'), function (btn) {
      btn.addEventListener('click', function () { showStep(current - 1); });
    });

    var get = function (id) { return document.getElementById(id); };

    function readVal(id) {
      var el = get(id);
      return el ? el.value.trim() : '';
    }

    var rcMap = [
      ['rcDate', 'bkDate'],
      ['rcService', 'bkService'],
      ['rcGuests', 'bkGuests'],
      ['rcName', 'bkName'],
      ['rcMail', 'bkMail']
    ];

    function fillReceipt() {
      rcMap.forEach(function (pair) {
        var dd = get(pair[0]);
        var src = get(pair[1]);
        if (src && src.tagName === 'SELECT') {
          dd.textContent = src.options[src.selectedIndex].textContent;
        } else if (src) {
          dd.textContent = src.value;
        }
        void dd;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validStep(current)) return;
      var ref = 'IN-ED-' + Math.floor(1000 + Math.random() * 9000);
      wsentRef.textContent = ref;
      form.classList.add('hidden');
      wsent.classList.remove('hidden');
      Toast.show('Demande transmise — ' + ref);
    });
  })();
})();