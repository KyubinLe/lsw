const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');
const pfCountSpan = document.getElementById('pf-count');

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
    updatePFCount(); // 제출 후 카운트 갱신
});

// PF License 신청 수 가져오기
function updatePFCount() {
    const statsUrl = "https://script.google.com/macros/s/AKfycbzDw8yoD4UL0MYF3016VUF9khDB09RYcSLPH6WnMBDrGEFAKDAn5zu9TBZ1j33Ed2Ld/exec?pfCount=true";

    fetch(statsUrl)
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
