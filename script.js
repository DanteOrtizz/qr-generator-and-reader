//Generator:
const qrGenerator = document.querySelector('.qr-code');
const urlInput = document.getElementById('url-input');
const dark = document.getElementById('dark');
const light = document.getElementById('light');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');

// event listeners:
dark.addEventListener('input', handleColor1);
light.addEventListener('input', handleColor2);
urlInput.addEventListener('input', handleUrlInput);
shareBtn.addEventListener('click', handleShare);


// DEFAULTS
let colorDark = dark.value = '#000'
let colorLight = light.value = '#fff'
let text = '';

// Functions for events:
function handleColor1(e) {
    colorDark = e.target.value;
    generateQRCode();
}

function handleColor2(e) {
    colorLight = e.target.value;
    generateQRCode();
}

function handleUrlInput(e) {
    const value = e.target.value;
    text = value;
    generateQRCode()
}

async function handleShare() {
    setTimeout(async() => {
        try {
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png",{
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: text,
            });
        } catch (error) {
            alert("Not able to share, try in another browser please!");
        }
    }, 100);
}

function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector('.qr-code img')
            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector('canvas');
            resolve(canvas.toDataURL());
        }, 50);
    });
}

async function generateQRCode() {
    qrGenerator.innerHTML ='';
    new QRCode('qr-code', {
        text,
        colorDark: colorDark,
        colorLight: colorLight,
    });
    downloadBtn.href = await resolveDataUrl();
}

generateQRCode();

// Reader:
const form = document.getElementById('qr-form');
const qrInput = document.getElementById('qr-input');
const urlOutput = document.getElementById('url-output');
const copyBtn = document.getElementById('copy-btn');
const readerContainer = document.getElementById('qr-reader-container');
const qrText = document.getElementById('qr-text');

// API: http://api.qrserver.com/v1/read-qr-code/ 
// Docs https://goqr.me/api/doc/read-qr-code/

//Event listeners:
form.addEventListener('click', () => qrInput.click());
copyBtn.addEventListener('click', copyToClipboard);

function copyToClipboard() {
    let address = urlOutput.textContent;
    address.select;
    navigator.clipboard.writeText(address);
    //console.log(address);
};

function fetchRequest(file, formData) {
    qrText.innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        qrText.innerText = result ? "Upload QR Code To Scan" : "Couldn't Scan QR Code";
        if (!result) return;
        document.querySelector('textarea').innerText = result;
        form.querySelector('.img-form').src = URL.createObjectURL(file);
        readerContainer.classList.add("inactive"); //hiddin text for the qr code area
    }).catch(() => {
        qrText.innerText = "Couldn't Scan QR Code...";
    });
}

qrInput.addEventListener("change", async e => {
    let file = e.target.files[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});