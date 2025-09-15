const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');
const pfCountSpan = document.getElementById('pf-count');

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwdaEEWYP6dldb7wf8tUfZT8PaTFDXRwiCV3h54jibEvsj566u1ncdESw3f8kP_rcef/exec";

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
        alert(`License Application Submitted!\nName: ${form.name.value}\nEmail: ${form.email.value}\nLicense: ${form.license.value}`);
        popup.style.display = 'none';
        form.reset();
        updatePFCount();
    })
    .catch(err => console.error("Error submitting form:", err));
});

// PF License 신청 수 가져오기 (fetch)
function updatePFCount() {
    fetch(WEB_APP_URL + "?pfCount=true")
      .then(res => res.json())
      .then(data => {
          pfCountSpan.textContent = data.pfLicenseCount;
      })
      .catch(err => console.error("Error fetching PF License count:", err));
}

// 페이지 로드 시 한번 실행
updatePFCount();

// 1분마다 자동 갱신
setInterval(updatePFCount, 60000);
