const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: [
        __dirname + '/public/js/jquery-3.1.0.js',
        __dirname + '/public/js/jquery.knob.js',
        __dirname + '/public/js/toastr.min.js',
        __dirname + '/public/js/eq.js',
        __dirname + '/public/js/player.js'
    ],

    output: {
        path: path.resolve(__dirname, 'public/build'),
        publicPath: 'build/',
        filename: 'build.js'
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}
