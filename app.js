/**
 * FilterCam Pro — Professional Camera Filter App
 * Main Application Logic
 * 
 * Uses DeepAR SDK for AR face filters
 * Falls back to CSS canvas filters if DeepAR fails
 */

// ============================================================
//  CONFIGURATION
// ============================================================

const CONFIG = {
    // ⚠️ REPLACE THIS with your actual DeepAR license key
    // Get one free at: https://developer.deepar.ai
    DEEPAR_LICENSE_KEY: 'YOUR_DEEPAR_LICENSE_KEY_HERE',

    // DeepAR model/effect paths (hosted by DeepAR CDN)
    DEEPAR_EFFECTS_BASE: 'https://cdn.jsdelivr.net/npm/deepar@5.6.4/effects/',

    CAMERA: {
        defaultFacing: 'user',
        resolutions: {
            hd:  { width: 1280, height: 720  },
            fhd: { width: 1920, height: 1080 },
            qhd: { width: 2560, height: 1440 },
        },
    },

    CAPTURE: {
        format: 'image/png',
        quality: 0.95,
        flashDuration: 400,
        shutterSoundFreq: 800,
    },

    TOAST: {
        duration: 2500,
    },
};

// ============================================================
//  FILTER DEFINITIONS
// ============================================================

const FILTERS = {
    face: [
        {
            id: 'none',
            name: 'No Filter',
            icon: '⭕',
            color: 'none',
            type: 'none',
            deeparEffect: null,
            cssFilter: 'none',
        },
        {
            id: 'aviators',
            name: 'Aviators',
            icon: '🕶️',
            color: 'cool',
            type: 'deepar',
            deeparEffect: 'aviators',
            cssFilter: 'none',
        },
        {
            id: 'bigmouth',
            name: 'Big Mouth',
            icon: '👄',
            color: 'funny',
            type: 'deepar',
            deeparEffect: 'bigmouth',
            cssFilter: 'none',
        },
        {
            id: 'dalmatian',
            name: 'Dalmatian',
            icon: '🐶',
            color: 'funny',
            type: 'deepar',
            deeparEffect: 'dalmatian',
            cssFilter: 'none',
        },
        {
            id: 'flowers',
            name: 'Flowers',
            icon: '🌸',
            color: 'rose',
            type: 'deepar',
            deeparEffect: 'flowers',
            cssFilter: 'none',
        },
        {
            id: 'koala',
            name: 'Koala',
            icon: '🐨',
            color: 'nature',
            type: 'deepar',
            deeparEffect: 'koala',
            cssFilter: 'none',
        },
        {
            id: 'lion',
            name: 'Lion',
            icon: '🦁',
            color: 'golden',
            type: 'deepar',
            deeparEffect: 'lion',
            cssFilter: 'none',
        },
        {
            id: 'teddycigar',
            name: 'Teddy',
            icon: '🧸',
            color: 'warm',
            type: 'deepar',
            deeparEffect: 'teddycigar',
            cssFilter: 'none',
        },
    ],

    color: [
        {
            id: 'warm_glow',
            name: 'Warm Glow',
            icon: '🌅',
            color: 'warm',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(35%) saturate(1.6) brightness(1.08) contrast(1.05)',
        },
        {
            id: 'cool_breeze',
            name: 'Cool Breeze',
            icon: '❄️',
            color: 'cool',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'saturate(0.85) brightness(1.1) hue-rotate(190deg) contrast(1.05)',
        },
        {
            id: 'vintage',
            name: 'Vintage',
            icon: '📷',
            color: 'vintage',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(55%) contrast(1.15) brightness(0.92) saturate(1.2)',
        },
        {
            id: 'noir',
            name: 'Noir',
            icon: '🖤',
            color: 'bw',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'grayscale(100%) contrast(1.4) brightness(0.85)',
        },
        {
            id: 'sunset_blush',
            name: 'Sunset',
            icon: '🌇',
            color: 'sunset',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(50%) saturate(2.2) hue-rotate(-15deg) brightness(1.05)',
        },
        {
            id: 'neon_nights',
            name: 'Neon',
            icon: '💜',
            color: 'neon',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'saturate(2.5) contrast(1.3) brightness(1.1) hue-rotate(285deg)',
        },
        {
            id: 'golden_hour',
            name: 'Golden',
            icon: '✨',
            color: 'golden',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(25%) saturate(1.8) brightness(1.15) contrast(1.02)',
        },
        {
            id: 'arctic',
            name: 'Arctic',
            icon: '🧊',
            color: 'arctic',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'brightness(1.25) hue-rotate(195deg) saturate(0.75) contrast(0.95)',
        },
    ],

    beauty: [
        {
            id: 'soft_skin',
            name: 'Soft Skin',
            icon: '🌟',
            color: 'beauty',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'brightness(1.08) contrast(0.95) saturate(0.9) blur(0.3px)',
        },
        {
            id: 'radiance',
            name: 'Radiance',
            icon: '💫',
            color: 'beauty',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'brightness(1.15) contrast(1.05) saturate(1.15)',
        },
        {
            id: 'peach',
            name: 'Peach',
            icon: '🍑',
            color: 'rose',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(15%) saturate(1.3) brightness(1.1) hue-rotate(-5deg)',
        },
        {
            id: 'porcelain',
            name: 'Porcelain',
            icon: '🤍',
            color: 'arctic',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'brightness(1.2) contrast(0.9) saturate(0.7)',
        },
        {
            id: 'rose_gold',
            name: 'Rose Gold',
            icon: '🌹',
            color: 'rose',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(20%) saturate(1.5) brightness(1.08) hue-rotate(-10deg) contrast(1.05)',
        },
    ],

    fun: [
        {
            id: 'xray',
            name: 'X-Ray',
            icon: '☠️',
            color: 'cyber',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'invert(100%) hue-rotate(180deg) contrast(1.2)',
        },
        {
            id: 'alien',
            name: 'Alien',
            icon: '👽',
            color: 'nature',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'hue-rotate(120deg) saturate(3) brightness(1.15)',
        },
        {
            id: 'matrix',
            name: 'Matrix',
            icon: '🟢',
            color: 'cyber',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'hue-rotate(90deg) saturate(5) brightness(0.75) contrast(1.5)',
        },
        {
            id: 'psychedelic',
            name: 'Psychedelic',
            icon: '🌀',
            color: 'neon',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'hue-rotate(220deg) invert(25%) contrast(2) saturate(3)',
        },
        {
            id: 'thermal',
            name: 'Thermal',
            icon: '🔥',
            color: 'warm',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'hue-rotate(330deg) saturate(4) contrast(1.8) brightness(0.9)',
        },
        {
            id: 'dream',
            name: 'Dream',
            icon: '💭',
            color: 'dream',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'blur(1.2px) brightness(1.25) saturate(1.6) contrast(0.85)',
        },
    ],

    artistic: [
        {
            id: 'pop_art',
            name: 'Pop Art',
            icon: '🎨',
            color: 'pop',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'saturate(3) contrast(1.8) brightness(1.1)',
        },
        {
            id: 'film_grain',
            name: 'Film',
            icon: '🎞️',
            color: 'vintage',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(30%) contrast(1.3) brightness(0.9) saturate(0.8)',
        },
        {
            id: 'duotone',
            name: 'Duotone',
            icon: '🎭',
            color: 'art',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'grayscale(100%) sepia(100%) hue-rotate(200deg) saturate(2) contrast(1.2)',
        },
        {
            id: 'high_contrast',
            name: 'Hi-Con',
            icon: '◼️',
            color: 'bw',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'grayscale(100%) contrast(2.5) brightness(1.1)',
        },
        {
            id: 'cyberpunk',
            name: 'Cyberpunk',
            icon: '🌃',
            color: 'cyber',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'hue-rotate(160deg) saturate(2) contrast(1.4) brightness(1.05)',
        },
        {
            id: 'retro_wave',
            name: 'Retrowave',
            icon: '🌆',
            color: 'retro',
            type: 'css',
            deeparEffect: null,
            cssFilter: 'sepia(40%) hue-rotate(300deg) saturate(2) contrast(1.2) brightness(1.05)',
        },
    ],
};

