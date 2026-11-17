(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 햄버거 메뉴
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', '메뉴 열기');
      }
    });
  }

  // 2. 글자 타이핑 효과
  var typing = document.getElementById('typing');
  if (typing) {
    var text = typing.getAttribute('data-text') || '';
    if (reduceMotion) {
      typing.textContent = text;
      typing.classList.add('done');
    } else {
      var i = 0;
      (function type() {
        typing.textContent = text.slice(0, i);
        if (i < text.length) {
          i++;
          setTimeout(type, 60);
        } else {
          typing.classList.add('done');
        }
      })();
    }
  }

  // 3. 스크롤하면 서서히 나타나기
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // 4. 숫자 올라가기
  var counters = document.querySelectorAll('.count');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var duration = 800;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(target * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  // 5. 이메일 주소 조합 (스팸 수집 방지)
  var emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    var user = 'dauniiii';
    var domain = 'naver' + '.com';
    emailBtn.href = 'mail' + 'to:' + user + '@' + domain;
    emailBtn.setAttribute('aria-label', '이메일 보내기 ' + user + '@' + domain);
  }

  // 6. 푸터 연도
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
