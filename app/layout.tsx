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
  title: "겟꿀 파트너스 - 상품 홍보하고 수익을 창출하세요",
  description: "누구나 쉽게 시작하는 겟꿀 파트너스. 다양한 상품을 홍보하고 업계 최고 수준의 커미션을 획득하세요. 획기적인 쇼핑 경험과 수익 창출 기회를 제공합니다.",
  keywords: ["겟꿀", "겟꿀 파트너스", "제이지디글로벌", "부업", "제휴마케팅", "수익창출", "커미션", "판매 플랫폼"],
  authors: [{ name: "주식회사 제이지디글로벌" }],
  openGraph: {
    title: "겟꿀 파트너스 - 상품 홍보하고 수익을 창출하세요",
    description: "업계 최고 수준의 커미션과 다양한 상품군. 지금 바로 겟꿀 파트너스로 수익을 창출해보세요.",
    url: 'https://partners.getkkul.com',
    siteName: '겟꿀 파트너스',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "겟꿀 파트너스 - 상품 홍보하고 수익을 창출하세요",
    description: "누구나 쉽게 시작하는 제휴 마케팅, 겟꿀 파트너스",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
