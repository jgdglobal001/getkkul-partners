import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://partners.getkkul.com'),
  title: "겟꿀 파트너스 | 겟꿀 - 상품 홍보하고 수익을 창출하세요",
  description: "겟꿀의 공식 파트너십 플랫폼, 겟꿀 파트너스. 누구나 쉽게 상품을 홍보하고 업계 최고 수준의 커미션을 획득하세요. 겟꿀 쇼핑과 연계된 획기적인 수익 창출 기회를 제공합니다.",
  keywords: ["겟꿀", "겟꿀 파트너스", "getkkul", "제이지디글로벌", "부업", "제휴마케팅", "수익창출", "커미션", "판매 플랫폼"],
  authors: [{ name: "주식회사 제이지디글로벌" }],
  applicationName: "겟꿀 파트너스",
  openGraph: {
    title: "겟꿀 파트너스 | 겟꿀 - 상품 홍보하고 수익을 창출하세요",
    description: "겟꿀의 공식 파트너십 플랫폼. 업계 최고 수준의 커미션과 다양한 상품군으로 지금 바로 겟꿀에서 수익을 창출해보세요.",
    url: 'https://partners.getkkul.com',
    siteName: '겟꿀 파트너스',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "겟꿀 파트너스 | 겟꿀 - 상품 홍보하고 수익을 창출하세요",
    description: "겟꿀의 공식 파트너십 플랫폼, 누구나 쉽게 시작하는 제휴 마케팅 겟꿀 파트너스",
  },
  verification: {
    google: 'ed4a8c2fc42ae331',
    other: {
      'naver-site-verification': '9a8a0694f4223970207260c717ab4272',
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/getkkul-partners-pabicon.png',
    apple: '/getkkul-partners-pabicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "겟꿀 파트너스",
              "alternateName": "겟꿀",
              "url": "https://partners.getkkul.com",
              "logo": "https://partners.getkkul.com/getkkul-partners-logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+82-10-7218-2858",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.getkkul.com"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "겟꿀 파트너스",
              "url": "https://partners.getkkul.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://partners.getkkul.com/products/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
