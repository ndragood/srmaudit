import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createAsset, deleteAsset } from "./actions";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export default async function AssetsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="text-sm text-gray-600">
        Not authenticated.{" "}
        <Link className="underline text-blue-600" href="/login">
          Login
        </Link>
      </div>
    );
  }

  const role = (session.user as any).role as "ADMIN" | "AUDITOR" | "AUDITEE" | undefined;
  const userId = String((session.user as any).id || "");

  const whereCondition: Prisma.AssetWhereInput = {};

  if (role === "AUDITOR") {
    whereCondition.organization = {
      auditAssignments: { some: { auditorId: userId } },
    };
  }

  const [assets, organizations] = await Promise.all([
    prisma.asset.findMany({
      where: whereCondition,
      include: { organization: true },
      orderBy: { createdAt: "desc" },
    }),
    role === "ADMIN"
      ? prisma.organization.findMany({ orderBy: { createdAt: "desc" } })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Assets</h1>

        {role === "ADMIN" && (
          <div className="flex gap-4 text-sm">
            <Link className="underline text-blue-600" href="/admin/organizations">
              Manage Organizations
            </Link>
            <Link className="underline text-blue-600" href="/admin/assignments">
              Assignments
            </Link>
          </div>
        )}
      </div>

      {/* ✅ Create Asset form (Admin only) */}
      {role === "ADMIN" && (
        <form action={createAsset} className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <div className="text-lg font-semibold">Create Asset</div>

          <div>
            <label className="text-sm font-medium">Organization</label>
            <select
              name="organizationId"
              required
              defaultValue=""
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            >
              <option value="" disabled>
                -- Select organization --
              </option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} • {o.sector}
                </option>
              ))}
            </select>
            {organizations.length === 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Belum ada organization. Buat dulu di <b>/admin/organizations</b>.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Asset Name</label>
              <input
                name="name"
                placeholder="e.g., Finance DB"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Owner</label>
              <input
                name="owner"
                placeholder="e.g., IT Department"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                name="location"
                placeholder="e.g., Cloud Server"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <input
                name="type"
                placeholder="Application / Server / Data"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">CIA</label>
              <select name="cia" defaultValue="Medium" className="w-full border border-gray-300 rounded-lg p-2 mt-1">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition font-medium">
            Add Asset
          </button>
        </form>
      )}

      {/* ✅ List Assets */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 gap-2 font-semibold bg-gray-50 p-4 text-sm">
          <div className="col-span-2">Name</div>
          <div>Type</div>
          <div>CIA</div>
          <div>Criticality</div>
          <div>Actions</div>
        </div>

        {assets.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No assets yet.</div>
        ) : (
          assets.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-6 gap-2 p-4 border-t text-sm items-center hover:bg-gray-50 transition"
            >
              <div className="col-span-2">
                <Link
                  href={`/assets/${a.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 underline transition"
                >
                  {a.name}
                </Link>
                <div className="text-xs text-gray-500">{a.organization?.name}</div>
              </div>

              <div>{a.type}</div>

              <div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{a.cia}</span>
              </div>

              <div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                  {a.criticalityLevel} (score {a.criticalityScore})
                </span>
              </div>

              <div>
                {role === "ADMIN" ? (
                  <form
                    action={async () => {
                      "use server";
                      await deleteAsset(a.id);
                    }}
                  >
                    <button className="text-red-600 hover:text-red-800 hover:underline transition font-medium">
                      Delete
                    </button>
                  </form>
                ) : (
                  <span className="text-xs text-gray-400">No access</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-gray-500">
        Criticality dihitung otomatis dari <b>Organization ExposureScore</b> + <b>CIA</b> dan disimpan ke DB (Module 3).
      </div>
    </div>
  );
}