const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');

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

// 폼 제출 후 알림
form.addEventListener('submit', () => {
    alert(`License Application Submitted!\nName: ${form.name.value}\nEmail: ${form.email.value}\nLicense: ${form.license.value}`);
    popup.style.display = 'none';
    form.reset();
});
