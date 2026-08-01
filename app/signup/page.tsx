"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.fieldErrors?.password?.[0] || data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // Auto sign-in right after signup
    const signInRes = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (signInRes?.ok) router.push("/");
    else setError("Account created — please log in.");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 pt-20">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <h1 className="font-display font-extrabold uppercase text-3xl mb-6">Create Account</h1>
        <input required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm text-cream" />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm text-cream" />
        <input required type="password" placeholder="Password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm text-cream" />
        {error && <p className="text-red text-sm">{error}</p>}
        <button disabled={loading} type="submit"
          className="w-full bg-gold text-black py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition disabled:opacity-50">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-creamDim text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline">Log in</Link>
        </p>
      </form>
    </main>
  );
}
