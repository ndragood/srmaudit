import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { toggleVulnerability } from "./actions";

export default async function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const asset = await prisma.asset.findFirst({
    where: { id: params.id },
    include: {
      selections: { include: { vulnerability: true } },
    },
  });

  const vulnerabilities = await prisma.vulnerability.findMany({
    orderBy: { category: "asc" },
  });

  if (!asset) return <div className="text-sm text-gray-500">Asset not found</div>;

  const selected = new Set(asset.selections.map((s) => s.vulnerabilityId));

  return (
    <div className="space-y-8">
      <Link
        href="/assets"
        className="text-blue-600 hover:text-blue-800 underline transition text-sm"
      >
        ← Back
      </Link>

      {/* ===== HEADER + AUDIT LINK ===== */}
      <div className="bg-white shadow-md rounded-xl p-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{asset.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {asset.type} • CIA:{" "}
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
              {asset.cia}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
  <Link
    href={`/assets/${asset.id}/audit`}
    className="inline-block text-sm bg-black text-white px-3 py-2 rounded"
  >
    Open Audit Checklist
  </Link>

  <Link
  href={`/assets/${asset.id}/findings`}
  className="inline-block text-sm border border-gray-200 px-3 py-2 rounded hover:bg-gray-50"
>
  Open Findings
</Link>
</div>
      </div>

      {/* ===== AVAILABLE VULNERABILITIES + ADD/REMOVE ===== */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold">Available Vulnerabilities</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select vulnerabilities to calculate risk and generate audit checklist.
        </p>

        <div className="space-y-2 mt-4">
          {vulnerabilities.map((v) => (
            <form
              key={v.id}
              action={async () => {
                "use server";
                await toggleVulnerability(asset.id, v.id);
              }}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <div>
                <div className="font-medium">{v.name}</div>
                <div className="text-xs text-gray-500">{v.category}</div>
              </div>

              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  selected.has(v.id)
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {selected.has(v.id) ? "Remove" : "Add"}
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* ===== STEP A: SELECTED VULNERABILITIES TABLE ===== */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold">Selected Vulnerabilities</h2>

        {asset.selections.length === 0 ? (
          <div className="text-sm text-gray-500 mt-2">
            No vulnerabilities selected yet.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Vulnerability</th>
                  <th className="p-3 text-left">Likelihood</th>
                  <th className="p-3 text-left">Impact</th>
                  <th className="p-3 text-left">Risk Score</th>
                  <th className="p-3 text-left">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {asset.selections.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{s.vulnerability.name}</td>
                    <td className="p-3">{s.likelihood}</td>
                    <td className="p-3">{s.impact}</td>
                    <td className="p-3 font-semibold">{s.riskScore}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          s.riskLevel === "Critical"
                            ? "bg-red-100 text-red-700"
                            : s.riskLevel === "High"
                            ? "bg-orange-100 text-orange-700"
                            : s.riskLevel === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {s.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}