// ============================================================
//  APPLICATION STATE
// ============================================================

const state = {
    deepAR: null,
    isDeepARReady: false,
    useDeepAR: false,

    currentStream: null,
    facingMode: 'user',
    currentFilter: FILTERS.face[0],
    currentCategory: 'face',

    gallery: [],
    capturedImage: null,

    settings: {
        resolution: 'fhd',
        mirror: true,
        grid: false,
        timer: 0,
        faceGuide: false,
    },

    flashMode: 'off',
    isCapturing: false,
    zoomLevel: 1,
};

// ============================================================
//  DOM ELEMENTS
// ============================================================

const DOM = {};

function cacheDOMElements() {
    // Screens
    DOM.loadingScreen = document.getElementById('loadingScreen');
    DOM.permissionScreen = document.getElementById('permissionScreen');
    DOM.cameraScreen = document.getElementById('cameraScreen');
    DOM.previewScreen = document.getElementById('previewScreen');

    // Loading
    DOM.loadingBar = document.getElementById('loadingBar');
    DOM.loadingStatus = document.getElementById('loadingStatus');

    // Camera
    DOM.deepARCanvas = document.getElementById('deepARCanvas');
    DOM.cameraVideo = document.getElementById('cameraVideo');
    DOM.canvasContainer = document.getElementById('canvasContainer');

    // Filter elements
    DOM.filterCarousel = document.getElementById('filterCarousel');
    DOM.filterTabs = document.getElementById('filterTabs');
    DOM.filterToast = document.getElementById('filterToast');
    DOM.filterToastIcon = document.getElementById('filterToastIcon');
    DOM.filterToastName = document.getElementById('filterToastName');
    DOM.filterLabel = document.getElementById('filterLabel');

    // Buttons
    DOM.btnGrantPermission = document.getElementById('btnGrantPermission');
    DOM.btnCapture = document.getElementById('btnCapture');
    DOM.btnFlash = document.getElementById('btnFlash');
    DOM.btnFlipCamera = document.getElementById('btnFlipCamera');
    DOM.btnSettings = document.getElementById('btnSettings');
    DOM.btnGallery = document.getElementById('btnGallery');
    DOM.btnBeautyMode = document.getElementById('btnBeautyMode');

    // Preview
    DOM.previewImage = document.getElementById('previewImage');
    DOM.previewFilterName = document.getElementById('previewFilterName');
    DOM.btnRetake = document.getElementById('btnRetake');
    DOM.btnSave = document.getElementById('btnSave');
    DOM.btnShare = document.getElementById('btnShare');
    DOM.btnPreviewClose = document.getElementById('btnPreviewClose');

    // Gallery
    DOM.galleryModal = document.getElementById('galleryModal');
    DOM.galleryGrid = document.getElementById('galleryGrid');
    DOM.galleryEmpty = document.getElementById('galleryEmpty');
    DOM.galleryCount = document.getElementById('galleryCount');
    DOM.galleryPreview = document.getElementById('galleryPreview');
    DOM.lastPhotoThumb = document.getElementById('lastPhotoThumb');
    DOM.galleryPlaceholder = document.getElementById('galleryPlaceholder');
    DOM.btnCloseGallery = document.getElementById('btnCloseGallery');
    DOM.btnClearGallery = document.getElementById('btnClearGallery');

    // Settings
    DOM.settingsModal = document.getElementById('settingsModal');
    DOM.btnCloseSettings = document.getElementById('btnCloseSettings');
    DOM.settingResolution = document.getElementById('settingResolution');
    DOM.settingMirror = document.getElementById('settingMirror');
    DOM.settingGrid = document.getElementById('settingGrid');
    DOM.settingTimer = document.getElementById('settingTimer');
    DOM.settingFaceGuide = document.getElementById('settingFaceGuide');

    // Overlays
    DOM.timerOverlay = document.getElementById('timerOverlay');
    DOM.timerCount = document.getElementById('timerCount');
    DOM.flashOverlay = document.getElementById('flashOverlay');
    DOM.gridOverlay = document.getElementById('gridOverlay');
    DOM.faceGuide = document.getElementById('faceGuide');

    // Toast
    DOM.toastContainer = document.getElementById('toastContainer');
}

