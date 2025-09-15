document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');
  const closeBtn = document.querySelector('.modal-close');

  // 카드 클릭 → 숨겨진 콘텐츠 보여주기
  document.querySelectorAll('.license-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-target');
      const content = document.getElementById(targetId);
      if (!content) return;

      modalTitle.textContent = card.querySelector('h3').innerText;
      modalBody.innerHTML = content.innerHTML;
      modal.classList.add('open');

      // 목차 하이라이트 기능
      setupTOCHighlight();
    });
  });

  // 닫기
  function closeModal() {
    modal.classList.remove('open');
    modalBody.innerHTML = '';
  }
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // 목차 하이라이트
  function setupTOCHighlight() {
    const links = modalBody.querySelectorAll('.toc a');
    const sections = [...modalBody.querySelectorAll('h3[id]')];

    if (!links.length || !sections.length) return;

    modalBody.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - modalBody.scrollTop;
        if (top <= 50) current = sec.getAttribute('id');
      });

      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });

    // 링크 클릭 → 스무스 스크롤
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href').substring(1);
        const target = modalBody.querySelector('#' + id);
        if (target) {
          modalBody.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
      });
    });
  }
});
