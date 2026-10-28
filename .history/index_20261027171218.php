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

          <div class="wish-letter-box">
            <p class="wish-paragraph">
              Cảm ơn em đã xuất hiện trong cuộc đời anh, mang đến cho anh những nụ cười ấm áp, những niềm vui dịu dàng và những khoảnh khắc hạnh phúc không gì sánh bằng.
            </p>
            <p class="wish-paragraph">
              Chúc cho em luôn xinh đẹp, rạng ngời, luôn yêu đời và luôn là cô bé vô tư, vui vẻ như bây giờ. Dù có chuyện gì xảy ra, hãy nhớ rằng anh sẽ luôn ở bên cạnh lắng nghe, yêu thương và bảo vệ em! 💖
            </p>
            <p class="wish-paragraph">
              Mỗi ngày trôi qua có em đều là một ngày tuyệt vời đối với anh. Cảm ơn em vì đã là em, và cảm ơn em vì đã chọn ở bên anh! 🌷
            </p>

            <div class="wish-signature">
              Mãi yêu em, <span class="partner-name-display">Bé Yêu</span>! ❤️
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
          <button class="cute-btn" onclick="goToPage(1)" style="background: white; color: var(--pink-600); border: 1.5px solid var(--pink-300);">
            Về đầu 🎀
          </button>
          <button class="cute-btn" onclick="goToPage(3)">
            Xem lại pháo hoa 🎆
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

  <!-- Modal cài đặt nhanh Tên & Ngày kỷ niệm -->
  <div id="configModal" class="media-modal" onclick="closeConfigModal()">
    <div class="media-modal-inner" style="background: white; border-radius: 24px; padding: 24px 20px; max-width: 360px; width: 90%; color: var(--text-dark);" onclick="event.stopPropagation()">
      <button class="modal-close-btn" onclick="closeConfigModal()">✕</button>
      
      <h3 style="font-family: 'Pacifico', cursive; color: var(--pink-600); font-size: 1.6rem; text-align: center; margin-bottom: 16px;">
        Cài Đặt Yêu Thương 🎀
      </h3>

      <div style="margin-bottom: 14px; width: 100%;">
        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-soft);">
          Tên / Biệt danh bạn gái:
        </label>
        <input id="inputPartnerName" type="text" placeholder="Ví dụ: Bé Huệ, Em yêu..." style="width: 100%; padding: 10px 14px; border: 2px solid #ffc2d4; border-radius: 12px; font-size: 0.95rem; font-family: 'Nunito', sans-serif; outline: none;">
      </div>

      <div style="margin-bottom: 20px; width: 100%;">
        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-soft);">
          Ngày bắt đầu yêu nhau:
        </label>
        <input id="inputAnniversaryDate" type="date" value="2024-02-14" style="width: 100%; padding: 10px 14px; border: 2px solid #ffc2d4; border-radius: 12px; font-size: 0.95rem; font-family: 'Nunito', sans-serif; outline: none;">
      </div>

      <button class="cute-btn" style="width: 100%; justify-content: center;" onclick="saveConfigSettings()">
        Lưu thay đổi 💕
      </button>
    </div>
  </div>

  <!-- JavaScript -->
  <script src="js/script.js"></script>
</body>
</html>

