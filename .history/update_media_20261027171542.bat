@echo off
chcp 65001 > nul
echo ========================================================
echo   Đang tự động quét ảnh, video và nhạc mới trong thư mục...
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$imgExts = @('.jpg','.jpeg','.png','.webp','.gif'); " ^
"$vidExts = @('.mp4','.mov','.webm','.mkv','.avi'); " ^
"$audExts = @('.mp3','.wav','.ogg','.m4a','.aac'); " ^
"$imgs = @(); if (Test-Path 'img') { $imgs = Get-ChildItem -Path 'img' -File | Where-Object { $imgExts -contains $_.Extension.ToLower() } | ForEach-Object { $_.Name } }; " ^
"$vids = @(); if (Test-Path 'video') { $vids = Get-ChildItem -Path 'video' -File | Where-Object { $vidExts -contains $_.Extension.ToLower() } | ForEach-Object { $_.Name } }; " ^
"$aud = ''; if (Test-Path 'audio') { $audFiles = Get-ChildItem -Path 'audio' -File | Where-Object { $audExts -contains $_.Extension.ToLower() }; if ($audFiles) { $aud = 'audio/' + $audFiles[0].Name; foreach ($a in $audFiles) { if ($a.Name.ToLower() -eq 'music.mp3') { $aud = 'audio/' + $a.Name; break } } } }; " ^
"$jsonImgs = ($imgs | ForEach-Object { '\"' + $_ + '\"' }) -join ', '; " ^
"$jsonVids = ($vids | ForEach-Object { '\"' + $_ + '\"' }) -join ', '; " ^
"$content = 'window.LOCAL_MEDIA = {' + [Environment]::NewLine + '  images: [' + $jsonImgs + '],' + [Environment]::NewLine + '  videos: [' + $jsonVids + '],' + [Environment]::NewLine + '  audio: \"' + $aud + '\"' + [Environment]::NewLine + '};'; " ^
"[System.IO.File]::WriteAllText('media_list.js', $content, [System.Text.Encoding]::UTF8)"

echo.
echo ========================================================
echo   [THÀNH CÔNG] Đã cập nhật xong file media_list.js!
echo   Bây giờ bạn chỉ cần mở lại file index.html là thấy ngay!
echo ========================================================
echo.
pause

