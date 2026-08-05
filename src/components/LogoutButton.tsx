"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
  );
}