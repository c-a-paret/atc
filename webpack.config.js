const path = require('path');

module.exports = {
    mode: "development",
    devServer: {
        static: {
            directory: __dirname,
        },
        compress: true,
        port: 9000,
    },
    target: 'web',
    output: {
        path: __dirname,
    }
};