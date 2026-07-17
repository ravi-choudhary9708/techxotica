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

interface AdminEvent {
    _id: string;
    name: string;
    description: string;
    type: "solo" | "team";
    minTeamSize: number;
    maxTeamSize: number;
    date: string | null;
    venue: string;
    prize: string;
    category: string;
    isActive: boolean;
    registrationCount: number;
}

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    regNo: string;
    phone: string;
    batch: string;
    branch: string;
    techexoticaId: string | null;
    profilePhoto?: string;
    registeredEventsCount: number;
    createdAt: string;
    eventsDetail: { eventName: string; category: string; type: string; registeredAt: string }[];
    achievements?: { _id: string; title: string; awardedAt: string }[];
}

type ActiveTab = "participants" | "manage-events" | "users";

const CATEGORIES = ["technical", "esports", "hackathon", "workshop", "cultural", "sports", "general"];

// Generate avatar color from name
function getAvatarColor(name: string): string {
    const colors = [
        "#00f5ff", "#a855f7", "#ffd700", "#00ff88",
        "#f97316", "#ec4899", "#3b82f6", "#10b981",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
    const [secret, setSecret] = useState("");
    const [inputSecret, setInputSecret] = useState("");
    const [activeTab, setActiveTab] = useState<ActiveTab>("participants");

    // Participants tab state
    const [events, setEvents] = useState<EventGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Manage Events tab state
    const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventsError, setEventsError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" | "warn" } | null>(null);

    // Users tab state
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [userSearch, setUserSearch] = useState("");
    const [achievementInput, setAchievementInput] = useState("");
    const [achievementLoading, setAchievementLoading] = useState(false);

    const [form, setForm] = useState({
        name: "", description: "", type: "solo" as "solo" | "team",
        minTeamSize: 2, maxTeamSize: 4, date: "", venue: "",
        prize: "", category: "technical", isActive: true,
        allowedRoles: ["Participant"],
    });

    // ── Fetch functions ───────────────────────────────────────────────────────
    const fetchParticipants = useCallback(async (sec: string) => {
        setLoading(true); setError("");
        try {
            const res = await fetch(`/api/admin/participants?secret=${encodeURIComponent(sec)}`);
            const json = await res.json();
            if (!json.success) { setError(json.message || "Failed to load data"); setEvents([]); }
            else { setEvents(json.data); if (json.data.length > 0) setSelectedEventId(json.data[0].eventId); }
        } catch { setError("Network error. Please try again."); }
        finally { setLoading(false); }
    }, []);

    const fetchAdminEvents = useCallback(async (sec: string) => {
        setEventsLoading(true); setEventsError("");
        try {
            const res = await fetch(`/api/admin/events?secret=${encodeURIComponent(sec)}`);
            const json = await res.json();
            if (!json.success) setEventsError(json.message || "Failed to load events");
            else setAdminEvents(json.data);
        } catch { setEventsError("Network error."); }
        finally { setEventsLoading(false); }
    }, []);

    const fetchUsers = useCallback(async (sec: string) => {
        setUsersLoading(true); setUsersError("");
        try {
            const res = await fetch(`/api/admin/users?secret=${encodeURIComponent(sec)}`);
            const json = await res.json();
            if (!json.success) setUsersError(json.message || "Failed to load users");
            else setUsers(json.data);
        } catch { setUsersError("Network error."); }
        finally { setUsersLoading(false); }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const s = params.get("secret");
            if (s) { setSecret(s); setInputSecret(s); fetchParticipants(s); }
        }
    }, [fetchParticipants]);

    useEffect(() => {
        if (activeTab === "manage-events" && secret) fetchAdminEvents(secret);
        if (activeTab === "users" && secret) fetchUsers(secret);
    }, [activeTab, secret, fetchAdminEvents, fetchUsers]);

    const showNotification = (msg: string, type: "success" | "error" | "warn") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setSecret(inputSecret);
        fetchParticipants(inputSecret);
    };

    // ── Add Event ─────────────────────────────────────────────────────────────
    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault(); setAddLoading(true); setAddError(""); setAddSuccess("");
        try {
            const res = await fetch(`/api/admin/events?secret=${encodeURIComponent(secret)}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, minTeamSize: form.type === "solo" ? 1 : form.minTeamSize, maxTeamSize: form.type === "solo" ? 1 : form.maxTeamSize }),
            });
            const json = await res.json();
            if (!json.success) { setAddError(json.message || "Failed to add event."); }
            else {
                setAddSuccess(`"${json.data.name}" added!`);
                setForm({ name: "", description: "", type: "solo", minTeamSize: 2, maxTeamSize: 4, date: "", venue: "", prize: "", category: "technical", isActive: true, allowedRoles: ["Participant"] });
                setShowAddForm(false); fetchAdminEvents(secret);
                showNotification(`Event "${json.data.name}" added!`, "success");
            }
        } catch { setAddError("Network error."); }
        finally { setAddLoading(false); }
    };

    // ── Toggle Active ─────────────────────────────────────────────────────────
    const handleToggleActive = async (ev: AdminEvent) => {
        try {
            const res = await fetch(`/api/admin/events/${ev._id}?secret=${encodeURIComponent(secret)}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !ev.isActive }),
            });
            const json = await res.json();
            if (json.success) {
                setAdminEvents(prev => prev.map(e => e._id === ev._id ? { ...e, isActive: !ev.isActive } : e));
                showNotification(`"${ev.name}" ${!ev.isActive ? "enabled" : "disabled"}.`, "success");
            } else showNotification(json.message || "Failed.", "error");
        } catch { showNotification("Network error.", "error"); }
    };

    // ── Delete Event ──────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/admin/events/${id}?secret=${encodeURIComponent(secret)}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                showNotification(json.message, "success");
                setAdminEvents(prev => prev.filter(e => e._id !== id));
            } else showNotification(json.message || "Delete failed.", "error");
        } catch { showNotification("Network error.", "error"); }
        finally { setDeleteLoading(false); setDeleteConfirmId(null); }
    };

    // ── Add Achievement ───────────────────────────────────────────────────────
    const handleAddAchievement = async () => {
        if (!achievementInput.trim() || !selectedUser) return;
        setAchievementLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedUser._id}/achievements?secret=${encodeURIComponent(secret)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: achievementInput.trim() }),
            });
            const json = await res.json();
            if (json.success) {
                setSelectedUser(prev => prev ? { ...prev, achievements: json.achievements } : prev);
                setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, achievements: json.achievements } : u));
                setAchievementInput("");
                showNotification("Achievement added!", "success");
            } else showNotification(json.message || "Failed.", "error");
        } catch { showNotification("Network error.", "error"); }
        finally { setAchievementLoading(false); }
    };

    const handleRemoveAchievement = async (achievementId: string) => {
        if (!selectedUser) return;
        try {
            const res = await fetch(`/api/admin/users/${selectedUser._id}/achievements?secret=${encodeURIComponent(secret)}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ achievementId }),
            });
            const json = await res.json();
            if (json.success) {
                setSelectedUser(prev => prev ? { ...prev, achievements: json.achievements } : prev);
                setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, achievements: json.achievements } : u));
                showNotification("Achievement removed.", "success");
            } else showNotification(json.message || "Failed.", "error");
        } catch { showNotification("Network error.", "error"); }
    };

    const selectedEvent = events.find((e) => e.eventId === selectedEventId);
    const filteredRegistrations = (selectedEvent?.registrations ?? []).filter((reg) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        if (reg.type === "solo") {
            const p = reg.participant;
            return p.name.toLowerCase().includes(q) || p.regNo.toLowerCase().includes(q) || p.techexoticaId?.toLowerCase().includes(q);
        } else {
            const inLeader = reg.leader && (reg.leader.name.toLowerCase().includes(q) || reg.leader.regNo.toLowerCase().includes(q));
            const inMembers = reg.members.some(m => m.name.toLowerCase().includes(q) || m.regNo.toLowerCase().includes(q));
            return inLeader || inMembers || reg.teamName.toLowerCase().includes(q);
        }
    });

    const filteredUsers = users.filter(u => {
        if (!userSearch) return true;
        const q = userSearch.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ||
            u.regNo.toLowerCase().includes(q) || u.branch.toLowerCase().includes(q) ||
            u.batch.toLowerCase().includes(q) || (u.techexoticaId || "").toLowerCase().includes(q);
    });

    const totalAcrossAll = events.reduce((sum, e) => sum + e.totalParticipants, 0);
    const totalRegistrationsAll = events.reduce((sum, e) => sum + e.registrations.length, 0);

    // ── Auth Screen ──────────────────────────────────────────────────────────
    if (!secret) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-dark)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                <div className="glass-card animated-border" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛡️</div>
                        <h1 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "1.4rem", letterSpacing: "3px", marginBottom: "0.5rem" }}>ADMIN ACCESS</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", letterSpacing: "1px" }}>Techxotica Control Panel</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "2px", color: "var(--text-muted)", fontFamily: "Orbitron, monospace", marginBottom: "0.5rem" }}>ACCESS KEY</label>
                            <input type="password" value={inputSecret} onChange={(e) => setInputSecret(e.target.value)} required placeholder="Enter admin secret..."
                                style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
                        </div>
                        {error && <p style={{ color: "var(--neon-red)", fontSize: "0.8rem", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
                        <button type="submit" className="btn-neon-solid" style={{ width: "100%", justifyContent: "center" }}>
                            {loading ? "Authenticating..." : "Enter Control Panel"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Main Dashboard ────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-dark)", fontFamily: "Inter, sans-serif" }}>

            {/* Toast Notification */}
            {notification && (
                <div style={{
                    position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
                    padding: "0.85rem 1.5rem", borderRadius: "10px",
                    background: notification.type === "success" ? "rgba(0,255,136,0.12)" : notification.type === "warn" ? "rgba(255,191,36,0.12)" : "rgba(255,50,50,0.12)",
                    border: `1px solid ${notification.type === "success" ? "rgba(0,255,136,0.5)" : notification.type === "warn" ? "rgba(255,191,36,0.5)" : "rgba(255,50,50,0.5)"}`,
                    color: notification.type === "success" ? "var(--neon-green)" : notification.type === "warn" ? "#fbbf24" : "var(--neon-red)",
                    fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", backdropFilter: "blur(12px)", maxWidth: "380px",
                    animation: "fadeInDown 0.3s ease",
                }}>
                    {notification.type === "success" ? "✓ " : notification.type === "warn" ? "⚠ " : "✕ "}{notification.msg}
                </div>
            )}

            {/* User Profile Modal */}
            {selectedUser && (
                <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setSelectedUser(null); }}>
                    <div className="glass-card animated-border" style={{ width: "100%", maxWidth: "560px", maxHeight: "88vh", overflowY: "auto", padding: "2rem", position: "relative" }}>
                        {/* Close btn */}
                        <button onClick={() => setSelectedUser(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "var(--text-muted)", width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

                        {/* Avatar + Name */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.75rem" }}>
                            <div style={{
                                width: "72px", height: "72px", borderRadius: "50%", flexShrink: 0,
                                background: `${getAvatarColor(selectedUser.name)}22`,
                                border: `2px solid ${getAvatarColor(selectedUser.name)}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1.6rem", fontWeight: 700, color: getAvatarColor(selectedUser.name),
                                fontFamily: "Orbitron, monospace", boxShadow: `0 0 20px ${getAvatarColor(selectedUser.name)}40`,
                                overflow: "hidden",
                            }}>
                                {selectedUser.profilePhoto ? (
                                    <img src={selectedUser.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    getInitials(selectedUser.name)
                                )}
                            </div>
                            <div>
                                <h2 className="font-orbitron" style={{ color: "var(--text-primary)", fontSize: "1.15rem", marginBottom: "0.2rem" }}>{selectedUser.name}</h2>
                                {selectedUser.techexoticaId && (
                                    <span style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: "4px", padding: "2px 10px", fontSize: "0.72rem", color: "var(--neon-cyan)", fontFamily: "monospace" }}>
                                        {selectedUser.techexoticaId}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            {[
                                { label: "EMAIL", value: selectedUser.email, mono: true },
                                { label: "PHONE", value: selectedUser.phone, mono: true },
                                { label: "REG NO", value: selectedUser.regNo, mono: true },
                                { label: "BRANCH", value: selectedUser.branch },
                                { label: "BATCH", value: selectedUser.batch },
                                { label: "JOINED", value: new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                            ].map(({ label, value, mono }) => (
                                <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                                    <div style={{ fontSize: "0.6rem", letterSpacing: "2px", color: "var(--text-muted)", fontFamily: "Orbitron, monospace", marginBottom: "0.3rem" }}>{label}</div>
                                    <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Registered Events */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h3 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "0.78rem", letterSpacing: "2px", marginBottom: "0.85rem" }}>
                                REGISTERED EVENTS ({selectedUser.eventsDetail.length})
                            </h3>
                            {selectedUser.eventsDetail.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", textAlign: "center", padding: "1rem" }}>No events registered yet.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {selectedUser.eventsDetail.map((ev, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)", borderRadius: "8px", padding: "0.65rem 1rem" }}>
                                            <div>
                                                <div style={{ fontSize: "0.87rem", color: "var(--text-primary)", fontWeight: 500 }}>{ev.eventName}</div>
                                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif", marginTop: "2px" }}>{ev.category} · {ev.type}</div>
                                            </div>
                                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                                {new Date(ev.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Achievements */}
                        <div>
                            <h3 className="font-orbitron" style={{ color: "var(--neon-gold)", fontSize: "0.78rem", letterSpacing: "2px", marginBottom: "0.85rem" }}>
                                ✦ ACHIEVEMENTS
                            </h3>
                            {(selectedUser.achievements || []).length > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                                    {(selectedUser.achievements || []).map((ach: any) => (
                                        <div key={ach._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "8px", padding: "0.65rem 1rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                                <span style={{ color: "var(--neon-gold)", fontSize: "0.9rem" }}>✔</span>
                                                <span style={{ fontSize: "0.87rem", color: "var(--text-primary)" }}>{ach.title}</span>
                                            </div>
                                            <button onClick={() => handleRemoveAchievement(ach._id)} style={{ background: "none", border: "none", color: "rgba(255,80,80,0.6)", cursor: "pointer", fontSize: "0.9rem", padding: "2px 6px" }} title="Remove">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input
                                    type="text"
                                    placeholder="e.g. Winner — Campus Clash 2026"
                                    value={achievementInput}
                                    onChange={e => setAchievementInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") handleAddAchievement(); }}
                                    style={{ flex: 1, padding: "0.6rem 0.9rem", background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", fontFamily: "Inter, sans-serif" }}
                                />
                                <button onClick={handleAddAchievement} disabled={achievementLoading || !achievementInput.trim()} style={{ padding: "0.6rem 1.2rem", background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.4)", borderRadius: "8px", color: "var(--neon-gold)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "Orbitron, monospace", letterSpacing: "1px", transition: "all 0.2s" }}>
                                    {achievementLoading ? "..." : "+ Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ background: "rgba(0,245,255,0.03)", borderBottom: "1px solid rgba(0,245,255,0.15)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
                <div>
                    <h1 className="font-orbitron neon-text-cyan" style={{ fontSize: "1.2rem", letterSpacing: "3px" }}>TECHXOTICA ADMIN</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px", fontFamily: "Rajdhani, sans-serif" }}>CONTROL PANEL</p>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <StatChip label="USERS" value={users.length || 0} color="var(--neon-green)" />
                    <StatChip label="EVENTS" value={events.length || adminEvents.length} color="var(--neon-cyan)" />
                    <StatChip label="TOTAL REG" value={totalRegistrationsAll} color="var(--neon-gold)" />
                    <StatChip label="PARTICIPANTS" value={totalAcrossAll} color="var(--neon-purple)" />
                    <a href={`/api/admin/export-registrations?secret=${encodeURIComponent(secret)}`} className="btn-neon" style={{ fontSize: "0.7rem", padding: "8px 18px" }} download>⬇ Export CSV</a>
                    <button onClick={() => { setSecret(""); setEvents([]); setSelectedEventId(null); setAdminEvents([]); setUsers([]); }} className="btn-neon-red" style={{ fontSize: "0.7rem", padding: "8px 18px" }}>Logout</button>
                </div>
            </div>

            {/* Tab Bar */}
            <div style={{ borderBottom: "1px solid rgba(0,245,255,0.1)", padding: "0 2rem", background: "rgba(0,0,0,0.2)" }}>
                {([
                    { id: "participants", label: "👥 PARTICIPANTS" },
                    { id: "manage-events", label: "⚡ MANAGE EVENTS" },
                    { id: "users", label: "🧑‍💻 ALL USERS" },
                ] as { id: ActiveTab; label: string }[]).map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: "0.85rem 1.5rem", background: "transparent", border: "none",
                        borderBottom: activeTab === tab.id ? "2px solid var(--neon-cyan)" : "2px solid transparent",
                        color: activeTab === tab.id ? "var(--neon-cyan)" : "var(--text-muted)",
                        fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "Orbitron, monospace",
                        cursor: "pointer", transition: "all 0.2s", marginBottom: "-1px",
                    }}>{tab.label}</button>
                ))}
            </div>

            {/* ═══ TAB: PARTICIPANTS ═══ */}
            {activeTab === "participants" && (
                loading ? <LoadingSpinner /> : error ? <ErrorCard msg={error} onRetry={() => fetchParticipants(secret)} /> : (
                    <div style={{ display: "flex", height: "calc(100vh - 130px)" }}>
                        <aside style={{ width: "280px", flexShrink: 0, borderRight: "1px solid rgba(0,245,255,0.1)", overflowY: "auto", padding: "1rem 0" }}>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.65rem", letterSpacing: "2px", fontFamily: "Orbitron, monospace", padding: "0 1rem 0.75rem" }}>ALL EVENTS</p>
                            {events.map(ev => <EventSidebarItem key={ev.eventId} event={ev} isActive={selectedEventId === ev.eventId} onClick={() => { setSelectedEventId(ev.eventId); setSearchQuery(""); }} />)}
                            {events.length === 0 && <p style={{ color: "var(--text-muted)", padding: "1rem", fontSize: "0.85rem", textAlign: "center" }}>No events found.</p>}
                        </aside>
                        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
                            {selectedEvent ? (
                                <>
                                    <div style={{ marginBottom: "1.5rem" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                                            <div>
                                                <h2 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "1.4rem", letterSpacing: "2px", marginBottom: "0.25rem" }}>{selectedEvent.eventName}</h2>
                                                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                                    <Badge text={selectedEvent.type.toUpperCase()} color={selectedEvent.type === "team" ? "var(--neon-purple)" : "var(--neon-cyan)"} />
                                                    <Badge text={selectedEvent.category} color="var(--neon-gold)" />
                                                    {selectedEvent.venue && <Badge text={selectedEvent.venue} color="var(--text-muted)" />}
                                                    {selectedEvent.date && <Badge text={new Date(selectedEvent.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} color="var(--neon-green)" />}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: "1rem" }}>
                                                <StatChip label="REGISTRATIONS" value={selectedEvent.registrations.length} color="var(--neon-cyan)" />
                                                <StatChip label="PARTICIPANTS" value={selectedEvent.totalParticipants} color="var(--neon-purple)" />
                                            </div>
                                        </div>
                                    </div>
                                    <input type="text" placeholder="Search name, reg no, TX ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: "100%", marginBottom: "1rem", padding: "0.6rem 1rem", background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", letterSpacing: "1px", marginBottom: "1rem", fontFamily: "Rajdhani, sans-serif" }}>
                                        SHOWING {filteredRegistrations.length} OF {selectedEvent.registrations.length} REGISTRATIONS
                                    </p>
                                    {filteredRegistrations.length === 0 ? (
                                        <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}><p style={{ color: "var(--text-muted)" }}>No registrations match your filter.</p></div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                            {filteredRegistrations.filter(r => r.type === "solo").length > 0 && (
                                                <div>
                                                    <h3 className="font-orbitron" style={{ color: "var(--neon-cyan)", marginBottom: "1rem", fontSize: "0.9rem", letterSpacing: "1px" }}>SOLO REGISTRATIONS</h3>
                                                    <div className="glass-card" style={{ overflow: "hidden", overflowX: "auto" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                                                            <thead><tr style={{ borderBottom: "1px solid rgba(0,245,255,0.15)" }}>
                                                                {["#", "Role", "Name", "Reg No", "TX ID", "Branch", "Batch", "Phone", "Registered"].map(h => (
                                                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.65rem", letterSpacing: "2px", color: "var(--neon-cyan)", fontFamily: "Orbitron, monospace", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                                                                ))}
                                                            </tr></thead>
                                                            <tbody>
                                                                {(filteredRegistrations.filter(r => r.type === "solo") as SoloRegistration[]).map((reg, idx) => (
                                                                    <tr key={reg.registrationId} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                                                                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,245,255,0.04)")}
                                                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                                                        <td style={tdStyle}>{idx + 1}</td>
                                                                        <td style={{ ...tdStyle, color: "var(--neon-gold)", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 }}>{reg.role}</td>
                                                                        <td style={{ ...tdStyle, fontWeight: 600 }}>{reg.participant.name}</td>
                                                                        <td style={{ ...tdStyle, fontFamily: "monospace", color: "var(--neon-cyan)" }}>{reg.participant.regNo}</td>
                                                                        <td style={{ ...tdStyle, fontFamily: "monospace", color: "var(--neon-purple)" }}>{reg.participant.techexoticaId || "—"}</td>
                                                                        <td style={tdStyle}>{reg.participant.branch}</td>
                                                                        <td style={tdStyle}>{reg.participant.batch}</td>
                                                                        <td style={{ ...tdStyle, fontFamily: "monospace" }}>{reg.participant.phone}</td>
                                                                        <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: "0.78rem" }}>{new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                            {filteredRegistrations.filter(r => r.type === "team").length > 0 && (
                                                <div>
                                                    <h3 className="font-orbitron" style={{ color: "var(--neon-purple)", marginBottom: "1rem", fontSize: "0.9rem", letterSpacing: "1px" }}>TEAM REGISTRATIONS</h3>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                                        {(filteredRegistrations.filter(r => r.type === "team") as TeamRegistration[]).map((reg, idx) => <TeamCard key={reg.registrationId} reg={reg} idx={idx + 1} />)}
                                                    </div>
                                                </div>
                                            )}
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
                )
            )}

            {/* ═══ TAB: MANAGE EVENTS ═══ */}
            {activeTab === "manage-events" && (
                <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <h2 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "1.1rem", letterSpacing: "3px", marginBottom: "0.25rem" }}>⚡ MANAGE EVENTS</h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "Rajdhani, sans-serif" }}>Add, enable/disable, or permanently delete events.</p>
                        </div>
                        <button onClick={() => { setShowAddForm(!showAddForm); setAddError(""); setAddSuccess(""); }} className="btn-neon-solid" style={{ fontSize: "0.8rem", padding: "10px 24px" }}>
                            {showAddForm ? "✕ Cancel" : "+ Add New Event"}
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="glass-card animated-border" style={{ padding: "2rem", marginBottom: "2rem" }}>
                            <h3 className="font-orbitron" style={{ color: "var(--neon-gold)", fontSize: "0.9rem", letterSpacing: "2px", marginBottom: "1.5rem" }}>✦ NEW EVENT</h3>
                            <form onSubmit={handleAddEvent}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                                    <FormField label="Event Name *"><input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Code Sprint" style={inputStyle} /></FormField>
                                    <FormField label="Category *">
                                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Type *">
                                        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "solo" | "team" }))} style={inputStyle}>
                                            <option value="solo">Solo</option><option value="team">Team</option>
                                        </select>
                                    </FormField>
                                    {form.type === "team" && (
                                        <>
                                            <FormField label="Min Team Size"><input type="number" min={2} max={10} value={form.minTeamSize} onChange={e => setForm(f => ({ ...f, minTeamSize: parseInt(e.target.value) }))} style={inputStyle} /></FormField>
                                            <FormField label="Max Team Size"><input type="number" min={2} max={20} value={form.maxTeamSize} onChange={e => setForm(f => ({ ...f, maxTeamSize: parseInt(e.target.value) }))} style={inputStyle} /></FormField>
                                        </>
                                    )}
                                    <FormField label="Date"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} /></FormField>
                                    <FormField label="Venue"><input type="text" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} placeholder="e.g. CS Lab" style={inputStyle} /></FormField>
                                    <FormField label="Prize Pool"><input type="text" value={form.prize} onChange={e => setForm(f => ({ ...f, prize: e.target.value }))} placeholder="e.g. ₹5,000" style={inputStyle} /></FormField>
                                    <FormField label="Status">
                                        <select value={form.isActive ? "active" : "inactive"} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "active" }))} style={inputStyle}>
                                            <option value="active">Active</option><option value="inactive">Inactive</option>
                                        </select>
                                    </FormField>
                                    <FormField label="Allowed Roles *">
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
                                            {["Participant", "Attendee", "Volunteer"].map(role => (
                                                <label key={role} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={form.allowedRoles.includes(role)} 
                                                        onChange={e => {
                                                            const newRoles = e.target.checked ? [...form.allowedRoles, role] : form.allowedRoles.filter(r => r !== role);
                                                            setForm(f => ({ ...f, allowedRoles: newRoles }));
                                                        }} 
                                                    />
                                                    {role}
                                                </label>
                                            ))}
                                        </div>
                                    </FormField>
                                </div>
                                <FormField label="Description" style={{ marginTop: "1.25rem" }}>
                                    <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Event description..." style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
                                </FormField>
                                {addError && <p style={{ color: "var(--neon-red)", fontSize: "0.82rem", marginTop: "1rem" }}>✕ {addError}</p>}
                                {addSuccess && <p style={{ color: "var(--neon-green)", fontSize: "0.82rem", marginTop: "1rem" }}>✓ {addSuccess}</p>}
                                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                                    <button type="submit" className="btn-neon-solid" disabled={addLoading} style={{ fontSize: "0.82rem" }}>{addLoading ? "Adding..." : "✓ Add Event"}</button>
                                    <button type="button" onClick={() => setShowAddForm(false)} className="btn-neon-red" style={{ fontSize: "0.82rem" }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {eventsLoading ? <LoadingSpinner /> : eventsError ? <ErrorCard msg={eventsError} onRetry={() => fetchAdminEvents(secret)} /> : adminEvents.length === 0 ? (
                        <div className="glass-card" style={{ padding: "4rem", textAlign: "center" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                            <p style={{ color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif" }}>No events yet. Add your first event above!</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                <StatChip label="TOTAL" value={adminEvents.length} color="var(--neon-cyan)" />
                                <StatChip label="ACTIVE" value={adminEvents.filter(e => e.isActive).length} color="var(--neon-green)" />
                                <StatChip label="INACTIVE" value={adminEvents.filter(e => !e.isActive).length} color="var(--neon-red)" />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {adminEvents.map(ev => (
                                    <div key={ev._id} className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", opacity: ev.isActive ? 1 : 0.55, borderLeft: `3px solid ${ev.isActive ? "var(--neon-cyan)" : "rgba(255,80,80,0.5)"}`, transition: "all 0.2s" }}>
                                        <div style={{ flex: 1, minWidth: "200px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                                                <span className="font-orbitron" style={{ color: ev.isActive ? "var(--text-primary)" : "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600 }}>{ev.name}</span>
                                                {!ev.isActive && <Badge text="INACTIVE" color="var(--neon-red)" />}
                                            </div>
                                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                                <Badge text={ev.type.toUpperCase()} color={ev.type === "team" ? "var(--neon-purple)" : "var(--neon-cyan)"} />
                                                <Badge text={ev.category} color="var(--neon-gold)" />
                                                {ev.venue && <Badge text={ev.venue} color="var(--text-muted)" />}
                                                {ev.prize && <Badge text={ev.prize} color="var(--neon-green)" />}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "center", minWidth: "80px" }}>
                                            <div className="font-orbitron" style={{ fontSize: "1.4rem", color: "var(--neon-cyan)", lineHeight: 1 }}>{ev.registrationCount}</div>
                                            <div style={{ fontSize: "0.6rem", letterSpacing: "1px", color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif" }}>REGISTRATIONS</div>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                                            <button onClick={() => handleToggleActive(ev)} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "0.72rem", letterSpacing: "1px", cursor: "pointer", fontFamily: "Orbitron, monospace", border: `1px solid ${ev.isActive ? "rgba(255,80,80,0.4)" : "rgba(0,255,136,0.4)"}`, background: ev.isActive ? "rgba(255,80,80,0.08)" : "rgba(0,255,136,0.08)", color: ev.isActive ? "var(--neon-red)" : "var(--neon-green)", transition: "all 0.2s" }}>
                                                {ev.isActive ? "⏸ Disable" : "▶ Enable"}
                                            </button>
                                            {deleteConfirmId === ev._id ? (
                                                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                                    <span style={{ fontSize: "0.72rem", color: "var(--neon-red)", fontFamily: "Rajdhani, sans-serif" }}>
                                                        {ev.registrationCount > 0 ? `Will delete ${ev.registrationCount} registration(s) too!` : "Permanently delete?"}
                                                    </span>
                                                    <button onClick={() => handleDelete(ev._id)} disabled={deleteLoading} style={{ padding: "5px 12px", borderRadius: "6px", fontSize: "0.7rem", cursor: "pointer", fontFamily: "Orbitron, monospace", border: "1px solid rgba(255,50,50,0.6)", background: "rgba(255,50,50,0.15)", color: "var(--neon-red)" }}>
                                                        {deleteLoading ? "..." : "✓ Confirm"}
                                                    </button>
                                                    <button onClick={() => setDeleteConfirmId(null)} style={{ padding: "5px 12px", borderRadius: "6px", fontSize: "0.7rem", cursor: "pointer", fontFamily: "Orbitron, monospace", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-muted)" }}>✕</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirmId(ev._id)} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer", fontFamily: "Orbitron, monospace", border: "1px solid rgba(255,50,50,0.3)", background: "rgba(255,50,50,0.05)", color: "rgba(255,80,80,0.7)", transition: "all 0.2s" }}>
                                                    🗑 Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ═══ TAB: ALL USERS ═══ */}
            {activeTab === "users" && (
                <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <h2 className="font-orbitron" style={{ color: "var(--neon-cyan)", fontSize: "1.1rem", letterSpacing: "3px", marginBottom: "0.25rem" }}>🧑‍💻 ALL USERS</h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "Rajdhani, sans-serif" }}>
                                {users.length} registered users — click any card to view full details
                            </p>
                        </div>
                        <button onClick={() => fetchUsers(secret)} className="btn-neon" style={{ fontSize: "0.75rem", padding: "8px 18px" }}>↻ Refresh</button>
                    </div>

                    {/* Search */}
                    <input type="text" placeholder="Search by name, email, reg no, branch, batch, TX ID..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                        style={{ width: "100%", marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />

                    {usersLoading ? <LoadingSpinner /> : usersError ? <ErrorCard msg={usersError} onRetry={() => fetchUsers(secret)} /> : filteredUsers.length === 0 ? (
                        <div className="glass-card" style={{ padding: "4rem", textAlign: "center" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
                            <p style={{ color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif" }}>{userSearch ? "No users match your search." : "No users registered yet."}</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                            {filteredUsers.map(user => {
                                const color = getAvatarColor(user.name);
                                return (
                                    <button key={user._id} onClick={() => setSelectedUser(user)} style={{ all: "unset", cursor: "pointer", display: "block" }}>
                                        <div className="glass-card" style={{
                                            padding: "1.5rem 1.25rem", textAlign: "center", transition: "all 0.25s",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "12px",
                                        }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                                                (e.currentTarget as HTMLElement).style.borderColor = `${color}55`;
                                                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}20`;
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                            }}>
                                            {/* Avatar */}
                                            <div style={{
                                                width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto 1rem",
                                                background: `${color}18`, border: `2px solid ${color}80`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "1.3rem", fontWeight: 700, color,
                                                fontFamily: "Orbitron, monospace",
                                                boxShadow: `0 0 16px ${color}30`,
                                                overflow: "hidden",
                                            }}>
                                                {user.profilePhoto ? (
                                                    <img src={user.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    getInitials(user.name)
                                                )}
                                            </div>
                                            {/* Name */}
                                            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.3rem", lineHeight: 1.3, fontFamily: "Inter, sans-serif" }}>
                                                {user.name}
                                            </div>
                                            {/* Branch + Batch */}
                                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif", marginBottom: "0.75rem" }}>
                                                {user.branch} · {user.batch}
                                            </div>
                                            {/* TX ID */}
                                            {user.techexoticaId && (
                                                <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "4px", padding: "2px 8px", fontSize: "0.65rem", color, fontFamily: "monospace", marginBottom: "0.75rem", display: "inline-block" }}>
                                                    {user.techexoticaId}
                                                </div>
                                            )}
                                            {/* Events count */}
                                            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                                                <span style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: "4px", padding: "2px 10px", fontSize: "0.68rem", color: "var(--neon-cyan)", fontFamily: "Orbitron, monospace" }}>
                                                    {user.eventsDetail.length} event{user.eventsDetail.length !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                            {/* Click hint */}
                                            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.75rem", fontFamily: "Rajdhani, sans-serif", letterSpacing: "1px" }}>
                                                CLICK TO VIEW DETAILS
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Shared Sub-components ────────────────────────────────────────────────────

const tdStyle: React.CSSProperties = { padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--text-primary)", verticalAlign: "middle", whiteSpace: "nowrap" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.65rem 0.9rem", background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" };

function LoadingSpinner() {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
            <div style={{ textAlign: "center" }}>
                <div className="neon-text-cyan font-orbitron" style={{ fontSize: "1.2rem", letterSpacing: "4px", marginBottom: "1rem" }}>LOADING...</div>
                <div style={{ width: "200px", height: "2px", background: "rgba(0,245,255,0.2)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "40%", background: "var(--neon-cyan)", boxShadow: "0 0 10px var(--neon-cyan)", animation: "pulse-slow 1.5s ease-in-out infinite" }} />
                </div>
            </div>
        </div>
    );
}

function ErrorCard({ msg, onRetry }: { msg: string; onRetry: () => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
            <div className="glass-card" style={{ padding: "2rem", textAlign: "center", maxWidth: "400px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
                <p style={{ color: "var(--neon-red)" }}>{msg}</p>
                <button onClick={onRetry} className="btn-neon" style={{ marginTop: "1rem", fontSize: "0.75rem" }}>Retry</button>
            </div>
        </div>
    );
}

function FormField({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={style}>
            <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "1.5px", color: "var(--text-muted)", fontFamily: "Orbitron, monospace", marginBottom: "0.4rem" }}>{label}</label>
            {children}
        </div>
    );
}

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}30`, borderRadius: "8px", padding: "0.4rem 0.8rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color, fontFamily: "Orbitron, monospace", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "1.5px", color: "var(--text-muted)", fontFamily: "Rajdhani, sans-serif", marginTop: "2px" }}>{label}</div>
        </div>
    );
}

function Badge({ text, color }: { text: string; color: string }) {
    return (
        <span style={{ display: "inline-block", background: `${color}18`, border: `1px solid ${color}55`, borderRadius: "4px", padding: "2px 10px", fontSize: "0.7rem", letterSpacing: "1px", color, fontFamily: "Rajdhani, sans-serif", fontWeight: 600, textTransform: "uppercase" }}>{text}</span>
    );
}

function EventSidebarItem({ event, isActive, onClick }: { event: EventGroup; isActive: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", background: isActive ? "rgba(0,245,255,0.08)" : "transparent", borderLeft: isActive ? "3px solid var(--neon-cyan)" : "3px solid transparent", borderRight: "none", borderTop: "none", borderBottom: "none", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "0.2rem" }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.04)"; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: isActive ? "var(--neon-cyan)" : "var(--text-primary)", display: "block", lineHeight: 1.3 }}>{event.eventName}</span>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.65rem", color: event.type === "team" ? "var(--neon-purple)" : "var(--neon-cyan)", fontFamily: "Rajdhani, sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>{event.type}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>·</span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{event.totalParticipants} participant{event.totalParticipants !== 1 ? "s" : ""}</span>
            </div>
        </button>
    );
}

function TeamCard({ reg, idx }: { reg: TeamRegistration; idx: number }) {
    const allMembers = [...(reg.leader ? [{ ...reg.leader, role: "Leader" }] : []), ...reg.members.map(m => ({ ...m, role: "Member" }))];
    return (
        <div className="glass-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span className="font-orbitron" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>#{idx}</span>
                    <span className="font-orbitron" style={{ color: "var(--neon-gold)", fontSize: "0.95rem" }}>{reg.teamName}</span>
                    <span style={{ color: "var(--neon-gold)", fontSize: "0.75rem", border: "1px solid var(--neon-gold)", padding: "2px 6px", borderRadius: "4px" }}>{reg.role}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>({allMembers.length} members)</span>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
                    {["Role", "Name", "Reg No", "Techxotica ID", "Branch", "Batch"].map(h => (
                        <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.6rem", letterSpacing: "1.5px", color: "var(--text-muted)", fontFamily: "Orbitron, monospace", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                </tr></thead>
                <tbody>
                    {allMembers.map((m, i) => (
                        <tr key={i} style={{ borderBottom: i < allMembers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                {m.role === "Leader"
                                    ? <span style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.4)", borderRadius: "4px", padding: "1px 8px", fontSize: "0.65rem", color: "var(--neon-gold)", fontFamily: "Orbitron, monospace" }}>★ Leader</span>
                                    : <span style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "4px", padding: "1px 8px", fontSize: "0.65rem", color: "var(--neon-purple)", fontFamily: "Orbitron, monospace" }}>Member</span>}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.85rem", fontWeight: m.role === "Leader" ? 700 : 400, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{m.name}</td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.83rem", fontFamily: "monospace", color: "var(--neon-cyan)", whiteSpace: "nowrap" }}>{m.regNo}</td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.83rem", fontFamily: "monospace", color: "var(--neon-purple)", whiteSpace: "nowrap" }}>{m.techexoticaId || "—"}</td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.82rem", color: "var(--text-primary)", whiteSpace: "nowrap" }}>{m.branch}</td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.82rem", color: "var(--text-primary)", whiteSpace: "nowrap" }}>{m.batch}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
