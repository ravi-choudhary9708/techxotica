"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Participant {
    name: string;
    regNo: string;
    techexoticaId: string;
    branch: string;
    batch: string;
    phone: string;
}

interface SoloRegistration {
    registrationId: string;
    type: "solo";
    status: string;
    registeredAt: string;
    participant: Participant;
}

interface TeamRegistration {
    registrationId: string;
    type: "team";
    teamName: string;
    status: string;
    registeredAt: string;
    leader: Participant | null;
    members: Participant[];
}

type Registration = SoloRegistration | TeamRegistration;

interface EventGroup {
    eventId: string;
    eventName: string;
    type: "solo" | "team";
    category: string;
    date: string | null;
    venue: string;
    registrations: Registration[];
    totalParticipants: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminParticipantsPage() {
    const [secret, setSecret] = useState("");
    const [inputSecret, setInputSecret] = useState("");
    const [events, setEvents] = useState<EventGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = useCallback(async (sec: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/admin/participants?secret=${encodeURIComponent(sec)}`);
            const json = await res.json();
            if (!json.success) {
                setError(json.message || "Failed to load data");
                setEvents([]);
            } else {
                setEvents(json.data);
                if (json.data.length > 0) setSelectedEventId(json.data[0].eventId);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-load if ?secret= is in URL
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const s = params.get("secret");
            if (s) {
                setSecret(s);
                setInputSecret(s);
                fetchData(s);
            }
        }
    }, [fetchData]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setSecret(inputSecret);
        fetchData(inputSecret);
    };

    const selectedEvent = events.find((e) => e.eventId === selectedEventId);

    const filteredRegistrations = (selectedEvent?.registrations ?? []).filter((reg) => {
        if (!searchQuery) return true;

        const q = searchQuery.toLowerCase();
        if (reg.type === "solo") {
            const p = reg.participant;
            return (
                p.name.toLowerCase().includes(q) ||
                p.regNo.toLowerCase().includes(q) ||
                p.techexoticaId?.toLowerCase().includes(q) ||
                p.branch?.toLowerCase().includes(q) ||
                p.batch?.toLowerCase().includes(q)
            );
        } else {
            const inLeader = reg.leader && (
                reg.leader.name.toLowerCase().includes(q) ||
                reg.leader.regNo.toLowerCase().includes(q) ||
                reg.leader.techexoticaId?.toLowerCase().includes(q) ||
                reg.leader.branch?.toLowerCase().includes(q) ||
                reg.leader.batch?.toLowerCase().includes(q)
            );
            const inMembers = reg.members.some(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.regNo.toLowerCase().includes(q) ||
                    m.techexoticaId?.toLowerCase().includes(q) ||
                    m.branch?.toLowerCase().includes(q) ||
                    m.batch?.toLowerCase().includes(q)
            );
            const inTeam = reg.teamName.toLowerCase().includes(q);
            return (inLeader || inMembers || inTeam);
        }
    });

    const totalAcrossAll = events.reduce((sum, e) => sum + e.totalParticipants, 0);
    const totalRegistrationsAll = events.reduce((sum, e) => sum + e.registrations.length, 0);

    // ── Auth Screen ──────────────────────────────────────────────────────────
    if (!secret) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "var(--bg-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}>
                <div className="glass-card animated-border" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛡️</div>
                        <h1 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "1.4rem", letterSpacing: "3px", marginBottom: "0.5rem" }}>
                            ADMIN ACCESS
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", letterSpacing: "1px" }}>
                            Techxotica Control Panel
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "2px", color: "var(--text-muted)", fontFamily: "Orbitron, monospace", marginBottom: "0.5rem" }}>
                                ACCESS KEY
                            </label>
                            <input
                                type="password"
                                value={inputSecret}
                                onChange={(e) => setInputSecret(e.target.value)}
                                required
                                placeholder="Enter admin secret..."
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    background: "rgba(0,245,255,0.05)",
                                    border: "1px solid rgba(0,245,255,0.2)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                    fontFamily: "monospace",
                                }}
                            />
                        </div>
                        {error && (
                            <p style={{ color: "var(--neon-red)", fontSize: "0.8rem", textAlign: "center", marginBottom: "1rem" }}>
                                {error}
                            </p>
                        )}
                        <button type="submit" className="btn-neon-solid" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Authenticating..." : "Enter Control Panel"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Main Dashboard ──────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-dark)", fontFamily: "Inter, sans-serif" }}>
            {/* Header */}
            <div style={{
                background: "rgba(0,245,255,0.03)",
                borderBottom: "1px solid rgba(0,245,255,0.15)",
                padding: "1rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(12px)",
            }}>
                <div>
                    <h1 className="font-orbitron neon-text-cyan" style={{ fontSize: "1.2rem", letterSpacing: "3px" }}>
                        TECHXOTICA ADMIN
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px", fontFamily: "Rajdhani, sans-serif" }}>
                        PARTICIPANTS DASHBOARD
                    </p>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    {/* Global stats */}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <StatChip label="EVENTS" value={events.length} color="var(--neon-cyan)" />
                        <StatChip label="TOTAL REG" value={totalRegistrationsAll} color="var(--neon-gold)" />
                        <StatChip label="PARTICIPANTS" value={totalAcrossAll} color="var(--neon-purple)" />
                    </div>

                    <a
                        href={`/api/admin/export-registrations?secret=${encodeURIComponent(secret)}`}
                        className="btn-neon"
                        style={{ fontSize: "0.7rem", padding: "8px 18px" }}
                        download
                    >
                        ⬇ Export CSV
                    </a>

                    <button
                        onClick={() => { setSecret(""); setEvents([]); setSelectedEventId(null); }}
                        className="btn-neon-red"
                        style={{ fontSize: "0.7rem", padding: "8px 18px" }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <div className="neon-text-cyan font-orbitron" style={{ fontSize: "1.2rem", letterSpacing: "4px", marginBottom: "1rem" }}>
                            LOADING DATA...
                        </div>
                        <div style={{ width: "200px", height: "2px", background: "rgba(0,245,255,0.2)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{
                                height: "100%", width: "40%",
                                background: "var(--neon-cyan)",
                                boxShadow: "0 0 10px var(--neon-cyan)",
                                animation: "pulse-slow 1.5s ease-in-out infinite",
                            }} />
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                    <div className="glass-card" style={{ padding: "2rem", textAlign: "center", maxWidth: "400px" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
                        <p style={{ color: "var(--neon-red)" }}>{error}</p>
                        <button onClick={() => fetchData(secret)} className="btn-neon" style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
                            Retry
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", height: "calc(100vh - 73px)" }}>

                    {/* ── Sidebar: Event List ── */}
                    <aside style={{
                        width: "280px",
                        flexShrink: 0,
                        borderRight: "1px solid rgba(0,245,255,0.1)",
                        overflowY: "auto",
                        padding: "1rem 0",
                    }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "2px", fontFamily: "Orbitron, monospace", padding: "0 1rem 0.75rem" }}>
                            ALL EVENTS
                        </p>
                        {events.map((ev) => (
                            <EventSidebarItem
                                key={ev.eventId}
                                event={ev}
                                isActive={selectedEventId === ev.eventId}
                                onClick={() => { setSelectedEventId(ev.eventId); setSearchQuery(""); }}
                            />
                        ))}
                        {events.length === 0 && (
                            <p style={{ color: "var(--text-muted)", padding: "1rem", fontSize: "0.85rem", textAlign: "center" }}>
                                No events found.
                            </p>
                        )}
                    </aside>

                    {/* ── Main Content ── */}
                    <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
                        {selectedEvent ? (
                            <>
                                {/* Event Header */}
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                                        <div>
                                            <h2 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "1.4rem", letterSpacing: "2px", marginBottom: "0.25rem" }}>
                                                {selectedEvent.eventName}
                                            </h2>
                                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                                <Badge text={selectedEvent.type.toUpperCase()} color={selectedEvent.type === "team" ? "var(--neon-purple)" : "var(--neon-cyan)"} />
                                                <Badge text={selectedEvent.category} color="var(--neon-gold)" />
                                                {selectedEvent.venue && <Badge text={selectedEvent.venue} color="var(--text-muted)" />}
                                                {selectedEvent.date && (
                                                    <Badge text={new Date(selectedEvent.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} color="var(--neon-green)" />
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "1rem" }}>
                                            <StatChip label="REGISTRATIONS" value={selectedEvent.registrations.length} color="var(--neon-cyan)" />
                                            <StatChip label="PARTICIPANTS" value={selectedEvent.totalParticipants} color="var(--neon-purple)" />
                                        </div>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                    <input
                                        type="text"
                                        placeholder="Search name, reg no, TX ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            flex: 1,
                                            minWidth: "220px",
                                            padding: "0.6rem 1rem",
                                            background: "rgba(0,245,255,0.05)",
                                            border: "1px solid rgba(0,245,255,0.2)",
                                            borderRadius: "8px",
                                            color: "var(--text-primary)",
                                            fontSize: "0.85rem",
                                            outline: "none",
                                        }}
                                    />
                                    {/* Removed status dropdown */}
                                </div>

                                {/* Registration Count */}
                                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", letterSpacing: "1px", marginBottom: "1rem", fontFamily: "Rajdhani, sans-serif" }}>
                                    SHOWING {filteredRegistrations.length} OF {selectedEvent.registrations.length} REGISTRATIONS
                                </p>

                                {/* Registrations */}
                                {filteredRegistrations.length === 0 ? (
                                    <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
                                        <p style={{ color: "var(--text-muted)" }}>No registrations match your filter.</p>
                                    </div>
                                ) : selectedEvent.type === "solo" ? (
                                    /* ── Solo Event: Table ── */
                                    <div className="glass-card" style={{ overflow: "hidden" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ borderBottom: "1px solid rgba(0,245,255,0.15)" }}>
                                                    {["#", "Name", "Reg No", "TX ID", "Branch", "Batch", "Phone", "Registered"].map((h) => (
                                                        <th key={h} style={{
                                                            padding: "0.75rem 1rem",
                                                            textAlign: "left",
                                                            fontSize: "0.65rem",
                                                            letterSpacing: "2px",
                                                            color: "var(--neon-cyan)",
                                                            fontFamily: "Orbitron, monospace",
                                                            fontWeight: 600,
                                                            whiteSpace: "nowrap",
                                                        }}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filteredRegistrations as SoloRegistration[]).map((reg, idx) => (
                                                    <tr key={reg.registrationId} style={{
                                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                                        transition: "background 0.2s",
                                                    }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,245,255,0.04)")}
                                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                    >
                                                        <td style={tdStyle}>{idx + 1}</td>
                                                        <td style={{ ...tdStyle, fontWeight: 600, color: "var(--text-primary)" }}>{reg.participant.name}</td>
                                                        <td style={{ ...tdStyle, fontFamily: "monospace", color: "var(--neon-cyan)" }}>{reg.participant.regNo}</td>
                                                        <td style={{ ...tdStyle, fontFamily: "monospace", color: "var(--neon-purple)" }}>{reg.participant.techexoticaId || "—"}</td>
                                                        <td style={tdStyle}>{reg.participant.branch}</td>
                                                        <td style={tdStyle}>{reg.participant.batch}</td>
                                                        <td style={{ ...tdStyle, fontFamily: "monospace" }}>{reg.participant.phone}</td>
                                                        <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: "0.78rem" }}>
                                                            {new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    /* ── Team Event: Cards ── */
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {(filteredRegistrations as TeamRegistration[]).map((reg, idx) => (
                                            <TeamCard key={reg.registrationId} reg={reg} idx={idx + 1} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px" }}>
                                <p style={{ color: "var(--text-muted)" }}>Select an event from the sidebar.</p>
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const tdStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
};

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${color}30`,
            borderRadius: "8px",
            padding: "0.4rem 0.8rem",
            textAlign: "center",
        }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color, fontFamily: "Orbitron, monospace", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "1.5px", color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif", marginTop: "2px" }}>{label}</div>
        </div>
    );
}

function Badge({ text, color }: { text: string; color: string }) {
    return (
        <span style={{
            display: "inline-block",
            background: `${color}18`,
            border: `1px solid ${color}55`,
            borderRadius: "4px",
            padding: "2px 10px",
            fontSize: "0.7rem",
            letterSpacing: "1px",
            color,
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
        }}>
            {text}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isConfirmed = status === "confirmed";
    return (
        <span style={{
            display: "inline-block",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "0.68rem",
            letterSpacing: "1px",
            fontWeight: 600,
            fontFamily: "Orbitron, monospace",
            background: isConfirmed ? "rgba(0,255,136,0.12)" : "rgba(255,191,36,0.12)",
            border: `1px solid ${isConfirmed ? "rgba(0,255,136,0.4)" : "rgba(255,191,36,0.4)"}`,
            color: isConfirmed ? "var(--neon-green)" : "#fbbf24",
            textTransform: "uppercase",
        }}>
            {status}
        </span>
    );
}

function EventSidebarItem({ event, isActive, onClick }: { event: EventGroup; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                textAlign: "left",
                padding: "0.75rem 1rem",
                background: isActive ? "rgba(0,245,255,0.08)" : "transparent",
                borderLeft: isActive ? "3px solid var(--neon-cyan)" : "3px solid transparent",
                borderRight: "none",
                borderTop: "none",
                borderBottom: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
            }}
            onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.04)"; }}
            onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
            <span style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: isActive ? "var(--neon-cyan)" : "var(--text-primary)",
                display: "block",
                lineHeight: 1.3,
            }}>
                {event.eventName}
            </span>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <span style={{
                    fontSize: "0.65rem",
                    color: event.type === "team" ? "var(--neon-purple)" : "var(--neon-cyan)",
                    fontFamily: "Rajdhani, sans-serif",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                }}>
                    {event.type}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>·</span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                    {event.totalParticipants} participant{event.totalParticipants !== 1 ? "s" : ""}
                </span>
            </div>
        </button>
    );
}

