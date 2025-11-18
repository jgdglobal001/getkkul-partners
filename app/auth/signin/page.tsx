import { redirect } from "next/navigation";

export default function SignInPage() {
  // /auth로 리다이렉트
  redirect('/auth');
}

