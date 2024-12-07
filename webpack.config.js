const path = require('path');

module.exports = {
    entry: 'examples/js/GSVPano.js', // Update the path to your JS file
    output: {
        filename: 'GSVPano.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    resolve: {
        fallback: {
            fs: false,
        },
    },
};