// ============================================================
//  INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', init);

async function init() {
    cacheDOMElements();
    loadSettings();
    loadGallery();
    bindEvents();
    await initializeApp();
}

async function initializeApp() {
    updateLoadingProgress(10, 'Checking camera support...');

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updateLoadingProgress(100, 'Camera not supported');
        showToast('❌', 'Camera API not supported in this browser', 'error');
        return;
    }

    updateLoadingProgress(25, 'Preparing AR engine...');

    // Try to initialize DeepAR
    const deepARSuccess = await initDeepAR();

    if (deepARSuccess) {
        state.useDeepAR = true;
        updateLoadingProgress(70, 'AR engine ready!');
    } else {
        state.useDeepAR = false;
        updateLoadingProgress(70, 'Using CSS filters (DeepAR unavailable)');
    }

    updateLoadingProgress(85, 'Almost ready...');

    // Try auto-starting camera
    try {
        await startCamera();
        updateLoadingProgress(100, 'Ready!');
        await sleep(500);
        hideLoadingScreen();
        showCameraScreen();
    } catch (err) {
        updateLoadingProgress(100, 'Waiting for permission...');
        await sleep(500);
        hideLoadingScreen();
        showPermissionScreen();
    }
}

// ============================================================
//  DEEPAR INITIALIZATION
// ============================================================

