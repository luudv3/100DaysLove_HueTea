<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function scanMediaFolder($folder, $allowedExtensions) {
    $dir = __DIR__ . DIRECTORY_SEPARATOR . $folder;
    if (!is_dir($dir)) {
        return [];
    }
    
    $files = scandir($dir);
    $result = [];
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..' || strpos($file, '.') === 0) {
            continue;
        }
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowedExtensions)) {
            $result[] = $file;
        }
    }
    
    return array_values($result);
}

$images = scanMediaFolder('img', ['jpg', 'jpeg', 'png', 'webp', 'gif']);
$videos = scanMediaFolder('video', ['mp4', 'mov', 'webm', 'mkv', 'avi']);
$audioFiles = scanMediaFolder('audio', ['mp3', 'wav', 'ogg', 'm4a', 'aac']);

$selectedAudio = null;
if (!empty($audioFiles)) {
    // Ưu tiên file music.mp3 nếu có, hoặc lấy file âm thanh đầu tiên tìm thấy
    $selectedAudio = 'audio/' . $audioFiles[0];
    foreach ($audioFiles as $a) {
        if (strtolower($a) === 'music.mp3') {
            $selectedAudio = 'audio/' . $a;
            break;
        }
    }
}

echo json_encode([
    'success' => true,
    'images' => $images,
    'videos' => $videos,
    'audio' => $selectedAudio,
    'counts' => [
        'images' => count($images),
        'videos' => count($videos)
    ]
], JSON_UNESCAPED_UNICODE);

