"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const regNo = formData.get("regNo");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ regNo, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to login");
            }

            router.push("/dashboard");
            router.refresh(); // force layout refetch
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02040d] text-white flex flex-col items-center justify-center pt-16 pb-32 px-6 font-sans relative">
            <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#00f5ff]/10 to-transparent blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#00f5ff] hover:text-white transition-colors mb-8 font-rajdhani tracking-widest text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    BACK TO HOME
                </Link>

                {/* Form Card */}
                <div className="bg-[#070b19]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(0,245,255,0.05)]">
                    <h1 className="text-3xl font-orbitron font-bold mb-2">LOGIN</h1>
                    <p className="text-slate-400 mb-8 font-rajdhani tracking-widest text-sm uppercase">Access your Techexotica Account</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-rajdhani tracking-widest text-slate-300 uppercase">Registration Number</label>
                            <input
                                name="regNo"
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00f5ff]/50 focus:bg-white/10 transition-all font-mono"
                                placeholder="Ex. 21CS001"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-rajdhani tracking-widest text-slate-300 uppercase">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00f5ff]/50 focus:bg-white/10 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00f5ff] text-[#02040d] font-orbitron font-bold tracking-widest py-3 px-4 rounded-xl hover:bg-white hover:text-[#02040d] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-slate-400">
                            New to Techexotica?{" "}
                            <Link href="/register" className="text-[#00f5ff] hover:underline hover:text-white transition-colors">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
