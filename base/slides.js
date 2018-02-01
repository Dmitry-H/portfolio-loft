const slides = (function () {
    const db = require("./low");

    return {
        get: function () {
            return db.get("slides").value();
        },
        add: function (data) {
            db.get("slides").push(data).write();
        }
    }
})();

module.exports = slides;