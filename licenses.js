document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const contents = document.querySelectorAll('.license-content');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);

      if (!targetContent) return;

      // 다른 콘텐츠 숨기기
      contents.forEach(c => {
        if (c !== targetContent) {
          c.style.display = 'none';
        }
      });

      // 클릭한 카드의 콘텐츠 토글
      if (targetContent.style.display === 'block') {
        targetContent.style.display = 'none';
      } else {
        targetContent.style.display = 'block';
        // 화면 상단으로 스크롤
        targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
