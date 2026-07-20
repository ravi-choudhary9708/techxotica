"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TeamPass from "./TeamPass";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .td-root {
    min-height: 100vh;
    background: #050508;
    color: #e8e0f0;
    font-family: 'Barlow Condensed', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .td-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 24px;
    position: relative;
    z-index: 10;
  }

  .td-back {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase;
    padding: 7px 18px; background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.4); cursor: pointer;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
    display: inline-block; margin-bottom: 24px;
  }
  .td-back:hover { border-color: rgba(0,200,255,0.35); color: #00c8ff; }

  /* Hero / Banner */
  .td-banner-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.08);
    position: relative;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 24px;
    margin-bottom: 32px;
    overflow: hidden;
  }
  .td-banner-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at center, rgba(0,200,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .td-logo {
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 2px solid rgba(0,200,255,0.3);
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; color: #00c8ff;
    margin-bottom: 20px;
    object-fit: cover;
    position: relative;
    z-index: 5;
    box-shadow: 0 0 30px rgba(0,200,255,0.2);
  }

  .td-team-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 48px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #fff;
    text-transform: uppercase;
    text-shadow: 0 0 20px rgba(0,200,255,0.4);
    position: relative; z-index: 5;
  }
  .td-event-name {
    font-family: 'Share Tech Mono', monospace;
    color: rgba(0,200,255,0.6);
    letter-spacing: 2px;
    margin-top: 8px;
    position: relative; z-index: 5;
  }

  /* Grid Layout */
  .td-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: start;
  }
  @media(max-width: 800px) {
    .td-grid { grid-template-columns: 1fr; }
  }

  /* Roster */
  .td-section {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    padding: 24px;
  }
  .td-section-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700; letter-spacing: 3px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase; margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .td-section-title::after {
    content:''; flex:1; height:1px; background: linear-gradient(to right, rgba(255,255,255,0.1), transparent);
  }

  .td-member-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 8px;
  }
  .td-member-name { font-size: 16px; color: #fff; }
  .td-member-id { font-family: 'Share Tech Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .td-badge { font-size: 10px; font-weight: 700; letter-spacing: 2px; padding: 4px 8px; border: 1px solid; text-transform: uppercase; }
  
  .td-badge-leader { color: #00c8ff; border-color: rgba(0,200,255,0.3); background: rgba(0,200,255,0.1); }
  .td-badge-confirmed { color: #00ff88; border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.1); }
  .td-badge-pending { color: #d28c3c; border-color: rgba(210,140,60,0.3); background: rgba(210,140,60,0.1); }

  /* Pass Section */
  .td-pass-section {
    background: rgba(0,200,255,0.04);
    border: 1px solid rgba(0,200,255,0.2);
    padding: 24px;
    text-align: center;
  }
  .td-status-box {
    padding: 16px; background: rgba(0,0,0,0.4); border: 1px dashed rgba(255,255,255,0.1);
    font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 1px;
  }
  .td-status-highlight { color: #00c8ff; font-family: 'Share Tech Mono', monospace; font-size: 14px; display: block; margin-bottom: 8px;}

  /* Invite / Remove Buttons */
  .td-btn { 
    background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff;
    padding: 4px 8px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px;
    cursor: pointer; text-transform: uppercase; font-weight: 700;
  }
  .td-btn-danger:hover { border-color: #ff3366; color: #ff3366; }
  .td-btn-primary:hover { border-color: #00c8ff; color: #00c8ff; background: rgba(0,200,255,0.1); }
  
  .td-invite-bar {
    display: flex; gap: 8px; margin-top: 16px;
  }
  .td-invite-input {
    flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
    color: #fff; padding: 8px 12px; font-family: 'Share Tech Mono', monospace;
    font-size: 14px; outline: none;
  }
  .td-invite-input:focus { border-color: rgba(0,200,255,0.5); }
`;

export default function TeamDashboardClient({ team, currentUser }: any) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [inviteId, setInviteId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!document.getElementById("td-styles")) {
            const el = document.createElement("style");
            el.id = "td-styles"; el.textContent = styles;
            document.head.appendChild(el);
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const allMembers = [...team.members, ...team.pending];
    const requiredSize = team.event.minTeamSize;
    const isConfirmed = team.status === "confirmed" || team.members.length >= requiredSize;
    const isLeader = currentUser.userId === team.leaderId;
    const canInvite = isLeader && allMembers.length < team.event.maxTeamSize;

    const handleInvite = async () => {
        if (!inviteId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/team/${team._id}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ techexoticaId: inviteId })
            });
            const data = await res.json();
            if (data.success) {
                alert("Invite sent!");
                router.refresh();
                setInviteId("");
            } else {
                alert(data.message || "Failed to invite");
            }
        } catch {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (targetUserId: string, type: "confirmed" | "pending") => {
        if (!confirm(`Are you sure you want to ${type === "pending" ? "cancel this invite" : "remove this member"}?`)) return;
        
        setLoading(true);
        try {
            const res = await fetch(`/api/team/${team._id}/remove`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId, type })
            });
            const data = await res.json();
            if (data.success) {
                router.refresh();
            } else {
                alert(data.message || "Failed to remove");
            }
        } catch {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="td-root">
            <div className="td-container">
                <Link href="/profile" className="td-back">← Back to Profile</Link>

                <div className="td-banner-card">
                    {team.teamLogo ? (
                        <img src={team.teamLogo} className="td-logo" alt="Team Logo" />
                    ) : (
                        <div className="td-logo">◈</div>
                    )}
                    <h1 className="td-team-name">{team.teamName}</h1>
                    <div className="td-event-name">{team.event.name}</div>
                </div>

                <div className="td-grid">
                    <div className="td-section">
                        <div className="td-section-title">Team Roster</div>
                        
                        {allMembers.map((m: any) => {
                            const isMemberLeader = m._id === team.leaderId;
                            return (
                                <div className="td-member-row" key={m._id}>
                                    <div>
                                        <div className="td-member-name">{m.name}</div>
                                        <div className="td-member-id">{m.techexoticaId}</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        {isMemberLeader ? (
                                            <span className="td-badge td-badge-leader">LEADER</span>
                                        ) : m.status === "confirmed" ? (
                                            <span className="td-badge td-badge-confirmed">CONFIRMED</span>
                                        ) : (
                                            <span className="td-badge td-badge-pending">PENDING</span>
                                        )}

                                        {isLeader && !isMemberLeader && (
                                            <button 
                                                className="td-btn td-btn-danger"
                                                onClick={() => handleRemove(m._id, m.status)}
                                                disabled={loading}
                                            >
                                                {m.status === "pending" ? "Cancel" : "Remove"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {canInvite && (
                            <div className="td-invite-bar">
                                <input 
                                    className="td-invite-input" 
                                    placeholder="Enter Techexotica ID (e.g. TX-12345)" 
                                    value={inviteId}
                                    onChange={(e) => setInviteId(e.target.value)}
                                />
                                <button 
                                    className="td-btn td-btn-primary" 
                                    style={{ padding: "8px 16px" }}
                                    onClick={handleInvite}
                                    disabled={loading}
                                >
                                    {loading ? "..." : "INVITE"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="td-pass-section">
                        <div className="td-section-title" style={{ color: "#00c8ff", justifyContent: "center" }}>
                            TEAM PASS
                        </div>
                        
                        {isConfirmed ? (
                            <TeamPass team={team} />
                        ) : (
                            <div className="td-status-box">
                                <span className="td-status-highlight">NOT YET ISSUED</span>
                                Team registration is pending. A minimum of {requiredSize} members must accept their invitations before the pass is generated.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
