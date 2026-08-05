import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full flex-1 flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-2xl p-8 md:p-12 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                SRM Audit System <span className="text-gray-400">—</span>{" "}
                ISO/IEC 27001
              </h1>

              <p className="text-gray-600">
                Security Risk Management & Audit Checklist generator.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Asset Inventory
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Risk Scoring
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  Audit Checklist
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black text-white">
                  AI Assistant
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[220px]">
              <Link
                href="/assets"
                className="text-center bg-black text-white px-5 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
              >
                Go to Assets
              </Link>

              <Link
                href="/ai-assistant"
                className="text-center border border-gray-200 px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-gray-900"
              >
                Ask AI Assistant
              </Link>

              <p className="text-xs text-gray-500 text-center">
                Tip: Add asset → select vulnerabilities → open audit.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="font-semibold text-gray-900">1) Assets</div>
              <div className="text-sm text-gray-600 mt-1">
                Register asset (owner, location, type, CIA).
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="font-semibold text-gray-900">2) Vulnerabilities</div>
              <div className="text-sm text-gray-600 mt-1">
                Add/remove vuln → auto risk score & level.
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="font-semibold text-gray-900">3) Audit</div>
              <div className="text-sm text-gray-600 mt-1">
                Auto-generate ISO controls checklist from mapping.
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Built with Next.js + Prisma + ISO/IEC 27001 mapping + AI Assistant.
        </p>
      </div>
    </div>
  );
}