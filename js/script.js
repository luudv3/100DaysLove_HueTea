// ==========================================
// CONFIGURATION & DATA
// ==========================================
const CONFIG = {
  anniversaryDate: localStorage.getItem('anniversaryDate') || '2024-02-14',
  partnerName: localStorage.getItem('partnerName') || 'Bé Yêu',
  myName: localStorage.getItem('myName') || 'Anh Yêu',
  bgMusicUrl: 'audio/1000 Ánh Mắt.mp3'
};

// 13 Hình ảnh hiện có trong thư mục ./img/
let IMAGES = [
  '1789556461089_2136759482228812858_7663928132333348806_a79211dec98ac51b637ca444757fe7ce.jpg',
  '1789556461098_2136759482228812858_7663928132333348806_7615364b6ac34c3033786c82d08dc6d3.jpg',
  '1789556461113_2136759482228812858_7663928132333348806_f7b3d44918066c9bc930c42a2997c578.jpg',
  '1789556461137_2136759482228812858_7663928132333348806_d4c0abedb68cc0511c0fa34fe7979d5c.jpg',
  '1793091314186_2136759482228812858_7663928132333348806_1828e4a21311a2753853ec2225c80a6b.jpg',
  '1793095622129_2136759482228812858_7663928132333348806_7d4a3ecfacff604506de1ccc4d8d0091.jpg',
  'z7849276063432_db26e89909b01479bc31359eb5d078d5.jpg',
  'z7849280125502_c358bb1d1f67493998179fe018338255.jpg',
  'z7849280144687_3fa73c288e360e2dd93df9c415af7d74.jpg',
  'z7849280147604_2566047d1b12f13d35e288051bc515a1.jpg',
  'z7849280156078_6bd271244c5ccfc57cf28afb90d8e11a.jpg',
  'z7849280158923_1892bb0c93fb0eaeb48efe3ccd0b5f98.jpg',
  'z7849280247005_989164adab7773e15a9d41da3d7c40d5.jpg'
];

// 12 Video hiện có trong thư mục ./video/
let VIDEOS = [
  '1789556461131_2136759482228812858_7663928132333348806.mp4',
  '1793095469517_2136759482228812858_7663928132333348806.mp4',
  '1793095622140_2136759482228812858_7663928132333348806.mp4',
  '1793095622144_2136759482228812858_7663928132333348806.mp4',
  '1793095622147_2136759482228812858_7663928132333348806.mp4',
  '1793095622150_2136759482228812858_7663928132333348806.mp4',
  '51a464c8-36d7-4934-9072-9052edebb1d2.mp4',
  '7566806332582432020.mp4',
  '7849276083925.mp4',
  '7976377873946.mp4',
  'd722c42c-711f-4d9b-8eee-9cbe71d95040.mp4',
  'snaptikvn_7589510726323014933.mp4'
];

const STICKER_ICONS = ['🎀', '🍓', '🧸', '🌸', '🐰', '✨', '🍰', '💌', '🌷', '🍬', '⭐', '🧁', '🐱', '💖', '🍭', '🌼', '🍯', '🍼'];

const SWEET_CAPTIONS = [
  'Nụ cười tỏa nắng của em ✨',
  'Khoảnh khắc ngọt ngào nhất 💖',
  'Bé cưng của anh nè 🌸',
  'Đáng yêu xỉu luôn 🧸',
  'Mỗi ngày đều yêu em nhiều hơn 🌷',
  'Chuyến đi cùng nhau 🚗',
  'Em xinh đẹp nhất trần đời 👑',
  'Thương em nhất quả đất 🍓',
  'Góc nào cũng thấy cưng 💌',
  'Kho báu của anh đó 💎',
  'Hạnh phúc giản đơn bên em 🥰',
  'Gương mặt mê người 💕',
  'Nắm tay em đi khắp thế gian 🌈',
  'Ngày nắng đẹp bên em ☀️',
  'Mắt biếc long lanh 💖',
  'Mãi là cô bé của anh nha 🎀',
  'Tình yêu to bự 🌟',
  'Yêu thương đong đầy 🍯',
  'Bên nhau mãi mãi nha em 💑'
];

let currentPage = 1;
let audioPlayer = null;
let isAudioPlaying = false;
let fireworksInterval = null;
let webAudioCtx = null;
let musicBoxInterval = null;

// Quản lý Carousel Trang 4
let currentMediaTab = 'videos';
let currentVideoIndex = 0;
let currentPhotoIndex = 0;

// ==========================================
// TỰ ĐỘNG CẬP NHẬT ẢNH / VIDEO / NHẠC TỪ SERVER
// ==========================================
function applyMediaData(data) {
  if (!data) return;
  
  if (data.images && data.images.length > 0) {
    IMAGES = data.images;
    const tabPhotos = document.getElementById('tabPhotos');
    if (tabPhotos) tabPhotos.innerText = `📸 Album Ảnh (${IMAGES.length})`;
    
    const p2Img = document.getElementById('p2FeatureImg');
    if (p2Img) p2Img.src = encodeURI(`img/${IMAGES[0]}`);
  }
  
  if (data.videos && data.videos.length > 0) {
    VIDEOS = data.videos;
    const tabVideos = document.getElementById('tabVideos');
    if (tabVideos) tabVideos.innerText = `🎬 Thước Phim (${VIDEOS.length})`;
  }
  
  // Cập nhật nhạc từ thư mục audio
  if (data.audio) {
    CONFIG.bgMusicUrl = encodeURI(data.audio);
    if (audioPlayer) {
      audioPlayer.src = CONFIG.bgMusicUrl;
    }
  }
  
  renderCarousel();
}

async function checkServerMedia() {
  // 0. Nếu đã lưu từ nút chọn trên web (localStorage)
  const savedImgs = localStorage.getItem('saved_images');
  const savedVids = localStorage.getItem('saved_videos');
  const savedAud = localStorage.getItem('saved_audio');
  if (savedImgs || savedVids || savedAud) {
    try {
      applyMediaData({
        images: savedImgs ? JSON.parse(savedImgs) : null,
        videos: savedVids ? JSON.parse(savedVids) : null,
        audio: savedAud || null
      });
      return;
    } catch(e) {}
  }

  // 1. Nếu có file media_list.js (chạy từ update_media.bat khi mở trực tiếp index.html)
  if (window.LOCAL_MEDIA && (window.LOCAL_MEDIA.images || window.LOCAL_MEDIA.videos || window.LOCAL_MEDIA.audio)) {
    applyMediaData(window.LOCAL_MEDIA);
    return;
  }

  // 2. Nếu mở file index.php trên localhost
  if (window.SERVER_MEDIA && window.SERVER_MEDIA.success) {
    applyMediaData(window.SERVER_MEDIA);
    return;
  }
  
  // 3. Nếu mở file index.html qua localhost, gọi API get_media.php
  try {
    const res = await fetch('get_media.php');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        applyMediaData(data);
      }
    }
  } catch (err) {
    console.log('Chế độ file tĩnh');
  }
}

