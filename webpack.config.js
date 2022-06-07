const path = require('path');

module.exports = {
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    target: 'web'
};