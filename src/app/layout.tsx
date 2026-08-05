import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "SRM Audit System",
  description: "ISO/IEC 27001 Risk & Audit Management System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800 min-h-screen flex flex-col font-sans antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black text-white shadow-md">
          <div className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="leading-tight group">
              <div className="text-lg font-semibold tracking-wide text-white group-hover:text-gray-300 transition">
                SRM Audit System – ISO/IEC 27001
              </div>
              <div className="text-xs text-gray-300">
                Security Risk Management & Audit Checklist
              </div>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Home
              </Link>

              <Link
                href="/assets"
                className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Assets
              </Link>

              <Link
                href="/ai-assistant"
                className="text-sm px-3 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition font-medium"
              >
                AI Assistant
              </Link>

              {/* ✅ Session area */}
              {session?.user && (
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/20">
                  <div className="text-xs text-gray-200">
                    <div className="leading-tight">
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-[11px] text-gray-300">
                        {(session.user as any)?.role || ""}
                      </div>
                    </div>
                  </div>

                  <LogoutButton />
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Page content - full width flex container */}
        <main className="flex-1 w-full flex flex-col items-center justify-center py-6 px-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="pb-8 bg-gray-100">
          <div className="max-w-6xl mx-auto px-6 text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} SRM Audit System
          </div>
        </footer>
      </body>
    </html>
  );
}