// ==========================================
// INIT APP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupAudio();
  setupFloatingStickers();
  setupParticlesCanvas();
  setupFireworksCanvas();
  setupCarousel();
  startLoveTimer();
  setupCursorHearts();
  loadSavedCustomizations();
  preventDoubleTapZoom();
  checkServerMedia();
});

function preventDoubleTapZoom() {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    if (e.target.closest('input, textarea, button, .cute-btn, .tab-btn, .top-pill-btn, .carousel-nav-btn, canvas, #scratchCanvas, .scratch-stage-wrapper, .quiz-btn-no, .quiz-btn-yes')) {
      return;
    }
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

function loadSavedCustomizations() {
  const pName = localStorage.getItem('partnerName') || 'Bé Yêu';
  const partnerNameEls = document.querySelectorAll('.partner-name-display');
  partnerNameEls.forEach(el => el.innerText = pName);

  const mName = localStorage.getItem('myName') || 'Anh Yêu';
  const myNameEls = document.querySelectorAll('.my-name-display');
  myNameEls.forEach(el => el.innerText = mName);
  
  const savedDate = localStorage.getItem('anniversaryDate');
  if (savedDate) {
    const dateInput = document.getElementById('inputAnniversaryDate');
    if (dateInput) dateInput.value = savedDate;
  }
}

// ==========================================
// AUDIO SYSTEM (Phát file trong audio/ hoặc nhạc mặc định)
// ==========================================
function setupAudio() {
  audioPlayer = new Audio();
  
  // Ưu tiên phát file trong audio/
  audioPlayer.src = encodeURI(CONFIG.bgMusicUrl);
  audioPlayer.loop = true;
  
  audioPlayer.onerror = () => {
    const fallbackList = ['audio/1000 Ánh Mắt.mp3', 'audio/music.mp3', 'audio/nhac.mp3', 'https://assets.mixkit.co/music/preview/mixkit-loving-you-117.mp3'];
    tryNextAudioFallback(fallbackList, 0);
  };
}

function tryNextAudioFallback(list, index) {
  if (index >= list.length) return;
  const testAudio = new Audio(encodeURI(list[index]));
  testAudio.oncanplaythrough = () => {
    if (audioPlayer) {
      audioPlayer.src = encodeURI(list[index]);
      CONFIG.bgMusicUrl = list[index];
    }
  };
  testAudio.onerror = () => {
    tryNextAudioFallback(list, index + 1);
  };
}

function playMusic() {
  if (isAudioPlaying) return;
  
  if (audioPlayer && audioPlayer.src) {
    audioPlayer.play().then(() => {
      isAudioPlaying = true;
      updateMusicButtonState();
    }).catch(err => {
      startMusicBoxTune();
      isAudioPlaying = true;
      updateMusicButtonState();
    });
  } else {
    startMusicBoxTune();
    isAudioPlaying = true;
    updateMusicButtonState();
  }
}

function toggleMusic() {
  if (isAudioPlaying) {
    if (audioPlayer) audioPlayer.pause();
    stopMusicBoxTune();
    isAudioPlaying = false;
  } else {
    playMusic();
  }
  updateMusicButtonState();
}

function updateMusicButtonState() {
  const toggleBtn = document.getElementById('musicToggle');
  const toggleText = document.getElementById('musicToggleText');
  if (!toggleBtn) return;
  
  if (isAudioPlaying) {
    toggleBtn.classList.add('playing');
    if (toggleText) toggleText.innerText = 'Đang phát 🎵';
  } else {
    toggleBtn.classList.remove('playing');
    if (toggleText) toggleText.innerText = 'Bật nhạc 🎵';
  }
}

function startMusicBoxTune() {
  stopMusicBoxTune();
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    webAudioCtx = new AudioContext();
    
    const notes = [
      523.25, 493.88, 440.00, 392.00, 349.23, 329.63, 349.23, 392.00,
      523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 523.25, 659.25
    ];
    let noteIdx = 0;
    
    musicBoxInterval = setInterval(() => {
      if (!isAudioPlaying || !webAudioCtx) return;
      playMusicBoxNote(notes[noteIdx % notes.length]);
      noteIdx++;
    }, 450);
  } catch(e) {}
}

function playMusicBoxNote(freq) {
  if (!webAudioCtx) return;
  if (webAudioCtx.state === 'suspended') webAudioCtx.resume();
  
  const osc = webAudioCtx.createOscillator();
  const gain = webAudioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, webAudioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.12, webAudioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, webAudioCtx.currentTime + 1.2);
  
  osc.connect(gain);
  gain.connect(webAudioCtx.destination);
  
  osc.start();
  osc.stop(webAudioCtx.currentTime + 1.2);
}

function stopMusicBoxTune() {
  if (musicBoxInterval) {
    clearInterval(musicBoxInterval);
    musicBoxInterval = null;
  }
}

// ==========================================
// PAGE NAVIGATION SYSTEM (KHÔNG CUỘN)
// ==========================================
function goToPage(pageNum) {
  if (pageNum < 1 || pageNum > 5) return;
  
  const prevPageEl = document.getElementById(`page-${currentPage}`);
  if (prevPageEl) {
    prevPageEl.classList.remove('active');
  }
  
  currentPage = pageNum;
  
  const nextPageEl = document.getElementById(`page-${currentPage}`);
  if (nextPageEl) {
    nextPageEl.classList.add('active');
  }
  
  document.querySelectorAll('.page-indicators .dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx + 1 === currentPage);
  });
  
  if (currentPage > 1 && !isAudioPlaying) {
    playMusic();
  }

  if (currentPage === 2) {
    startLetterTypewriter();
  } else {
    if (isLetterTyping) {
      finishTypewriter(true);
    }
  }
  
  if (currentPage === 3) {
    launchFireworksShow();
  } else {
    stopFireworksShow();
  }

  if (currentPage === 5) {
    burstHeartsAtCenter();
  }

  if (currentPage !== 4) {
    const activeVid = document.querySelector('#carouselCard video');
    if (activeVid) activeVid.pause();
    // Khi rời trang 4 thì tiếp tục phát lại bài hát 1000 Ánh Mắt
    if (isAudioPlaying && audioPlayer) {
      audioPlayer.play().catch(() => {});
    }
  } else {
    renderCarousel();
  }
}

