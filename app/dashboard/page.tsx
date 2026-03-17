import { redirect } from "next/navigation";
import { getUser } from "@/lib/getUser";
import connectDB from "@/lib/db";
import User from "@/models/User";
import "@/models/Event";
import { Calendar, User as UserIcon, Monitor, Trophy } from "lucide-react";

export default async function DashboardPage() {
    const session = await getUser();

    if (!session || !session.userId) {
        redirect("/login");
    }

    await connectDB();

    const user = await User.findById(session.userId)
        .select("-password")
        .populate({
            path: "registeredEvents.eventId",
            select: "title category date venue",
        });

    if (!user) {
        redirect("/login");
    }

    const phoneStr = user.phone as string;
    const maskedPhone = phoneStr.length >= 4
        ? "*".repeat(phoneStr.length - 4) + phoneStr.slice(-4)
        : phoneStr;

    return (
        <div className="min-h-screen bg-[#02040d] text-white pt-24 pb-32 px-6 font-sans relative">
            <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-400/10 to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">

                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                    {/* Hexagon Avatar */}
                    <div className="w-24 h-24 shrink-0 bg-gradient-to-tr from-amber-500 to-[#ec4899] rounded-2xl rotate-3 flex items-center justify-center p-1 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                        <div className="w-full h-full bg-[#070b19] rounded-xl flex items-center justify-center -rotate-3">
                            <span className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#ec4899]">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black font-orbitron tracking-tight mb-2">
                            WELCOME, <span className="text-amber-400">{user.name.toUpperCase()}</span>
                        </h1>
                        <p className="text-slate-400 font-rajdhani tracking-widest uppercase mb-4">
                            Here's your operational status for Techexotica 2026.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-mono">
                                <span className="text-slate-500 flex items-center gap-2"><Monitor className="w-4 h-4" /> TECH ID:</span>
                                <span className="text-[#00f5ff]">{user.techexoticaId}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-mono">
                                <span className="text-slate-500 flex items-center gap-2"><UserIcon className="w-4 h-4" /> PHONE:</span>
                                <span className="text-white">{maskedPhone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Profile Card */}
                    <div className="lg:col-span-1 border border-white/10 bg-[#070b19]/80 backdrop-blur-md rounded-3xl p-6 h-fit">
                        <h3 className="font-orbitron font-bold text-xl mb-6 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-[#00f5ff]" />
                            PROFILE DATA
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs font-rajdhani tracking-widest text-slate-500 uppercase mb-1">Registration No</p>
                                <p className="font-mono text-white">{user.regNo}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs font-rajdhani tracking-widest text-slate-500 uppercase mb-1">Branch</p>
                                <p className="font-mono text-white">{user.branch}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs font-rajdhani tracking-widest text-slate-500 uppercase mb-1">Batch Year</p>
                                <p className="font-mono text-white">{user.batch}</p>
                            </div>
                        </div>
                    </div>

                    {/* Registered Events */}
                    <div className="lg:col-span-2 border border-white/10 bg-[#070b19]/80 backdrop-blur-md rounded-3xl p-6">
                        <h3 className="font-orbitron font-bold text-xl mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            REGISTERED EVENTS
                        </h3>

                        {user.registeredEvents.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/20">
                                <p className="text-slate-400 mb-4 font-rajdhani tracking-widest">No assigned operations yet.</p>
                                <a href="/events" className="inline-block bg-amber-400 text-black px-6 py-2 rounded-lg font-orbitron font-bold text-sm tracking-wider hover:bg-white transition-colors">
                                    BROWSE EVENTS
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.registeredEvents.map((reg: any, idx: number) => {
                                    if (!reg.eventId) return null; // If event was deleted
                                    return (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-amber-400/50 transition-colors group cursor-default">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-bold tracking-widest bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                                                    {reg.eventId.category?.toUpperCase() || "EVENT"}
                                                </span>
                                                <Calendar className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                                            </div>
                                            <h4 className="font-orbitron font-bold text-lg mb-2">{reg.eventId.title || reg.eventId.name}</h4>
                                            <p className="font-mono text-slate-400 text-sm">{reg.eventId.date}</p>
                                            <p className="font-mono text-slate-500 text-xs mt-1">{reg.eventId.venue}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
