import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    type: { type: String, enum: ["solo", "team"], required: true },
    soloUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teamName: { type: String },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
    registeredAt: { type: Date, default: Date.now },
});

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);
