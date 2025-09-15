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

// 폼 제출 이벤트
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value;
    const email = form.email.value;
    const license = form.license.value;

    const webAppUrl = "https://script.google.com/macros/s/AKfycbwdaEEWYP6dldb7wf8tUfZT8PaTFDXRwiCV3h54jibEvsj566u1ncdESw3f8kP_rcef/exec";

    // Google Apps Script Web App으로 데이터 전송
    fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name, email, license })
    })
    .then(res => res.text())
    .then(data => {
        alert(`License Application Submitted!\nYour application has been saved!\nSubmitted at: ${new Date().toLocaleString()}`);
        popup.style.display = 'none';
        form.reset();
    })
    .catch(err => {
        alert("Error submitting application: " + err);
    });
});

// PF License 신청 수 가져오기
function updatePFCount() {
    const statsUrl = "https://script.google.com/macros/s/AKfycbwdaEEWYP6dldb7wf8tUfZT8PaTFDXRwiCV3h54jibEvsj566u1ncdESw3f8kP_rcef/exec";

    fetch(statsUrl)
      .then(res => res.json())
      .then(data => {
          document.getElementById("pf-count").textContent = data.pfLicenseCount;
      })
      .catch(err => console.error("Error fetching PF License count:", err));
}

// 페이지 로드 시 한번 실행
updatePFCount();

// 이후 일정 시간마다 갱신하고 싶으면 (예: 1분)
setInterval(updatePFCount, 60000);
