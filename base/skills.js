const skills = (function () {
    const db = require("./low");

    return {
        get: function () {
            return db.get("skills").value();
        },
        add: function (data) {
            db.set("skills", data).write();
        }
    }
})();

module.exports = skills;