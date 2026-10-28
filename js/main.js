/* Мастерская «Линия» — интерактив лендинга */
(function () {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* приватный режим */ } }
  };

  /* ---------- Шапка ---------- */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  const burger = $('[data-burger]');
  const menu = $('[data-mobile-menu]');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (burger.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 300);
    }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Активный пункт меню ---------- */
  const navLinks = $$('.nav__list a');
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) sectionIo.observe(s); });

  /* ---------- Бесконечная лента в hero ---------- */
  $$('.hero__track').forEach((track) => {
    Array.from(track.children).forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('img', clone).forEach((img) => { img.alt = ''; img.loading = 'lazy'; });
      track.appendChild(clone);
    });
  });

  /* ---------- Появление блоков ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = Math.min(siblings.indexOf(el), 5) * 80 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Карусель каталога ---------- */
  const carousel = $('[data-carousel]');
  const prev = $('[data-carousel-prev]');
  const next = $('[data-carousel-next]');
  if (carousel) {
    const step = () => {
      const card = carousel.firstElementChild;
      return card ? card.getBoundingClientRect().width + 20 : 320;
    };
    const update = () => {
      const max = carousel.scrollWidth - carousel.clientWidth - 2;
      prev.disabled = carousel.scrollLeft <= 2;
      next.disabled = carousel.scrollLeft >= max;
    };
    prev.addEventListener('click', () => carousel.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: 'smooth' }));
    carousel.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Портфолио: до/после + кейсы ---------- */
  const IMG = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  const cases = [
    {
      img: '1558997519-83ea9252edf8',
      rows: [
        ['Объект', 'Гардеробная в нише 1,6 м², ЖК «Символ»'],
        ['Задача', 'Вместить одежду семьи из трёх человек'],
        ['Решение', 'П-образное наполнение, выдвижные корзины, подсветка по датчику движения'],
        ['Материалы', 'ЛДСП Egger, фасады в шпоне дуба'],
        ['Фурнитура', 'Blum Tandembox, пантограф Hettich'],
        ['Срок', '16 дней'],
        ['Стоимость', '168 000 ₽']
      ]
    },
    {
      img: '1600489000022-c2086d79f9d4',
      rows: [
        ['Объект', 'Кухня в хрущёвке 5,8 м²'],
        ['Задача', 'Встроить посудомойку и холодильник'],
        ['Решение', 'Верхние шкафы до потолка, узкая ПММ 45 см, подоконник-столешница'],
        ['Материалы', 'МДФ в плёнке «графит», столешница HPL'],
        ['Фурнитура', 'Blum Legrabox, подъёмники Aventos'],
        ['Срок', '21 день'],
        ['Стоимость', '214 000 ₽']
      ]
    },
    {
      img: '1586023492125-27b2c045efd7',
      rows: [
        ['Объект', 'Шкаф-купе в прихожую со скосом'],
        ['Задача', 'Коридор с балкой и трубой отопления'],
        ['Решение', 'Шкаф обходит коммуникации, фасады маскируют короб'],
        ['Материалы', 'ЛДСП Kronospan, зеркало с пескоструем'],
        ['Фурнитура', 'Профиль Aristo, доводчики дверей'],
        ['Срок', '14 дней'],
        ['Стоимость', '96 000 ₽']
      ]
    }
  ];

  const ba = $('[data-ba]');
  const range = $('[data-ba-range]');
  const table = $('[data-case-table]');
  const caseImgs = $$('[data-case-img]');
  const tabs = $$('[data-case]');

  if (range) {
    range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));
  }

  function renderCase(i) {
    const c = cases[i];
    table.innerHTML = c.rows.map((r, idx) => {
      const accent = idx === c.rows.length - 1 ? ' class="is-accent"' : '';
      return `<tr${accent} style="animation-delay:${idx * 40}ms"><td>${r[0]}</td><td>${r[1]}</td></tr>`;
    }).join('');

    const src = IMG(c.img, 1100);
    if (caseImgs[0].getAttribute('src') !== src) {
      ba.classList.add('is-loading');
      const pre = new Image();
      pre.onload = pre.onerror = () => {
        caseImgs.forEach((img) => { img.src = src; });
        ba.classList.remove('is-loading');
      };
      pre.src = src;
    }
    tabs.forEach((t, idx) => {
      t.setAttribute('aria-selected', String(idx === i));
      t.tabIndex = idx === i ? 0 : -1;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => renderCase(i));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[n].focus();
      renderCase(n);
    });
  });
  if (table) renderCase(0);

  const moreBtn = $('[data-more-btn]');
  const moreWorks = $('[data-more-works]');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      const open = moreWorks.hidden;
      moreWorks.hidden = !open;
      moreBtn.setAttribute('aria-expanded', String(open));
      moreBtn.textContent = open ? 'Свернуть' : 'Показать ещё проекты';
      if (!open) $('#works').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Маска телефона ---------- */
  function formatPhone(value) {
    let d = value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    let out = '+7';
    if (p[0]) out += ' (' + p[0];
    if (p[0].length === 3) out += ')';
    if (p[1]) out += ' ' + p[1];
    if (p[2]) out += '-' + p[2];
    if (p[3]) out += '-' + p[3];
    return out;
  }
  const phoneValid = (v) => v.replace(/\D/g, '').length === 11;

  $$('[data-phone]').forEach((input) => {
    input.addEventListener('focus', () => { if (!input.value) input.value = '+7 '; });
    input.addEventListener('blur', () => { if (input.value.replace(/\D/g, '') === '7') input.value = ''; });
    input.addEventListener('input', () => {
      input.value = formatPhone(input.value);
      if (phoneValid(input.value)) input.closest('.field').classList.remove('is-invalid');
    });
  });

  function checkPhone(form) {
    const input = $('[data-phone]', form);
    const ok = phoneValid(input.value);
    input.closest('.field').classList.toggle('is-invalid', !ok);
    if (!ok) input.focus();
    return ok;
  }

  /* ---------- Формы заявки ---------- */
  $$('[data-lead-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!checkPhone(form)) return;
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.dataset.label = btn.dataset.label || btn.textContent;
      btn.textContent = 'Отправляем…';
      // Здесь будет отправка на сервер / в CRM
      setTimeout(() => {
        btn.textContent = btn.dataset.label;
        btn.disabled = false;
        form.reset();
        const fileName = $('[data-file-name]', form);
        if (fileName) fileName.textContent = 'Фото или план (необязательно)';
        $('[data-done]', form).hidden = false;
        store.set('lead', '1');
      }, 700);
    });
  });

  $$('[data-file]').forEach((input) => {
    input.addEventListener('change', () => {
      const label = input.parentElement.querySelector('[data-file-name]');
      label.textContent = input.files[0] ? input.files[0].name : 'Фото или план (необязательно)';
    });
  });

  /* ---------- Квиз ---------- */
  const quiz = $('[data-quiz]');
  if (quiz) {
    const steps = $$('[data-step]', quiz);
    const bar = $('[data-quiz-bar]', quiz);
    const count = $('[data-quiz-count]', quiz);
    const btnPrev = $('[data-quiz-prev]', quiz);
    const btnNext = $('[data-quiz-next]', quiz);
    const nav = $('[data-quiz-nav]', quiz);
    const estimate = $('[data-estimate]', quiz);
    const total = steps.length - 1; // последний шаг — контакты
    let current = 0;

    const answered = (i) => !!$('input[type="radio"]:checked', steps[i]);
    const rub = (n) => Math.round(n / 1000) * 1000;
    const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

    function calc() {
      const type = $('input[name="type"]:checked', quiz);
      const length = parseFloat(($('input[name="length"]:checked', quiz) || {}).value || '0');
      const facade = parseFloat(($('input[name="facade"]:checked', quiz) || {}).value || '1');
      const base = parseFloat(type ? type.dataset.price : '22000');
      const meters = length || 2.5;
      const sum = base * meters * facade;
      return length
        ? `${fmt(rub(sum * 0.85))} — ${fmt(rub(sum * 1.15))}`
        : `от ${fmt(rub(base * 1.5 * facade))}`;
    }

    function go(i) {
      steps[current].classList.remove('is-active');
      current = i;
      steps[current].classList.add('is-active');
      const isFinal = current === total;
      bar.style.width = ((current + 1) / steps.length) * 100 + '%';
      count.textContent = isFinal ? 'Последний шаг' : `Вопрос ${current + 1} из ${total}`;
      btnPrev.disabled = current === 0;
      btnNext.hidden = isFinal;
      btnNext.disabled = !answered(current);
      if (isFinal) {
        estimate.textContent = calc();
        setTimeout(() => $('[data-phone]', quiz).focus({ preventScroll: true }), 50);
      }
    }

    quiz.addEventListener('change', (e) => {
      if (e.target.type !== 'radio') return;
      btnNext.disabled = false;
      // автопереход после выбора
      clearTimeout(quiz._t);
      quiz._t = setTimeout(() => { if (current < total) go(current + 1); }, 320);
    });
    btnNext.addEventListener('click', () => { if (answered(current)) go(current + 1); });
    btnPrev.addEventListener('click', () => { if (current > 0) go(current - 1); });

    quiz.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!checkPhone(quiz)) return;
      steps.forEach((s) => s.classList.remove('is-active'));
      nav.hidden = true;
      bar.style.width = '100%';
      count.textContent = 'Готово';
      $('[data-quiz-done]', quiz).hidden = false;
      store.set('lead', '1');
    });

    go(0);
  }

  /* ---------- Таймер акции (до конца месяца) ---------- */
  const monthsIn = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
  const now = new Date();
  const monthEl = $('[data-month]');
  if (monthEl) monthEl.textContent = monthsIn[now.getMonth()];

  const timer = $('[data-timer]');
  if (timer) {
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    const parts = { d: $('[data-t="d"]', timer), h: $('[data-t="h"]', timer), m: $('[data-t="m"]', timer), s: $('[data-t="s"]', timer) };
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const s = Math.floor(diff / 1000);
      parts.d.textContent = pad(Math.floor(s / 86400));
      parts.h.textContent = pad(Math.floor((s % 86400) / 3600));
      parts.m.textContent = pad(Math.floor((s % 3600) / 60));
      parts.s.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Модальные окна ---------- */
  let openModal = null;
  let lastFocus = null;

  function showModal(name) {
    const modal = $(`[data-modal="${name}"]`);
    if (!modal) return;
    if (openModal) hideModal();
    if (burger.getAttribute('aria-expanded') === 'true') setMenu(false);
    lastFocus = document.activeElement;
    $$('[data-done]', modal).forEach((d) => { d.hidden = true; });
    modal.hidden = false;
    openModal = modal;
    document.body.classList.add('is-locked');
    const first = $('input', modal);
    setTimeout(() => (first || $('.modal__close', modal)).focus(), 60);
  }
  function hideModal() {
    if (!openModal) return;
    openModal.hidden = true;
    openModal = null;
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) { e.preventDefault(); showModal(opener.dataset.modalOpen); return; }
    if (e.target.closest('[data-modal-close]')) hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (openModal) hideModal();
      else if (burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
    }
    if (e.key === 'Tab' && openModal) { // удерживаем фокус внутри окна
      const f = $$('button, input, a[href]', openModal).filter((el) => !el.disabled && el.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Попап при уходе (только десктоп, раз за сессию) ---------- */
  const fine = window.matchMedia('(pointer: fine)').matches;
  const startedAt = Date.now();
  if (fine) {
    document.addEventListener('mouseout', (e) => {
      if (e.relatedTarget || e.clientY > 0) return;
      if (openModal || Date.now() - startedAt < 15000) return;
      if (store.get('exitShown') || store.get('lead')) return;
      store.set('exitShown', '1');
      showModal('exit');
    });
  }

  /* ---------- Плавающая кнопка на мобильных ---------- */
  const floatCta = $('[data-float-cta]');
  const hero = $('.hero');
  const hideZones = [$('#quiz'), $('#contacts')];
  const visible = new Set();
  let pastHero = false;
  const syncFloat = () => floatCta.classList.toggle('is-visible', pastHero && visible.size === 0);

  new IntersectionObserver(([entry]) => { pastHero = !entry.isIntersecting; syncFloat(); }).observe(hero);
  const zoneIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target); });
    syncFloat();
  });
  hideZones.forEach((z) => z && zoneIo.observe(z));
})();
