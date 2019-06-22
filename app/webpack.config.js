const path = require('path');

module.exports = {
    mode: 'none',
    entry: ['./.react_build_tmp/image-dice.js', './.react_build_tmp/index.js'],
    externals: {
	fs : "commonjs fs",
	path: "commonjs path"
    },
    output: {
	filename: 'renderer-react.js',
	path: path.resolve(__dirname, 'dist')
    },
    module: {
	rules: [
	    {
		test: /\.css$/,
		use: [
		    'style-loader',
		    'css-loader'
		]
	    },
	    {
		test: /\.(png|svg|giv|jpg)$/,
		use: [
		    'file-loader'
		]
	    }
	]
    }
};
