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
    if (e.target.closest('input, textarea, button, .cute-btn, .tab-btn, .top-pill-btn, .carousel-nav-btn')) {
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
// VỆT TRÁI TIM THEO TAY (TOUCH / MOUSE)
// ==========================================
function setupCursorHearts() {
  let lastX = 0, lastY = 0;
  
  const handleMove = (x, y) => {
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist > 35) {
      createMiniHeartCursor(x, y);
      lastX = x;
      lastY = y;
    }
  };
  
  window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

function createMiniHeartCursor(x, y) {
  const heart = document.createElement('div');
  const symbols = ['💖', '✨', '🌸', '💕'];
  heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: ${Math.random() * 10 + 14}px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%) scale(1);
    transition: transform 0.7s ease-out, opacity 0.7s ease-out;
  `;
  document.body.appendChild(heart);
  
  requestAnimationFrame(() => {
    heart.style.transform = `translate(-50%, -${Math.random() * 40 + 25}px) scale(0.3) rotate(${Math.random() * 60 - 30}deg)`;
    heart.style.opacity = '0';
  });
  
  setTimeout(() => heart.remove(), 700);
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
