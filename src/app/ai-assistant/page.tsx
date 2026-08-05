import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AIAssistantClient from "./AIAssistantClient";

export default async function AIAssistantPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="w-full flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center space-y-4 shadow-md max-w-md w-full">
          <div className="text-4xl">🔒</div>
          <h2 className="text-xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-sm text-gray-600">
            Anda harus login terlebih dahulu untuk dapat menggunakan fitur AI Auditor Assistant.
          </p>
          <div className="pt-2">
            <Link
              className="inline-block bg-black hover:bg-gray-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-sm w-full"
              href="/login?callbackUrl=/ai-assistant"
            >
              Sign In to Continue →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AIAssistantClient />;
}
