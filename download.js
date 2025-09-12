// download.js — Handles APK download (fetch+blob fallback) with polished messages

(() => {
    "use strict";

    const APK_URL = 'https://t.me/vtspoly';
    const SAVE_FILENAME = 'VTS-POLY-v1.0.apk';
    const VERSION = 'v1.0';
    const RELEASE_DATE = '2025-09-02';

    const downloadBtn = document.getElementById('downloadBtn');
    const apkAnchor = document.getElementById('apkAnchor');
    const messageEl = document.getElementById('message');
    const versionEl = document.getElementById('versionText');
    const releaseEl = document.getElementById('releaseDate');

    // Populate metadata
    if (versionEl) versionEl.textContent = VERSION;
    if (releaseEl) releaseEl.textContent = RELEASE_DATE;
    if (apkAnchor) {
        apkAnchor.href = APK_URL;
        apkAnchor.download = SAVE_FILENAME;
    }

    function setMessage(text) {
        if (messageEl) messageEl.textContent = text;
    }

    function triggerDownload(blobUrl) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = SAVE_FILENAME;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 6000);
    }

    async function startDownload() {
        if (!downloadBtn) return;

        downloadBtn.disabled = true;
        const originalText = downloadBtn.textContent;
        setMessage('Preparing download...');
        downloadBtn.textContent = 'Downloading...';

        try {
            const response = await fetch(APK_URL);
            if (!response.ok) throw new Error('Network error');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            triggerDownload(blobUrl);
            setMessage('Download started! Check your downloads.');
        } catch (err) {
            console.warn('Download fallback', err);
            setMessage('Download fallback in progress...');
            if (apkAnchor) apkAnchor.click();
            else window.location.href = APK_URL;
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = originalText;
        }
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startDownload();
        });
    }
})();
