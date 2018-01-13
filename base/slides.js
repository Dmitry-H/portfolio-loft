const db = require("./low");
const result = db.get("slides").value();

module.exports = result;