// Bùng nổ ngàn nụ hôn và trái tim trên Trang 5
function sendKissesFountain() {
  burstHeartsAtCenter();
  const count = 36;
  const kissingIcons = ['💋', '😘', '💖', '💕', '💗', '🌸', '✨', '💍', '💌', '🌷'];
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const kiss = document.createElement('div');
      kiss.innerText = kissingIcons[Math.floor(Math.random() * kissingIcons.length)];
      
      const startX = window.innerWidth / 2 + (Math.random() * 80 - 40);
      const startY = window.innerHeight * 0.45 + (Math.random() * 60 - 30);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 220 + 80;
      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance - (Math.random() * 80 + 50);
      const duration = 1.8 + Math.random() * 1.2;
      
      kiss.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: ${Math.random() * 18 + 22}px;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%) scale(0.6);
        transition: transform ${duration}s cubic-bezier(0.12, 0.8, 0.32, 1), opacity ${duration}s ease-out;
      `;
      document.body.appendChild(kiss);
      
      requestAnimationFrame(() => {
        kiss.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1.3) rotate(${Math.random() * 60 - 30}deg)`;
        kiss.style.opacity = '0';
      });
      
      setTimeout(() => kiss.remove(), duration * 1000);
    }, i * 35);
  }
}

function openGiftBox() {
  burstHeartsAtCenter();
  playMusic();
  
  const boxBtn = document.querySelector('.gift-box-btn');
  if (boxBtn) {
    boxBtn.style.transform = 'scale(1.35) rotate(15deg)';
    boxBtn.style.opacity = '0.7';
  }
  
  setTimeout(() => {
    goToPage(2);
  }, 450);
}

function finishReading() {
  burstHeartsAtCenter();
  goToPage(3);
}

// ==========================================
// FLOATING STICKERS
// ==========================================
function setupFloatingStickers() {
  const container = document.getElementById('floatingStickers');
  if (!container) return;
  
  const count = window.innerWidth < 450 ? 12 : 20;
  container.innerHTML = '';
  
  for (let i = 0; i < count; i++) {
    const sticker = document.createElement('div');
    sticker.className = 'sticker';
    sticker.innerText = STICKER_ICONS[Math.floor(Math.random() * STICKER_ICONS.length)];
    
    const left = Math.random() * 88 + 4; 
    const top = Math.random() * 86 + 6;  
    const delay = Math.random() * 4;
    const duration = 3 + Math.random() * 3;
    const size = 22 + Math.random() * 12;
    
    sticker.style.left = `${left}%`;
    sticker.style.top = `${top}%`;
    sticker.style.animationDelay = `${delay}s`;
    sticker.style.animationDuration = `${duration}s`;
    sticker.style.fontSize = `${size}px`;
    
    sticker.addEventListener('click', (e) => {
      e.stopPropagation();
      popSticker(sticker);
    });
    
    container.appendChild(sticker);
  }
}

function popSticker(el) {
  el.style.transform = 'scale(1.7) rotate(360deg)';
  el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  const rect = el.getBoundingClientRect();
  createMiniBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  
  setTimeout(() => {
    el.style.transform = '';
  }, 600);
}

// ==========================================
// PARTICLES CANVAS
// ==========================================
let pCanvas, pCtx;
let particles = [];

function setupParticlesCanvas() {
  pCanvas = document.getElementById('effectsCanvas');
  if (!pCanvas) return;
  pCtx = pCanvas.getContext('2d');
  
  resizeParticlesCanvas();
  window.addEventListener('resize', resizeParticlesCanvas);
  
  for (let i = 0; i < 28; i++) {
    particles.push(createParticle());
  }
  
  animateParticles();
}

function resizeParticlesCanvas() {
  if (!pCanvas) return;
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    size: Math.random() * 12 + 8,
    speedY: Math.random() * 0.7 + 0.3,
    speedX: Math.sin(Math.random() * Math.PI) * 0.4,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 1.5,
    opacity: Math.random() * 0.5 + 0.3,
    type: Math.random() > 0.4 ? 'heart' : 'petal',
    color: ['#ff477e', '#ff7096', '#ff9ebb', '#ffb3c1', '#ffffff'][Math.floor(Math.random() * 5)]
  };
}

function animateParticles() {
  if (!pCtx) return;
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  
  particles.forEach(p => {
    p.y += p.speedY;
    p.x += Math.sin(p.y / 30) * 0.5;
    p.rotation += p.rotSpeed;
    
    if (p.y > pCanvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * pCanvas.width;
    }
    
    pCtx.save();
    pCtx.translate(p.x, p.y);
    pCtx.rotate((p.rotation * Math.PI) / 180);
    pCtx.globalAlpha = p.opacity;
    
    if (p.type === 'heart') {
      pCtx.fillStyle = p.color;
      drawHeart(pCtx, 0, 0, p.size);
    } else {
      pCtx.fillStyle = '#ffccd5';
      drawPetal(pCtx, 0, 0, p.size);
    }
    
    pCtx.restore();
  });
  
  requestAnimationFrame(animateParticles);
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
  ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
}

function drawPetal(ctx, x, y, size) {
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.4, size * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ==========================================
// FIREWORKS CANVAS (TRANG 3)
// ==========================================
let fwCanvas, fwCtx;
let fireworks = [];
let fireworkParticles = [];

function setupFireworksCanvas() {
  fwCanvas = document.getElementById('fireworksCanvas');
  if (!fwCanvas) return;
  fwCtx = fwCanvas.getContext('2d');
  
  resizeFireworksCanvas();
  window.addEventListener('resize', resizeFireworksCanvas);
  
  animateFireworks();
}

function resizeFireworksCanvas() {
  if (!fwCanvas) return;
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}

function launchFireworksShow() {
  stopFireworksShow();
  for (let i = 0; i < 4; i++) {
    setTimeout(createRandomFirework, i * 220);
  }
  
  fireworksInterval = setInterval(() => {
    if (currentPage === 3) {
      createRandomFirework();
    }
  }, 650);
}

function stopFireworksShow() {
  if (fireworksInterval) {
    clearInterval(fireworksInterval);
    fireworksInterval = null;
  }
}

function createRandomFirework() {
  if (!fwCanvas) return;
  const startX = Math.random() * (fwCanvas.width * 0.8) + (fwCanvas.width * 0.1);
  const startY = fwCanvas.height;
  const targetX = startX + (Math.random() - 0.5) * 160;
  const targetY = Math.random() * (fwCanvas.height * 0.45) + 60;
  
  const colors = ['#ff477e', '#ff7096', '#ffbe0b', '#70d6ff', '#e0245e', '#ff9ebb', '#ffffff', '#ffd166', '#d946ef'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  fireworks.push({
    x: startX,
    y: startY,
    targetX: targetX,
    targetY: targetY,
    speed: 13 + Math.random() * 4,
    angle: Math.atan2(targetY - startY, targetX - startX),
    color: color
  });
}

function createFireworkExplosion(x, y, color) {
  const particleCount = 70 + Math.floor(Math.random() * 25);
  const isHeart = Math.random() > 0.35;
  
  for (let i = 0; i < particleCount; i++) {
    let vx, vy;
    
    if (isHeart) {
      const t = (Math.PI * 2 * i) / particleCount;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      const speed = (Math.random() * 0.2 + 0.8) * 0.24;
      vx = hx * speed;
      vy = hy * speed;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
    }
    
    fireworkParticles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      alpha: 1,
      decay: Math.random() * 0.016 + 0.012,
      color: color,
      size: Math.random() * 3 + 2
    });
  }
}