async function initDeepAR() {
    // Skip if license key not set
    if (CONFIG.DEEPAR_LICENSE_KEY === 'YOUR_DEEPAR_LICENSE_KEY_HERE') {
        console.warn('DeepAR: No license key configured. Using CSS filters fallback.');
        return false;
    }

    try {
        const deepAR = await deepar.initialize({
            licenseKey: CONFIG.DEEPAR_LICENSE_KEY,
            canvas: DOM.deepARCanvas,
            effect: '',
            additionalOptions: {
                cameraConfig: {
                    facingMode: state.facingMode,
                },
                hint: 'faceTracking',
            },
        });

        state.deepAR = deepAR;
        state.isDeepARReady = true;

        // Hide fallback video when DeepAR is active
        DOM.cameraVideo.classList.add('hidden');

        console.log('DeepAR initialized successfully');
        return true;

    } catch (error) {
        console.warn('DeepAR initialization failed:', error.message);
        console.info('Falling back to CSS filters');
        return false;
    }
}

// ============================================================
//  CAMERA MANAGEMENT
// ============================================================

async function startCamera() {
    const resolution = CONFIG.CAMERA.resolutions[state.settings.resolution] || CONFIG.CAMERA.resolutions.fhd;

    const constraints = {
        video: {
            facingMode: state.facingMode,
            width: { ideal: resolution.width },
            height: { ideal: resolution.height },
        },
        audio: false,
    };

    // Stop any existing stream
    stopCamera();

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.currentStream = stream;

    if (state.useDeepAR && state.deepAR) {
        // DeepAR manages its own video
        // Switch camera through DeepAR if needed
    } else {
        // Fallback: show video element
        DOM.cameraVideo.classList.remove('hidden');
        DOM.deepARCanvas.classList.add('hidden');
        DOM.cameraVideo.srcObject = stream;
        await DOM.cameraVideo.play();

        // Apply mirror
        updateMirror();
    }

    // Apply current filter
    applyCurrentFilter();
}

function stopCamera() {
    if (state.currentStream) {
        state.currentStream.getTracks().forEach(track => track.stop());
        state.currentStream = null;
    }
}

async function flipCamera() {
    state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';

    if (state.useDeepAR && state.deepAR) {
        try {
            await state.deepAR.switchCamera(state.facingMode);
        } catch (e) {
            console.warn('DeepAR camera switch failed, using fallback');
            await startCamera();
        }
    } else {
        await startCamera();
    }

    updateMirror();
    showToast('🔄', `Switched to ${state.facingMode === 'user' ? 'front' : 'rear'} camera`, 'info');
}

function updateMirror() {
    if (state.facingMode === 'user' && state.settings.mirror) {
        DOM.cameraVideo.style.transform = 'scaleX(-1)';
    } else {
        DOM.cameraVideo.style.transform = 'scaleX(1)';
    }
}

// ============================================================
//  FILTER MANAGEMENT
// ============================================================

