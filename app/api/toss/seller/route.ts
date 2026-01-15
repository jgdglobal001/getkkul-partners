import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

/**
 * 토스페이먼츠 셀러 상태 조회 API
 * GET /api/toss/seller?userId={userId}
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
  const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY?.trim();

  if (!secretKey || !securityKey) {
    return NextResponse.json(
      { success: false, error: '토스 API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    // refSellerId는 1~20자 제한 (userId 앞 20자)
    const refSellerId = userId.slice(0, 20);
    
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    // 토스 셀러 조회 API 호출
    // GET /v2/sellers/{refSellerId}
    const response = await fetch(
      `https://api.tosspayments.com/v2/sellers/${refSellerId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[Toss Seller] 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Toss Seller] 조회 실패:', errorText);
      return NextResponse.json(
        { success: false, error: '셀러 조회 실패', details: errorText },
        { status: response.status }
      );
    }

    // 응답이 JWE로 암호화된 경우 복호화
    const responseText = await response.text();
    let sellerData;

    try {
      // 먼저 일반 JSON인지 확인
      sellerData = JSON.parse(responseText);
    } catch {
      // JWE 암호화된 응답인 경우 복호화
      try {
        const keyBytes = Buffer.from(securityKey, 'base64');
        const { plaintext } = await jose.compactDecrypt(responseText, keyBytes);
        sellerData = JSON.parse(new TextDecoder().decode(plaintext));
      } catch (decryptError) {
        console.error('[Toss Seller] 복호화 실패:', decryptError);
        return NextResponse.json(
          { success: false, error: '응답 복호화 실패' },
          { status: 500 }
        );
      }
    }

    console.log('[Toss Seller] 조회 성공:', sellerData);

    return NextResponse.json({
      success: true,
      seller: sellerData,
      status: sellerData.status || sellerData.entityBody?.status,
    });

  } catch (error: any) {
    console.error('[Toss Seller] 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

