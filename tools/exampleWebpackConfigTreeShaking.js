module.exports = {
    entry: {
        test: "./test.js",
    },
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: "test.bundle.js",
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                test: /\.js$/,
                query: {
                    babelrc: false,
                    // presets: ['es2015'],
                    presets: [],

                    // All of the plugins of babel-preset-es2015,
                    // minus babel-plugin-transform-es2015-modules-commonjs
                    plugins: [
                        'transform-es2015-template-literals',
                        'transform-es2015-literals',
                        'transform-es2015-function-name',
                        'transform-es2015-arrow-functions',
                        'transform-es2015-block-scoped-functions',
                        'transform-es2015-classes',
                        'transform-es2015-object-super',
                        'transform-es2015-shorthand-properties',
                        'transform-es2015-computed-properties',
                        'transform-es2015-for-of',
                        'transform-es2015-sticky-regex',
                        'transform-es2015-unicode-regex',
                        'check-es2015-constants',
                        'transform-es2015-spread',
                        'transform-es2015-parameters',
                        'transform-es2015-destructuring',
                        'transform-es2015-block-scoping',
                        'transform-es2015-typeof-symbol',
                        ['transform-regenerator', { async: false, asyncGenerators: false }],
                        "transform-flow-strip-types"
                    ],
                }
            }
        ]
    }
}