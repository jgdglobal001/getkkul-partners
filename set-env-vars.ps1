# Cloudflare Pages 환경 변수 설정 스크립트

$projectName = "getkkul-partners"

Write-Host "🔧 Cloudflare Pages 환경 변수 설정 시작..." -ForegroundColor Green

# NextAuth
Write-Host "`n📌 NextAuth 설정..." -ForegroundColor Cyan
npx wrangler pages secret put NEXTAUTH_SECRET --project-name=$projectName
npx wrangler pages secret put NEXTAUTH_URL --project-name=$projectName

# Database
Write-Host "`n📌 Database 설정..." -ForegroundColor Cyan
npx wrangler pages secret put DATABASE_URL --project-name=$projectName
npx wrangler pages secret put DIRECT_URL --project-name=$projectName

# Google OAuth
Write-Host "`n📌 Google OAuth 설정..." -ForegroundColor Cyan
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=$projectName
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=$projectName

# Kakao OAuth
Write-Host "`n📌 Kakao OAuth 설정..." -ForegroundColor Cyan
npx wrangler pages secret put KAKAO_CLIENT_ID --project-name=$projectName
npx wrangler pages secret put KAKAO_CLIENT_SECRET --project-name=$projectName

# Naver OAuth
Write-Host "`n📌 Naver OAuth 설정..." -ForegroundColor Cyan
npx wrangler pages secret put NAVER_CLIENT_ID --project-name=$projectName
npx wrangler pages secret put NAVER_CLIENT_SECRET --project-name=$projectName

# 환경 설정
Write-Host "`n📌 환경 설정..." -ForegroundColor Cyan
echo "production" | npx wrangler pages secret put NODE_ENV --project-name=$projectName

# 겟꿀 서비스 URL
Write-Host "`n📌 겟꿀 서비스 URL 설정..." -ForegroundColor Cyan
echo "https://getkkul-partners.pages.dev" | npx wrangler pages secret put NEXT_PUBLIC_BASE_URL --project-name=$projectName
echo "https://www.getkkul.com" | npx wrangler pages secret put NEXT_PUBLIC_GETKKUL_SHOPPING_URL --project-name=$projectName

# 토스페이먼츠
Write-Host "`n📌 토스페이먼츠 설정..." -ForegroundColor Cyan
npx wrangler pages secret put NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY --project-name=$projectName
npx wrangler pages secret put TOSS_PAYMENTS_API_KEY --project-name=$projectName
npx wrangler pages secret put TOSS_PAYMENTS_SECRET_KEY --project-name=$projectName
npx wrangler pages secret put TOSS_PAYMENTS_SECURITY_KEY --project-name=$projectName

# 국세청 API
Write-Host "`n📌 국세청 API 설정..." -ForegroundColor Cyan
npx wrangler pages secret put NTS_BUSINESSMAN_API_KEY --project-name=$projectName

Write-Host "`n✅ 환경 변수 설정 완료!" -ForegroundColor Green

