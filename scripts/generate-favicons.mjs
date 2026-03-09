/**
 * 파비콘 생성 스크립트
 * favicon.ico (PNG 형식)를 정사각형으로 변환하고 다양한 크기 생성
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// 생성할 파비콘 크기들
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },      // iOS
  { name: 'android-chrome-192x192.png', size: 192 }, // Android/PWA
  { name: 'android-chrome-512x512.png', size: 512 }, // PWA 스플래시
];

async function generateFavicons() {
  const sourcePath = path.join(publicDir, 'favicon.ico');
  
  console.log('📁 Source:', sourcePath);
  console.log('📁 Output:', publicDir);
  console.log('');

  // 원본 이미지 로드
  const sourceBuffer = fs.readFileSync(sourcePath);
  const metadata = await sharp(sourceBuffer).metadata();
  
  console.log(`📐 원본 크기: ${metadata.width}x${metadata.height}`);
  
  // 정사각형으로 만들기 (더 큰 쪽에 맞추고 중앙 정렬, 투명 배경)
  const maxDim = Math.max(metadata.width, metadata.height);
  
  // 원본을 정사각형 캔버스에 중앙 배치
  const squareBuffer = await sharp(sourceBuffer)
    .resize(maxDim, maxDim, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // 투명 배경
    })
    .png()
    .toBuffer();
  
  console.log(`✅ 정사각형 변환 완료: ${maxDim}x${maxDim}`);
  console.log('');

  // 각 크기별 파비콘 생성
  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);
    
    await sharp(squareBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ ${name} (${size}x${size}) 생성 완료`);
  }

  // favicon.ico 업데이트 (32x32 PNG로)
  const favicon32Buffer = await sharp(squareBuffer)
    .resize(32, 32, {
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32Buffer);
  console.log('✅ favicon.ico (32x32) 업데이트 완료');
  
  // 기존 icon.png 업데이트 (app 폴더용)
  const appDir = path.join(__dirname, '..', 'app');
  const icon192Buffer = await sharp(squareBuffer)
    .resize(192, 192, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  fs.writeFileSync(path.join(appDir, 'icon.png'), icon192Buffer);
  console.log('✅ app/icon.png (192x192) 업데이트 완료');
  
  // apple-icon.png도 업데이트
  const apple180Buffer = await sharp(squareBuffer)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), apple180Buffer);
  console.log('✅ app/apple-icon.png (180x180) 업데이트 완료');

  console.log('');
  console.log('🎉 모든 파비콘 생성 완료!');
}

generateFavicons().catch(console.error);

