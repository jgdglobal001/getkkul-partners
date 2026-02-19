/**
 * 안전한 fetch JSON 파싱 유틸리티
 * 
 * 문제: Next.js가 API 라우트 에러 시 HTML 페이지(<!DOCTYPE html>...)를 반환하면
 *       .json() 호출 시 SyntaxError: Unexpected token '<' 발생
 * 
 * 해결: response를 text로 먼저 읽고, JSON 파싱을 안전하게 시도
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  isHtmlResponse: boolean;
}

/**
 * fetch 후 JSON 응답을 안전하게 파싱합니다.
 * HTML 응답(서버 에러 페이지, 404 등)이 오면 에러로 처리합니다.
 * 
 * @example
 * const { ok, data, error } = await safeFetchJson('/api/business-registration');
 * if (!ok) { console.error(error); return; }
 * // data를 안전하게 사용
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const response = await fetch(url, options);
    const text = await response.text();

    // HTML 응답 감지 (Next.js 에러 페이지, 404 등)
    if (text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
      console.error(`[safeFetchJson] HTML 응답 수신 (${response.status}): ${url}`);
      return {
        ok: false,
        status: response.status,
        data: null,
        error: response.status === 404
          ? 'API 경로를 찾을 수 없습니다.'
          : '서버에서 예상치 못한 응답이 왔습니다. 잠시 후 다시 시도해주세요.',
        isHtmlResponse: true,
      };
    }

    // JSON 파싱 시도
    let data: T;
    try {
      data = JSON.parse(text);
    } catch {
      console.error(`[safeFetchJson] JSON 파싱 실패 (${response.status}): ${url}`, text.slice(0, 200));
      return {
        ok: false,
        status: response.status,
        data: null,
        error: '서버 응답을 처리할 수 없습니다.',
        isHtmlResponse: false,
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : ((data as any)?.error || (data as any)?.message || '요청 처리 중 오류가 발생했습니다.'),
      isHtmlResponse: false,
    };
  } catch (networkError: any) {
    console.error(`[safeFetchJson] 네트워크 오류: ${url}`, networkError);
    return {
      ok: false,
      status: 0,
      data: null,
      error: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
      isHtmlResponse: false,
    };
  }
}

