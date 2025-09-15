// ===================== 카드 클릭 시 내용 토글 =====================
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

// ===================== 목차 클릭 시 스크롤 이동 =====================
document.querySelectorAll('.toc a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===================== 상단 이동 버튼 =====================
const topBtns = document.querySelectorAll('.topBtn');
window.addEventListener('scroll', () => {
  topBtns.forEach(btn => btn.style.display = window.scrollY > 300 ? 'block' : 'none');
});

topBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ===================== 팝업 모달 =====================
const popup = document.getElementById('popup');
const applyBtns = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const licenseForm = document.getElementById('license-form');
const formSteps = document.querySelectorAll('.form-step');
let currentStep = 0;

applyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    popup.style.display = 'block';
    document.getElementById('license').value = btn.dataset.license;
    showStep(currentStep);
  });
});

closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  currentStep = 0;
  formSteps.forEach(step => step.classList.remove('active'));
});

function showStep(step) {
  formSteps.forEach((s, i) => s.classList.toggle('active', i === step));
}

// ===================== STEP 버튼 =====================
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep < formSteps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

document.querySelectorAll('.prev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

// ===================== 폼 제출 =====================
licenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(licenseForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // STEP 7: OOC / Discord / Multi-character 정보 입력값
  data.discordID = document.querySelector('input[name="discordID"]').value || "";
  data.discordNickname = document.querySelector('input[name="discordNickname"]').value || "";
  data.faction = document.querySelector('input[name="faction"]').value || "";
  data.multiCharacter = document.querySelector('select[name="multiCharacter"]').value || "N";
  data.multiCharacterInfo = document.querySelector('input[name="multiCharacterInfo"]').value || "";
  data.oocAgree = document.querySelector('input[name="oocAgree"]').checked ? "Y" : "N";

  try {
    const response = await fetch('YOUR_WEB_APP_URL', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if(result.status === 'success') {
      alert('신청이 성공적으로 제출되었습니다.');
      popup.style.display = 'none';
      licenseForm.reset();
      currentStep = 0;
      showStep(currentStep);
    } else {
      alert('제출 오류: ' + result.message);
    }
  } catch(err) {
    alert('제출 실패: ' + err);
  }
});
