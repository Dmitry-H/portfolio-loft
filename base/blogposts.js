const db = require("./low");
const result = db.get("blogposts").value();

module.exports = result;