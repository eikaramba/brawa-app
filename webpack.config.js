const webpack = require("@nativescript/webpack");
const dotenv = require("dotenv");
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const { relative, resolve, dirname } = require('path');
module.exports = (env) => {
	dotenv.config({ path: process.env.ENV_PATH });
	webpack.init(env);


	// Learn how to customize:
	// https://docs.nativescript.org/webpack


	webpack.Utils.addCopyRule('**/*.svg')

	dotenv.config()
    const isUppercase = key => key.toUpperCase() === key;
    const envKeys = Object.keys(env);
    let dotEnvValues = envKeys
        .filter(isUppercase)
        .reduce((memo, key) => {
            return {...memo, [key]: JSON.stringify(env[key])};
        }, {})

    const dotEnvkeys = Object.keys(process.env);
    dotEnvValues = dotEnvkeys
        .filter(isUppercase)
        .reduce((memo, key) => {
            if (memo[key]) {
                return memo;
            }

            return {...memo, [key]: dotEnvValues[key] || JSON.stringify(process.env[key])};
        }, {...dotEnvValues})

		// console.log(dotEnvValues);

		webpack.chainWebpack(config => {
			config.plugin('DefinePlugin').tap(args => {
			  Object.assign(args[0], dotEnvValues)
		
			  return args
			})
		  })
	// webpack.Utils.addCopyRule({
	// 	from: '**/*.svg',
	// 	noErrorOnMissing: true,
	// 	// the context of the "from" rule, in this case node_modules
	// 	// we used the getProjectFilePath util here, but this could have been
	// 	// a path.resolve(__dirname, 'node_modules') too.
	// 	context: webpack.Utils.project.getProjectFilePath('node_modules')
	//   })

	// webpack.chainWebpack(config => {
	// 	config.module
	// 		.rule('scss')
	// 		.use('sass-loader')
	// 		.options({ sassOptions: { indentedSyntax: true } })
	// 	config.module
	// 		.rule('something')
	// 		.test(/\.something$/)
	// 		.use('something-loader')
	// 		.loader('something-loader')
	// 		.options({
	// 			example: true
	// 		})
	//   })


	// {
	// 	test: /[\/|\\]app\.scss$/,
	// 	use: [
	// 		'nativescript-dev-webpack/style-hot-loader',
	// 		{
	// 			loader: "nativescript-dev-webpack/css2json-loader",
	// 			options: { useForImports: true }
	// 		},
	// 		'sass-loader',
	// +       'postcss-loader'
	// 	],
	// }
	  

	return webpack.resolveConfig();
};


