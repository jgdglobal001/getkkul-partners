import AuthForm from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "겟꿀 파트너스 | 시작하기",
  description: "겟꿀 파트너스와 함께 수익을 창출하세요",
};

export default function AuthPage() {
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-5 border border-gray-200 p-5 rounded-md shadow-md">
          <Logo />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">겟꿀 파트너스</h1>
          <p className="mt-2 text-sm text-gray-600">
            지금 시작하고 수익을 창출하세요
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}

