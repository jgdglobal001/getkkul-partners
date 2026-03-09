import { spawnSync } from 'node:child_process';

function runStep(label, command) {
  const result = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    console.error(`[verify:deploy] ${label} 실행 중 오류가 발생했습니다.`);
    console.error(result.error.message);
    process.exit(1);
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
}

runStep('verify:core', 'npm run verify:core');

if (process.platform === 'win32') {
  console.log('[verify:deploy] Native Windows에서는 Cloudflare Pages adapter build를 로컬에서 강제하지 않습니다.');
  console.log('[verify:deploy] 다음 단계: 실제 배포 후 빌드 로그에서 Worker compile / Assets published / site deployed 여부를 확인하세요.');
  process.exit(0);
}

runStep('build:pages', 'npm run build:pages');
console.log('[verify:deploy] verify:core + build:pages까지 통과했습니다.');