function animateFireworks() {
  if (!fwCtx) return;
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i];
    f.x += Math.cos(f.angle) * f.speed;
    f.y += Math.sin(f.angle) * f.speed;
    
    fwCtx.beginPath();
    fwCtx.arc(f.x, f.y, 3, 0, Math.PI * 2);
    fwCtx.fillStyle = f.color;
    fwCtx.fill();
    
    if (f.y <= f.targetY) {
      createFireworkExplosion(f.x, f.y, f.color);
      fireworks.splice(i, 1);
    }
  }
  
  for (let i = fireworkParticles.length - 1; i >= 0; i--) {
    const p = fireworkParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.vx *= 0.98;
    p.alpha -= p.decay;
    
    if (p.alpha <= 0) {
      fireworkParticles.splice(i, 1);
      continue;
    }
    
    fwCtx.save();
    fwCtx.globalAlpha = p.alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 8;
    fwCtx.shadowColor = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }
  
  requestAnimationFrame(animateFireworks);
}

function triggerFireworksBurst() {
  for (let i = 0; i < 5; i++) {
    setTimeout(createRandomFirework, i * 180);
  }
}

// ==========================================
// VỆT TRÁI TIM & BỤI SAO PHÉP THUẬT (TOUCH / MOUSE)
// ==========================================
function setupCursorHearts() {
  let lastX = 0, lastY = 0;
  
  const handleMove = (x, y) => {
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist > 22) {
      createMiniHeartCursor(x, y);
      lastX = x;
      lastY = y;
    }
  };
  
  window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      createMiniHeartCursor(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

function createMiniHeartCursor(x, y) {
  const symbols = ['💖', '✨', '🌸', '💕', '⭐', '💓', '🌷'];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  const heart = document.createElement('div');
  heart.className = 'magic-trail-particle';
  heart.innerText = symbol;
  
  const dx = (Math.random() * 50 - 25) + 'px';
  const dy = (-Math.random() * 45 - 20) + 'px';
  const rot = (Math.random() * 70 - 35) + 'deg';
  
  heart.style.setProperty('--dx', dx);
  heart.style.setProperty('--dy', dy);
  heart.style.setProperty('--rot', rot);
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${Math.random() * 10 + 13}px`;
  
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 850);
}

function createMiniBurst(x, y) {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.innerText = ['💖', '✨', '🌸'][Math.floor(Math.random() * 3)];
    p.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 15px;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s;
    `;
    document.body.appendChild(p);
    
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 35 + Math.random() * 20;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    requestAnimationFrame(() => {
      p.style.transform = `translate(${tx}px, ${ty}px) scale(1.1)`;
      p.style.opacity = '0';
    });
    
    setTimeout(() => p.remove(), 600);
  }
}

function burstHeartsAtCenter() {
  createMiniBurst(window.innerWidth / 2, window.innerHeight / 2);
}

function shootHeartShower() {
  const btn = document.querySelector('.heart-fountain-btn');
  const rect = btn ? btn.getBoundingClientRect() : null;
  const count = 25;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.innerText = ['💖', '💕', '💗', '💓', '💝', '🌸', '✨', '🎀'][Math.floor(Math.random() * 8)];
      const startX = rect ? (rect.left + rect.width / 2 + (Math.random() * 24 - 12)) : (window.innerWidth - 40);
      const startY = rect ? (rect.top + rect.height / 2) : (window.innerHeight - 80);
      const endX = startX - (Math.random() * 280 + 30);
      const endY = -40;
      const duration = 2.2 + Math.random() * 1.2;
      
      heart.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: ${Math.random() * 18 + 18}px;
        pointer-events: none;
        z-index: 10000;
        transition: transform ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1), opacity ${duration}s;
      `;
      document.body.appendChild(heart);
      
      requestAnimationFrame(() => {
        heart.style.transform = `translate(${endX - startX}px, ${endY - startY}px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0.1';
      });
      
      setTimeout(() => heart.remove(), duration * 1000);
    }, i * 50);
  }
}

// ==========================================
// ĐỒNG HỒ ĐẾM NGÀY YÊU (TRANG 3)
// ==========================================
function startLoveTimer() {
  function update() {
    const savedDate = localStorage.getItem('anniversaryDate') || CONFIG.anniversaryDate;
    const start = new Date(savedDate);
    const now = new Date();
    const diff = Math.max(0, now - start);
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    const dEl = document.getElementById('countDays');
    const hEl = document.getElementById('countHours');
    const mEl = document.getElementById('countMins');
    const sEl = document.getElementById('countSecs');
    
    if (dEl) dEl.innerText = days;
    if (hEl) hEl.innerText = String(hours).padStart(2, '0');
    if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
    if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
  }
  
  update();
  setInterval(update, 1000);
}

// ==========================================
// CAROUSEL THƯỚC PHIM & ẢNH KỶ NIỆM (TRANG 4)
// ==========================================
function setupCarousel() {
  renderCarousel();
  
  const viewport = document.getElementById('carouselViewport');
  if (!viewport) return;
  
  let touchStartX = 0;
  let touchStartY = 0;
  
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  viewport.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextCarouselItem();
      } else {
        prevCarouselItem();
      }
    }
  }, { passive: true });
}

function switchMediaTab(tab) {
  currentMediaTab = tab;
  
  const tabVideos = document.getElementById('tabVideos');
  const tabPhotos = document.getElementById('tabPhotos');
  
  if (tab === 'videos') {
    tabVideos.classList.add('active');
    tabPhotos.classList.remove('active');
  } else {
    tabPhotos.classList.add('active');
    tabVideos.classList.remove('active');

    // Tạm dừng video và phát lại bài hát 1000 Ánh Mắt
    const activeVid = document.querySelector('#carouselCard video');
    if (activeVid) activeVid.pause();
    if (audioPlayer && isAudioPlaying) {
      audioPlayer.play().catch(() => {});
    }
  }
  
  renderCarousel();
}

