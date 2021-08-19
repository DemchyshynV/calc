const fs = require('fs/promises');
const path = require('path');
const util = require('util');


const dbPath = path.join(__dirname, 'db', 'users.json')
const start = async () => {
    try {
        await fs.writeFile(dbPath, JSON.stringify({name: 'Max', age: 15}))
        const data = await fs.readFile(dbPath, 'utf-8');
        console.log(data);
    } catch (e) {
        console.log(e);
    }
}

start()
