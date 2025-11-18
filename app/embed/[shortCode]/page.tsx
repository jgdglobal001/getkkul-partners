import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface EmbedPageProps {
  params: {
    shortCode: string;
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { shortCode } = params;

  // DB에서 링크 조회
  const link = await prisma.partner_links.findUnique({
    where: { shortCode },
    include: { products: true },
  });

  if (!link) {
    notFound();
  }

  const product = link.products;
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  // 파트너 링크 URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';
  const partnerUrl = `${baseUrl}/p/${shortCode}`;

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
            background: white;
            width: 120px;
            height: 240px;
            overflow: hidden;
          }
          .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            background: white;
          }
          .header {
            padding: 4px 8px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
          }
          .logo {
            font-size: 10px;
            font-weight: bold;
            color: #6366f1;
          }
          .image-container {
            flex: 1;
            position: relative;
            overflow: hidden;
            background: #f3f4f6;
          }
          .image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .discount-badge {
            position: absolute;
            top: 4px;
            left: 4px;
            background: #ef4444;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
          }
          .info {
            padding: 8px;
            background: white;
          }
          .title {
            font-size: 11px;
            color: #1f2937;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.3;
            height: 28px;
          }
          .price-container {
            margin-bottom: 6px;
          }
          .discount-info {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 2px;
          }
          .discount-percent {
            font-size: 10px;
            color: #ef4444;
            font-weight: bold;
          }
          .original-price {
            font-size: 9px;
            color: #9ca3af;
            text-decoration: line-through;
          }
          .price {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
          }
          .button {
            display: block;
            width: 100%;
            padding: 6px;
            background: #6366f1;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .button:hover {
            background: #4f46e5;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">getkkul</div>
          </div>
          
          <div className="image-container">
            <img src={product.thumbnail} alt={product.title} className="image" />
            {hasDiscount && (
              <div className="discount-badge">
                {product.discountPercentage}% OFF
              </div>
            )}
          </div>
          
          <div className="info">
            <div className="title">{product.title}</div>
            
            <div className="price-container">
              {hasDiscount ? (
                <>
                  <div className="discount-info">
                    <span className="discount-percent">{product.discountPercentage}%</span>
                    <span className="original-price">₩{product.price.toLocaleString()}</span>
                  </div>
                  <div className="price">₩{discountedPrice.toLocaleString()}</div>
                </>
              ) : (
                <div className="price">₩{product.price.toLocaleString()}</div>
              )}
            </div>
            
            <a href={partnerUrl} target="_blank" rel="noopener noreferrer" className="button">
              소환하기
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

