const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: [
        __dirname + '/public/js/jquery-3.1.0.js',
        __dirname + '/public/js/jquery.ui.widget.js',
        __dirname + '/public/js/jquery.knob.js',
        __dirname + '/public/js/jquery.iframe-transport.js',
        __dirname + '/public/js/jquery.fileupload.js',
        __dirname + '/public/js/toastr.min.js',
        __dirname + '/public/js/socket.io.js',
        __dirname + '/public/js/eq.js',
        __dirname + '/public/js/player.js',
        __dirname + '/public/js/upload.js',
        __dirname + '/public/js/remote.js'
    ],

    output: {
        path: path.resolve(__dirname, 'public/build'),
        publicPath: 'build/',
        filename: 'build.js'
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            widget: "jquery.ui.widget"
        })
    ]
}
