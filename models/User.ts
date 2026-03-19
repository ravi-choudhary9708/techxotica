import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    regNo: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    batch: { type: String, required: true },
    branch: { type: String, required: true },
    password: { type: String, required: true },
    techexoticaId: { type: String, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    registeredEvents: [
        {
            eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
            registeredAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function () {
    if (this.isNew || !this.techexoticaId) {
        const baseId = `TX-${this.phone.slice(0, 5)}-${this.batch}`;

        const existingUser = await mongoose.models.User.findOne({ techexoticaId: baseId });

        if (existingUser && existingUser._id.toString() !== this._id.toString()) {
            this.techexoticaId = `${baseId}-${this.regNo.slice(-2)}`;
        } else {
            this.techexoticaId = baseId;
        }
    }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
