const WhenNode = require('when/node');
const Sass = WhenNode.liftAll(require('node-sass'));

module.exports = function (text, paths) {

	const options = {
		data: text,
		indentWidth: 4,
		indentType: '\t',
		outputStyle: 'expanded',
		includePaths: [
			paths.root,
			paths.directory
		]
	};

	return Sass.render(options).then(function (result) {

		return result.css.toString();

	}).catch(function (error) {
		throw error;
	});

};