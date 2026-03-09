import { spawnSync } from 'node:child_process';

if (process.platform === 'win32') {
  console.error('[build:pages] Native Windows에서는 @cloudflare/next-on-pages 로컬 실행이 불안정합니다.');
  console.error('[build:pages] 먼저 `npm run verify:core`로 코드 기준을 확인하세요.');
  console.error('[build:pages] 최종 Pages 변환/배포 검증은 Cloudflare 배포 후 빌드 로그로 확인하세요.');
  console.error('[build:pages] 로컬 Pages 번들이 꼭 필요하면 WSL 또는 Linux/macOS에서 다시 실행하세요.');
  process.exit(1);
}

const result = spawnSync('npx', ['@cloudflare/next-on-pages@1'], {
  stdio: 'inherit',
});

if (result.error) {
  console.error('[build:pages] next-on-pages 실행 중 오류가 발생했습니다.');
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);