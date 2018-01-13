const db = require("./low");
const result = db.get("skills").value();

module.exports = result;