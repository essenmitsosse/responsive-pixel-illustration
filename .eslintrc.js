module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'@vue/airbnb',
	],
	parserOptions: {
		parser: 'babel-eslint',
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: [2, 'tab', { SwitchCase: 1, VariableDeclarator: 1 }],
		'import/prefer-default-export': 'off',
		'import/no-default-export': 'error',
		'no-tabs': 0,
	},
	"overrides": [
		{
			"files": [ "*.vue" ],
			"rules": {
				'import/prefer-default-export': 'error',
				'import/no-default-export': 'off',
			}
		}
	]
};
