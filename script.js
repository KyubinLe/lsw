const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');

const pfCountSpan = document.getElementById('pf-count');
const ccwCountSpan = document.getElementById('ccw-count');
const guardCountSpan = document.getElementById('guard-count');

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzRhogpwuk3i-T0P7VjAY9dhY0CCdszatSl2C5uqbGUsBgKRdOwQti0HgtnxzBclzyF/exec"; // 변경 필요

// Apply 버튼 클릭 시 팝업 열기
applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const licenseType = btn.getAttribute('data-license');
        licenseInput.value = licenseType;
        popupTitle.textContent = `Apply for ${licenseType}`;
        popup.style.display = 'flex';
        showStep(0);
    });
});

// 팝업 닫기
closeBtn.addEventListener('click', () => { popup.style.display = 'none'; });

// 팝업 바깥 클릭 시 닫기
window.addEventListener('click', (e) => { if(e.target==popup) popup.style.display='none'; });

// Multi-step Form
const steps = document.querySelectorAll('.form-step');
let currentStep = 0;

function showStep(n){
    steps.forEach((step,i)=>step.classList.toggle('active', i===n));
    currentStep = n;
}

document.querySelectorAll('.next-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        if(currentStep<steps.length-1) showStep(currentStep+1);
    });
});
document.querySelectorAll('.prev-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        if(currentStep>0) showStep(currentStep-1);
    });
});

// 폼 제출
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((v,k)=>params.append(k,v));

    fetch(WEB_APP_URL, {method:'POST', body:params})
    .then(res=>res.text())
    .then(()=>{
        alert("License Application Submitted!");
        popup.style.display='none';
        form.reset();
        updateCounts();
    })
    .catch(err=>console.error(err));
});

// 신청 통계 업데이트
function updateCounts(){
    fetch(WEB_APP_URL+"?getCounts=true")
    .then(res=>res.json())
    .then(data=>{
        pfCountSpan.textContent=data.pfLicenseCount;
        ccwCountSpan.textContent=data.ccwLicenseCount;
        guardCountSpan.textContent=data.guardCardCount;
    }).catch(err=>console.error(err));
}

// 페이지 로드 시
updateCounts();
setInterval(updateCounts,60000);