function renderCarousel() {
  const card = document.getElementById('carouselCard');
  const badge = document.getElementById('carouselBadge');
  const caption = document.getElementById('carouselCaption');
  const counter = document.getElementById('carouselCounter');
  if (!card) return;
  
  if (currentMediaTab === 'videos') {
    const total = VIDEOS.length;
    if (total === 0) {
      card.innerHTML = `
        <div style="color: white; padding: 20px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 6px;">🎬</div>
          <div style="font-size: 0.9rem; font-weight: 700;">Chưa có video</div>
          <button class="cute-btn" style="margin-top: 10px; font-size: 0.78rem; padding: 6px 12px; background: var(--pink-500);" onclick="openConfigModal()">
            Bấm chọn video 📁
          </button>
        </div>`;
      return;
    }
    const idx = currentVideoIndex % total;
    const vidSrc = encodeURI(`video/${VIDEOS[idx]}`);
    
    // Video mặc định tắt tiếng, người xem muốn nghe thì tự bấm bật tiếng trên video
    card.innerHTML = `
      <video src="${vidSrc}" controls playsinline autoplay muted loop></video>
    `;

    const vid = card.querySelector('video');
    if (vid) {
      vid.muted = true; // MẶC ĐỊNH TẮT TIẾNG

      // Khi người xem chủ động bật tiếng video -> tạm dừng nhạc nền
      vid.onvolumechange = () => {
        if (!vid.muted && vid.volume > 0) {
          if (audioPlayer && isAudioPlaying) {
            audioPlayer.pause();
          }
        } else {
          if (audioPlayer && isAudioPlaying) {
            audioPlayer.play().catch(() => {});
          }
        }
      };
    }
    
    if (badge) badge.innerText = `🎬 Thước phim #${idx + 1}`;
    if (caption) caption.innerText = SWEET_CAPTIONS[idx % SWEET_CAPTIONS.length];
    if (counter) counter.innerText = `${idx + 1} / ${total}`;
    
  } else {
    const total = IMAGES.length;
    if (total === 0) {
      card.innerHTML = `
        <div style="color: white; padding: 20px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 6px;">📸</div>
          <div style="font-size: 0.9rem; font-weight: 700;">Chưa có ảnh</div>
          <button class="cute-btn" style="margin-top: 10px; font-size: 0.78rem; padding: 6px 12px; background: var(--pink-500);" onclick="openConfigModal()">
            Bấm chọn ảnh 📁
          </button>
        </div>`;
      return;
    }
    const idx = currentPhotoIndex % total;
    const imgSrc = encodeURI(`img/${IMAGES[idx]}`);
    
    card.innerHTML = `
      <img src="${imgSrc}" alt="Ảnh kỷ niệm ${idx + 1}">
    `;
    
    if (badge) badge.innerText = `📸 Bức ảnh #${idx + 1}`;
    if (caption) caption.innerText = SWEET_CAPTIONS[idx % SWEET_CAPTIONS.length];
    if (counter) counter.innerText = `${idx + 1} / ${total}`;
    
    card.onclick = () => {
      openMediaModal('image', imgSrc);
    };
  }
}

function nextCarouselItem() {
  if (currentMediaTab === 'videos') {
    if (VIDEOS.length > 0) {
      currentVideoIndex = (currentVideoIndex + 1) % VIDEOS.length;
    }
  } else {
    if (IMAGES.length > 0) {
      currentPhotoIndex = (currentPhotoIndex + 1) % IMAGES.length;
    }
  }
  renderCarousel();
  burstHeartsAtCenter();
}

function prevCarouselItem() {
  if (currentMediaTab === 'videos') {
    if (VIDEOS.length > 0) {
      currentVideoIndex = (currentVideoIndex - 1 + VIDEOS.length) % VIDEOS.length;
    }
  } else {
    if (IMAGES.length > 0) {
      currentPhotoIndex = (currentPhotoIndex - 1 + IMAGES.length) % IMAGES.length;
    }
  }
  renderCarousel();
}

function openActiveItemFullscreen() {
  if (currentMediaTab === 'videos') {
    if (VIDEOS.length > 0) {
      const vidSrc = encodeURI(`video/${VIDEOS[currentVideoIndex % VIDEOS.length]}`);
      openMediaModal('video', vidSrc);
    }
  } else {
    if (IMAGES.length > 0) {
      const imgSrc = encodeURI(`img/${IMAGES[currentPhotoIndex % IMAGES.length]}`);
      openMediaModal('image', imgSrc);
    }
  }
}

function likeActiveItem(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  btn.style.transform = 'scale(1.4)';
  const rect = btn.getBoundingClientRect();
  createMiniBurst(rect.left + 10, rect.top + 10);
  setTimeout(() => btn.style.transform = '', 300);
}

// ==========================================
// MODAL XEM TOÀN MÀN HÌNH (OBJECT-FIT: CONTAIN)
// ==========================================
function openMediaModal(type, src) {
  const modal = document.getElementById('mediaModal');
  const container = document.getElementById('mediaModalContent');
  if (!modal || !container) return;
  
  container.innerHTML = '';
  
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    container.appendChild(img);
  } else if (type === 'video') {
    const vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.muted = true; // MẶC ĐỊNH TẮT TIẾNG KHI PHÓNG TO
    container.appendChild(vid);
    
    // Nếu người xem chủ động bật tiếng video trong modal
    vid.onvolumechange = () => {
      if (!vid.muted && vid.volume > 0) {
        if (audioPlayer && isAudioPlaying) {
          audioPlayer.pause();
        }
      } else {
        if (audioPlayer && isAudioPlaying) {
          audioPlayer.play().catch(() => {});
        }
      }
    };
  }
  
  modal.classList.add('active');
}

function closeMediaModal() {
  const modal = document.getElementById('mediaModal');
  const container = document.getElementById('mediaModalContent');
  if (!modal) return;
  
  modal.classList.remove('active');
  if (container) {
    const vid = container.querySelector('video');
    if (vid) vid.pause();
    container.innerHTML = '';
  }
  
  // Phát lại bài hát 1000 Ánh Mắt
  if (audioPlayer && isAudioPlaying) {
    audioPlayer.play().catch(() => {});
  }
}

// ==========================================
// CÀI ĐẶT NHANH (TÙY CHỈNH TÊN, NGÀY & CHỌN MEDIA MỚI)
// ==========================================
function openConfigModal() {
  const modal = document.getElementById('configModal');
  if (modal) modal.classList.add('active');
}

function closeConfigModal() {
  const modal = document.getElementById('configModal');
  if (modal) modal.classList.remove('active');
}

