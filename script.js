const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');

const pfCountSpan = document.getElementById('pf-count');
const ccwCountSpan = document.getElementById('ccw-count');
const guardCountSpan = document.getElementById('guard-count');

const WEB_APP_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Step Form
let currentStep = 0;
const steps = document.querySelectorAll(".form-step");

function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
}

document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep < steps.length -1) { currentStep++; showStep(currentStep); }
    });
});
document.querySelectorAll(".prev-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) { currentStep--; showStep(currentStep); }
    });
});

// Apply 버튼 클릭 시 팝업 열기
applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const licenseType = btn.getAttribute('data-license');
        licenseInput.value = licenseType;
        popupTitle.textContent = `Apply for ${licenseType}`;
        popup.style.display = 'flex';
        currentStep = 0;
        showStep(currentStep);
    });
});

// 팝업 닫기 버튼
closeBtn.addEventListener('click', () => popup.style.display = 'none');
window.addEventListener('click', (e) => { if(e.target==popup) popup.style.display='none'; });

// 폼 제출
form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((v,k)=> params.append(k,v));
    fetch(WEB_APP_URL, { method:"POST", body: params })
    .then(res => res.text())
    .then(()=> { alert("License Application Submitted!"); popup.style.display='none'; form.reset(); updateCounts(); })
    .catch(err => console.error(err));
});

// 통계 업데이트
function updateCounts() {
    fetch(WEB_APP_URL + "?getCounts=true")
    .then(res=>res.json())
    .then(data=>{
        pfCountSpan.textContent = data.pfLicenseCount;
        ccwCountSpan.textContent = data.ccwLicenseCount;
        guardCountSpan.textContent = data.guardCardCount;
    }).catch(err=>console.error(err));
}

updateCounts();
setInterval(updateCounts, 60000);
