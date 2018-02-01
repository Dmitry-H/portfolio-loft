const userdata = (function () {
    const db = require("./low");

    return {
        getUserData: function() {
            return db.get("userData").value();
        }
    }
})();

module.exports = userdata;