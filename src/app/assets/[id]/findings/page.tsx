import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createFinding, deleteFinding } from "./actions";

export default async function FindingsPage({
  params,
}: {
  params: { id: string };
}) {
  const asset = await prisma.asset.findFirst({
    where: { id: params.id },
  });

  if (!asset) return <div className="text-sm text-gray-500">Asset not found</div>;

  const findings = await prisma.finding.findMany({
    where: { assetId: asset.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <Link
        href={`/assets/${asset.id}`}
        className="text-blue-600 hover:text-blue-800 underline transition text-sm"
      >
        ← Back to Asset
      </Link>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold">Findings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Asset: <span className="font-medium">{asset.name}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Output: Issues + risk + recommendations (ISO-style).
        </p>
      </div>

      {/* Add Finding */}
      <form
        action={async (formData) => {
          "use server";
          await createFinding(asset.id, formData);
        }}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Issue</label>
            <input
              name="issue"
              className="w-full border rounded-lg p-2 mt-1"
              placeholder='Example: "TLS not enforced on web app"'
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Risk</label>
            <select
              name="risk"
              className="w-full border rounded-lg p-2 mt-1"
              defaultValue="High"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Recommendation</label>
            <textarea
              name="recommendation"
              className="w-full border rounded-lg p-2 mt-1 min-h-[90px]"
              placeholder='Example: "Enforce HTTPS/TLS for all endpoints, redirect HTTP→HTTPS, and renew certificates."'
              required
            />
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Add Finding
        </button>
      </form>

      {/* Findings List */}
      {findings.length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-6 text-sm text-gray-500">
          No findings yet. Add one using the form above.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-100 p-4 text-sm font-semibold text-gray-700">
            <div className="col-span-2">Issue</div>
            <div>Risk</div>
            <div>Actions</div>
          </div>

          {findings.map((f) => (
            <div
              key={f.id}
              className="grid grid-cols-4 p-4 border-t text-sm items-start"
            >
              <div className="col-span-2">
                <div className="font-medium">{f.issue}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {f.recommendation}
                </div>
                <div className="text-[11px] text-gray-400 mt-2">
                  Created: {new Date(f.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    f.risk === "Critical"
                      ? "bg-red-100 text-red-700"
                      : f.risk === "High"
                      ? "bg-orange-100 text-orange-700"
                      : f.risk === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {f.risk}
                </span>
              </div>

              <div>
                <form
                  action={async () => {
                    "use server";
                    await deleteFinding(asset.id, f.id);
                  }}
                >
                  <button className="text-red-600 hover:underline text-sm">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}