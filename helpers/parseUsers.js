const fs = require("fs/promises");
const {DBPath} = require("../db");

module.exports = async () => {
    const buffer = await fs.readFile(DBPath, 'utf8');
    return buffer ? JSON.parse(buffer) : []
}
