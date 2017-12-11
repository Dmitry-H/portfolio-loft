const webpack = require("webpack");

const config = {
    output: {
        filename: "script.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "eslint-loader",
                options: {
                    fix: true
                }
            }
        ]
    }
};

module.exports = config;