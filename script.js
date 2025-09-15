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

// 폼 제출
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value));

    fetch(WEB_APP_URL, {
        method: 'POST',
        body: params
    })
    .then(res => res.json())
    .then(() => {
        alert("License Application Submitted!");
        popup.style.display = 'none';
        form.reset();
        updateCounts(); // 신청 수 업데이트
    })
    .catch(err => console.error("Error submitting form:", err));
});

// 통계 정보 업데이트 (JSONP 방식)
function updateCounts() {
    const callbackName = "handleCounts";
    const script = document.createElement("script");
    script.src = `${WEB_APP_URL}?getCounts=true&callback=${callbackName}`;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

// JSONP 콜백
function handleCounts(data) {
    if (data.error) return;

    // PF License
    document.getElementById("pf-count").textContent = data.pf.issued;
    document.querySelector("#pf-rejected").textContent = data.pf.rejected;
    document.querySelector("#pf-total").textContent = data.pf.total;

    // CCW License
    document.getElementById("ccw-count").textContent = data.ccw.issued;
    document.querySelector("#ccw-rejected").textContent = data.ccw.rejected;
    document.querySelector("#ccw-total").textContent = data.ccw.total;

    // Guard Card
    document.getElementById("guard-count").textContent = data.guard.issued;
    document.querySelector("#guard-rejected").textContent = data.guard.rejected;
    document.querySelector("#guard-total").textContent = data.guard.total;
}

// 페이지 로드 시 실행
updateCounts();

// 1분마다 자동 갱신
setInterval(updateCounts, 60000);
