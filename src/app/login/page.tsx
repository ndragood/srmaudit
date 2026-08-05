import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginFormClient from "./LoginFormClient";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = (await searchParams) || {};

  // Jika pengguna sudah dalam posisi login, langsung redirect ke /assets
  if (session?.user) {
    const target = callbackUrl && !callbackUrl.includes("/login") ? callbackUrl : "/assets";
    redirect(target);
  }

  return <LoginFormClient callbackUrl={callbackUrl} />;
}