function saveConfigSettings() {
  const partnerName = document.getElementById('inputPartnerName').value.trim();
  const dateVal = document.getElementById('inputAnniversaryDate').value;
  
  if (partnerName) {
    localStorage.setItem('partnerName', partnerName);
    loadSavedCustomizations();
  }
  if (dateVal) {
    localStorage.setItem('anniversaryDate', dateVal);
  }
  
  closeConfigModal();
  burstHeartsAtCenter();
}

function handlePickImages(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  const names = [];
  for (let i = 0; i < files.length; i++) {
    names.push(files[i].name);
  }
  localStorage.setItem('saved_images', JSON.stringify(names));
  IMAGES = names;
  
  const tabPhotos = document.getElementById('tabPhotos');
  if (tabPhotos) tabPhotos.innerText = `📸 Album Ảnh (${IMAGES.length})`;
  
  const p2Img = document.getElementById('p2FeatureImg');
  if (p2Img && IMAGES.length > 0) {
    p2Img.src = encodeURI(`img/${IMAGES[0]}`);
  }
  
  renderCarousel();
  showUploadStatus(`Đã nhận ${names.length} ảnh mới! 📸`);
}

function handlePickVideos(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  const names = [];
  for (let i = 0; i < files.length; i++) {
    names.push(files[i].name);
  }
  localStorage.setItem('saved_videos', JSON.stringify(names));
  VIDEOS = names;
  
  const tabVideos = document.getElementById('tabVideos');
  if (tabVideos) tabVideos.innerText = `🎬 Thước Phim (${VIDEOS.length})`;
  
  renderCarousel();
  showUploadStatus(`Đã nhận ${names.length} video mới! 🎬`);
}

function handlePickAudio(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  const audioPath = 'audio/' + file.name;
  localStorage.setItem('saved_audio', audioPath);
  CONFIG.bgMusicUrl = audioPath;
  if (audioPlayer) {
    audioPlayer.src = encodeURI(audioPath);
    playMusic();
  }
  showUploadStatus(`Đã chọn bài hát: ${file.name} 🎵`);
}

function showUploadStatus(msg) {
  const el = document.getElementById('uploadStatusText');
  if (el) {
    el.innerText = msg;
    burstHeartsAtCenter();
  }
}

// ========================================================
// 1. HIỆU ỨNG GÕ MÁY ĐÁNH CHỮ THƯ TÌNH (TYPEWRITER EFFECT - TRANG 2)
// ========================================================
let typewriterTimeout = null;
let isLetterTyping = false;
let hasLetterTyped = false;

const LETTER_TEXT_DATA = [
  "Cảm ơn em đã xuất hiện trong cuộc đời anh, mang đến cho anh những nụ cười ấm áp, những niềm vui dịu dàng và những khoảnh khắc hạnh phúc không gì sánh bằng.",
  "Dạo này em bận rộn và vất vả nhiều rồi, anh thấy hết và thương em thật nhiều 💗 Hãy luôn nhớ tự chăm sóc bản thân thật tốt nhé, đừng để bản thân mệt quá nha.",
  "Mỗi ngày trôi qua có em đều là một ngày tuyệt vời đối với anh. Cảm ơn em vì đã là em, và cảm ơn vì đã chọn ở bên anh! 🌷✨"
];

function playSoftChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!webAudioCtx) webAudioCtx = new AudioContext();
    if (webAudioCtx.state === 'suspended') webAudioCtx.resume();
    
    const osc = webAudioCtx.createOscillator();
    const gain = webAudioCtx.createGain();
    
    const freqs = [523.25, 659.25, 783.99, 1046.50, 880.00];
    osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.015, webAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, webAudioCtx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(webAudioCtx.destination);
    
    osc.start();
    osc.stop(webAudioCtx.currentTime + 0.08);
  } catch(e) {}
}

function startLetterTypewriter() {
  if (hasLetterTyped) return;
  
  const container = document.getElementById('wishLetterText');
  const skipHint = document.getElementById('typewriterSkipHint');
  if (!container) return;
  
  if (skipHint) skipHint.style.display = 'block';
  
  const pName = localStorage.getItem('partnerName') || CONFIG.partnerName;
  const signatureText = `Mãi yêu em, ${pName}! ❤️`;
  const fullLines = [...LETTER_TEXT_DATA, signatureText];
  
  container.innerHTML = '';
  isLetterTyping = true;
  
  let lineIdx = 0;
  let charIdx = 0;
  
  let currentEl = document.createElement('p');
  currentEl.className = 'wish-paragraph';
  container.appendChild(currentEl);
  
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriter-cursor';
  cursorSpan.innerText = '|';
  currentEl.appendChild(cursorSpan);
  
  function typeNext() {
    if (!isLetterTyping) return;
    
    if (lineIdx < fullLines.length) {
      const currentLineText = fullLines[lineIdx];
      
      if (charIdx < currentLineText.length) {
        const char = currentLineText[charIdx];
        cursorSpan.before(char);
        charIdx++;
        
        if (charIdx % 4 === 0 && char !== ' ') {
          playSoftChime();
        }
        
        typewriterTimeout = setTimeout(typeNext, 22 + Math.random() * 14);
      } else {
        cursorSpan.remove();
        lineIdx++;
        charIdx = 0;
        
        if (lineIdx < fullLines.length) {
          if (lineIdx === fullLines.length - 1) {
            currentEl = document.createElement('div');
            currentEl.className = 'wish-signature';
          } else {
            currentEl = document.createElement('p');
            currentEl.className = 'wish-paragraph';
          }
          container.appendChild(currentEl);
          currentEl.appendChild(cursorSpan);
          typewriterTimeout = setTimeout(typeNext, 200);
        } else {
          finishTypewriter(false);
        }
      }
    } else {
      finishTypewriter(false);
    }
  }
  
  typeNext();
}

function skipTypewriter() {
  if (!isLetterTyping) return;
  finishTypewriter(true);
}

function finishTypewriter(instant = false) {
  isLetterTyping = false;
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }
  
  hasLetterTyped = true;
  const container = document.getElementById('wishLetterText');
  const skipHint = document.getElementById('typewriterSkipHint');
  if (skipHint) skipHint.style.display = 'none';
  
  const cursor = document.querySelector('.typewriter-cursor');
  if (cursor) cursor.remove();
  
  if (instant && container) {
    const pName = localStorage.getItem('partnerName') || CONFIG.partnerName;
    container.innerHTML = `
      <p class="wish-paragraph">${LETTER_TEXT_DATA[0]}</p>
      <p class="wish-paragraph">${LETTER_TEXT_DATA[1]}</p>
      <p class="wish-paragraph">${LETTER_TEXT_DATA[2]}</p>
      <div class="wish-signature">Mãi yêu em, <span class="partner-name-display">${pName}</span>! ❤️</div>
    `;
  }
  
  const deco = document.querySelector('.wish-bottom-deco');
  if (deco) {
    deco.style.animation = 'popInModal 0.5s ease-out';
  }
}

