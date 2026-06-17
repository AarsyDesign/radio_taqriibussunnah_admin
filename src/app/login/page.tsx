"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (data.session) router.replace("/dashboard");
      });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Email atau password tidak sesuai.");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3e7] px-4 text-[#1f2f24]">
      <section className="w-full max-w-md rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f7f55]">
          Radio Taqriibussunnah
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Login Admin</h1>
        <p className="mt-2 text-sm leading-6 text-[#65725b]">
          Masuk dengan akun Supabase Auth yang sudah dibuat. Tidak ada
          pendaftaran publik di halaman ini.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-[#334d39]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#d3c5a8] bg-white px-3 py-2 text-sm outline-none ring-[#7a9c62] transition focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#334d39]">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#d3c5a8] bg-white px-3 py-2 text-sm outline-none ring-[#7a9c62] transition focus:ring-2"
            />
          </label>

          {error ? <p className="text-sm text-[#9b3327]">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#285c3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f472d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}
