const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

// Parser for converting JS objects to CSV string
function toCSV(data) {
    if (!data || !data.length) return '';
    
    // Get all unique keys across all objects
    const keys = new Set();
    data.forEach(item => {
        Object.keys(item).forEach(key => keys.add(key));
    });
    
    let csv = Array.from(keys).join(',') + '\n';
    
    data.forEach(item => {
        const row = Array.from(keys).map(key => {
            let val = item[key];
            if (val === undefined || val === null) return '';
            if (typeof val === 'object') val = JSON.stringify(val);
            val = String(val).replace(/"/g, '""');
            return `"${val}"`;
        });
        csv += row.join(',') + '\n';
    });
    
    return csv;
}

async function main() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const uriMatch = envContent.match(/MONGODB_URI=(.*)/);
        if (!uriMatch) {
            console.error('MONGODB_URI not found in .env.local');
            process.exit(1);
        }
        
        const uri = uriMatch[1].trim();
        console.log('Connecting to database...');
        await mongoose.connect(uri);
        console.log('Connected.');
        
        const db = mongoose.connection.db;
        
        const collections = ['users', 'events', 'registrations'];
        
        for (const col of collections) {
            console.log(`Fetching ${col}...`);
            const data = await db.collection(col).find({}).toArray();
            if (data.length > 0) {
                const csvData = toCSV(data);
                const outPath = path.join(__dirname, `${col}_export.csv`);
                fs.writeFileSync(outPath, csvData);
                console.log(`Saved ${data.length} records to ${outPath}`);
            } else {
                console.log(`No records found in ${col}.`);
            }
        }
        
        console.log('Data export complete.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main();
