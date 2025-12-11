"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    OAuthSignin: "OAuth 제공자에 연결할 수 없습니다.",
    OAuthCallback: "OAuth 콜백 처리 중 오류가 발생했습니다.",
    OAuthCreateAccount: "계정을 생성할 수 없습니다.",
    EmailCreateAccount: "이메일로 계정을 생성할 수 없습니다.",
    Callback: "콜백 처리 중 오류가 발생했습니다.",
    OAuthAccountNotLinked: "이미 다른 계정으로 등록된 이메일입니다.",
    EmailSignInError: "이메일 로그인에 실패했습니다.",
    CredentialsSignin: "로그인 정보가 올바르지 않습니다.",
    SessionCallback: "세션 콜백 중 오류가 발생했습니다.",
    JWTCallback: "JWT 콜백 중 오류가 발생했습니다.",
  };

  const message = error ? errorMessages[error] || "로그인 중 오류가 발생했습니다." : "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-lg font-medium text-gray-900">
              로그인 오류
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            {error && (
              <p className="mt-2 text-xs text-gray-500">
                오류 코드: {error}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/auth/signin"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              다시 로그인
            </Link>
            <Link
              href="/"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}

