function checkMaintenanceStatus() {
    const oldScript = document.getElementById('status-checker');
    if (oldScript) oldScript.remove();
    
    const script = document.createElement('script');
    script.id = 'status-checker';
    // Menambahkan timestamp agar browser tidak mengambil cache file lama
    script.src = `status.js?v=${new Date().getTime()}`;
    
    script.onload = () => {
        const mScreen = document.getElementById('m-screen');
        const mainApp = document.getElementById('main-app');
        const mTitle = mScreen.querySelector('h1');
        const mText = document.getElementById('m-text');
        const mEta = document.getElementById('m-eta');
        const mIcon = mScreen.querySelector('[data-lucide]');

        if (typeof maintenanceConfig !== 'undefined') {
            // 1. CEK STATUS CLOSED (DITUTUP)
            if (maintenanceConfig.isClosed) {
                isMaintenanceMode = true;
                mScreen.classList.remove('hidden');
                mainApp.classList.add('hidden');
                
                mTitle.innerText = "Layanan Ditutup";
                mText.innerText = maintenanceConfig.closedMessage;
                mEta.parentElement.classList.add('hidden'); // Sembunyikan kotak ETA
                
                // Ganti icon jadi "archive" atau "off"
                mIcon.setAttribute('data-lucide', 'archive-restore');
                lucide.createIcons();
                
                if (clockInterval) clearInterval(clockInterval);
                return;
            }

            // 2. CEK STATUS MAINTENANCE
            if (maintenanceConfig.isMaintenance) {
                if (!isMaintenanceMode) {
                    isMaintenanceMode = true;
                    mScreen.classList.remove('hidden');
                    mainApp.classList.add('hidden');
                    
                    mTitle.innerText = "Maintenance";
                    mText.innerText = maintenanceConfig.maintenanceMessage;
                    mEta.parentElement.classList.remove('hidden');
                    mEta.innerText = "Estimasi Selesai: " + maintenanceConfig.maintenanceETA;
                    
                    mIcon.setAttribute('data-lucide', 'cog');
                    lucide.createIcons();
                    
                    if (clockInterval) clearInterval(clockInterval);
                }
            } else {
                // 3. JIKA SEMUA NORMAL
                if (isMaintenanceMode) {
                    isMaintenanceMode = false;
                    window.location.reload();
                }
                mScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
            }
        }
    };
    document.head.appendChild(script);
}
