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

    const name = form.name.value;
    const email = form.email.value;
    const license = form.license.value;

    const webAppUrl = "https://script.google.com/macros/s/AKfycbzDw8yoD4UL0MYF3016VUF9khDB09RYcSLPH6WnMBDrGEFAKDAn5zu9TBZ1j33Ed2Ld/exec";

    // Google Apps Script Web App으로 데이터 전송
    fetch(webAppUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name, email, license })
    })
    .then(res => res.text())
    .then(data => {
        alert("License Application Submitted!\nYour application has been saved!");
        popup.style.display = 'none';
        form.reset();
    })
    .catch(err => {
        alert("Error submitting application: " + err);
    });
});

