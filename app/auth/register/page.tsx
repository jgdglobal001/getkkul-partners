import { redirect } from "next/navigation";

export default function RegisterPage() {
  // /auth로 리다이렉트
  redirect('/auth');
}

