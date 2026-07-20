"use client";

import { QRCodeCanvas } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";

export default function AttendeePass({ user, event, role }: { user: any, event: any, role: string }) {
    const passRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!passRef.current) return;
        setDownloading(true);
        try {
            const dataUrl = await htmlToImage.toPng(passRef.current, {
                pixelRatio: 3, // High res
                style: { margin: "0" } // ensure no weird offsets
            });
            const link = document.createElement("a");
            link.download = `${user.name.replace(/\s+/g, "_")}_${role}_Pass.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate pass", err);
            alert("Failed to generate pass image. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const qrData = `NAME: ${user.name}
ID: ${user.techexoticaId}
BRANCH: ${user.branch}
BATCH: ${user.batch}
PHONE: ${user.phone}
EVENT: ${event.name}
ROLE: ${role}`;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* The Pass to Capture */}
            <div 
                ref={passRef}
                style={{
                    width: "320px",
                    height: "500px",
                    background: "#111",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    color: "#fff"
                }}
            >
                {/* Lanyard Hole */}
                <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "12px",
                    background: "#050508",
                    borderRadius: "20px",
                    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.2)",
                    zIndex: 20
                }} />

                {/* Top Section - Event Image */}
                <div style={{ position: "relative", height: "220px", width: "100%" }}>
                    <img 
                        src="/event.png" 
                        alt="Event"
                        crossOrigin="anonymous"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center 20%"
                        }}
                    />
                    {/* Gradient Overlay for text readability */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(17,17,17,1) 100%)"
                    }} />
                    
                    <div style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "0",
                        width: "100%",
                        textAlign: "center"
                    }}>
                        <div style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: "32px",
                            fontWeight: 800,
                            letterSpacing: "4px",
                            color: "#fff",
                            textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,200,255,0.5)"
                        }}>
                            CAMPUS CLASH
                        </div>
                        <div style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "12px",
                            color: "#00c8ff",
                            letterSpacing: "2px",
                            textTransform: "uppercase"
                        }}>
                            OFFICIAL {role.toUpperCase()} PASS
                        </div>
                    </div>
                </div>

                {/* Middle Section - Details & QR */}
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                    
                    <div style={{ textAlign: "center", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ 
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#fff",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            lineHeight: 1.1,
                            marginBottom: "4px"
                        }}>
                            {user.name}
                        </div>
                        <div style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                            paddingBottom: "12px",
                            marginBottom: "12px"
                        }}>
                            {user.techexoticaId}
                        </div>
                        <div style={{ 
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#00c8ff",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            marginBottom: "16px",
                            textAlign: "center"
                        }}>
                            {event.name}
                        </div>
                    </div>

                    {/* QR Code Canvas */}
                    <div style={{ 
                        background: "#fff", 
                        padding: "8px", 
                        borderRadius: "8px",
                        boxShadow: "0 0 15px rgba(0,200,255,0.2)"
                    }}>
                        <QRCodeCanvas value={qrData} size={110} level="M" />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ 
                    height: "12px", 
                    width: "100%", 
                    background: "repeating-linear-gradient(45deg, #00c8ff, #00c8ff 10px, #111 10px, #111 20px)" 
                }} />
            </div>

            <button 
                onClick={handleDownload}
                disabled={downloading}
                style={{
                    marginTop: "24px",
                    width: "320px",
                    padding: "16px",
                    background: "rgba(0,200,255,0.1)",
                    border: "1px solid #00c8ff",
                    color: "#00c8ff",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
                    transition: "all 0.2s"
                }}
            >
                {downloading ? "PROCESSING..." : "↓ DOWNLOAD E-PASS"}
            </button>
        </div>
    );
}
