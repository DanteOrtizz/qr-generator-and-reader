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
    download.href = await handleDataUrl();
}

generateQRCode();