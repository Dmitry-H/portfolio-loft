const blogposts = (function () {
    const db = require("./low");

    return {
        get: function () {
            return db.get("blogposts").value();
        },
        add: function (data) {
            db.get("blogposts").push(data).write();
        }
    }
})();

module.exports = blogposts;