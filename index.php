<?php
// Tự động quét toàn bộ thư mục img, video, audio khi chạy trên XAMPP localhost
function scanDirSafe($dir, $extensions) {
    $fullPath = __DIR__ . DIRECTORY_SEPARATOR . $dir;
    if (!is_dir($fullPath)) return [];
    $files = scandir($fullPath);
    $res = [];
    foreach ($files as $f) {
        if ($f === '.' || $f === '..' || strpos($f, '.') === 0) continue;
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (in_array($ext, $extensions)) {
            $res[] = $f;
        }
    }
    return array_values($res);
}

$images = scanDirSafe('img', ['jpg', 'jpeg', 'png', 'webp', 'gif']);
$videos = scanDirSafe('video', ['mp4', 'mov', 'webm', 'mkv', 'avi']);
$audioFiles = scanDirSafe('audio', ['mp3', 'wav', 'ogg', 'm4a', 'aac']);

$selectedAudio = null;
if (!empty($audioFiles)) {
    $selectedAudio = 'audio/' . $audioFiles[0];
    foreach ($audioFiles as $a) {
        if (strtolower($a) === 'music.mp3') {
            $selectedAudio = 'audio/' . $a;
            break;
        }
    }
}

$serverMedia = [
    'success' => true,
    'images' => $images,
    'videos' => $videos,
    'audio' => $selectedAudio,
    'counts' => [
        'images' => count($images),
        'videos' => count($videos)
    ]
];
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#ffeaf1">
  <title>Món Quà Đặc Biệt Dành Tặng Em Yêu 🎀</title>
  
  <!-- Dữ liệu tự động quét từ máy chủ XAMPP -->
  <script>
    window.SERVER_MEDIA = <?php echo json_encode($serverMedia, JSON_UNESCAPED_UNICODE); ?>;
  </script>

  <!-- Google Fonts: Pacifico, Dancing Script, Nunito -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Nunito:wght@400;600;700;800;900&family=Pacifico&display=swap" rel="stylesheet">
  
  <!-- CSS Stylesheet -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Khung viền hồng dễ thương bao quanh màn hình -->
  <div class="cute-frame"></div>

  <!-- Nơi các sticker dễ thương bay nhảy bồng bềnh xung quanh -->
  <div id="floatingStickers" class="floating-stickers-container"></div>

  <!-- Canvas hiệu ứng cánh hoa & trái tim bay lơ lửng -->
  <canvas id="effectsCanvas"></canvas>

  <!-- Canvas pháo hoa bùng nổ -->
  <canvas id="fireworksCanvas"></canvas>

  <!-- Thanh điều khiển trên cùng (Tối ưu cho tai thỏ iPhone) -->
  <div class="top-bar-controls">
    <button class="top-pill-btn" onclick="openConfigModal()" title="Cài đặt tên và ngày">
      <span>⚙️</span>
      <span>Cài đặt</span>
    </button>

    <button id="musicToggle" class="top-pill-btn" onclick="toggleMusic()" title="Bật/Tắt nhạc">
      <span class="disc-icon">💿</span>
      <span id="musicToggleText">Bật nhạc 🎵</span>
    </button>
  </div>

  <!-- Nút bắn vòi phun trái tim bay lên trời ở góc phải dưới -->
  <button class="heart-fountain-btn" title="Bắn tim tặng em" onclick="shootHeartShower()">
    💖
  </button>

  <!-- Các chấm định hướng chuyển trang bên hông trái -->
  <div class="page-indicators">
    <div class="dot active" onclick="goToPage(1)" title="Trang 1: Hộp quà bí mật"></div>
    <div class="dot" onclick="goToPage(2)" title="Trang 2: Lời chúc & Ảnh"></div>
    <div class="dot" onclick="goToPage(3)" title="Trang 3: Bùng nổ pháo hoa"></div>
    <div class="dot" onclick="goToPage(4)" title="Trang 4: Kỷ niệm chúng mình"></div>
    <div class="dot" onclick="goToPage(5)" title="Trang 5: Nụ hôn ngọt ngào"></div>
  </div>

  <!-- KHUNG CHÍNH CỦA CÁC TRANG - VỪA KHÍT 1 KHUNG HÌNH (100dvh) -->
  <main class="app-container">

    <!-- TRANG 1: MỞ CỬA SỔ & HỘP QUÀ TẶNG EM -->
    <section id="page-1" class="page active">
      <div class="p1-card">
        <div class="window-doors">
          <div class="window-bg">🎀</div>
        </div>

        <div class="sparkle-label">✨ Gửi tặng công chúa của anh ✨</div>
        <h1 class="p1-title">Món Quà Dành Riêng Cho Em</h1>
        
        <p class="p1-desc">
          Anh đã tự tay chuẩn bị một bất ngờ ngọt ngào ở bên trong. Em hãy chạm vào hộp quà để mở ra nhé! 💕
        </p>

        <button class="gift-box-btn" onclick="openGiftBox()" title="Chạm để mở quà">
          <span class="gift-box-emoji">🎁</span>
        </button>

        <button class="cute-btn" onclick="openGiftBox()">
          Mở hộp quà bí mật 💌
        </button>
      </div>
    </section>

    <!-- TRANG 2: ẢNH VÀ NHỮNG LỜI CHÚC NGỌT NGÀO -->
    <section id="page-2" class="page">
      <div class="p2-container">
        <div class="p2-header">
          <div class="p2-badge">💌 LỜI NHẮN TỪ TRÁI TIM</div>
          <h2 class="p2-title">Gửi Người Con Gái Anh Yêu</h2>
        </div>

        <div class="p2-content-card">
          <div class="p2-photo-row">
            <div class="polaroid-feature">
              <div class="polaroid-img-wrapper">
                <img id="p2FeatureImg" src="img/<?php echo !empty($images) ? htmlspecialchars($images[0]) : ''; ?>" alt="Ảnh em yêu">
              </div>
              <div class="polaroid-text">Bé cưng của anh 🌸</div>
            </div>

            <div class="wish-mini-header">
              <div class="wish-envelope-title">Gửi <span class="partner-name-display">Bé Yêu</span>,</div>
              <div class="wish-envelope-sub">Bông hoa xinh đẹp nhất đời anh 💕</div>
            </div>
          </div>

          <div class="wish-letter-box" onclick="skipTypewriter()" title="Chạm để xem nhanh">
            <div class="wish-letter-text" id="wishLetterText">
            <p class="wish-paragraph">
              Cảm ơn em đã xuất hiện trong cuộc đời anh, mang đến cho anh những nụ cười ấm áp, những niềm vui dịu dàng và những khoảnh khắc hạnh phúc không gì sánh bằng.
            </p>
            <p class="wish-paragraph">
              Dạo này em bận rộn và vất vả nhiều rồi, anh thấy hết và thương em thật nhiều 💗 Hãy luôn nhớ tự chăm sóc bản thân thật tốt nhé, đừng để bản thân mệt quá nha.
            </p>
            <p class="wish-paragraph">
              Mỗi ngày trôi qua có em đều là một ngày tuyệt vời đối với anh. Cảm ơn em vì đã là em, và cảm ơn em vì đã chọn ở bên anh! 🌷
            </p>

            <div class="wish-signature">
              Mãi yêu em, <span class="partner-name-display">Bé Yêu</span>! ❤️
            </div>
          </div>
          <div class="typewriter-skip-hint" id="typewriterSkipHint" style="display:none;">(Chạm vào thư để hiện hết nhanh ✨)</div>

          <!-- Dải hình trái tim & sticker tình yêu lấp đầy khoảng trắng -->
          <div class="wish-bottom-deco">
            <div class="love-hearts-cluster">
              <span class="cluster-item flutter-icon">🌸</span>
              <span class="cluster-item pulse-mini">💖</span>
              <span class="cluster-item pulse-main">❤️</span>
              <span class="cluster-item pulse-mini">💕</span>
              <span class="cluster-item flutter-icon">✨</span>
            </div>
            <div class="sweet-vow-badge">
              <span>🎀 Trọn đời yêu em, công chúa của anh 🎀</span>
            </div>
            <button class="scratch-trigger-btn" onclick="openScratchCardModal(event)" title="Cào thẻ nhận điều ước">
              <span>🎟️ Cào thẻ nhận điều ước bí mật ✨</span>
            </button>
          </div>
        </div>

          <button class="cute-btn finish-reading-btn" onclick="finishReading()">
            Em đọc xong rồi, bấm vào đây đi nè! ✨🎆
          </button>
        </div>
      </div>
    </section>

    <!-- TRANG 3: BÙNG NỔ PHÁO HOA & TỎ TÌNH LÃNG MẠN -->
    <section id="page-3" class="page">
      <div class="p3-container">
        <div class="fireworks-hero-banner">
          <div class="p3-fireworks-tag">✨ BÙNG NỔ YÊU THƯƠNG ✨</div>
          
          <h1 class="p3-main-title">YÊU <span class="partner-name-display">EM</span> NHẤT TRÊN ĐỜI! 💖</h1>
          
          <div class="love-heart-beat">❤️</div>

          <p class="p3-quote">
            Chúc cho tình yêu của hai đứa mình luôn rực rỡ và ngọt ngào như những chùm pháo hoa này nhé! 🌟
          </p>

          <div class="love-days-box">
            <div style="font-weight: 800; color: #ff477e; font-size: 0.82rem; margin-bottom: 4px;">
              ⏳ HÀNH TRÌNH TÌNH YÊU CHÚNG MÌNH
              <span style="font-size: 0.75rem; cursor: pointer; text-decoration: underline; margin-left: 6px; color: #855364;" onclick="openConfigModal()">✏️ Đổi ngày</span>
            </div>
            <div class="counter-grid">
              <div class="counter-num-box">
                <span id="countDays" class="counter-num-val">365</span>
                <span class="counter-num-label">Ngày</span>
              </div>
              <div class="counter-num-box">
                <span id="countHours" class="counter-num-val">12</span>
                <span class="counter-num-label">Giờ</span>
              </div>
              <div class="counter-num-box">
                <span id="countMins" class="counter-num-val">30</span>
                <span class="counter-num-label">Phút</span>
              </div>
              <div class="counter-num-box">
                <span id="countSecs" class="counter-num-val">45</span>
                <span class="counter-num-label">Giây</span>
              </div>
            </div>
          </div>

          <div class="p3-actions">
            <button class="cute-btn fire-again-btn" onclick="triggerFireworksBurst()">
              Bắn thêm pháo hoa 🎆
            </button>
            <button class="cute-btn" onclick="goToPage(4)">
              Xem rạp phim & ảnh kỷ niệm 🎬📸
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- TRANG 4: REELS & CAROUSEL (KHUNG NHỎ NHƯNG THẤY FULL 100% VIDEO) -->
    <section id="page-4" class="page">
      <div class="p4-container">
        <div class="p4-header">
          <h2 class="p4-title">Kho Báu Của Chúng Mình 💕</h2>

          <div class="media-tab-bar">
            <button id="tabVideos" class="tab-btn active" onclick="switchMediaTab('videos')">
              🎬 Thước Phim (<?php echo count($videos); ?>)
            </button>
            <button id="tabPhotos" class="tab-btn" onclick="switchMediaTab('photos')">
              📸 Album Ảnh (<?php echo count($images); ?>)
            </button>
          </div>
        </div>

        <div id="carouselViewport" class="carousel-viewport">
          <button class="carousel-nav-btn carousel-prev" onclick="prevCarouselItem()" title="Trước">❮</button>

          <div class="carousel-card-active">
            <div id="carouselBadge" class="carousel-badge">🎬 Thước phim #1</div>
            <button class="fullscreen-quick-btn" onclick="openActiveItemFullscreen()" title="Xem phóng to toàn màn hình">⛶</button>
            
            <div id="carouselCard">
              <!-- Video hoặc ảnh hiển thị trọn vẹn tại đây -->
            </div>
          </div>

          <button class="carousel-nav-btn carousel-next" onclick="nextCarouselItem()" title="Sau">❯</button>
        </div>

        <div class="carousel-info-strip">
          <span id="carouselCaption" class="carousel-caption-text">Nụ cười tỏa nắng của em ✨</span>
          <div class="carousel-info-actions">
            <button class="carousel-like-btn" onclick="likeActiveItem(event)" title="Thả tim">💖</button>
            <span id="carouselCounter" class="carousel-counter-pill">1 / <?php echo max(1, count($videos)); ?></span>
          </div>
        </div>

        <div class="bottom-nav-row">
          <button class="cute-btn" onclick="goToPage(3)" style="background: white; color: var(--pink-600); border: 1.5px solid var(--pink-300);">
            ❮ Pháo hoa 🎆
          </button>
          <button class="cute-btn" onclick="goToPage(5)">
            Trang cuối cùng 💖 ❯
          </button>
        </div>
      </div>
    </section>

    <!-- ==========================================
       TRANG 5: KẾT THÚC HOÀNH TRÁNG & NỤ HÔN NGỌT NGÀO
       ========================================== -->
    <section id="page-5" class="page">
      <div class="p5-container">
        
        <div class="p5-header">
          <div class="p5-badge">✨ KẾT THÚC CÓ HẬU CỦA ĐÔI TA ✨</div>
          <h1 class="p5-title">Mãi Mãi Yêu Em <span class="partner-name-display">Bé Yêu</span> 💖</h1>
        </div>

        <!-- Sân khấu Sticker chạy quanh & 2 nhân vật nam nữ hôn nhau ở giữa -->
        <div class="orbit-stage">
          <!-- Vòng xoay sticker chuyển động quanh cặp đôi -->
          <div class="orbit-track">
            <span class="orbit-item">🎀</span>
            <span class="orbit-item">💖</span>
            <span class="orbit-item">🍓</span>
            <span class="orbit-item">🧸</span>
            <span class="orbit-item">💍</span>
            <span class="orbit-item">🌸</span>
            <span class="orbit-item">✨</span>
            <span class="orbit-item">💌</span>
          </div>

          <!-- Biểu tượng nụ hôn nổi trên đỉnh khung tròn -->
          <div class="kiss-heart-burst">💋</div>

          <!-- Khung tròn trung tâm: 2 nhân vật nam nữ hôn nhau ngọt ngào -->
          <div class="kissing-halo">
            <!-- SVG Animated Kissing Couple Nghệ Thuật & Lãng Mạn -->
            <svg class="kissing-art-svg" viewBox="0 0 240 210" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Dreamy Romantic Halo Background -->
                <radialGradient id="coupleAuraPhp" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
                  <stop offset="60%" stop-color="#ffe3ec" stop-opacity="0.6"/>
                  <stop offset="100%" stop-color="#ffb3c1" stop-opacity="0.2"/>
                </radialGradient>

                <!-- Boy Hair Gradient -->
                <linearGradient id="boyHairGradPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4e3b32"/>
                  <stop offset="50%" stop-color="#3a2a22"/>
                  <stop offset="100%" stop-color="#241913"/>
                </linearGradient>

                <!-- Girl Hair Gradient -->
                <linearGradient id="girlHairGradPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#8c532b"/>
                  <stop offset="50%" stop-color="#6e3d1c"/>
                  <stop offset="100%" stop-color="#48240f"/>
                </linearGradient>

                <!-- Hair Sheen -->
                <linearGradient id="sheenPhp" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>

                <!-- Skin Tones -->
                <linearGradient id="skinBoyPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff0e5"/>
                  <stop offset="100%" stop-color="#fcd3bd"/>
                </linearGradient>

                <linearGradient id="skinGirlPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff5f0"/>
                  <stop offset="100%" stop-color="#fedacf"/>
                </linearGradient>

                <!-- Clothing Gradients -->
                <linearGradient id="boySweaterPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#64748b"/>
                  <stop offset="100%" stop-color="#475569"/>
                </linearGradient>

                <linearGradient id="girlSweaterPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff8fab"/>
                  <stop offset="50%" stop-color="#ff7096"/>
                  <stop offset="100%" stop-color="#e04374"/>
                </linearGradient>

                <!-- Glowing Heart Gradient -->
                <linearGradient id="glowHeartPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff0055"/>
                  <stop offset="50%" stop-color="#ff477e"/>
                  <stop offset="100%" stop-color="#ff7597"/>
                </linearGradient>

                <!-- Soft Cheeks Blush -->
                <radialGradient id="softBlushPhp" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ff3b6f" stop-opacity="0.65"/>
                  <stop offset="100%" stop-color="#ff3b6f" stop-opacity="0"/>
                </radialGradient>
              </defs>

              <!-- Dreamy Romantic Halo Background Behind Couple -->
              <circle cx="120" cy="105" r="95" fill="url(#coupleAuraPhp)"/>
              
              <!-- Floating Twinkle Stars & Sparkles -->
              <g class="sparkles-layer">
                <path d="M120 42 Q120 48 126 48 Q120 48 120 54 Q120 48 114 48 Q120 48 120 42 Z" fill="#ffd166">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/>
                </path>
                <path d="M72 58 Q72 62 76 62 Q72 62 72 66 Q72 62 68 62 Q72 62 72 58 Z" fill="#ff8fab">
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.9s" repeatCount="indefinite"/>
                </path>
                <path d="M168 56 Q168 60 172 60 Q168 60 168 64 Q168 60 164 60 Q168 60 168 56 Z" fill="#ffd166">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.3s" repeatCount="indefinite"/>
                </path>
                <circle cx="112" cy="68" r="2" fill="#fff" opacity="0.8">
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite"/>
                </circle>
                <circle cx="128" cy="68" r="2" fill="#fff" opacity="0.8">
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite"/>
                </circle>
              </g>

              <!-- ==================== BOY CHARACTER (LEFT) ==================== -->
              <g class="boy-group">
                <!-- Boy Back Hair Shadow -->
                <path d="M42 90 C38 68 52 48 76 44 C95 40 106 50 108 58 C96 52 82 52 68 58 C55 64 48 76 48 90 Z" fill="#241913"/>

                <!-- Boy Body / Shoulders (Leaning in tenderly) -->
                <path d="M25 210 C25 160 52 142 85 146 L120 180 L120 210 Z" fill="url(#boySweaterPhp)"/>
                <!-- Sweater collar & seam detail -->
                <path d="M78 145 C86 152 98 153 108 146 L112 154 C100 162 86 160 76 151 Z" fill="#334155"/>
                <!-- Inner white t-shirt collar -->
                <path d="M84 145 C90 148 98 148 104 145" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>

                <!-- Boy Neck -->
                <path d="M80 124 L98 124 L102 148 L82 148 Z" fill="url(#skinBoyPhp)"/>
                <path d="M82 126 C90 132 98 131 100 126 L98 134 C92 137 84 136 82 131 Z" fill="#e2b49d"/>

                <!-- Boy Head / Face (Romantic profile leaning forward) -->
                <path d="M56 86 C56 64 76 56 94 65 C104 70 110 78 114 88 C116 93 118 97 120 100 C117 101 115 102 113 103 C111 107 105 116 94 122 C82 126 66 122 58 110 C54 102 56 93 56 86 Z" fill="url(#skinBoyPhp)"/>

                <!-- Boy Ear -->
                <ellipse cx="66" cy="98" rx="8" ry="11" fill="url(#skinBoyPhp)" transform="rotate(-5 66 98)"/>
                <path d="M64 94 C67 93 69 96 68 101 C67 103 65 104 63 102" stroke="#d49b82" stroke-width="1.8" stroke-linecap="round" fill="none"/>

                <!-- Boy Hair (Layered anime fringe & bangs) -->
                <path d="M50 82 C46 62 62 45 84 46 C98 47 110 55 112 65 C108 62 100 60 92 63 C84 66 82 72 78 70 C72 67 68 70 65 76 C62 82 60 85 54 86 Z" fill="url(#boyHairGradPhp)"/>
                <path d="M78 52 C88 56 96 66 98 75 C94 72 90 73 86 78 C88 70 82 65 74 64 Z" fill="url(#boyHairGradPhp)"/>
                <path d="M92 58 C102 64 108 74 112 85 C109 82 105 82 102 86 C104 78 100 72 94 69 Z" fill="url(#boyHairGradPhp)"/>
                <path d="M68 54 Q80 50 94 56" stroke="url(#sheenPhp)" stroke-width="3" stroke-linecap="round" fill="none"/>

                <!-- Boy Closed Smiling Eye (Happy kiss) -->
                <path d="M90 91 Q97 97 104 90" stroke="#3b2b1f" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                <path d="M88 83 Q96 81 103 84" stroke="#4a3728" stroke-width="2.2" stroke-linecap="round" fill="none"/>

                <!-- Boy Soft Rosy Blush -->
                <ellipse cx="90" cy="101" rx="9" ry="5" fill="url(#softBlushPhp)"/>
                <line x1="87" y1="99" x2="89" y2="103" stroke="#ff477e" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
                <line x1="91" y1="99" x2="93" y2="103" stroke="#ff477e" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>

                <!-- Boy Smiling Lip Profile -->
                <path d="M114 103 Q118 104 120 102" stroke="#e04374" stroke-width="2.2" stroke-linecap="round"/>
              </g>

              <!-- ==================== GIRL CHARACTER (RIGHT) ==================== -->
              <g class="girl-group">
                <!-- Girl Long Flowing Back Hair -->
                <path d="M198 90 C204 68 190 46 166 44 C146 42 134 50 130 58 C144 52 160 52 174 58 C188 64 196 78 198 102 C200 120 202 145 194 175 C190 190 184 202 178 210 L215 210 C218 180 216 130 205 100 Z" fill="url(#girlHairGradPhp)"/>

                <!-- Girl Body / Sweater (Leaning inward) -->
                <path d="M215 210 C215 160 188 142 155 146 L120 180 L120 210 Z" fill="url(#girlSweaterPhp)"/>
                <path d="M162 145 C154 152 142 153 132 146 L128 154 C140 162 154 160 164 151 Z" fill="#c03260"/>
                <path d="M156 145 C150 148 142 148 136 145" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>

                <!-- Girl Neck -->
                <path d="M160 124 L142 124 L138 148 L158 148 Z" fill="url(#skinGirlPhp)"/>
                <path d="M158 126 C150 132 142 131 140 126 L142 134 C148 137 156 136 158 131 Z" fill="#f4b5a3"/>

                <!-- Girl Head / Face -->
                <path d="M184 86 C184 64 164 56 146 65 C136 70 130 78 126 88 C124 93 122 97 120 100 C123 101 125 102 127 103 C129 107 135 116 146 122 C158 126 174 122 182 110 C186 102 184 93 184 86 Z" fill="url(#skinGirlPhp)"/>

                <!-- Girl Ear & Earring -->
                <ellipse cx="174" cy="98" rx="7.5" ry="10" fill="url(#skinGirlPhp)" transform="rotate(5 174 98)"/>
                <path d="M176 94 C173 93 171 96 172 101 C173 103 175 104 177 102" stroke="#e8a38f" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                <circle cx="175" cy="110" r="2.5" fill="#ff477e"/>

                <!-- Girl Hair (Bangs & Wavy Locks) -->
                <path d="M190 82 C194 62 178 45 156 46 C142 47 130 55 128 65 C132 62 140 60 148 63 C156 66 158 72 162 70 C168 67 172 70 175 76 C178 82 180 85 186 86 Z" fill="url(#girlHairGradPhp)"/>
                <path d="M162 52 C152 56 144 66 142 75 C146 72 150 73 154 78 C152 70 158 65 166 64 Z" fill="url(#girlHairGradPhp)"/>
                <path d="M148 58 C138 64 132 74 128 85 C131 82 135 82 138 86 C136 78 140 72 146 69 Z" fill="url(#girlHairGradPhp)"/>
                <path d="M172 54 Q160 50 146 56" stroke="url(#sheenPhp)" stroke-width="3" stroke-linecap="round" fill="none"/>

                <!-- Cute Ribbon / Bow on Girl Hair -->
                <g class="girl-ribbon" transform="translate(178, 58)">
                  <path d="M0 0 C-8 -8 -16 -4 -12 4 C-8 10 0 2 0 0 Z" fill="#ff477e"/>
                  <path d="M0 0 C8 -8 16 -4 12 4 C8 10 0 2 0 0 Z" fill="#ff477e"/>
                  <circle cx="0" cy="0" r="3.5" fill="#ffd166"/>
                  <path d="M0 2 C-4 8 -6 16 -8 20 M0 2 C4 8 6 16 8 20" stroke="#ff477e" stroke-width="2.5" stroke-linecap="round"/>
                </g>

                <!-- Girl Closed Smiling Eye with Fluttery Lashes -->
                <path d="M150 91 Q143 97 136 90" stroke="#3b2b1f" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                <line x1="137" y1="91" x2="133" y2="88" stroke="#3b2b1f" stroke-width="2" stroke-linecap="round"/>
                <line x1="140" y1="94" x2="138" y2="98" stroke="#3b2b1f" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="145" y1="95" x2="145" y2="99" stroke="#3b2b1f" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M152 83 Q144 81 137 84" stroke="#6e3d1c" stroke-width="2.2" stroke-linecap="round" fill="none"/>

                <!-- Girl Soft Rosy Blush -->
                <ellipse cx="150" cy="101" rx="9" ry="5" fill="url(#softBlushPhp)"/>
                <line x1="147" y1="99" x2="149" y2="103" stroke="#ff477e" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
                <line x1="151" y1="99" x2="153" y2="103" stroke="#ff477e" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
                <circle cx="157" cy="99" r="1.5" fill="#fff" opacity="0.9"/>

                <!-- Girl Smiling Lip Profile -->
                <path d="M126 103 Q122 104 120 102" stroke="#e04374" stroke-width="2.2" stroke-linecap="round"/>
              </g>

              <!-- ==================== SWEET KISSING HEART AT CENTER ==================== -->
              <g class="kissing-heart-glow">
                <path d="M120 92 C116 82 104 82 104 94 C104 106 120 118 120 118 C120 118 136 106 136 94 C136 82 124 82 120 92 Z" fill="url(#glowHeartPhp)">
                  <animate attributeName="transform" type="scale" values="1; 1.25; 1" dur="1.1s" repeatCount="indefinite" transform-origin="120 100"/>
                </path>
                <path d="M112 88 C110 88 107 90 107 94" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
                
                <circle cx="114" cy="78" r="2.5" fill="#ffd166">
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite"/>
                  <animate attributeName="cy" values="82;72;82" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="126" cy="76" r="3" fill="#ff7096">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite"/>
                  <animate attributeName="cy" values="80;70;80" dur="2s" repeatCount="indefinite"/>
                </circle>
              </g>
            </svg>
          </div>
        </div>

        <div class="couple-names-strip">
          <span class="my-name-display">Anh Yêu</span> 👩‍❤️‍💋‍👨 <span class="partner-name-display">Bé Yêu</span>
        </div>

        <!-- Lời chúc & lời hứa ngọt ngào -->
        <div class="p5-vow-card">
          <p class="p5-vow-quote">
            "Dù thế giới ngoài kia có bao la rộng lớn, vòng tay anh mãi là chốn bình yên duy nhất dành cho em. Nguyện cùng em già đi theo năm tháng! 💍💖"
          </p>
        </div>

        <!-- Cặp nút tương tác: Thử lòng bé yêu & Gửi ngàn nụ hôn -->
        <div class="p5-actions-grid">
          <button class="fun-quiz-btn" onclick="openLoveQuizModal()" title="Hỏi nhỏ em nè">
            💌 Hỏi nhỏ Huệ nè 🥰
          </button>
          <button class="kiss-action-btn" onclick="sendKissesFountain()" title="Gửi nụ hôn">
            💋 Gửi ngàn nụ hôn 💋
          </button>
        </div>

        <!-- Thanh điều hướng chuyển trang -->
        <div class="bottom-nav-row" style="margin-top: 4px;">
          <button class="cute-btn" onclick="openScratchCardModal(event)"
            style="background: #fff8e7; color: #b86200; border: 1.5px solid #ffd166;" title="Cào thẻ điều ước">
            🎟️ Thẻ cào 🎁
          </button>
          <button class="cute-btn" onclick="goToPage(1)" style="background: white; color: var(--pink-600); border: 1.5px solid var(--pink-300);">
            Về đầu 🎀
          </button>
          <button class="cute-btn" onclick="goToPage(4)" style="background: white; color: var(--pink-600); border: 1.5px solid var(--pink-300);">
            Xem ảnh 📸
          </button>
        </div>

      </div>
    </section>

  </main>

  <!-- Modal phóng to xem ảnh hoặc xem video có âm thanh -->
  <div id="mediaModal" class="media-modal" onclick="closeMediaModal()">
    <div class="media-modal-inner" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="closeMediaModal()">✕</button>
      <div id="mediaModalContent"></div>
    </div>
  </div>

  <!-- Modal cài đặt nhanh Tên & Ngày kỷ niệm (Cuộn mượt mà không bị cắt) -->
  <div id="configModal" class="media-modal" onclick="closeConfigModal()">
    <div class="config-modal-box" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="closeConfigModal()" title="Đóng">✕</button>
      
      <h3 style="font-family: 'Pacifico', cursive; color: var(--pink-600); font-size: 1.45rem; text-align: center; margin-bottom: 14px; padding-right: 28px;">
        Cài Đặt Yêu Thương 🎀
      </h3>

      <div style="margin-bottom: 12px; width: 100%;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 5px; color: var(--text-soft);">
          Tên / Biệt danh bạn gái:
        </label>
        <input id="inputPartnerName" type="text" placeholder="Ví dụ: Bé Huệ, Em yêu..." style="width: 100%; padding: 9px 12px; border: 2px solid #ffc2d4; border-radius: 12px; font-size: 0.92rem; font-family: 'Nunito', sans-serif; outline: none;">
      </div>

      <div style="margin-bottom: 14px; width: 100%;">
        <label style="display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 5px; color: var(--text-soft);">
          Ngày bắt đầu yêu nhau:
        </label>
        <input id="inputAnniversaryDate" type="date" value="2024-02-14" style="width: 100%; padding: 9px 12px; border: 2px solid #ffc2d4; border-radius: 12px; font-size: 0.92rem; font-family: 'Nunito', sans-serif; outline: none;">
      </div>

      <button class="cute-btn" style="width: 100%; justify-content: center; margin-bottom: 12px; padding: 10px 16px;" onclick="saveConfigSettings()">
        Lưu cài đặt 💕
      </button>

      <!-- Khu vực chọn ảnh, video, nhạc mới nhanh trên máy -->
      <div style="border-top: 1.5px dashed #ffb3c1; padding-top: 10px; width: 100%; text-align: center;">
        <div style="font-weight: 800; font-size: 0.82rem; color: var(--pink-600); margin-bottom: 8px;">
          📁 Cập nhật ảnh, video & nhạc mới:
        </div>
        
        <input type="file" id="filePickerImg" multiple accept="image/*" style="display:none;" onchange="handlePickImages(event)">
        <input type="file" id="filePickerVid" multiple accept="video/*" style="display:none;" onchange="handlePickVideos(event)">
        <input type="file" id="filePickerAud" accept="audio/*" style="display:none;" onchange="handlePickAudio(event)">

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button type="button" class="cute-btn" style="background: #fff0f5; color: var(--pink-600); border: 1.5px solid #ff9ebb; font-size: 0.8rem; padding: 7px 10px; box-shadow: none;" onclick="document.getElementById('filePickerImg').click()">
            📸 Chọn tất cả ảnh trong thư mục img
          </button>
          <button type="button" class="cute-btn" style="background: #fff0f5; color: var(--pink-600); border: 1.5px solid #ff9ebb; font-size: 0.8rem; padding: 7px 10px; box-shadow: none;" onclick="document.getElementById('filePickerVid').click()">
            🎬 Chọn tất cả video trong thư mục video
          </button>
          <button type="button" class="cute-btn" style="background: #fff0f5; color: var(--pink-600); border: 1.5px solid #ff9ebb; font-size: 0.8rem; padding: 7px 10px; box-shadow: none;" onclick="document.getElementById('filePickerAud').click()">
            🎵 Chọn file nhạc trong thư mục audio
          </button>
        </div>
        <div id="uploadStatusText" style="font-size: 0.8rem; color: #059669; font-weight: 800; margin-top: 6px; min-height: 18px;"></div>
      </div>
    </div>
  </div>

  <!-- Modal trêu ghẹo đáng yêu: Em có yêu anh không? (Nút né ngón tay) -->
  <div id="loveQuizModal" class="media-modal" onclick="closeLoveQuizModal()">
    <div class="quiz-modal-box" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="closeLoveQuizModal()" title="Đóng">✕</button>
      
      <div id="quizQuestionStage">
        <div class="quiz-badge">💌 CÂU HỎI QUAN TRỌNG NHẤT 💌</div>
        <h3 class="quiz-question-title">Hỏi Nhỏ Nè Bé Yêu 🥰</h3>
        <p class="quiz-question-sub">
          <span class="partner-name-display">Bé Huệ</span> ơi, em có yêu anh nhiều thật nhiều hông dạ? 💕
        </p>

        <div class="quiz-interactive-stage" id="quizPlayground">
          <button id="quizBtnYes" class="quiz-btn-yes" onclick="handleLoveYes()">
            ❤️ Yêu anh nhất trần đời! ❤️
          </button>
          <button id="quizBtnNo" class="quiz-btn-no">
            😜 Hông yêu đâu!
          </button>
        </div>
      </div>

      <div id="quizSuccessStage" class="quiz-success-view" style="display:none;">
        <div class="quiz-success-emoji">👩‍❤️‍💋‍👨💋🎉</div>
        <h3 class="quiz-success-title">Moaaahhh! Yêu Em Nhất! 💖</h3>
        <p class="quiz-success-desc">
          Anh biết ngay mà! <span class="partner-name-display">Huệ</span> là cô gái ngoan, xinh đẹp và đáng yêu nhất vũ trụ này! Anh cũng yêu em ngàn lần vạn lần! 💍✨
        </p>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button class="cute-btn" onclick="finishQuizWithKiss()" style="padding: 8px 14px; font-size: clamp(0.76rem, 2.9vw, 0.86rem);">
            💋 Nhận ngàn nụ hôn nè 💋
          </button>
          <button class="cute-btn" onclick="resetLoveQuiz()" style="background: white; color: var(--pink-600); border: 1.5px solid var(--pink-300); padding: 8px 14px; font-size: clamp(0.76rem, 2.9vw, 0.86rem);">
            Hỏi lại 🔄
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Thẻ Cào Tình Yêu May Mắn (Scratch Card) -->
  <div id="scratchCardModal" class="media-modal" onclick="closeScratchCardModal()">
    <div class="scratch-modal-box" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="closeScratchCardModal()" title="Đóng">✕</button>
      
      <div class="scratch-ticket">
        <div class="scratch-ticket-badge">✨ OFFICIAL LOVE PASS #520 ✨</div>
        <h3 class="scratch-ticket-title">Thẻ Cào Tình Yêu Bí Mật 🎟️</h3>
        <div class="scratch-ticket-subtitle">
          Món quà đặc quyền dành riêng cho công chúa <span class="partner-name-display">Bé Yêu</span> 💕
        </div>

        <!-- Khung thẻ cào có canvas phủ nhũ -->
        <div class="scratch-stage-wrapper" id="scratchStageWrapper">
          <!-- Phần thưởng ẩn giấu bên dưới -->
          <div class="scratch-hidden-content" id="scratchHiddenContent">
            <div class="voucher-icon" id="voucherIcon">🧋</div>
            <div class="voucher-title" id="voucherTitle">VÉ ĐẶC QUYỀN VÔ HẠN</div>
            <div class="voucher-desc" id="voucherDesc">
              Huệ được quyền bắt Anh mua trà sữa, dắt đi ăn mọi món ngon mà không được từ chối!
            </div>
            <div class="voucher-term" id="voucherTerm">
              🌸 Hạn dùng: Suốt đời bên nhau • Vô điều kiện 💖
            </div>
          </div>

          <!-- Canvas phủ lớp nhũ bạc/vàng lấp lánh -->
          <canvas id="scratchCanvas"></canvas>
        </div>

        <div class="scratch-hint-text" id="scratchHintText">
          ✨ Dùng ngón tay cào nhẹ lớp nhũ để mở quà nhé! 🎁
        </div>

        <!-- Các nút thao tác thẻ cào -->
        <div class="scratch-actions-row">
          <button class="cute-btn" onclick="rollNextScratchCard()" style="background: #fff0f5; color: var(--pink-600); border: 1.5px solid #ff9ebb;">
            🎲 Cào thẻ khác
          </button>
          <button class="cute-btn" onclick="claimScratchReward()">
            💖 Nhận điều ước này
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Dữ liệu danh sách media tự động -->
  <script src="media_list.js"></script>
  <!-- JavaScript -->
  <script src="js/script.js"></script>
</body>
</html>

