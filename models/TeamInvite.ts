import mongoose from "mongoose";

const TeamInviteSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
    // "join-team"   = target is already registered, asking them to merge into this team
    // "event-invite" = target is not registered, inviting them to join event + team
    type: { type: String, enum: ["join-team", "event-invite"], required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate pending invites from same leader to same user for same event
TeamInviteSchema.index({ fromUser: 1, toUser: 1, eventId: 1, status: 1 });

export default mongoose.models.TeamInvite || mongoose.model("TeamInvite", TeamInviteSchema);
