const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("./base/data/db.json");
const db = low(adapter);

db.defaults({slides: [], blogposts: []}).write();

module.exports = db;