function buildFilterCarousel(category) {
    const filters = FILTERS[category] || [];
    DOM.filterCarousel.innerHTML = '';

    // Always add "No Filter" as first option if not already present
    const allFilters = category !== 'face'
        ? [FILTERS.face[0], ...filters]
        : filters;

    allFilters.forEach(filter => {
        const item = document.createElement('div');
        item.className = `filter-item${state.currentFilter.id === filter.id ? ' active' : ''}`;
        item.dataset.filterId = filter.id;
        item.innerHTML = `
            <div class="filter-thumb" data-color="${filter.color}">
                <span>${filter.icon}</span>
            </div>
            <span class="filter-label">${filter.name}</span>
        `;
        item.addEventListener('click', () => selectFilter(filter, item));
        DOM.filterCarousel.appendChild(item);
    });

    // Scroll active filter into view
    requestAnimationFrame(() => {
        const activeItem = DOM.filterCarousel.querySelector('.filter-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
}

async function selectFilter(filter, element) {
    if (state.currentFilter.id === filter.id) return;

    // Update active state in UI
    DOM.filterCarousel.querySelectorAll('.filter-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');

    state.currentFilter = filter;

    // Show filter toast
    showFilterToast(filter.icon, filter.name);

    // Apply the filter
    await applyCurrentFilter();

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
}

async function applyCurrentFilter() {
    const filter = state.currentFilter;

    if (filter.type === 'deepar' && state.useDeepAR && state.deepAR) {
        // Apply DeepAR effect
        try {
            if (filter.deeparEffect) {
                const effectPath = `${CONFIG.DEEPAR_EFFECTS_BASE}${filter.deeparEffect}`;
                await state.deepAR.switchEffect(effectPath);
            } else {
                await state.deepAR.clearEffect();
            }
            // Clear any CSS filter
            DOM.deepARCanvas.style.filter = 'none';
            DOM.cameraVideo.style.filter = 'none';
        } catch (e) {
            console.warn('Failed to apply DeepAR effect:', e);
            // Fallback to CSS
            applyCSSFilter(filter.cssFilter);
        }
    } else if (filter.type === 'css' || filter.type === 'none') {
        // Apply CSS filter
        if (state.useDeepAR && state.deepAR) {
            try { await state.deepAR.clearEffect(); } catch (e) { /* ignore */ }
        }
        applyCSSFilter(filter.cssFilter);
    } else {
        // No filter
        applyCSSFilter('none');
        if (state.useDeepAR && state.deepAR) {
            try { await state.deepAR.clearEffect(); } catch (e) { /* ignore */ }
        }
    }
}

function applyCSSFilter(cssFilter) {
    const target = state.useDeepAR ? DOM.deepARCanvas : DOM.cameraVideo;
    target.style.filter = cssFilter || 'none';
}

function showFilterToast(icon, name) {
    DOM.filterToastIcon.textContent = icon;
    DOM.filterToastName.textContent = name;
    DOM.filterToast.classList.remove('hidden');
    DOM.filterToast.classList.add('show');

    clearTimeout(state._filterToastTimeout);
    state._filterToastTimeout = setTimeout(() => {
        DOM.filterToast.classList.remove('show');
        setTimeout(() => DOM.filterToast.classList.add('hidden'), 300);
    }, 1500);
}

// ============================================================
//  PHOTO CAPTURE
// ============================================================

async function capturePhoto() {
    if (state.isCapturing) return;

    const timerDelay = parseInt(state.settings.timer) || 0;

    if (timerDelay > 0) {
        await runTimer(timerDelay);
    }

    state.isCapturing = true;

    // Trigger flash
    triggerFlash();

    // Play shutter sound
    playShutterSound();

    // Capture the image
    let imageDataURL;

    if (state.useDeepAR && state.deepAR) {
        try {
            imageDataURL = await state.deepAR.takeScreenshot();
        } catch (e) {
            console.warn('DeepAR screenshot failed, using canvas fallback');
            imageDataURL = captureFromVideo();
        }
    } else {
        imageDataURL = captureFromVideo();
    }

    if (!imageDataURL) {
        state.isCapturing = false;
        showToast('❌', 'Failed to capture photo', 'error');
        return;
    }

    state.capturedImage = imageDataURL;

    // Short delay for flash effect
    await sleep(CONFIG.CAPTURE.flashDuration);

    // Show preview screen
    showPreviewScreen(imageDataURL);

    state.isCapturing = false;
}

function captureFromVideo() {
    const video = DOM.cameraVideo;
    if (!video.videoWidth) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Mirror if front camera
    if (state.facingMode === 'user' && state.settings.mirror) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }

    // Apply CSS filter to canvas
    ctx.filter = state.currentFilter.cssFilter || 'none';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reset transforms
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';

    return canvas.toDataURL(CONFIG.CAPTURE.format, CONFIG.CAPTURE.quality);
}

function triggerFlash() {
    DOM.flashOverlay.classList.add('active');
    setTimeout(() => DOM.flashOverlay.classList.remove('active'), CONFIG.CAPTURE.flashDuration);
}

function playShutterSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(CONFIG.CAPTURE.shutterSoundFreq, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
        // Audio not supported, silent capture
    }
}

async function runTimer(seconds) {
    return new Promise(resolve => {
        let count = seconds;
        DOM.timerCount.textContent = count;
        DOM.timerOverlay.classList.remove('hidden');

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                DOM.timerCount.textContent = count;
                // Re-trigger animation
                DOM.timerCount.style.animation = 'none';
                requestAnimationFrame(() => {
                    DOM.timerCount.style.animation = 'timerPulse 1s ease-in-out';
                });

                if (navigator.vibrate) navigator.vibrate(50);
            } else {
                clearInterval(interval);
                DOM.timerOverlay.classList.add('hidden');
                if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
                resolve();
            }
        }, 1000);

        if (navigator.vibrate) navigator.vibrate(50);
    });
}

// ============================================================
//  PREVIEW SCREEN
// ============================================================

function showPreviewScreen(imageDataURL) {
    DOM.previewImage.src = imageDataURL;
    DOM.previewFilterName.textContent = state.currentFilter.name;
    DOM.previewScreen.classList.remove('hidden');
    DOM.cameraScreen.classList.add('hidden');
}

function hidePreviewScreen() {
    DOM.previewScreen.classList.add('hidden');
    DOM.cameraScreen.classList.remove('hidden');
    state.capturedImage = null;
}

