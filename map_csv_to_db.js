const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const readline = require('readline');

// Parse a single line of CSV respecting quotes
function parseCSVLine(text) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
            inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += c;
        }
    }
    result.push(cur.trim());
    return result;
}

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, lowercase: true },
    regNo: { type: String, unique: true },
    phone: { type: String, unique: true },
    batch: { type: String },
    branch: { type: String },
    password: { type: String },
    techexoticaId: { type: String, unique: true },
    registeredEvents: [
        {
            eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
            registeredAt: { type: Date, default: Date.now },
        },
    ]
});

const EventSchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String },
});

const RegistrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    type: { type: String },
    soloUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teamName: { type: String },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, default: "pending" },
    registeredAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
const Registration = mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);


async function main() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const uriMatch = envContent.match(/MONGODB_URI=(.*)/);
        if (!uriMatch) {
            console.error('MONGODB_URI not found');
            process.exit(1);
        }
        
        await mongoose.connect(uriMatch[1].trim());
        
        const csvPath = path.join(__dirname, 'app', 'data', 'techexotica_registrations (2).csv');
        const fileStream = fs.createReadStream(csvPath);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
        
        const lines = [];
        for await (const line of rl) {
            if (line.trim()) lines.push(line);
        }
        
        const headers = parseCSVLine(lines[0]);
        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const obj = {};
            headers.forEach((h, idx) => { obj[h] = values[idx]; });
            records.push(obj);
        }
        
        console.log(`Read ${records.length} records from CSV.`);
        
        // Load all events to memory
        const events = await Event.find({});
        const eventMap = new Map();
        events.forEach(e => {
            // Case-insensitive match just in case
            eventMap.set(e.name.toLowerCase().trim(), e);
        });
        
        // Group by Event -> TeamName -> Registration info
        // To handle solos, we treat them like teams but with a unique key
        const registrationsMap = new Map();
        
        let soloCounter = 0;
        
        for (const record of records) {
            const EventName = record['Event Name'];
            const TechexoticaID = record['Techexotica ID'];
            const StudentName = record['Student Name'];
            const RegNo = record['Reg No'];
            const Phone = record['Phone'];
            const Batch = record['Batch'];
            const Branch = record['Branch'];
            const RegistrationType = record['Registration Type'];
            const TeamNameRaw = record['Team Name'];
            const Role = record['Role'];
            
            if (!EventName) continue;
            
            const eventDoc = eventMap.get(EventName.toLowerCase().trim());
            if (!eventDoc) {
                console.log(`Event not found in DB: ${EventName}`);
                continue;
            }
            
            // Find or update user manually since we don't have password/email in csv
            // We'll base user identification on phone or regNo
            let user = await User.findOne({ phone: Phone });
            if (!user) {
                user = await User.findOne({ regNo: RegNo });
            }
            
            if (!user) {
                // If the user doesn't exist, we can't create them without breaking validation (email, password required in actual schema)
                // However, let's create a minimal user and bypass validation if necessary, or just skip if we must.
                // Assuming we want to create placeholder user:
                const dummyEmail = `${Phone}@placeholder.com`;
                const userDoc = new User({
                    name: StudentName,
                    email: dummyEmail,
                    regNo: RegNo,
                    phone: Phone,
                    batch: Batch,
                    branch: Branch,
                    password: "DefaultPassword@123", // Dummy
                    techexoticaId: TechexoticaID
                });
                try {
                    await userDoc.save();
                    user = userDoc;
                } catch(e) {
                    console.log(`Failed to create user ${StudentName}: ${e.message}`);
                    continue;
                }
            }
            
            const eventId = eventDoc._id;
            
            let regKey = "";
            let regType = "solo";
            if (RegistrationType.toLowerCase() === 'team') {
                regType = "team";
                regKey = `${eventId.toString()}_team_${TeamNameRaw.trim()}`;
            } else {
                regType = "solo";
                soloCounter++;
                regKey = `${eventId.toString()}_solo_${soloCounter}`;
            }
            
            if (!registrationsMap.has(regKey)) {
                registrationsMap.set(regKey, {
                    eventId: eventId,
                    type: regType,
                    teamName: RegistrationType.toLowerCase() === 'team' ? TeamNameRaw : null,
                    members: [], // will store User _ids
                    leader: null, // will store User _id
                    soloUser: null // will store User _id
                });
            }
            
            const regData = registrationsMap.get(regKey);
            
            if (regType === 'solo') {
                regData.soloUser = user._id;
            } else {
                if (Role && Role.toLowerCase() === 'team leader') {
                    regData.leader = user._id;
                    // Add leader to members list too as per schema convention
                    if (!regData.members.some(id => id.toString() === user._id.toString())) {
                         regData.members.push(user._id);
                    }
                } else {
                    if (!regData.members.some(id => id.toString() === user._id.toString())) {
                         regData.members.push(user._id);
                    }
                }
            }
        }
        
        console.log(`Grouped into ${registrationsMap.size} distinct registrations.`);
        
        // Now save to DB
        // We might want to clear old "broken" registrations first to avoid duplicates if possible,
        // but since they references deleted events they won't show up in admin pane anyway.
        // It's safer to just upsert/insert the new ones from CSV.
        
        let inserted = 0;
        for (const [key, data] of registrationsMap.entries()) {
            
            // Check if this exact registration already exists to avoid dupes 
            let query = { eventId: data.eventId };
            if (data.type === 'solo') {
                query.soloUser = data.soloUser;
                query.type = 'solo';
            } else {
                query.leader = data.leader;
                query.teamName = data.teamName;
                query.type = 'team';
                
                // Ensure leader is always the first member or correctly assigned
                if (!data.leader && data.members.length > 0) {
                     data.leader = data.members[0]; // fallback
                }
            }
            
            const existing = await Registration.findOne(query);
            if (!existing) {
                const reg = new Registration({
                    eventId: data.eventId,
                    type: data.type,
                    soloUser: data.soloUser,
                    teamName: data.teamName,
                    leader: data.leader,
                    members: data.members,
                    status: 'confirmed'
                });
                await reg.save();
                inserted++;
                
                // Optional: Update user's registeredEvents array
                const membersToUpdate = data.type === 'solo' ? [data.soloUser] : data.members;
                for (const mId of membersToUpdate) {
                    if (mId) {
                        await User.updateOne(
                            { _id: mId },
                            { $addToSet: { registeredEvents: { eventId: data.eventId } } }
                        );
                    }
                }
            }
        }
        
        console.log(`Successfully inserted ${inserted} missing registrations from CSV.`);
        
    } catch(err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
main();