function TeamCard({ reg, idx }: { reg: TeamRegistration; idx: number }) {
    const allMembers: Array<Participant & { role: string }> = [
        ...(reg.leader ? [{ ...reg.leader, role: "Leader" }] : []),
        ...reg.members.map((m) => ({ ...m, role: "Member" })),
    ];

    return (
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span className="font-orbitron" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>#{idx}</span>
                    <span className="font-orbitron" style={{ color: "var(--neon-gold)", fontSize: "0.95rem", letterSpacing: "1px" }}>
                        {reg.teamName}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                        ({allMembers.length} member{allMembers.length !== 1 ? "s" : ""})
                    </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                        {new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                </div>
            </div>

            {/* Members table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
                        {["Role", "Name", "Reg No", "Techxotica ID", "Branch", "Batch"].map((h) => (
                            <th key={h} style={{
                                padding: "0.5rem 0.75rem",
                                textAlign: "left",
                                fontSize: "0.6rem",
                                letterSpacing: "1.5px",
                                color: "var(--text-muted)",
                                fontFamily: "Orbitron, monospace",
                                whiteSpace: "nowrap",
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {allMembers.map((m, i) => (
                        <tr key={i}
                            style={{ borderBottom: i < allMembers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                            <td style={{ padding: "0.6rem 0.75rem", whiteSpace: "nowrap" }}>
                                {m.role === "Leader" ? (
                                    <span style={{
                                        background: "rgba(255,215,0,0.15)",
                                        border: "1px solid rgba(255,215,0,0.4)",
                                        borderRadius: "4px",
                                        padding: "1px 8px",
                                        fontSize: "0.65rem",
                                        color: "var(--neon-gold)",
                                        fontFamily: "Orbitron, monospace",
                                        letterSpacing: "1px",
                                    }}>
                                        ★ Leader
                                    </span>
                                ) : (
                                    <span style={{
                                        background: "rgba(168,85,247,0.1)",
                                        border: "1px solid rgba(168,85,247,0.3)",
                                        borderRadius: "4px",
                                        padding: "1px 8px",
                                        fontSize: "0.65rem",
                                        color: "var(--neon-purple)",
                                        fontFamily: "Orbitron, monospace",
                                        letterSpacing: "1px",
                                    }}>
                                        Member
                                    </span>
                                )}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem", fontWeight: m.role === "Leader" ? 700 : 400, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                                {m.name}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.83rem", fontFamily: "monospace", color: "var(--neon-cyan)", whiteSpace: "nowrap" }}>
                                {m.regNo}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.83rem", fontFamily: "monospace", color: "var(--neon-purple)", whiteSpace: "nowrap" }}>
                                {m.techexoticaId || "—"}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.82rem", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                                {m.branch}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.82rem", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                                {m.batch}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