function retakePhoto() {
    hidePreviewScreen();
}

async function savePhoto() {
    if (!state.capturedImage) return;

    // Add to gallery
    const photo = {
        id: Date.now(),
        src: state.capturedImage,
        filter: state.currentFilter.name,
        timestamp: new Date().toISOString(),
    };

    state.gallery.unshift(photo);
    saveGallery();
    updateGalleryUI();

    // Download the photo
    downloadImage(state.capturedImage, `FilterCam_${photo.id}.png`);

    showToast('✅', 'Photo saved successfully!', 'success');

    // Return to camera
    await sleep(600);
    hidePreviewScreen();
}

async function sharePhoto() {
    if (!state.capturedImage) return;

    if (navigator.share) {
        try {
            // Convert data URL to Blob
            const response = await fetch(state.capturedImage);
            const blob = await response.blob();
            const file = new File([blob], 'FilterCam_Photo.png', { type: 'image/png' });

            await navigator.share({
                title: 'FilterCam Pro Photo',
                text: `Photo taken with ${state.currentFilter.name} filter`,
                files: [file],
            });

            showToast('📤', 'Photo shared!', 'success');
        } catch (e) {
            if (e.name !== 'AbortError') {
                // Fallback to download
                downloadImage(state.capturedImage, `FilterCam_${Date.now()}.png`);
                showToast('📥', 'Photo downloaded instead', 'info');
            }
        }
    } else {
        // No Web Share API — download instead
        downloadImage(state.capturedImage, `FilterCam_${Date.now()}.png`);
        showToast('📥', 'Photo downloaded (share not supported)', 'info');
    }
}

function downloadImage(dataURL, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================================
//  GALLERY MANAGEMENT
// ============================================================

function saveGallery() {
    try {
        // Store only last 50 photos to avoid localStorage limits
        const toStore = state.gallery.slice(0, 50);
        localStorage.setItem('filtercam_gallery', JSON.stringify(toStore));
    } catch (e) {
        console.warn('Failed to save gallery to localStorage:', e);
    }
}

function loadGallery() {
    try {
        const stored = localStorage.getItem('filtercam_gallery');
        if (stored) {
            state.gallery = JSON.parse(stored);
        }
    } catch (e) {
        state.gallery = [];
    }
}

function updateGalleryUI() {
    const count = state.gallery.length;

    // Update gallery button
    if (count > 0) {
        DOM.lastPhotoThumb.src = state.gallery[0].src;
        DOM.lastPhotoThumb.classList.remove('hidden');
        DOM.galleryPlaceholder.classList.add('hidden');
        DOM.galleryCount.textContent = count;
        DOM.galleryCount.classList.remove('hidden');
    } else {
        DOM.lastPhotoThumb.classList.add('hidden');
        DOM.galleryPlaceholder.classList.remove('hidden');
        DOM.galleryCount.classList.add('hidden');
    }

    // Update gallery modal grid
    if (count > 0) {
        DOM.galleryEmpty.classList.add('hidden');
        DOM.galleryGrid.classList.remove('hidden');
        DOM.galleryGrid.innerHTML = '';

        state.gallery.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-photo-item';
            item.innerHTML = `
                <img src="${photo.src}" alt="Photo" loading="lazy">
                <div class="gallery-photo-overlay">
                    <span class="gallery-photo-filter">${photo.filter}</span>
                    <button class="gallery-photo-delete" data-id="${photo.id}" title="Delete">🗑️</button>
                </div>
            `;

            // Tap to view full screen
            item.querySelector('img').addEventListener('click', () => {
                viewFullPhoto(photo);
            });

            // Delete button
            item.querySelector('.gallery-photo-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deletePhoto(photo.id);
            });

            DOM.galleryGrid.appendChild(item);
        });
    } else {
        DOM.galleryGrid.classList.add('hidden');
        DOM.galleryEmpty.classList.remove('hidden');
    }
}

function deletePhoto(id) {
    state.gallery = state.gallery.filter(p => p.id !== id);
    saveGallery();
    updateGalleryUI();
    showToast('🗑️', 'Photo deleted', 'info');
}

function clearGallery() {
    if (state.gallery.length === 0) return;

    if (confirm('Delete all photos? This cannot be undone.')) {
        state.gallery = [];
        saveGallery();
        updateGalleryUI();
        showToast('🗑️', 'Gallery cleared', 'info');
    }
}

function viewFullPhoto(photo) {
    // Use the preview screen to view gallery photos
    DOM.previewImage.src = photo.src;
    DOM.previewFilterName.textContent = photo.filter;
    state.capturedImage = photo.src;

    DOM.galleryModal.classList.add('hidden');
    DOM.previewScreen.classList.remove('hidden');
    DOM.cameraScreen.classList.add('hidden');
}

