const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');

const pfCountSpan = document.getElementById('pf-count');
const ccwCountSpan = document.getElementById('ccw-count');
const guardCountSpan = document.getElementById('guard-count');

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzRhogpwuk3i-T0P7VjAY9dhY0CCdszatSl2C5uqbGUsBgKRdOwQti0HgtnxzBclzyF/exec";

// Apply 버튼 클릭 시 팝업 열기
applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const licenseType = btn.getAttribute('data-license');
        licenseInput.value = licenseType;
        popupTitle.textContent = `Apply for ${licenseType}`;
        popup.style.display = 'flex';
    });
});

// 팝업 닫기 버튼
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// 팝업 바깥 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target == popup) {
        popup.style.display = 'none';
    }
});

// 단계별 폼
const formSteps = document.querySelectorAll('.form-step');
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
let currentStep = 0;

function showStep(index) {
    formSteps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
    });
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep < formSteps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// 초기 step 표시
showStep(currentStep);

// 폼 제출 (fetch)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value));

    fetch(WEB_APP_URL, {
        method: 'POST',
        body: params
    })
    .then(res => res.text())
    .then(() => {
        alert("License Application Submitted!");
        popup.style.display = 'none';
        form.reset();
        currentStep = 0;
        showStep(currentStep);
        updateCounts(); // 신청 수 업데이트
    })
    .catch(err => console.error("Error submitting form:", err));
});

// 모든 라이선스 신청 수 가져오기
function updateCounts() {
    fetch(WEB_APP_URL + "?getCounts=true")
      .then(res => res.json())
      .then(data => {
          pfCountSpan.textContent = data.pfLicenseCount;
          ccwCountSpan.textContent = data.ccwLicenseCount;
          guardCountSpan.textContent = data.guardCardCount;
      })
      .catch(err => console.error("Error fetching counts:", err));
}

// 페이지 로드 시 한번 실행
updateCounts();

// 1분마다 자동 갱신
setInterval(updateCounts, 60000);
