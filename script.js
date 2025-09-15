const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const licenseInput = document.getElementById('license');
const applyButtons = document.querySelectorAll('.apply-btn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('license-form');

applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const licenseType = btn.getAttribute('data-license');
        licenseInput.value = licenseType;
        popupTitle.textContent = `Apply for ${licenseType}`;
        popup.style.display = 'flex';
    });
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == popup) {
        popup.style.display = 'none';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`License Application Submitted!\nName: ${form.name.value}\nEmail: ${form.email.value}\nLicense: ${form.license.value}`);
    popup.style.display = 'none';
    form.reset();
});
const applyBtns = document.querySelectorAll(".apply-btn");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close");
const licenseInput = document.getElementById("license");
const form = document.getElementById("license-form");

// Apply 버튼 클릭 시 팝업 열기
applyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        licenseInput.value = btn.dataset.license;
        popup.style.display = "block";
    });
});

// 닫기 버튼
closeBtn.addEventListener("click", () => popup.style.display = "none");

// 폼 제출
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const license = document.getElementById("license").value;
    
    const webAppUrl = "https://script.google.com/macros/s/AKfycbzDw8yoD4UL0MYF3016VUF9khDB09RYcSLPH6WnMBDrGEFAKDAn5zu9TBZ1j33Ed2Ld/exec"; // 1️⃣에서 복사한 URL 넣기
    
    fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name, email, license })
    })
    .then(res => res.text())
    .then(data => {
        alert("Application submitted!");
        popup.style.display = "none";
        form.reset();
    })
    .catch(err => alert("Error: " + err));
});