function showGallery() {
    updateGalleryUI();
    DOM.galleryModal.classList.remove('hidden');
}

function hideGallery() {
    DOM.galleryModal.classList.add('hidden');
}

// ============================================================
//  SETTINGS
// ============================================================

function loadSettings() {
    try {
        const stored = localStorage.getItem('filtercam_settings');
        if (stored) {
            Object.assign(state.settings, JSON.parse(stored));
        }
    } catch (e) {
        // Use defaults
    }
}

function saveSettings() {
    try {
        localStorage.setItem('filtercam_settings', JSON.stringify(state.settings));
    } catch (e) {
        // Ignore
    }
}

function applySettings() {
    // Resolution
    DOM.settingResolution.value = state.settings.resolution;

    // Mirror
    DOM.settingMirror.checked = state.settings.mirror;
    updateMirror();

    // Grid
    DOM.settingGrid.checked = state.settings.grid;
    DOM.gridOverlay.classList.toggle('hidden', !state.settings.grid);

    // Timer
    DOM.settingTimer.value = state.settings.timer.toString();

    // Face Guide
    DOM.settingFaceGuide.checked = state.settings.faceGuide;
    DOM.faceGuide.classList.toggle('hidden', !state.settings.faceGuide);
}

function showSettings() {
    applySettings();
    DOM.settingsModal.classList.remove('hidden');
}

function hideSettings() {
    DOM.settingsModal.classList.add('hidden');
}

// ============================================================
//  FLASH TOGGLE
// ============================================================

function toggleFlash() {
    const modes = ['off', 'on', 'auto'];
    const labels = { off: 'Off', on: 'On', auto: 'Auto' };
    const currentIdx = modes.indexOf(state.flashMode);
    const nextIdx = (currentIdx + 1) % modes.length;

    state.flashMode = modes[nextIdx];
    DOM.btnFlash.querySelector('.icon-btn-label').textContent = labels[state.flashMode];

    // Apply flash using track capabilities if available
    if (state.currentStream) {
        const track = state.currentStream.getVideoTracks()[0];
        if (track && track.getCapabilities) {
            const capabilities = track.getCapabilities();
            if (capabilities.torch) {
                const torchOn = state.flashMode === 'on';
                track.applyConstraints({ advanced: [{ torch: torchOn }] }).catch(() => { });
            }
        }
    }

    showToast('⚡', `Flash: ${labels[state.flashMode]}`, 'info');
}

// ============================================================
//  SCREEN MANAGEMENT
// ============================================================

function updateLoadingProgress(percent, statusText) {
    DOM.loadingBar.style.width = `${percent}%`;
    if (statusText) DOM.loadingStatus.textContent = statusText;
}

function hideLoadingScreen() {
    DOM.loadingScreen.classList.add('fade-out');
    setTimeout(() => DOM.loadingScreen.classList.add('hidden'), 500);
}

function showPermissionScreen() {
    DOM.permissionScreen.classList.remove('hidden');
}

function hidePermissionScreen() {
    DOM.permissionScreen.classList.add('hidden');
}

function showCameraScreen() {
    DOM.cameraScreen.classList.remove('hidden');
    buildFilterCarousel(state.currentCategory);
    updateGalleryUI();
    applySettings();
}

// ============================================================
//  TOAST NOTIFICATIONS
// ============================================================

function showToast(icon, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST.duration);
}

// ============================================================
//  EVENT BINDINGS
// ============================================================

