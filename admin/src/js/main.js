document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
   * Header Dropdowns (Alarm / Profile)
   * - hidden 속성 + aria-expanded 동기화
   * - 바깥 클릭 & ESC 닫기
   * =========================== */
  const dropdownMap = [
    {
      btn: document.getElementById('btn-alarm'),
      panel: document.getElementById('alarm-dropdown'),
    },
    {
      btn: document.getElementById('btn-profile'),
      panel: document.getElementById('profile-dropdown'),
    },
  ].filter(({ btn, panel }) => btn && panel);

  // 초기 상태 정리
  dropdownMap.forEach(({ btn, panel }) => {
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true; // CSS와 일관
  });

  const closeAll = () => {
    dropdownMap.forEach(({ btn, panel }) => {
      if (!panel.hidden) {
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const toggleDropdown = (btn, panel) => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    closeAll();
    if (!isOpen) {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      // 첫 포커스 가능한 요소로 포커스 이동(있으면)
      const focusable = panel.querySelector(
        'a, button, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus({ preventScroll: true });
    }
  };

  dropdownMap.forEach(({ btn, panel }) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(btn, panel);
    });
    // 패널 내부 클릭은 전파 중단(바깥 클릭 닫힘 방지)
    panel.addEventListener('click', (e) => e.stopPropagation());
  });

  // 바깥 클릭 시 닫기
  document.addEventListener('click', () => closeAll());

  // ESC로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  /* ===========================
   * Sidebar Accordion (기존 로직 유지)
   * =========================== */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.sidebar__toggle-btn');
    if (!btn) return;

    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // 모든 서브메뉴 닫기 (하나만 열기)
    const wrappers = document.getElementsByClassName(
      'sidebar__submenu-wrapper'
    );
    Array.from(wrappers).forEach((el) => {
      if (el.classList.contains('is-open')) {
        const currentHeight = el.scrollHeight;
        el.style.height = `${currentHeight}px`;
        el.offsetHeight; // 강제 리플로우
        el.style.height = '0px';
        el.classList.remove('is-open');
        el.setAttribute('aria-hidden', 'true');
        const relatedBtn = document.querySelector(
          `.sidebar__toggle-btn[aria-controls="${el.id}"]`
        );
        if (relatedBtn) relatedBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // 이미 열려있던 패널이면 종료(=모두 닫힌 상태 유지)
    if (isOpen) return;

    // 열기
    panel.style.height = 'auto';
    const targetHeight = panel.scrollHeight;
    panel.style.height = '0px';
    panel.offsetHeight; // 강제 리플로우
    panel.style.height = `${targetHeight}px`;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');

    // 전환 끝나면 height:auto로 고정 (내용 변화 대응)
    const onOpenEnd = (evt) => {
      if (evt.propertyName === 'height') {
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', onOpenEnd);
      }
    };
    panel.addEventListener('transitionend', onOpenEnd);
  });

  // 키보드 접근(Enter/Space)
  document.addEventListener('keydown', (e) => {
    if (
      (e.key === 'Enter' || e.key === ' ') &&
      e.target.closest('.sidebar__toggle-btn')
    ) {
      e.preventDefault();
      e.target.click();
    }
  });
});
