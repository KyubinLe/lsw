document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const popupTitle = document.getElementById('popup-title');
  const licenseInput = document.getElementById('license');
  const applyButtons = document.querySelectorAll('.apply-btn');
  const closeBtn = document.querySelector('.close');
  const form = document.getElementById('license-form');

  const pfCountSpan = document.getElementById('pf-count');
  const ccwCountSpan = document.getElementById('ccw-count');
  const guardCountSpan = document.getElementById('guard-count');

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzRhogpwuk3i-T0P7VjAY9dhY0CCdszatSl2C5uqbGUsBgKRdOwQti0HgtnxzBclzyF/exec"; // 배포된 웹앱 URL 또는 기존 값

  // steps
  const steps = Array.from(document.querySelectorAll('.form-step'));
  let currentStep = 0;

  function showStep(n) {
    if (n < 0) n = 0;
    if (n > steps.length - 1) n = steps.length - 1;
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === n);
    });
    currentStep = n;
    // 포커스: 해당 단계의 첫 입력에 포커스
    const first = steps[n].querySelector('input, select, textarea, button');
    if (first) first.focus();
    // 스크롤 맨 위로 (팝업 내부 스크롤 대비)
    const popupContent = document.querySelector('.popup-content');
    if (popupContent) popupContent.scrollTop = 0;
  }

  // Apply 버튼: 팝업 열고 첫 스텝으로 이동
  applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const licenseType = btn.getAttribute('data-license');
      licenseInput.value = licenseType;
      popupTitle.textContent = `Apply for ${licenseType}`;
      popup.style.display = 'flex';
      showStep(0);
    });
  });

  // 닫기
  closeBtn.addEventListener('click', () => popup.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') popup.style.display = 'none'; });

  // 이벤트 위임으로 Next / Prev 처리
  document.addEventListener('click', (e) => {
    // Next 버튼
    if (e.target.matches('.next-btn')) {
      e.preventDefault();
      // 현재 step의 required 체크: invalid 요소가 있으면 포커스하고 이동 거부
      const invalid = steps[currentStep].querySelector(':invalid');
      if (invalid) {
        invalid.focus();
        // 간단한 시각 피드백 (임시)
        invalid.classList.add('invalid-field');
        setTimeout(() => invalid.classList.remove('invalid-field'), 1500);
        return;
      }
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
      return;
    }

    // Previous 버튼
    if (e.target.matches('.prev-btn')) {
      e.preventDefault();
      if (currentStep > 0) showStep(currentStep - 1);
      return;
    }
  });

  // 폼 제출 (기존 방식 유지)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value));

    // POST: (이 부분은 CORS / Apps Script 설정에 따라 실패할 수 있음)
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: params
    })
    .then(res => res.json ? res.json() : res.text())
    .then(() => {
      alert("License Application Submitted!");
      popup.style.display = 'none';
      form.reset();
      showStep(0);
      updateCounts();
    })
    .catch(err => {
      console.error("Error submitting form:", err);
      alert("제출 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    });
  });

  // JSONP 통계 업데이트 (GET CORS 우회 - 기존에 사용한 방식)
  function updateCounts() {
    const callbackName = "handleCounts";
    // remove existing script with same id if any
    const existing = document.getElementById('jsonp-stats-script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'jsonp-stats-script';
    script.src = `${WEB_APP_URL}?getCounts=true&callback=${callbackName}`;
    script.onerror = () => console.error('JSONP script load error');
    document.body.appendChild(script);
    // script will be removed by JSONP callback (or you can remove after small timeout)
  }

  // JSONP 콜백 (전역에 노출)
  window.handleCounts = function(data) {
    if (!data || data.error) {
      console.warn("handleCounts: no data or error", data);
      return;
    }
    pfCountSpan.textContent = data.pf.issued;
    document.getElementById('pf-rejected') && (document.getElementById('pf-rejected').textContent = data.pf.rejected);
    document.getElementById('pf-total') && (document.getElementById('pf-total').textContent = data.pf.total);

    ccwCountSpan.textContent = data.ccw.issued;
    document.getElementById('ccw-rejected') && (document.getElementById('ccw-rejected').textContent = data.ccw.rejected);
    document.getElementById('ccw-total') && (document.getElementById('ccw-total').textContent = data.ccw.total);

    guardCountSpan.textContent = data.guard.issued;
    document.getElementById('guard-rejected') && (document.getElementById('guard-rejected').textContent = data.guard.rejected);
    document.getElementById('guard-total') && (document.getElementById('guard-total').textContent = data.guard.total);

    // cleanup jsonp script tag
    const s = document.getElementById('jsonp-stats-script');
    if (s) s.remove();
  };

  // 초기화
  showStep(0);
  updateCounts();
  setInterval(updateCounts, 60000);
});

