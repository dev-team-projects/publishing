document.addEventListener('DOMContentLoaded', () => {
  // 사이드바 토글 버튼 클릭 이벤트 위임
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.sidebar__toggle-btn');
    if (!btn) return;

    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // 모든 서브메뉴 닫기 (하나만 열리도록)
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
        if (relatedBtn) {
          relatedBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // 이미 열려있던 패널이면 여기서 종료
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