function bindEvents() {
    // Permission
    DOM.btnGrantPermission.addEventListener('click', async () => {
        try {
            await startCamera();
            hidePermissionScreen();
            showCameraScreen();
        } catch (err) {
            showToast('❌', 'Camera access denied. Please allow camera permission.', 'error');
        }
    });

    // Capture
    DOM.btnCapture.addEventListener('click', capturePhoto);

    // Flash
    DOM.btnFlash.addEventListener('click', toggleFlash);

    // Flip Camera
    DOM.btnFlipCamera.addEventListener('click', flipCamera);

    // Settings
    DOM.btnSettings.addEventListener('click', showSettings);
    DOM.btnCloseSettings.addEventListener('click', hideSettings);

    // Settings change handlers
    DOM.settingResolution.addEventListener('change', async (e) => {
        state.settings.resolution = e.target.value;
        saveSettings();
        if (!state.useDeepAR) {
            await startCamera();
        }
        showToast('📐', `Resolution: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });

    DOM.settingMirror.addEventListener('change', (e) => {
        state.settings.mirror = e.target.checked;
        saveSettings();
        updateMirror();
    });

    DOM.settingGrid.addEventListener('change', (e) => {
        state.settings.grid = e.target.checked;
        saveSettings();
        DOM.gridOverlay.classList.toggle('hidden', !e.target.checked);
    });

    DOM.settingTimer.addEventListener('change', (e) => {
        state.settings.timer = parseInt(e.target.value);
        saveSettings();
    });

    DOM.settingFaceGuide.addEventListener('change', (e) => {
        state.settings.faceGuide = e.target.checked;
        saveSettings();
        DOM.faceGuide.classList.toggle('hidden', !e.target.checked);
    });

    // Click outside settings to close
    DOM.settingsModal.addEventListener('click', (e) => {
        if (e.target === DOM.settingsModal) hideSettings();
    });

    // Preview actions
    DOM.btnRetake.addEventListener('click', retakePhoto);
    DOM.btnPreviewClose.addEventListener('click', retakePhoto);
    DOM.btnSave.addEventListener('click', savePhoto);
    DOM.btnShare.addEventListener('click', sharePhoto);

    // Gallery
    DOM.btnGallery.addEventListener('click', showGallery);
    DOM.btnCloseGallery.addEventListener('click', hideGallery);
    DOM.btnClearGallery.addEventListener('click', clearGallery);

    // Filter category tabs
    DOM.filterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;

        DOM.filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        state.currentCategory = tab.dataset.category;
        buildFilterCarousel(state.currentCategory);
    });

    // Beauty mode toggle
    DOM.btnBeautyMode.addEventListener('click', () => {
        DOM.btnBeautyMode.classList.toggle('active');
        const isActive = DOM.btnBeautyMode.classList.contains('active');

        if (isActive) {
            // Activate "Face" tab and show face filters
            DOM.filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            DOM.filterTabs.querySelector('[data-category="beauty"]').classList.add('active');
            state.currentCategory = 'beauty';
            buildFilterCarousel('beauty');
            showToast('✨', 'Beauty Mode activated', 'info');
        } else {
            DOM.filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            DOM.filterTabs.querySelector('[data-category="face"]').classList.add('active');
            state.currentCategory = 'face';
            buildFilterCarousel('face');
            showToast('✨', 'Beauty Mode deactivated', 'info');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!DOM.previewScreen.classList.contains('hidden')) {
                savePhoto();
            } else if (!DOM.cameraScreen.classList.contains('hidden')) {
                capturePhoto();
            }
        }
        if (e.key === 'Escape') {
            if (!DOM.previewScreen.classList.contains('hidden')) {
                retakePhoto();
            } else if (!DOM.settingsModal.classList.contains('hidden')) {
                hideSettings();
            } else if (!DOM.galleryModal.classList.contains('hidden')) {
                hideGallery();
            }
        }
    });

    // Pinch to zoom on canvas container
    let initialDistance = 0;

    DOM.canvasContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches[0], e.touches[1]);
        }
    }, { passive: true });

    DOM.canvasContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / initialDistance;
            state.zoomLevel = Math.min(Math.max(state.zoomLevel * scale, 1), 5);
            initialDistance = currentDistance;

            const target = state.useDeepAR ? DOM.deepARCanvas : DOM.cameraVideo;
            target.style.transform = state.facingMode === 'user' && state.settings.mirror
                ? `scaleX(-1) scale(${state.zoomLevel})`
                : `scale(${state.zoomLevel})`;

            // Show zoom indicator
            document.getElementById('zoomLevel').textContent = `${state.zoomLevel.toFixed(1)}x`;
            document.getElementById('zoomIndicator').classList.remove('hidden');
        }
    }, { passive: true });

    DOM.canvasContainer.addEventListener('touchend', () => {
        setTimeout(() => {
            document.getElementById('zoomIndicator').classList.add('hidden');
        }, 1000);
    }, { passive: true });

    // Double tap to flip camera
    let lastTap = 0;
    DOM.canvasContainer.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            const now = Date.now();
            if (now - lastTap < 300) {
                flipCamera();
            }
            lastTap = now;
        }
    });

    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Handle visibility change — pause/resume camera
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page hidden — optionally pause
        } else {
            // Page visible — resume if needed
            if (state.currentStream && !DOM.cameraScreen.classList.contains('hidden')) {
                const track = state.currentStream.getVideoTracks()[0];
                if (track && track.readyState === 'ended') {
                    startCamera().catch(() => { });
                }
            }
        }
    });
}

// ============================================================
//  UTILITY FUNCTIONS
// ============================================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}