// ========================================================
// 2. MINI-GAME TRÊU GHẸO: "EM CÓ YÊU ANH KHÔNG?" (RUNAWAY BUTTON)
// ========================================================
const RUNAWAY_QUIPS = [
  'Lêu lêu hụt rùi 😝',
  'Đố bắt được nè! 🏃‍♀️',
  'Chạy đâu cho thoát! 😜',
  'Bắt buộc bấm YÊU thui! 💕',
  'Hụt nữa rùi haha! 😂',
  'Không bấm hông được! 😚',
  'Càng né càng chứng tỏ yêu! 💖',
  'Chịu thua chưa? Yêu anh đi 🥺'
];

let runawayQuipIndex = 0;

function openLoveQuizModal() {
  const modal = document.getElementById('loveQuizModal');
  if (!modal) return;
  
  const qStage = document.getElementById('quizQuestionStage');
  const sStage = document.getElementById('quizSuccessStage');
  if (qStage) qStage.style.display = 'block';
  if (sStage) sStage.style.display = 'none';
  
  const btnNo = document.getElementById('quizBtnNo');
  if (btnNo) {
    btnNo.style.left = '50%';
    btnNo.style.top = '96px';
    btnNo.style.transform = 'translateX(-50%)';
    btnNo.innerText = '😜 Hông yêu đâu!';
    
    btnNo.onpointerenter = dodgeRunawayButton;
    btnNo.ontouchstart = (e) => {
      e.preventDefault();
      dodgeRunawayButton(e);
    };
    btnNo.onpointerdown = (e) => {
      e.preventDefault();
      dodgeRunawayButton(e);
    };
  }
  
  modal.classList.add('active');
  burstHeartsAtCenter();
}

function closeLoveQuizModal() {
  const modal = document.getElementById('loveQuizModal');
  if (modal) modal.classList.remove('active');
}

function dodgeRunawayButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  const btnNo = document.getElementById('quizBtnNo');
  const playground = document.getElementById('quizPlayground');
  const btnYes = document.getElementById('quizBtnYes');
  if (!btnNo || !playground) return;
  
  // 1. Cập nhật câu thoại trêu trước để đo chính xác bề rộng mới của nút
  btnNo.innerText = RUNAWAY_QUIPS[runawayQuipIndex % RUNAWAY_QUIPS.length];
  runawayQuipIndex++;
  
  // 2. Lấy kích thước thực tế của ô và của nút
  const stageWidth = playground.clientWidth;
  const stageHeight = playground.clientHeight;
  const btnWidth = btnNo.offsetWidth;
  const btnHeight = btnNo.offsetHeight;
  
  // Lấy vị trí nút Yes để né tránh chồng lên nút Yes
  const yesTop = btnYes ? btnYes.offsetTop : 6;
  const yesHeight = btnYes ? btnYes.offsetHeight : 44;
  const yesBottom = yesTop + yesHeight;
  
  // 3. Vùng an toàn tuyệt đối: cách đều mép viền ô ít nhất 8px
  const minX = 8;
  const maxX = Math.max(minX, stageWidth - btnWidth - 8);
  const minY = 8;
  const maxY = Math.max(minY, stageHeight - btnHeight - 8);
  
  // 4. Chọn tọa độ ngẫu nhiên
  let newX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  let newY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  
  // Nếu tọa độ Y rơi vào vùng nút Yes (nửa trên), ưu tiên đẩy xuống vùng dưới hoặc 2 bên mép
  if (newY < yesBottom + 6 && newY > yesTop - 6) {
    if (stageHeight - yesBottom > btnHeight + 14) {
      newY = Math.floor(Math.random() * (maxY - (yesBottom + 6) + 1)) + (yesBottom + 6);
    } else {
      newX = Math.random() < 0.5 ? minX : maxX;
    }
  }
  
  // Đảm bảo không bao giờ vượt ra ngoài ô
  newX = Math.min(Math.max(minX, newX), maxX);
  newY = Math.min(Math.max(minY, newY), maxY);
  
  const rot = Math.floor(Math.random() * 16 - 8);
  
  // Gán vị trí tuyệt đối - Nút 100% nằm trọn vẹn trong ô, không bị che khuất!
  btnNo.style.left = `${newX}px`;
  btnNo.style.top = `${newY}px`;
  btnNo.style.transform = `rotate(${rot}deg)`;
  
  const bRect = btnNo.getBoundingClientRect();
  createMiniBurst(bRect.left + bRect.width / 2, bRect.top + bRect.height / 2);
  playSoftChime();
}

function handleLoveYes() {
  const qStage = document.getElementById('quizQuestionStage');
  const sStage = document.getElementById('quizSuccessStage');
  if (qStage) qStage.style.display = 'none';
  if (sStage) sStage.style.display = 'block';
  
  burstHeartsAtCenter();
  launchFireworksShow();
  shootHeartShower();
  
  setTimeout(() => {
    stopFireworksShow();
  }, 4000);
}

function finishQuizWithKiss() {
  closeLoveQuizModal();
  goToPage(5);
  sendKissesFountain();
}

function resetLoveQuiz() {
  openLoveQuizModal();
}

// ========================================================
// 3. THẺ CÀO TÌNH YÊU MAY MẮN (LOVE SCRATCH CARD)
// ========================================================
function getLoveVoucher(idx) {
  const pName = localStorage.getItem('partnerName') || CONFIG.partnerName;
  const list = [
    {
      icon: '🧋',
      title: 'VÉ ĐẶC QUYỀN VÔ HẠN',
      desc: `${pName} được quyền bắt Anh mua trà sữa, dắt đi ăn mọi món ngon mà không được từ chối!`,
      term: '🌸 Hạn dùng: Suốt đời bên nhau • Vô điều kiện 💖'
    },
    {
      icon: '🤗',
      title: 'VÉ MIỄN TRỪ GIẬN DỖI',
      desc: `Mỗi khi ${pName} dỗi, chỉ cần giơ vé này là Anh phải ôm thật chặt và xin lỗi dỗ dành ngay!`,
      term: '🌸 Hạn dùng: Vĩnh viễn • Có tác dụng an ủi 100% 💖'
    },
    {
      icon: '👑',
      title: 'VÉ ĐỆ NHẤT CHIỀU CHUỘNG',
      desc: `1 Ngày Anh làm người hầu độc quyền cho ${pName}: đấm lưng, bóp vai và cưng chiều 100%!`,
      term: '🌸 Hạn dùng: Trọn đời • Áp dụng mọi lúc mọi nơi 💖'
    },
    {
      icon: '💋',
      title: 'VÉ 1000 NỤ HÔN ẤM ÁP',
      desc: `Đổi lấy 1000 nụ hôn ngọt ngào và những cái ôm siết chặt từ Anh bất cứ khi nào em muốn!`,
      term: '🌸 Hạn dùng: Bất tận • Nạp đầy năng lượng yêu thương 💖'
    },
    {
      icon: '🌟',
      title: 'VÉ NGUYỆN ƯỚC TRỌN ĐỜI',
      desc: `Anh hứa thực hiện trọn vẹn 1 điều ước bí mật bất kỳ của ${pName}, khó mấy cũng làm!`,
      term: '🌸 Hạn dùng: Mãi mãi • Lời thề của người yêu em 💍'
    },
    {
      icon: '✈️',
      title: 'VÉ ĐI TRỐN CÙNG NHAU',
      desc: `Một chuyến đi hẹn hò chỉ riêng hai đứa mình đến nơi mà ${pName} thích nhất cùng Anh!`,
      term: '🌸 Hạn dùng: Suốt thanh xuân • Cùng em đi khắp thế gian 🌈'
    }
  ];
  return list[idx % list.length];
}

