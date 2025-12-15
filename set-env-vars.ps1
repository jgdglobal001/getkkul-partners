# Cloudflare Pages 환경 변수 설정 스크립트
# 주의: 이 파일에 실제 비밀번호를 적어서 커밋하지 마세요! (GitHub 보안 차단됨)
# 실제 값은 Cloudflare 대시보드에서 직접 입력하거나, 로컬에서만 사용하는 별도 파일로 관리하세요.

$projectName = "getkkul-partners"

Write-Host "🔧 Cloudflare Pages 환경 변수 설정 스크립트" -ForegroundColor Green
Write-Host "이 스크립트는 템플릿입니다. 실제 값을 설정하려면 대시보드를 이용해주세요." -ForegroundColor Yellow

# 예시 명령어 (주석 처리됨)
# echo "값" | npx wrangler pages secret put 변수명 --project-name=$projectName
