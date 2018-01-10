const webpack = require("webpack");

const config = {
    output: {
        filename: "script.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue: ["../../node_modules/vue/dist/vue.esm.js", "default"]
        })
    ]
/*    module: {
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
    }*/
};




module.exports = config;