let currentVoucherIndex = 0;
let isCardRevealed = false;
let scratchPixelCount = 0;

function openScratchCardModal(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('scratchCardModal');
  if (!modal) return;
  
  modal.classList.add('active');
  // Chờ animation modal hiển thị để lấy kích thước canvas chính xác
  setTimeout(() => {
    initScratchCard(currentVoucherIndex);
  }, 60);
}

function closeScratchCardModal() {
  const modal = document.getElementById('scratchCardModal');
  if (modal) modal.classList.remove('active');
}

function initScratchCard(voucherIdx) {
  isCardRevealed = false;
  scratchPixelCount = 0;
  
  const voucher = getLoveVoucher(voucherIdx);
  
  const vIcon = document.getElementById('voucherIcon');
  const vTitle = document.getElementById('voucherTitle');
  const vDesc = document.getElementById('voucherDesc');
  const vTerm = document.getElementById('voucherTerm');
  const hintText = document.getElementById('scratchHintText');
  
  if (vIcon) vIcon.innerText = voucher.icon;
  if (vTitle) vTitle.innerText = voucher.title;
  if (vDesc) vDesc.innerText = voucher.desc;
  if (vTerm) vTerm.innerText = voucher.term;
  if (hintText) hintText.innerHTML = '✨ Dùng ngón tay cào nhẹ lớp nhũ để mở quà nhé! 🎁';
  
  const wrapper = document.getElementById('scratchStageWrapper');
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas || !wrapper) return;
  
  canvas.style.opacity = '1';
  canvas.style.pointerEvents = 'auto';
  
  const rect = wrapper.getBoundingClientRect();
  const width = Math.round(rect.width || 310);
  const height = Math.round(rect.height || 160);
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Vẽ lớp nhũ vàng hồng ánh kim lấp lánh
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#fbc2eb');
  grad.addColorStop(0.3, '#fbe4ee');
  grad.addColorStop(0.5, '#ffd166');
  grad.addColorStop(0.8, '#ff9ebb');
  grad.addColorStop(1, '#ffccd5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  
  // Họa tiết lấp lánh trên lớp cào
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let i = 0; i < 28; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.beginPath();
    ctx.arc(rx, ry, Math.random() * 3 + 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.fillStyle = '#68253b';
  ctx.font = 'bold 14px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✨ CÀO LỚP NHŨ NÀY NÈ ✨', width / 2, height / 2 - 12);
  
  ctx.font = '12px Nunito, sans-serif';
  ctx.fillStyle = '#8c3552';
  ctx.fillText('🎁 Vuốt ngón tay để mở điều ước bí mật', width / 2, height / 2 + 13);
  
  setupScratchEvents(canvas, ctx);
}

function setupScratchEvents(canvas, ctx) {
  let isDown = false;
  
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      rawX: clientX,
      rawY: clientY
    };
  };
  
  const scratch = (pos) => {
    if (isCardRevealed) return;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();
    
    if (Math.random() < 0.4) {
      createMiniHeartCursor(pos.rawX, pos.rawY);
    }
    
    scratchPixelCount++;
    if (scratchPixelCount % 10 === 0) {
      checkScratchCompletion(canvas, ctx);
    }
  };
  
  canvas.onmousedown = (e) => {
    isDown = true;
    scratch(getPos(e));
  };
  
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    scratch(getPos(e));
  });
  
  window.addEventListener('mouseup', () => {
    isDown = false;
  });
  
  canvas.ontouchstart = (e) => {
    e.preventDefault();
    isDown = true;
    scratch(getPos(e));
  };
  
  canvas.ontouchmove = (e) => {
    e.preventDefault();
    if (!isDown) return;
    scratch(getPos(e));
  };
  
  canvas.ontouchend = () => {
    isDown = false;
    checkScratchCompletion(canvas, ctx);
  };
}

function checkScratchCompletion(canvas, ctx) {
  if (isCardRevealed) return;
  
  try {
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    
    let transparent = 0;
    const sampleRate = 32;
    const totalSamples = data.length / (4 * sampleRate);
    
    for (let i = 3; i < data.length; i += 4 * sampleRate) {
      if (data[i] < 128) transparent++;
    }
    
    const percentage = (transparent / totalSamples) * 100;
    
    if (percentage > 38) {
      revealScratchCard();
    }
  } catch(e) {}
}

function revealScratchCard() {
  if (isCardRevealed) return;
  isCardRevealed = true;
  
  const canvas = document.getElementById('scratchCanvas');
  const hintText = document.getElementById('scratchHintText');
  
  if (canvas) {
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
  }
  
  if (hintText) {
    const pName = localStorage.getItem('partnerName') || CONFIG.partnerName;
    hintText.innerHTML = `🎉 <b style="color: #ff0055;">Chúc mừng ${pName} đã mở khóa điều ước!</b> Nhận quà ngay nè 💕`;
  }
  
  burstHeartsAtCenter();
  playSoftChime();
}

function rollNextScratchCard() {
  currentVoucherIndex++;
  initScratchCard(currentVoucherIndex);
  burstHeartsAtCenter();
}

function claimScratchReward() {
  if (!isCardRevealed) {
    revealScratchCard();
  }
  
  const voucher = getLoveVoucher(currentVoucherIndex);
  burstHeartsAtCenter();
  shootHeartShower();
  
  const hintText = document.getElementById('scratchHintText');
  if (hintText) {
    hintText.innerHTML = `💌 <b>Đã nhận "${voucher.title}"!</b> Anh hứa sẽ thực hiện trọn vẹn cho em! 💖`;
  }
  
  setTimeout(() => {
    closeScratchCardModal();
  }, 2200);
}
