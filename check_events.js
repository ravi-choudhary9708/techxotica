const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

async function main() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const uriMatch = envContent.match(/MONGODB_URI=(.*)/);
        const uri = uriMatch[1].trim();
        
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        
        const registrations = await db.collection('registrations').find({}).toArray();
        const events = await db.collection('events').find({}).toArray();
        
        // Find which eventIds in registrations don't exist in events
        const eventMap = new Map();
        events.forEach(e => eventMap.set(e._id.toString(), e.name));
        
        const missingIds = new Set();
        const existingIds = new Set();
        registrations.forEach(r => {
            const eid = r.eventId.toString();
            if (eventMap.has(eid)) {
                existingIds.add(eid);
            } else {
                missingIds.add(eid);
            }
        });
        
        console.log(`Found ${missingIds.size} missing eventIds in registrations. Existing: ${existingIds.size}`);
        console.log(`Missing Event IDs: ${Array.from(missingIds).join(', ')}`);
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
main();
