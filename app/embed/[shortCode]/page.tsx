import { db } from '@/db';
import { partnerLinks, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

interface EmbedPageProps {
  params: {
    shortCode: string;
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { shortCode } = params;

  // DB에서 링크 조회
  const links = await db
    .select()
    .from(partnerLinks)
    .leftJoin(products, eq(partnerLinks.productId, products.id))
    .where(eq(partnerLinks.shortCode, shortCode))
    .limit(1);

  if (!links[0] || !links[0].products) {
    notFound();
  }

  const link = links[0].partner_links;
  const product = links[0].products;

  // 파트너 링크 URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';
  const partnerUrl = `${baseUrl}/p/${shortCode}`;

  // URL 쿼리 파라미터로 보더라인 옵션 확인 (서버 사이드에서는 불가능하므로 클라이언트에서 처리)

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{product.title}</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: transparent;
            width: 120px;
            height: 240px;
            overflow: hidden;
          }
          .container {
            width: 120px;
            height: 240px;
            display: flex;
            flex-direction: column;
            background: white;
            padding: 8px;
            cursor: pointer;
            transition: box-shadow 0.2s;
          }
          .container.with-border {
            border: 1px solid #111;
          }
          .container:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .logo-container {
            text-align: center;
            margin-bottom: 6px;
          }
          .logo {
            height: 20px;
            width: auto;
          }
          .image-container {
            margin-bottom: 6px;
          }
          .image {
            width: 100%;
            height: auto;
            display: block;
          }
          .title {
            font-size: 10px;
            color: #1f2937;
            text-align: center;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.4;
            min-height: 28px;
          }
          .button {
            display: block;
            width: 100%;
            padding: 6px;
            background: #2563eb;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            transition: background 0.2s;
            border: none;
          }
          .button:hover {
            background: #1d4ed8;
          }
        `}</style>
        <script dangerouslySetInnerHTML={{__html: `
          window.addEventListener('DOMContentLoaded', function() {
            var container = document.querySelector('.container');
            var urlParams = new URLSearchParams(window.location.search);
            var border = urlParams.get('border');
            if (border !== '0') {
              container.classList.add('with-border');
            }
          });
        `}} />
      </head>
      <body>
        <a href={partnerUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
          <div className="container">
            {/* 겟꿀 쇼핑 로고 */}
            <div className="logo-container">
              <img
                src="/getkkul-logo-left-right.png"
                alt="겟꿀"
                className="logo"
              />
            </div>

            {/* 상품 이미지 */}
            <div className="image-container">
              <img src={product.thumbnail} alt={product.title} className="image" />
            </div>

            {/* 상품명 */}
            <div className="title">{product.title}</div>

            {/* 쇼핑하기 버튼 */}
            <button className="button">
              쇼핑하기
            </button>
          </div>
        </a>
      </body>
    </html>
  );
}

