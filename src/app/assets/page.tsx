import { prisma } from "@/lib/prisma";
import { createAsset, deleteAsset } from "./actions";
import Link from "next/link";

export default async function AssetsPage() {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Assets</h1>

      {/* Form tambah asset */}
      <form
        action={createAsset}
        className="bg-white shadow-md rounded-xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Asset Name</label>
            <input
              name="name"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Student Database"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Owner</label>
            <input
              name="owner"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="IT Department"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              name="location"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Cloud Server"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              name="type"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option>Application</option>
              <option>Server</option>
              <option>Data</option>
              <option>Network</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">CIA Value</label>
            <select
              name="cia"
              defaultValue="Medium"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
            >
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

      {/* List assets */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 gap-2 font-semibold bg-gray-50 p-4 text-sm">
          <div className="col-span-2">Name</div>
          <div>Type</div>
          <div>CIA</div>
          <div className="col-span-2">Actions</div>
        </div>

        {assets.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No assets yet.
          </div>
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
                <div className="text-gray-500 text-xs mt-1">
                  {a.owner || "-"} • {a.location || "-"}
                </div>
              </div>

              <div>{a.type}</div>

              <div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                  {a.cia}
                </span>
              </div>

              <div className="col-span-2">
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
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400">
        Next: vulnerability selection per asset (risk calculation).
      </p>
    </div>
  );
}