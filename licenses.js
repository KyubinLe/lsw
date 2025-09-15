// 카드 클릭 시 내용 토글
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.dataset.target;
    const content = document.getElementById(targetId);
    const isVisible = content.style.display === 'block';
    
    document.querySelectorAll('.license-content').forEach(c => c.style.display = 'none');
    if (!isVisible) {
      content.style.display = 'block';
      content.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 목차 클릭 시 스크롤 이동
document.querySelectorAll('.toc a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// 상단 이동 버튼
const topBtns = document.querySelectorAll('.topBtn');
window.addEventListener('scroll', () => {
  topBtns.forEach(btn => btn.style.display = window.scrollY > 300 ? 'block' : 'none');
});

topBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
